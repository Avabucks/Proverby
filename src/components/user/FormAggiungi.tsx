"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import CardProverbio from "@/src/components/proverbi/CardProverbio";
import Ripple from "@/src/components/ui/Ripple";
import { getProverbioFromSEO, aggiungiProverbio } from "@/src/actions/proverbi_actions";
import confetti from "canvas-confetti"
import { BiSend, BiErrorAlt, BiUser, BiPlus } from "react-icons/bi"
import Link from "next/link";

interface Props {
    id: string;
}

export default function ProfiloLayout({ id }: Readonly<Props>) {
    const router = useRouter();
    const pathname = usePathname().split("/").findLast(Boolean);
    const { user } = useUser();

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [proverbio, setProverbio] = useState("");
    const [spiegazione, setSpiegazione] = useState("");
    const [esempi, setEsempi] = useState<string[]>([""]);
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState<{ success?: boolean; error?: string; }>({ success: true });

    const handleConfetti = () => {
        const duration = 5 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }
        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min
        const interval = globalThis.setInterval(() => {
            const timeLeft = animationEnd - Date.now()
            if (timeLeft <= 0) {
                return clearInterval(interval)
            }
            const particleCount = 50 * (timeLeft / duration)
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        }, 250)
    }

    const handleChangeEsempi = (e: React.ChangeEvent<HTMLInputElement>) => {
        const index = Number(e.target.id);
        const value = e.target.value;

        setEsempi(prev => {
            const newEsempi = [...prev];
            newEsempi[index] = value;
            return newEsempi;
        });
    };

    const handleAggiungiEsempio = () => {
        if (esempi.length < 9) setEsempi(prev => [...prev, ""]);
    }

    const handleAggiungi = async () => {
        if (!user) {
            setErrorMsg({ success: false, error: "Utente non caricato" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (proverbio.length == 0 || spiegazione.length == 0) {
            setErrorMsg({ success: false, error: "Il proverbio e la spiegazione non possono essere vuoti" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSaving(true)
        const result = await aggiungiProverbio(id, user.uid, user.username, proverbio, spiegazione, esempi, user.isAdmin)
        if (result.success && user?.isAdmin == 0) {
            setIsSuccess(true)
            handleConfetti();
        } else if (result.success && user?.isAdmin == 1) {
            router.push("/admin")
        } else {
            setErrorMsg(result)
        }
        setIsSaving(false);
    };

    useEffect(() => {
        if (isSuccess && user?.isAdmin == 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [isSuccess, user?.isAdmin]);

    useEffect(() => {
        async function loadUser() {
            if (user) {
                loadProverbioFromSEO();
            } else {
                router.push("/");
            }
        }

        async function loadProverbioFromSEO() {
            if (pathname === "new") {
                setIsLoading(false);
            } else {
                const result = await getProverbioFromSEO(pathname || "");
                if (user && result && result.stato != 1 && (result.username == user.username || user.isAdmin == 1)) {
                    setProverbio(result.proverbio);
                    setSpiegazione(result.spiegazione);
                    setEsempi(result.esempi || [""]);
                    setIsLoading(false);
                } else {
                    router.push("/")
                }
            }
        }

        loadUser()
    }, [])

    const renderLoadingSkeleton = () => (
        <>
            <div className="animate-pulse rounded-full w-full h-6 bg-(--contrast-01)"></div>
            <div className="animate-pulse rounded-full w-[300px] h-[15px] bg-(--contrast-01) mt-[7px]"></div>
            <div className="animate-pulse rounded-full w-[215px] h-[15px] bg-(--contrast-01) mt-[9px]"></div>
            <div className="animate-pulse rounded-full w-full h-6 bg-(--contrast-01) mt-10"></div>
            <div className="animate-pulse rounded-full w-[300px] h-[15px] bg-(--contrast-01) mt-[7px]"></div>
            <div className="animate-pulse rounded-full w-[215px] h-[15px] bg-(--contrast-01) mt-[9px] mb-10"></div>
        </>
    )

    const renderSuccess = () => {
        return (
            <section className="justify-center min-h-[70vh]">
                <div className="animate-[bounce-in_.5s_cubic-bezier(0.68,-0.6,0.32,1.6)]">
                    <div className="flex flex-col items-center text-center gap-5">
                        <h1 className="text-[3.5rem] font-bold w-full md:w-[650px] leading-15 bg-linear-to-br from-(--primary-light) to-(--primary-dark) bg-clip-text text-transparent">Grazie per aver condiviso un proverbio!</h1>
                        <h2 className="opacity-70 w-full md:w-[600px] leading-6">Il tuo proverbio è stato inviato ed è in attesa di approvazione. Appena sarà approvato, sarà visibile alla community di Proverby.</h2>
                    </div>
                    <div className="w-full my-10 border-t border-t-solid border-t-(--contrast-01)"></div>
                    <div className="flex justify-center w-full">
                        <div className="flex flex-row gap-3 md:gap-5 items-center justify-center">
                            <Link href={`/profilo/${user?.username}`} aria-label=""><Ripple opt="outline" icon={BiUser}><span className="hidden md:flex -mr-0.5">Visualizza</span><span>Profilo</span></Ripple></Link>
                            <Ripple opt="accient" icon={BiPlus} handleOnClick={() => setIsSuccess(false)}>Aggiungi Proverbio</Ripple>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <div>
            {isSuccess ?
                renderSuccess()
                :
                <div>
                    {(errorMsg.success === false) && (
                        <section>
                            <div className="relative flex items-center gap-2.5 overflow-hidden border-solid border-2 border-[rgb(220,50,50)] text-[rgb(220,50,50)] p-5 rounded-(--border-radius) before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-[rgb(220,50,50)] before:opacity-20">
                                <div><BiErrorAlt className='text-[1.3rem]' /></div>
                                {errorMsg.error}
                            </div>
                        </section>
                    )}
                    <CardProverbio type="aggiungi" setString={setProverbio} proverbio={proverbio}></CardProverbio>
                    <section className="mt-[-130px]">
                        {isLoading ?
                            renderLoadingSkeleton()
                            :
                            <>
                                {user ?
                                    <>
                                        <div className="flex flex-col items-start w-full">
                                            <div className="flex items-center gap-2.5 w-full"><h2 className="title">SPIEGAZIONE</h2><div className="w-full border-b border-b-solid border-b-(--contrast-01)"></div></div>
                                        </div>
                                        <textarea
                                            className="textarea w-full mt-[15px] text-[16px]"
                                            value={spiegazione}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpiegazione(e.target.value)}
                                            placeholder="Inserisci una spiegazione" />
                                        <div className="flex flex-col items-start w-full mt-[45px]">
                                            <div className="flex items-center justify-between gap-2.5 w-full">
                                                <div className="flex items-center gap-2.5 w-full"><h2 className="title">ESEMPI</h2><div className="w-full border-b border-b-solid border-b-(--contrast-01)"></div></div>
                                                <div className="scale-90"><Ripple opt="primary" icon={BiPlus} handleOnClick={handleAggiungiEsempio}></Ripple></div>
                                            </div>
                                            <div className="flex flex-col gap-2.5 mt-[5px] w-full">
                                                {esempi.map((val, idx) => (
                                                    <input
                                                        type="text"
                                                        key={`${idx}`}
                                                        id={String(idx)}
                                                        value={val}
                                                        onChange={handleChangeEsempi}
                                                        placeholder={`${idx + 1}. Inserisci un esempio (lascia vuoto per ignorare)`}
                                                        className="input text-[16px]"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start w-full mt-[50px]">
                                            <div className="title">CONDIZIONI PER L'ACCETTAZIONE</div>
                                            <div className="mt-[15px]">
                                                <ol className="list-decimal list-inside space-y-3">
                                                    <li><span className="font-medium">Rispetto dei termini e condizioni del sito:</span> il contenuto non deve violare regole, copyright o includere materiale offensivo (<a href="/terms" target="_blank" className="text-(--primary-light) underline">leggi termini e condizioni</a>).</li>
                                                    <li><span className="font-medium">Tipologia ammessa:</span> il proverbio può essere</li>
                                                    <ul className="list-disc ml-10 space-y-1">
                                                        <li>inventato dall'utente,</li>
                                                        <li>una rivisitazione di proverbi esistenti <span className="opacity-50">(es. “Chi scrolla Tiktok, non piglia like.”),</span></li>
                                                        <li>un proverbio tradizionale già conosciuto <span className="opacity-50">(es. “Chi dorme, non piglia pesci.”),</span></li>
                                                        <li>un motto, uno slogan o un frase motivazionale.</li>
                                                    </ul>
                                                    <li><span className="font-medium">Chiarezza e spiegazione:</span> ogni proverbio deve poter essere accompagnato da una spiegazione o definizione che ne chiarisca il significato.</li>
                                                    <li><span className="font-medium">Esempi d'uso (facoltativi):</span> l'autore può aggiungere esempi pratici o frasi che mostrino come utilizzare il proverbio nel contesto quotidiano.</li>
                                                </ol>
                                            </div>
                                        </div>
                                        <div className="mt-[50px] flex flex-col gap-5 items-center">
                                            {isSaving ?
                                                <div className="py-2.5">
                                                    <div className="border-[3px] border-solid border-(--primary) border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                                                </div>
                                                :
                                                <button className="animate-[fade-in_.3s] flex items-center justify-center gap-[5px] leading-0 w-full bg-(--primary) py-5 text-[rgb(255,255,255)] rounded-(--border-radius) shadow-[0_5px_0_var(--primary-dark)] active:shadow-[0_0_0_var(--primary-dark)] active:translate-y-[5px] transition-[translate,box-shadow] duration-300 cursor-pointer"
                                                    onClick={handleAggiungi}>
                                                    <BiSend />Invia il proverbio <span className="hidden md:flex">e attendi che venga accettato</span>
                                                </button>
                                            }
                                        </div>
                                    </>
                                    :
                                    <></>
                                }
                            </>
                        }
                    </section>
                </div>
            }
        </div>
    )
}