"use client"
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/src/context/UserContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { dailyProverbio, getProverbioFromSEO } from "@/src/actions/proverbi_actions";
import LikeDislike from "@/src/components/LikeDislike";
import SalvaProverbio from "@/src/components/SalvaProverbio";
import { BiErrorAlt, BiLockOpenAlt, BiChevronLeft } from "react-icons/bi";

interface Props {
    type: string;
    proverbio?: string;
    setString?: Function;
}

interface Proverbio {
    id?: number;
    proverbio?: string;
    username: string;
    seo_link?: string;
    photoURL: string;
    stato?: number;
}

export default function CardProverbio({ type, setString, proverbio }: Props) {
    const router = useRouter();
    const pathname = usePathname().split("/").filter(Boolean).pop();
    const { user } = useUser();

    const [proverbioObj, setProverbioObj] = useState<Proverbio>();
    const [isLoading, setLoading] = useState(true);
    const [counterChar, setCounterChar] = useState(0);
    const [isSaved, setSaved] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value.replace(/\r?\n/g, "");

        if (val.length < 100) {
            if (setString) setString(val);
            setCounterChar(val.length);
        }
    };

    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
            textareaRef.current.focus()
            setCounterChar(textareaRef.current.textContent.length);
        }
    };

    useEffect(() => {
        async function loadDailyProverbio() {
            const result = await dailyProverbio();
            if (result) {
                setProverbioObj(result);
            }
            setLoading(false);
        }

        async function loadProverbioFromSEO() {
            const result = await getProverbioFromSEO(pathname || "", user?.uid, user?.username);
            if (result && (result.stato == 2 || (result.stato == 0 && user && user.username == result.username) || user?.isAdmin == 1)) {
                setProverbioObj(result);
                if (user && result.stato == 2) setSaved(result.isSaved)
                setLoading(false);
            } else {
                router.push("/")
            }
        }

        async function loadProverbioAggiungi() {
            if (user) {
                if (pathname != "new") {
                    const result = await getProverbioFromSEO(pathname || "");
                    if (result && result.stato != 1) {
                        setProverbioObj(result);
                        setLoading(false);
                    } else {
                        router.push("/")
                    }
                } else {
                    if (user) setProverbioObj({ username: user.username, photoURL: user.photoURL });
                    setLoading(false);
                }
            }
        }

        const loaders: { [key: string]: () => Promise<void> } = {
            "giorno": loadDailyProverbio,
            "dettagli": loadProverbioFromSEO,
            "aggiungi": loadProverbioAggiungi,
        };

        if (loaders[type]) {
            loaders[type]();
        }

    }, []);

    useEffect(() => {
        if (type == "aggiungi") {
            resizeTextarea()
            window.addEventListener("resize", resizeTextarea);
        }
    }, [proverbio])

    return (
        <>
            {(proverbioObj?.stato == 0 && user?.isAdmin == 0) ? <div className="flex items-center justify-center gap-[10px] p-[10px] w-full bg-[var(--primary-dark)] text-[rgb(255,255,255)]"><BiErrorAlt className='text-[1.2rem]' />Questo proverbio è in fase di revisione e sarà visibile solo a te finché non verrà approvato.</div> : <></>}
            {(type != "giorno" && user?.isAdmin == 1) ? <div className="flex items-center justify-center gap-[10px] p-[10px] w-full bg-[var(--contrast-01)] text-[var(--text-color)]"><BiLockOpenAlt className='text-[1.2rem]' />Visualizzazione Admin</div> : <></>}
            <div className={`card-proverby ${(type == "aggiungi" && counterChar > 0) ? "aggiungi-scritto" : type} w-full overflow-hidden ${type == "dettagli" ? "text-white/90" : ""} ${(type == "dettagli" || type == "aggiungi") ? "mt-[-60px] md:mt-[-90px]" : ""}`}>
                <div className={`${(!isLoading && type == "giorno") ? "glare-hover cursor-pointer" : ""} relative block w-[80%] md:w-[90%] h-[70vh] sm:h-[35vh] min-h-[270px] bg-[var(--bg)] rounded-[var(--border-radius)] transition-all duration-300 mb-[170px] mt-[80px] md:mt-[110px] mx-auto`} onClick={() => { if (type == "giorno") router.push("/proverbio/" + proverbioObj?.seo_link) }}>
                    {
                        isLoading ?
                            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-full bg-[var(--contrast-01)]">
                            </div>
                            :
                            <div className="animate-[fade-in_.5s]">
                                {
                                    type === "giorno" ?
                                        <>
                                            <div className="bg-[url('/assets/emojis/esplosione.webp')] absolute left-[calc(100%-25px)] top-[15%] sm:top-[23%] z-[1] w-[350px] 2xl:w-1/4 aspect-[1/1] pointer-events-none bg-contain transform-[translate(-50%,-50%)] transition duration-500 select-none emoji"></div>
                                            <div className="bg-[url('/assets/emojis/fuoco.webp')] absolute left-[11%] md:left-[2%] top-[calc(100%-30px)] z-[1] w-[350px] 2xl:w-1/4 aspect-[1/1] pointer-events-none bg-contain transform-[translate(-50%,-50%)] transition duration-500 select-none emoji"></div>
                                        </>
                                        : type === "dettagli" ?
                                            <>
                                                <div className="bg-[url('/assets/emojis/scrittura.webp')] absolute left-[calc(100%-25px)] top-[13%] sm:top-[23%] z-[1] w-[350px] 2xl:w-1/4 aspect-[1/1] pointer-events-none bg-contain transform-[translate(-50%,-50%)] transition duration-500 select-none emoji"></div>
                                            </>
                                            : type === "aggiungi" ?
                                                <>
                                                    <div className="bg-[url('/assets/emojis/pensieroso.webp')] absolute left-[calc(100%-25px)] top-[13%] sm:top-[23%] z-[1] w-[350px] 2xl:w-1/4 aspect-[1/1] pointer-events-none bg-contain transform-[translate(-50%,-50%)] transition duration-500 select-none emoji"></div>
                                                </>
                                                : <></>
                                }
                                <div className="absolute w-full h-full overflow-hidden rounded-[var(--border-radius)] bg-card">
                                    <div className="absolute top-1/2 left-1/2 transform-[translate(-50%,-50%)rotate(45deg)] sm:transform-[translate(-50%,-50%)rotate(10deg)] flex flex-col gap-[20px]">
                                        <span className="sm:hidden font-[family-name:var(--font-yourmate)] text-[var(--contrast-005)] text-[25vw] sm:text-[15.5vw] leading-[1] select-none duration-300">PROVERBY</span>
                                        <span className="sm:hidden font-[family-name:var(--font-yourmate)] text-[var(--contrast-005)] text-[25vw] sm:text-[15.5vw] leading-[1] select-none duration-300">PROVERBY</span>
                                        <span className="font-[family-name:var(--font-yourmate)] text-[var(--contrast-005)] text-[25vw] sm:text-[15.5vw] leading-[1] select-none duration-300">PROVERBY</span>
                                        <span className="font-[family-name:var(--font-yourmate)] text-[var(--contrast-005)] text-[25vw] sm:text-[15.5vw] leading-[1] select-none duration-300">PROVERBY</span>
                                        <span className="font-[family-name:var(--font-yourmate)] text-[var(--contrast-005)] text-[25vw] sm:text-[15.5vw] leading-[1] select-none duration-300">PROVERBY</span>
                                    </div>
                                </div>
                                {type != "aggiungi" ?
                                    <h1 className="absolute top-1/2 left-1/2 transform-[translate(-50%,-50%)] w-[90%] text-center text-[2rem] sm:text-[3.1vw] leading-[2.5rem] sm:leading-[3.3vw] font-bold">{proverbioObj?.proverbio?.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()}.</h1>
                                    :
                                    <div>
                                        <textarea className="absolute min-h-0 top-1/2 left-1/2 transform-[translate(-50%,-50%)] w-[90%] text-center text-[2rem] sm:text-[3.1vw] leading-[2.5rem] sm:leading-[3.3vw] font-bold whitespace-pre-wrap break-words overflow-hidden"
                                            value={proverbio}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onInput={resizeTextarea}
                                            rows={1}
                                            ref={textareaRef}
                                            placeholder="Scrivi qui il tuo proverbio ..." />
                                        <div className="flex items-center absolute bottom-[15px] right-[15px] leading-0">{counterChar} <BiChevronLeft className="text-[24px]" /> <span className="font-semibold">99</span> </div>
                                    </div>}
                                <Link className="absolute top-[85%] left-[50%] transform-[translate(-50%,-50%)] z-[3] flex items-center gap-[10px] text-[.9rem]" href={`/profilo/${proverbioObj?.username}`} onClick={(e) => { e.stopPropagation(); }}>by {proverbioObj?.username}<Image className="rounded-full max-w-none" src={`${proverbioObj?.photoURL}`} alt="fot_profilo" width={30} height={30} /></Link>
                                {(type === "dettagli" && proverbioObj?.stato == 2) ?
                                    <>
                                        <div className="absolute bottom-[10px] left-[10px] z-[3] text-[rgb(255,255,255)]"><LikeDislike id={proverbioObj?.id || 0}></LikeDislike></div>
                                        <div className="absolute top-[10px] left-[10px] z-[3] text-[rgb(255,255,255)]"><SalvaProverbio id={proverbioObj?.id || 0} isSaved={isSaved} setSaved={setSaved}></SalvaProverbio></div>
                                    </>
                                    : <></>}
                            </div>
                    }
                </div>
            </div>
        </>
    );
}