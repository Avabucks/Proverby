'use client';
import { useState } from "react";

import Ripple from "@/src/components/Ripple";
import GoogleLogo from "@/public/assets/google_logo.svg";
import { firebaseLogIn } from "@/src/actions/firebase_actions";

export default function LoginForm({ children, setUser }: { children: React.ReactNode, setUser: Function }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true)
    const userJson = await firebaseLogIn();
    if (userJson) {
      setUser({ displayName: userJson.displayName, photoURL: userJson.photoURL, uid: userJson.uid, username: userJson.username, email: userJson.email });
      location.reload()
    }
    setLoading(false)
  };

  return (
    <>
      {loading ?
        <div className="border-[3px] border-solid border-[var(--primary)] border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
        :
        <Ripple handleOnClick={handleLogin} opt="outline" img={GoogleLogo} alt="google_logo">{children}</Ripple>
      }
    </>
  );
}