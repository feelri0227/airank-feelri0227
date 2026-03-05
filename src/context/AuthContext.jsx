import { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUser = async (u) => {
    try {
      if (!u) {
        setUser(null);
        return;
      }

      // 이메일 인증 여부 확인 (소셜 로그인은 제외하고 이메일/비밀번호 로그인인 경우만 체크)
      const isEmailUser = u.providerData.some(p => p.providerId === "password");
      
      if (isEmailUser && !u.emailVerified) {
        // 인증되지 않은 유저는 즉시 로그아웃 처리하여 세션을 종료합니다.
        setUser(null);
        await signOut(auth);
        return;
      }
      
      const userRef = doc(db, "users", u.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: u.uid,
          displayName: u.displayName || u.email?.split('@')[0],
          email: u.email,
          photoURL: u.photoURL || `https://ui-avatars.com/api/?name=${u.email?.split('@')[0]}&background=random`,
          createdAt: new Date(),
        });
      }
      setUser(u);
    } catch (error) {
      console.error("🔴 Error handling user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      handleUser(u).finally(() => setLoading(false));
    });
    return unsub;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("🔴 Google Popup error:", error);
      throw error;
    }
  };

  const registerWithEmail = async (email, password, name) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      // 프로필 업데이트
      await updateProfile(res.user, {
        displayName: name,
        photoURL: `https://ui-avatars.com/api/?name=${name}&background=random`
      });

      // 이메일 인증 메일 발송
      await sendEmailVerification(res.user);
      
      // 가입 직후 자동 로그인되는 것을 방지하기 위해 즉시 로그아웃
      await signOut(auth);
      setUser(null);
      
      return res.user;
    } catch (error) {
      console.error("🔴 Registration error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      
      // 로그인 시점에 이메일 인증 여부 재확인
      if (!res.user.emailVerified) {
        await signOut(auth);
        setUser(null);
        throw new Error("unverified-email");
      }
      
      await handleUser(res.user);
      return res.user;
    } catch (error) {
      console.error("🔴 Email Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
