"use client"
import { useEffect, useState } from "react";

import { useUser } from "@/src/context/UserContext";

import Ripple from "@/src/components/Ripple";

interface Props {
    id: number;
}

export default function SalvaProverbio({ id }: Props) {
    const { user } = useUser();

    const [isLogged, setLogged] = useState(false);

    useEffect(() => {
        if (user) {
            setLogged(true)
        }
    }, [user])

    // TODO: salva function (con controllo login e username)
    // - return { success: false, error: "Errore del database" };
    // - return { success: true };

    return (
        <>
            {isLogged ?
                <div className="animate-[fade-in_.5s]">
                    <Ripple icon="bx bx-bookmark"></Ripple>
                </div>
                : <></>
            }
        </>
    )

}

// TODO
// - controllo se è salvato icona piena