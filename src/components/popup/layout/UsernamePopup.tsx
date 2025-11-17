"use client";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { setUsername } from "@/src/actions/users_actions";
import Ripple from "@/src/components/Ripple";
import { toSeoFriendly } from "@/src/utils/utils";

interface UsernamePopupProps {
  userString: { displayName: string, photoURL: string, uid: string, username: string, email: string } | null;
  setUser: Function;
  setOpenUsernamePopup: Function;
}

export default function UsernamePopup({ userString, setUser, setOpenUsernamePopup }: UsernamePopupProps) {

  const user = userString;
  
  const [username, setUsernameString] = useState("");
  const [errorMsg, setErrMsg] = useState<{ success?: boolean; error: string; } | { success?: boolean; error?: undefined; }>({ });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 15) {
      setUsernameString(e.target.value);
    }
  };

  const handleOnClick = () => {
    if (username === "") setErrMsg({ success: false, error: "Questo campo non può essere vuoto" })
      else setErrMsg({ success: true, })
  };

  useEffect(() => {
    const updateUsername = async () => {
      if (user && errorMsg.success === true) {
        const result = await setUsername(user.uid || "", toSeoFriendly(username));
        setErrMsg(result || { success: false, error: "Errore generico" });

        if (result.success) {
          const userCookie = {
            uid: user.uid,
            username: toSeoFriendly(username),
            email: user.email || "",
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
          };

          setCookie("user", JSON.stringify(userCookie), { maxAge: 365 * 24 * 60 * 60 });

          setUser({
            displayName: userCookie.displayName,
            photoURL: userCookie.photoURL,
            uid: userCookie.uid,
            username: userCookie.username,
          });

          setOpenUsernamePopup(false);
        }
      }
    };

    updateUsername();
  }, [errorMsg.success]);

  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex gap-[10px] items-center justify-between">
        <input className="w-full"
        type="text"
        value={username}
        onChange={ handleChange }
        placeholder="Inserisci username" />
        <Ripple handleOnClick={ handleOnClick } icon="bx bx-finger-up">Imposta</Ripple>
      </div>
      { !errorMsg.success ? <p className="text-[.9rem] text-red-700 opacity-80">{ errorMsg.error }</p> : `` }
    </div>
  );
}