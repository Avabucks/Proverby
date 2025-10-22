'use client';

import { auth, googleProvider } from "@/src/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      console.log("User:", result.user);
      alert("Login effettuato!");
      // Qui puoi salvare result.user.getIdToken() per passarlo al server
    } catch (error) {
      console.error(error);
      alert("Errore login con Google");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!user ? (
        <button onClick={handleGoogleLogin} style={{ padding: "10px 20px" }}>
          Accedi con Google
        </button>
      ) : (
        <div>
          <h2>Ciao, {user.displayName}</h2>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  );
}