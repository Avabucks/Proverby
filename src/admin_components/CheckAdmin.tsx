"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getCookie } from "cookies-next";
import { getUser } from "@/src/actions/users_actions";
import { checkAdmin } from "@/src/actions/admin_actions";

interface Props {
    children: React.ReactNode;
    load: boolean;
}

export default function CheckAdmin({ children, load }: Props) {
    const router = useRouter();
    const [isAdmin, setAdmin] = useState(false)

    useEffect(() => {
        async function loadUser() {
            const cookieUser = getCookie("user");
            let jsonCookie;
            if (cookieUser) {
                jsonCookie = JSON.parse(cookieUser as string);
                const user = await getUser(jsonCookie?.username)
                if (user.uid === jsonCookie.uid) {
                    const result = await checkAdmin(user.uid)
                    setAdmin(result)
                    if (!result) {
                        router.push("/")
                    }
                }
            } else {
                router.push("/")
            }
        }

        loadUser();

    }, []);

    if (isAdmin)
        return <div className="animate-[fade-in_.3s]">{children}</div>;
    else return (
        <>
            {load ?
                <section className="animate-[fade-in_.3s] flex flex-col gap-[10px] items-center justify-center h-[calc(100vh-90px)] md:h-[calc(100vh-110px)] mt-[90px] md:mt-[110px]">
                    <span>Verificando requisiti</span>
                    <div className="border-[3px] border-solid border-[var(--primary)] border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                </section>
                : <></>}
        </>
    )
}