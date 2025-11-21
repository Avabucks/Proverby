"use client"
import { useEffect, useState } from "react";
import { useUser } from "@/src/context/UserContext";
import Ripple from "@/src/components/Ripple";
import { salvaProverbio } from "@/src/actions/proverbi_actions";
import { usePathname } from "next/navigation";

interface Props {
    id: number;
    isSaved: boolean;
    setSaved: Function;
}

export default function SalvaProverbio({ id, isSaved, setSaved }: Props) {
    const { user } = useUser();
    const pathname = usePathname()

    const [isLogged, setLogged] = useState(false);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setLogged(true)
        }
    }, [user])

    const handleSalva = async () => {
        setLoading(true)
        if (user) {
            setSaved(!isSaved)
            const result = await salvaProverbio(user.uid, user.username, isSaved, pathname.split("/").filter(Boolean).pop())
            if (result) {
                console.log("Salvato") // TODO: toast
            } else {
                console.log("Errore") // TODO: toast
            }
        }
        setLoading(false)
    };

    return (
        <>
            {isLogged ?
                <>
                    {isLoading ?
                        <div className="p-[10px]"><div className="border-[3px] border-solid border-[rgba(255,255,255,.8)] border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div></div>
                        :
                        <div className="animate-[fade-in_.5s]">
                            {isSaved ?
                                <Ripple icon="bx bxs-bookmark" handleOnClick={handleSalva}></Ripple>
                                :
                                <Ripple icon="bx bx-bookmark" handleOnClick={handleSalva}></Ripple>
                            }
                        </div>
                    }
                </>
                : <></>
            }
        </>
    )

}