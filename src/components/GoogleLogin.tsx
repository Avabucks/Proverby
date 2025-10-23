'use client';
import { auth, googleProvider } from "@/src/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { saveUser } from "@/src/app/save_user";
import Ripple from "@/src/components/ripple/Ripple";
import GoogleLogo from "@/public/assets/google_logo.svg";
import { setCookie } from "cookies-next";

export default function LoginForm({ setUser }: { setUser: Function }) {
  const handleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();

    await saveUser(user.displayName || "", user.email || "", user.uid, token);
    setCookie("user", JSON.stringify(user), { maxAge: 100 * 365 * 24 * 60 * 60 });

    setUser({ displayName: user.displayName, photoURL: user.photoURL });
  };

  return (
    <Ripple handleOnClick={ handleLogin } opt="outline" img={ GoogleLogo } alt="google_logo">Accedi con Google</Ripple>
  );
}