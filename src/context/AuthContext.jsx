import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUser = async (u) => {
    if (!u) {
      setUser(null);
      return;
    }
    const userRef = doc(db, "users", u.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      // 새로운 사용자라면 Firestore에 사용자 정보 저장
      await setDoc(userRef, {
        uid: u.uid,
        displayName: u.displayName,
        email: u.email,
        photoURL: u.photoURL,
        createdAt: new Date(),
      });
    }
    setUser(u);
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
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
