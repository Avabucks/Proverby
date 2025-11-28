"use client"
import { useEffect, useState } from "react";
import { useUser } from "@/src/context/UserContext";
import Ripple from "@/src/components/ui/Ripple";
import { salvaProverbio } from "@/src/actions/proverbi_actions";
import { usePathname } from "next/navigation";
import { BiBookmark, BiSolidBookmark } from "react-icons/bi";

interface Props {
    isSaved: boolean;
    setSaved: Function;
}

export default function SalvaProverbio({ isSaved, setSaved }: Readonly<Props>) {
    const { user } = useUser();
    const pathname = usePathname()

    const [isLogged, setIsLogged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setIsLogged(true)
        }
    }, [user])

    const handleSalva = async () => {
        setIsLoading(true)
        if (user) {
            setSaved(!isSaved)
            const result = await salvaProverbio(user.uid, user.username, isSaved, pathname.split("/").findLast(Boolean))
            if (result) {
                console.log("Salvato") // TODO: toast
            } else {
                console.log("Errore") // TODO: toast
            }
        }
        setIsLoading(false)
    };

    return (
        <>
            {isLogged ?
                <>
                    {isLoading ?
                        <div className="p-2.5"><div className="border-[3px] border-solid border-[rgba(255,255,255,.8)] border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div></div>
                        :
                        <div className="animate-[fade-in_.5s]">
                            {isSaved ?
                                <Ripple icon={BiSolidBookmark} handleOnClick={handleSalva}></Ripple>
                                :
                                <Ripple icon={BiBookmark} handleOnClick={handleSalva}></Ripple>
                            }
                        </div>
                    }
                </>
                : <></>
            }
        </>
    )

}