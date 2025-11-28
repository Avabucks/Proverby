"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/src/context/UserContext";

interface Props {
    children: React.ReactNode;
    load: boolean;
    closeOnError: boolean;
}

export default function CheckAdmin({ children, load, closeOnError }: Readonly<Props>) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false)
    const { user } = useUser();

    useEffect(() => {
        async function loadUser() {
            if (user) {
                if (user.isAdmin === 1) setIsAdmin(true)
                else if (closeOnError) router.push("/")
            } else {
                (closeOnError) && router.push("/")
            }
        }

        loadUser();

    }, []);

    if (isAdmin)
        return <div className="animate-[fade-in_.3s]">{children}</div>;
    else return (
        <>
            {load ?
                <section className="animate-[fade-in_.3s] flex flex-col gap-2.5 items-center justify-center h-[calc(100vh-90px)] md:h-[calc(100vh-110px)] mt-[90px] md:mt-[110px]">
                    <span>Verificando requisiti</span>
                    <div className="border-[3px] border-solid border-(--primary) border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                </section>
                : <></>}
        </>
    )
}