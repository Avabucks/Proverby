"use client"
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/src/context/UserContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { dailyProverbio, getProverbioFromSEO } from "@/src/actions/proverbi_actions";
import LikeDislike from "@/src/components/user/LikeDislike";
import SalvaProverbio from "@/src/components/user/SalvaProverbio";
import { BiErrorAlt, BiLockOpenAlt, BiChevronLeft, BiVolumeFull } from "react-icons/bi";
import Ripple from "@/src/components/ui/Ripple";
import clsx from 'clsx';

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
    likeState?: number;
}

export default function CardProverbio({ type, setString, proverbio }: Readonly<Props>) {
    const router = useRouter();
    const pathname = usePathname().split("/").findLast(Boolean);
    const { user, fingerprint } = useUser();

    const [proverbioObj, setProverbioObj] = useState<Proverbio>();
    const [isLoading, setIsLoading] = useState(true);
    const [counterChar, setCounterChar] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleClickCard = () => {
        if (type === "giorno") {
            router.push("/proverbio/" + proverbioObj?.seo_link);
        }
    };

    const cardClasses = clsx(
        "relative block w-[80%] md:w-[90%] h-[70vh] sm:h-[35vh] min-h-[270px] bg-(--bg) rounded-(--border-radius) transition-all duration-300 mb-[170px] mt-20 md:mt-[110px] mx-auto",
        !isLoading && type === "giorno" && "glare-hover cursor-pointer",
        type === "dettagli" && "cursor-default"
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value.replaceAll(/\r?\n/g, "");

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

    const speak = (textToSpeech?: string) => {
        if (textToSpeech) {
            const utter = new SpeechSynthesisUtterance(textToSpeech);
            utter.rate = 1;
            utter.pitch = 1;

            const googleVoice = voices.find(v =>
                v.name.toLowerCase().includes("google") &&
                v.lang === "it-IT"
            );

            if (googleVoice) utter.voice = googleVoice;

            globalThis.window.speechSynthesis.speak(utter);
        }
    };

    useEffect(() => {
        const loadVoices = () => setVoices(globalThis.window.speechSynthesis.getVoices());
        globalThis.window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
        loadVoices();

        async function loadDailyProverbio() {
            const result = await dailyProverbio();
            if (result) {
                setProverbioObj(result);
            }
            setIsLoading(false);
        }

        async function loadProverbioFromSEO() {
            const result = await getProverbioFromSEO(pathname || "", user?.uid, user?.username, fingerprint || "");
            if (result && (result.stato == 2 || (result.stato == 0 && user && user.username == result.username) || user?.isAdmin == 1)) {
                setProverbioObj(result);
                if (user && result.stato == 2) setIsSaved(result.isSaved)
                setIsLoading(false);
            } else {
                router.push("/")
            }
        }

        async function loadProverbioAggiungi() {
            if (user) {
                if (pathname === "new") {
                    if (user) setProverbioObj({ username: user.username, photoURL: user.photoURL });
                    setIsLoading(false);
                } else {
                    const result = await getProverbioFromSEO(pathname || "");
                    if (result && result.stato != 1) {
                        setProverbioObj(result);
                        setIsLoading(false);
                    } else {
                        router.push("/")
                    }
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

        return () =>
            globalThis.window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);

    }, []);

    useEffect(() => {
        if (type == "aggiungi") {
            resizeTextarea()
            window.addEventListener("resize", resizeTextarea);
        }
    }, [proverbio])

    const renderLoadingSkeleton = () => (
        <div className="animate-pulse rounded-(--border-radius) w-full h-full bg-(--contrast-01)"></div>
    );

    const renderEmojiDecoration = () => {
        if (type === "giorno") {
            return (
                <>
                    <div className="absolute left-[calc(100%-25px)] top-[15%] sm:top-[20%] z-1 w-[350px] 2xl:w-1/4 aspect-square pointer-events-none transform-[translate(-50%,-50%)] transition duration-500 select-none emoji">
                        <Image
                            src="/assets/emojis/esplosione.webp"
                            alt="Esplosione"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="absolute left-[11%] md:left-[2%] top-[calc(100%-40px)] z-1 w-[350px] 2xl:w-1/4 aspect-square pointer-events-none transform-[translate(-50%,-50%)] transition duration-500 select-none emoji">
                        <Image
                            src="/assets/emojis/fuoco.webp"
                            alt="Fuoco emoji"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </>
            );
        } else if (type === "dettagli") {
            return (
                <div className="absolute left-[calc(100%-25px)] top-[15%] sm:top-[20%] z-1 w-[350px] 2xl:w-1/4 aspect-square pointer-events-none transform-[translate(-50%,-50%)] transition duration-500 select-none emoji">
                    <Image
                        src="/assets/emojis/scrittura.webp"
                        alt="Esplosione"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            );
        } else if (type === "aggiungi") {
            return (
                <div className="absolute left-[calc(100%-25px)] top-[15%] sm:top-[20%] z-1 w-[350px] 2xl:w-1/4 aspect-square pointer-events-none transform-[translate(-50%,-50%)] transition duration-500 select-none emoji">
                    <Image
                        src="/assets/emojis/pensieroso.webp"
                        alt="Esplosione"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            );
        }
    }

    const renderAggiungiContent = () => {
        return (
            <div>
                <textarea className="absolute min-h-0 top-1/2 left-1/2 transform-[translate(-50%,-50%)] w-[90%] text-center text-[2rem] sm:text-[3.1vw] leading-10 sm:leading-[3.3vw] font-bold whitespace-pre-wrap wrap-break-word overflow-hidden"
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
            </div>
        )
    }

    const renderSpeechButton = () => {
        if (type === "giorno" || type === "dettagli") {
            return (
                <div className="absolute bottom-2.5 right-2.5 z-3"><Ripple icon={BiVolumeFull} handleOnClick={(e) => { e.stopPropagation(); speak(proverbioObj?.proverbio) }}></Ripple></div>
            )
        }
    }

    return (
        <>
            {(proverbioObj?.stato == 0 && user?.isAdmin == 0) && (
                <div className="flex items-center justify-center gap-2.5 p-2.5 w-full bg-(--primary-dark) text-[rgb(255,255,255)]"><BiErrorAlt className='text-[1.2rem]' />Questo proverbio è in fase di revisione e sarà visibile solo a te finché non verrà approvato.</div>
            )}
            {(type != "giorno" && user?.isAdmin == 1) ? <div className="flex items-center justify-center gap-2.5 p-2.5 w-full bg-(--contrast-01) text-(--text-color) duration-300"><BiLockOpenAlt className='text-[1.2rem]' />Visualizzazione Admin</div> : <></>}
            <div className={`card-proverby ${(type == "aggiungi" && counterChar > 0) ? "aggiungi-scritto" : type} w-full overflow-hidden ${type == "dettagli" ? "text-white/90" : ""} ${(type == "dettagli" || type == "aggiungi") ? "mt-[-60px] md:mt-[-90px]" : ""}`}>
                <button className={cardClasses} onClick={handleClickCard}>
                    {
                        isLoading ?
                            renderLoadingSkeleton()
                            :
                            <div className="animate-[fade-in_.5s]">
                                {renderEmojiDecoration()}
                                <div className="absolute inset-0 w-full h-full overflow-hidden rounded-(--border-radius) bg-card">
                                    <div className="absolute top-1/2 left-1/2 transform-[translate(-50%,-50%)rotate(45deg)] sm:transform-[translate(-50%,-50%)rotate(10deg)] flex flex-col gap-5">
                                        <span className="sm:hidden font-(family-name:--font-yourmate) text-(--contrast-005) text-[25vw] sm:text-[15.5vw] leading-none select-none duration-300">PROVERBY</span>
                                        <span className="sm:hidden font-(family-name:--font-yourmate) text-(--contrast-005) text-[25vw] sm:text-[15.5vw] leading-none select-none duration-300">PROVERBY</span>
                                        <span className="font-(family-name:--font-yourmate) text-(--contrast-005) text-[25vw] sm:text-[15.5vw] leading-none select-none duration-300">PROVERBY</span>
                                        <span className="font-(family-name:--font-yourmate) text-(--contrast-005) text-[25vw] sm:text-[15.5vw] leading-none select-none duration-300">PROVERBY</span>
                                        <span className="font-(family-name:--font-yourmate) text-(--contrast-005) text-[25vw] sm:text-[15.5vw] leading-none select-none duration-300">PROVERBY</span>
                                    </div>
                                </div>
                                {type === "aggiungi" ?
                                    renderAggiungiContent()
                                    :
                                    <h1 className="absolute top-1/2 left-1/2 transform-[translate(-50%,-50%)] w-[90%] text-center text-[2rem] sm:text-[3.1vw] leading-10 sm:leading-[3.3vw] font-bold">{proverbioObj?.proverbio?.replaceAll('&nbsp;', " ").replaceAll(/\s+/g, " ").trim()}</h1>
                                }
                                <Link className="absolute bottom-15 md:bottom-2.5 left-[50%] translate-x-[-50%] z-3 flex items-center text-[.9rem]" href={`/profilo/${proverbioObj?.username}`} onClick={(e) => { e.stopPropagation(); }}><Ripple>by {proverbioObj?.username}<Image className="rounded-full max-w-none" src={`${proverbioObj?.photoURL}`} alt="fot_profilo" width={30} height={30} /></Ripple></Link>
                                {(type === "dettagli" && proverbioObj?.stato == 2) &&
                                    (<>
                                        <div className="absolute bottom-2.5 left-2.5 z-3 text-[rgb(255,255,255)]"><LikeDislike id={proverbioObj?.id || 0} likeStateProverbio={proverbioObj?.likeState || 0}></LikeDislike></div>
                                        <div className="absolute top-2.5 left-2.5 z-3 text-[rgb(255,255,255)]"><SalvaProverbio isSaved={isSaved} setSaved={setIsSaved}></SalvaProverbio></div>
                                    </>
                                    )}
                                {renderSpeechButton()}
                            </div>
                    }
                </button>
            </div>
        </>
    );
}