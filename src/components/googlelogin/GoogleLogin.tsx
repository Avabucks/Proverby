'use client';
import { auth, googleProvider } from "@/src/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { saveUser } from "@/src/app/save_user";

export default function LoginForm() {
  const handleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();

    await saveUser(user.displayName || "", user.email || "", user.uid, token);
    alert("Utente salvato!");
  };

  return <button onClick={handleLogin}>Login con Google</button>;
}