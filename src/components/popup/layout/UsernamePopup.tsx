"use client";
import { useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import { useUser } from "@/src/context/UserContext";
import { setUsername, getUser } from "@/src/actions/users_actions";
import Ripple from "@/src/components/ui/Ripple";
import { toSeoFriendly } from "@/src/utils/utils";
import { BiCheck } from "react-icons/bi";

interface Props {
  setOpenUsernamePopup: Function;
}

export default function UsernamePopup({ setOpenUsernamePopup }: Readonly<Props>) {

  const { user, setUser } = useUser();

  const [usernameString, setUsernameString] = useState("");
  const [errorMsg, setErrorMsg] = useState<{ success?: boolean; error?: string; }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 15) {
      setUsernameString(e.target.value);
    }
  };

  const handleOnClick = () => {
    if (usernameString === "") setErrorMsg({ success: false, error: "Questo campo non può essere vuoto" })
    else setErrorMsg({ success: true, })
  };

  useEffect(() => {
    const updateUsername = async () => {
      if (user && errorMsg.success === true) {
        const result = await setUsername(user.uid || "", toSeoFriendly(usernameString));
        setErrorMsg(result || { success: false, error: "Errore generico" });

        if (result.success) {
          const userCookie = {
            uid: user.uid,
            username: toSeoFriendly(usernameString),
          };

          setCookie("user", JSON.stringify(userCookie), { maxAge: 365 * 24 * 60 * 60 });

          const returnUser = await getUser(toSeoFriendly(usernameString), user.uid)
          setUser(returnUser)
          setOpenUsernamePopup(false)

        }
      }
    };

    updateUsername();
  }, [errorMsg.success]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2.5 items-center justify-between">
        <input className="input w-full text-[16px]"
          type="text"
          value={usernameString}
          onChange={handleChange}
          placeholder="Inserisci username" />
        <Ripple handleOnClick={handleOnClick} icon={BiCheck}>Imposta</Ripple>
      </div>
      {(errorMsg.success === false) && (<p className="text-[.9rem] text-red-700 opacity-80">{errorMsg.error}</p>)}
    </div>
  );
}