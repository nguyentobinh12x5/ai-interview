"use client";
import { useEffect, useState } from "react";
import { auth, provider } from "@/lib/firebaseConfig";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error logging in with Firebase: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out with Firebase: ", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Login</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          )}
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <Button onClick={handleLogin}>Login with Google</Button>
      )}
    </div>
  );
}
