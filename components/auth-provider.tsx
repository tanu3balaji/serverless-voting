"use client";

import type React from "react";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { auth, loginWithGoogle, logout } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export type User = {
  name: string;
  email: string;
  image: string;
  joinedAt: string;
};

type AuthContextType = {
  user: User | null;
  signInWithGoogle: () => void;
  logout: () => void;
  isAllowedDomain: boolean;
  updateProfile: (patch: Partial<Pick<User, "name">>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Track Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email.endsWith("@citchennai.net")) {
        setUser({
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          email: firebaseUser.email,
          image: firebaseUser.photoURL || "/placeholder-user.jpg",
          joinedAt:
            firebaseUser.metadata.creationTime || new Date().toISOString(),
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function signInWithGoogle() {
    try {
      const firebaseUser = await loginWithGoogle();
      setUser({
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
        image: firebaseUser.photoURL || "/placeholder-user.jpg",
        joinedAt:
          firebaseUser.metadata.creationTime || new Date().toISOString(),
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  function updateProfile(patch: Partial<Pick<User, "name">>) {
    if (!user) return;
    setUser({ ...user, ...patch });
  }

  const isAllowedDomain = useMemo(() => {
    if (!user) return false;
    return user.email.toLowerCase().endsWith("@citchennai.net");
  }, [user]);

  const value = useMemo(
    () => ({ user, signInWithGoogle, logout, isAllowedDomain, updateProfile }),
    [user, isAllowedDomain]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
