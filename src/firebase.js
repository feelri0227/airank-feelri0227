import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTuWAhBVjr8F_WfF1WQkJjOAcCYWKG93w",
  authDomain: "airank-9c19a.firebaseapp.com",
  projectId: "airank-9c19a",
  storageBucket: "airank-9c19a.firebasestorage.app",
  messagingSenderId: "662989825625",
  appId: "1:662989825625:web:4e7d530127c91e6442b348",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
