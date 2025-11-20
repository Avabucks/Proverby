"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import CardProverbio from "@/src/components/CardProverbio";
import { getProverbioFromSEO, aggiungiProverbio } from "@/src/actions/proverbi_actions";
import confetti from "canvas-confetti"

interface Props {
    id: string;
}

export default function ProfiloLayout({ id }: Props) {
    const router = useRouter();
    const pathname = usePathname().split("/").filter(Boolean).pop();
    const { user } = useUser();

    const [isLoading, setLoading] = useState(true)
    const [isSaving, setSaving] = useState(false)
    const [proverbio, setProverbioString] = useState("");
    const [spiegazione, setSpiegazioneString] = useState("");
    const [isSuccess, setSuccess] = useState(false)
    const [errorMsg, setErrMsg] = useState<{ success?: boolean; error: string; } | { success?: boolean; error?: undefined; }>({ success: true });

    const handleConfetti = () => {
        const duration = 5 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }
        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min
        const interval = window.setInterval(() => {
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

    const handleAggiungi = async () => {
        if (!user) {
            setErrMsg({ success: false, error: "Utente non caricato" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (proverbio.length == 0 || spiegazione.length == 0) {
            setErrMsg({ success: false, error: "Il proverbio e la spiegazione non possono essere vuoti" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // TODO:
        const esempi = ["Es1", "es2"]

        setSaving(true)
        const result = await aggiungiProverbio(id, user.uid, user.username, proverbio, spiegazione, esempi, user.isAdmin)
        if (result.success && !result.isAdmin) {
            setSuccess(true)
            handleConfetti();
        } else if (result.success && result.isAdmin) {
            router.push("/admin")
        } else {
            setErrMsg(result)
        }
        if (!result.isAdmin) window.scrollTo({ top: 0, behavior: 'smooth' });
        setSaving(false);
    };

    useEffect(() => {
        async function loadUser() {
            if (user) {
                loadProverbioFromSEO();
            } else {
                router.push("/");
            }
        }

        async function loadProverbioFromSEO() {
            if (pathname != "new") {
                const result = await getProverbioFromSEO(pathname || "");
                if (user && result && result.stato != 1 && (result.username == user.username || user.isAdmin == 1)) {
                    setProverbioString(result.proverbio);
                    setSpiegazioneString(result.spiegazione);
                    setLoading(false);
                } else {
                    router.push("/")
                }
            } else {
                setLoading(false);
            }
        }

        loadUser()
    }, [])

    return (
        <div>
            {!isSuccess ?
                <div>
                    {!errorMsg.success ?
                        <section>
                            <div className="relative flex items-center gap-[10px] overflow-hidden border-solid border-[2px] border-[rgb(220,50,50)] text-[rgb(220,50,50)] p-[20px] rounded-[var(--border-radius)] before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-[rgb(220,50,50)] before:opacity-20">
                                <i className='bx bx-alert-triangle text-[1.3rem]'></i>
                                {errorMsg.error}
                            </div>
                        </section>
                        : <></>}
                    <CardProverbio type="aggiungi" setString={setProverbioString} proverbio={proverbio}></CardProverbio>
                    <section className="mt-[-130px]">
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
                            <>
                                {user ?
                                    <>
                                        <div className="flex flex-col items-start w-full">
                                            <div className="title">SPIEGAZIONE</div>
                                        </div>
                                        <textarea
                                            className="textarea w-full mt-[15px]"
                                            value={spiegazione}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpiegazioneString(e.target.value)}
                                            placeholder="Inserisci una spiegazione" />
                                        <div className="flex flex-col items-start w-full mt-[50px]">
                                            <div className="title">ESEMPI</div>
                                            <div className="mt-[15px]">
                                                TODO: esempi
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start w-full mt-[50px]">
                                            <div className="title">CONDIZIONI PER L'ACCETTAZIONE</div>
                                            <div className="mt-[15px]">
                                                <ol className="list-decimal list-inside space-y-3">
                                                    <li><span className="font-medium">Rispetto dei termini e condizioni del sito:</span> il contenuto non deve violare regole, copyright o includere materiale offensivo (<a href="/terms" target="_blank" className="text-[var(--primary-light)] underline">leggi termini e condizioni</a>).</li>
                                                    <li><span className="font-medium">Tipologia ammessa:</span> il proverbio può essere</li>
                                                    <ul className="list-disc ml-[40px] space-y-1">
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
                                        <div className="mt-[50px] flex flex-col gap-[20px] items-center">
                                            {isSaving ?
                                                <div className="py-[10px]">
                                                    <div className="border-[3px] border-solid border-[var(--primary)] border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                                                </div>
                                                :
                                                <div className="animate-[fade-in_.3s] flex items-center justify-center gap-[5px] leading-0 w-full bg-[var(--primary)] py-[20px] text-[rgb(255,255,255)] rounded-[var(--border-radius)] shadow-[0_5px_0_var(--primary-dark)] active:shadow-[0_0_0_var(--primary-dark)] active:translate-y-[5px] transition-[translate,box-shadow] duration-300 cursor-pointer"
                                                    onClick={handleAggiungi}>
                                                    <i className="bx bx-send-alt mr-[5px]"></i>Invia il proverbio <span className="hidden md:flex">e attendi che venga accettato</span>
                                                </div>
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
                :
                <section className="animate-[fade-in_.5s] flex flex-col items-center center min-h-[70vh]">
                    TODO: Success (visualizza il profilo con css outline - aggiungine un altro con css accient [cambia state])
                </section>
            }
        </div>
    )
}