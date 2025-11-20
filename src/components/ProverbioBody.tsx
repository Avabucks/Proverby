"use client"
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getProverbioFromSEO } from "@/src/actions/proverbi_actions";
import { getRandomProverbioSEO } from "@/src/actions/proverbi_actions";

interface Proverbio {
    spiegazione: string;
    esempi: string[];
}

export default function ProverbioBody() {
    const router = useRouter();
    const pathname = usePathname();

    const [msg, setMsg] = useState("");
    const [proverbioObj, setProverbioObj] = useState<Proverbio>();
    const [isLoading, setLoading] = useState(true);

    let lock = false;
    const [isSpin, setSpin] = useState(false);

    const handleRandom = async () => {
        if (lock) return;
        lock = true;
        setSpin(true);
        const result = await getRandomProverbioSEO()
        setTimeout(() => {
            setSpin(false);
            lock = false;
            router.push(`/proverbio/${result}`)
        }, 1000);
    };

    useEffect(() => {
        async function loadProverbioFromSEO() {
            const result = await getProverbioFromSEO(pathname.split("/").filter(Boolean).pop() || "");
            if (result) {
                setProverbioObj(result);
                setMsg("Guarda%20il%20proverbio%20di%20" + result.username + "%20su%20Proverby%21%20https%3A%2F%2Fwww.proverby.it%2Fproverbio%2F" + pathname.split("/").filter(Boolean).pop())
                setLoading(false);
            }
        }

        loadProverbioFromSEO();
    }, []);

    return (
        <div className="flex flex-col gap-[10px]">

            <div className="flex flex-col items-start mt-[-130px]">
                {isLoading ?
                    <>
                        <div className="animate-pulse rounded-full w-full h-[24px] bg-[var(--contrast-01)]"></div>
                        <div className="animate-pulse rounded-full w-[300px] h-[15px] bg-[var(--contrast-01)] mt-[7px]"></div>
                        <div className="animate-pulse rounded-full w-[215px] h-[15px] bg-[var(--contrast-01)] mt-[9px]"></div>
                        <div className="animate-pulse rounded-full w-full h-[24px] bg-[var(--contrast-01)] mt-[40px]"></div>
                        <div className="animate-pulse rounded-full w-[300px] h-[15px] bg-[var(--contrast-01)] mt-[7px]"></div>
                        <div className="animate-pulse rounded-full w-[215px] h-[15px] bg-[var(--contrast-01)] mt-[9px] mb-[40px]"></div>
                    </>
                    :
                    <div className="animate-[fade-in_.5s] flex flex-col items-start w-full">
                        <div className="flex justify-between gap-[10px] w-full">
                            <div className="flex flex-col items-start w-full">
                                <h3 className="title">SPIEGAZIONE</h3>
                                <p className="mt-[10px]">{proverbioObj?.spiegazione}</p>
                            </div>
                            <div className="hidden md:flex flex-col items-start gap-[10px]">
                                <h3 className="title text-nowrap">CONDIVIDI SU</h3>
                                <div className="flex items-center gap-[20px] text-[1.8rem]">
                                    <a href={`https://wa.me/?text=${msg}`} target="_blank" className="opacity-50 hover:opacity-100 hover:duration-300"><i className='bxl bx-whatsapp'></i></a>
                                    <a href={`https://twitter.com/intent/tweet?text=${msg}`} target="_blank" className="opacity-50 hover:opacity-100 hover:duration-300"><i className='bxl bx-twitter-x'></i></a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.proverby.it%2Fproverbio%2F${pathname.split("/").filter(Boolean).pop()}`} target="_blank" className="opacity-50 hover:opacity-100 hover:duration-300"><i className='bxl bx-facebook-circle'></i></a>
                                </div>
                            </div>
                        </div>
                        {proverbioObj?.esempi ?
                            <div className="mt-[30px] flex flex-col items-start w-full">
                                <h3 className="title">ESEMPI</h3>
                                <div className="flex flex-col gap-[5px] mt-[10px] rounded-[var(--border-radius)] bg-[var(--contrast-007)] w-full p-[15px_20px] border-l-5 border-[var(--contrast-01)]">
                                    {
                                        proverbioObj.esempi.map((esempio, i) => (
                                            <p key={i}>"{esempio}"</p>
                                        ))
                                    }
                                </div>
                            </div>
                            :
                            <>
                            </>
                        }
                    </div>
                }
            </div>

            <div className="flex md:hidden py-[40px_30px] flex flex-col items-center gap-[10px]">
                <h3 className="title">CONDIVIDI SU</h3>
                <div className="flex items-center gap-[20px] text-[1.8rem]">
                    <a href={`https://wa.me/?text=${msg}`} target="_blank" className="opacity-50 hover:opacity-100 hover:duration-300"><i className='bxl bx-whatsapp'></i></a>
                    <a href={`https://twitter.com/intent/tweet?text=${msg}`} target="_blank" className="opacity-50 hover:opacity-100 hover:duration-300"><i className='bxl bx-twitter-x'></i></a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.proverby.it%2Fproverbio%2F${pathname.split("/").filter(Boolean).pop()}`} target="_blank" className="opacity-50 hover:opacity-100 hover:duration-300"><i className='bxl bx-facebook-circle'></i></a>
                </div>
            </div>

            <div className="relative w-full border-solid border-[1px] border-[var(--contrast-01)] rounded-[var(--border-radius)] p-[20px_20px_100px_20px] text-center  mt-[0px] md:mt-[50px] mb-[75px]">
                <h3 className="font-semibold text-[1.4rem]">Esplora un proverbio casuale!</h3>
                <p>Clicca sul pulsante qui sotto per esplorare un proverbio casuale.</p>
                <div className="absolute left-[50%] top-[100%] transform-[translate(-50%,-50%)] flex items-center justify-center w-[140px] h-[140px] bg-[var(--primary)] rounded-full shadow-[0_5px_0_var(--primary-dark)] active:shadow-[0_0_0_var(--primary-dark)] active:transform-[translate(-50%,calc(-50%+5px))] duration-300 cursor-pointer" onClick={handleRandom}>
                    <div className="flex items-center transform-[rotate(20deg)]">
                        <i className={`bx bxs-dice-5 text-white/90 text-[4rem] ${isSpin ? "animate-[spin_1s_cubic-bezier(0.25,0.1,0.25,1)]" : ""}`}></i>
                    </div>
                </div>
            </div>

        </div>
    )

}