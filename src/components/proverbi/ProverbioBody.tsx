"use client"
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getProverbioFromSEO, getRandomProverbioSEO } from "@/src/actions/proverbi_actions";
import { BiSolidDice5, BiLogoWhatsapp, BiLogoFacebookCircle } from "react-icons/bi";
import { RiTwitterXFill } from "react-icons/ri";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import ListProverbi from "./ListProverbi";

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
        <div className="flex flex-col gap-2.5">

            <div className="flex flex-col items-start mt-[-130px]">
                {isLoading ?
                    <>
                        <div className="animate-pulse rounded-full w-full h-6 bg-(--contrast-01)"></div>
                        <div className="animate-pulse rounded-full w-[300px] h-[15px] bg-(--contrast-01) mt-[7px]"></div>
                        <div className="animate-pulse rounded-full w-[215px] h-[15px] bg-(--contrast-01) mt-[9px]"></div>
                        <div className="animate-pulse rounded-full w-full h-6 bg-(--contrast-01) mt-10"></div>
                        <div className="animate-pulse rounded-full w-[300px] h-[15px] bg-(--contrast-01) mt-[7px]"></div>
                        <div className="animate-pulse rounded-full w-[215px] h-[15px] bg-(--contrast-01) mt-[9px] mb-10"></div>
                    </>
                    :
                    <div className="animate-[fade-in_.5s] flex flex-col items-start w-full">
                        <div className="flex justify-between gap-2.5 w-full">
                            <div className="flex flex-col items-start w-full">
                                <div className="flex items-center gap-2.5 w-full"><h2 className="title">SPIEGAZIONE</h2><div className="w-full border-b border-b-solid border-b-(--contrast-01) duration-300"></div></div>
                                <p className="mt-2.5">{proverbioObj?.spiegazione}</p>
                            </div>
                            <div className="hidden md:flex flex-col items-start gap-2.5">
                                <h2 className="title text-nowrap">CONDIVIDI SU</h2>
                                <div className="flex items-center gap-5 text-[1.8rem]">
                                    <a href={`https://wa.me/?text=${msg}`} target="_blank" aria-label="Share on whatsapp" className="opacity-50 hover:opacity-100 hover:duration-300"><BiLogoWhatsapp /></a>
                                    <a href={`https://twitter.com/intent/tweet?text=${msg}`} target="_blank" aria-label="Share on x" className="opacity-50 hover:opacity-100 hover:duration-300"><RiTwitterXFill /></a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.proverby.it%2Fproverbio%2F${pathname.split("/").filter(Boolean).pop()}`} target="_blank" aria-label="Share on facebook" className="opacity-50 hover:opacity-100 hover:duration-300"><BiLogoFacebookCircle /></a>
                                </div>
                            </div>
                        </div>
                        {(proverbioObj?.esempi && proverbioObj?.esempi.length > 0) ?
                            <div className="mt-[30px] flex flex-col items-start w-full">
                                <div className="flex items-center gap-2.5 w-full"><h2 className="title">ESEMPI</h2><div className="w-full border-b border-b-solid border-b-(--contrast-01) duration-300"></div></div>
                                <div className="flex flex-col gap-2.5 md:gap-[5px] mt-3 rounded-(--border-radius) bg-(--contrast-007) w-full p-[15px_20px] border-l-5 border-(--contrast-01)">
                                    {
                                        proverbioObj.esempi.map((esempio, i) => (
                                            <div className="flex items-center gap-2.5" key={i}><div><AiOutlineDoubleLeft className="text-[1.2rem] opacity-20" /></div><p>{esempio}</p><div><AiOutlineDoubleRight className="text-[1.2rem] opacity-20" /></div></div>
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

            <div className="md:hidden py-[40px_30px] flex flex-col items-center gap-2.5">
                <h2 className="title">CONDIVIDI SU</h2>
                <div className="flex items-center gap-5 text-[1.8rem]">
                    <a href={`https://wa.me/?text=${msg}`} target="_blank" aria-label="Share on whatsapp" className="opacity-50 hover:opacity-100 hover:duration-300"><BiLogoWhatsapp /></a>
                    <a href={`https://twitter.com/intent/tweet?text=${msg}`} target="_blank" aria-label="Share on x" className="opacity-50 hover:opacity-100 hover:duration-300"><RiTwitterXFill /></a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.proverby.it%2Fproverbio%2F${pathname.split("/").filter(Boolean).pop()}`} target="_blank" aria-label="Share on facebook" className="opacity-50 hover:opacity-100 hover:duration-300"><BiLogoFacebookCircle /></a>
                </div>
            </div>

            <div className="relative w-full border-solid border border-(--contrast-01) rounded-(--border-radius) p-[20px_20px_100px_20px] text-center  mt-0 md:mt-[50px] mb-[75px]">
                <h2 className="font-semibold text-[1.4rem]">Esplora un proverbio casuale!</h2>
                <p>Clicca sul pulsante qui sotto per esplorare un proverbio casuale.</p>
                <div className="absolute left-[50%] top-full transform-[translate(-50%,-50%)] flex items-center justify-center w-[140px] h-[140px] bg-(--primary) rounded-full shadow-[0_5px_0_var(--primary-dark)] active:shadow-[0_0_0_var(--primary-dark)] active:transform-[translate(-50%,calc(-50%+5px))] duration-300 cursor-pointer" onClick={handleRandom}>
                    <div className="flex items-center transform-[rotate(20deg)]">
                        <BiSolidDice5 className={`text-white/90 text-[4rem] ${isSpin ? "animate-[spin_1s_cubic-bezier(0.25,0.1,0.25,1)]" : ""}`} />
                    </div>
                </div>
            </div>

            <div className="mt-[45px] flex flex-col items-start w-full">
                <div className="flex items-center gap-2.5 w-full"><h2 className="title">ALTRI PROVERBI SIMILI</h2><div className="w-full border-b border-b-solid border-b-(--contrast-01) duration-300"></div></div>
                <div className="mt-2.5 w-full">
                    <ListProverbi type="similar"></ListProverbi>
                </div>
            </div>

        </div>
    )

}