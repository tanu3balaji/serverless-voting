// lib/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "API",
  authDomain: "campuscast-603fa.firebaseapp.com",
  projectId: "campuscast-603fa",
  storageBucket: "firebasestorage.app",
  messagingSenderId: "id",
  appId: "1:379712309958:web:a8d047ccc9228c12fda5c7",
  measurementId: "G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Login function
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const email = result.user.email;

  if (!email.endsWith("@citchennai.net")) {
    alert("Not an official account. Please use your @citchennai.net email.");
    await signOut(auth);
    throw new Error("Unauthorized domain");
  }

  return result.user;
};

// Logout function
export const logout = () => signOut(auth);
