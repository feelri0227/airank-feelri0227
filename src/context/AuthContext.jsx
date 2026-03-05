import { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification // 추가됨
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

      // 이메일 로그인 유저인데 인증을 받지 않았다면 로그아웃 처리하거나 정보를 제한할 수 있음
      // 여기서는 일단 상태 업데이트만 진행 (UI에서 제어)
      
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
      
      await handleUser(res.user);
      return res.user;
    } catch (error) {
      console.error("🔴 Registration error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      
      // 이메일 인증 여부 확인
      if (!res.user.emailVerified) {
        // 인증되지 않은 경우 에러를 던져서 UI에서 처리하게 함
        throw new Error("unverified-email");
      }
      
      return res.user;
    } catch (error) {
      console.error("🔴 Email Login error:", error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
