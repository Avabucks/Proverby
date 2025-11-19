"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";

import CardProverbio from "@/src/components/CardProverbio";
import { checkUsername } from "@/src/actions/users_actions";
import { getProverbioFromSEO } from "@/src/actions/proverbi_actions";

export default function ProfiloLayout() {
    const router = useRouter();
    const pathname = usePathname().split("/").filter(Boolean).pop();

    const [isLogged, setLogged] = useState(false)
    const [isLoading, setLoading] = useState(true)

    const [proverbio, setProverbioString] = useState("");
    const [spiegazione, setSpiegazioneString] = useState("");

    const [isSuccess, setSuccess] = useState(false)
    const [errorMsg, setErrMsg] = useState<{ success?: boolean; error: string; } | { success?: boolean; error?: undefined; }>({});

    useEffect(() => {
        async function loadUser() {
            const cookieUser = getCookie("user");
            let jsonCookie;
            if (cookieUser) {
                setLogged(true);
                loadProverbioFromSEO();
                jsonCookie = JSON.parse(cookieUser as string);
                const check = await checkUsername(jsonCookie?.uid)
                if (check) {
                    location.href = "/"
                }
            } else {
                location.href = "/" // TODO: manda a una pagina per login
            }
        }

        async function loadProverbioFromSEO() {
            if (pathname != "new") {
                const result = await getProverbioFromSEO(pathname || "");
                if (result && result.stato != 1) {
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
                                {isLogged ?
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
                                                TODO
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
                                        <div className="mt-[50px] flex items-center justify-center gap-[5px] leading-0 w-full bg-[var(--primary)] py-[20px] text-[rgb(255,255,255)] rounded-[var(--border-radius)] shadow-[0_5px_0_var(--primary-dark)] active:shadow-[0_0_0_var(--primary-dark)] active:transform-[translateY(5px)] duration-300 cursor-pointer">
                                            <i className="bx bx-send-alt mr-[5px]"></i>Sottoponi il proverbio <span className="hidden md:flex">e attendi che venga accettato</span>
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
                <div className="animate-[fade-in_.5s]">
                    Success "confetti"
                </div>
            }
        </div>
    )
}

// TODO:
// - loadUser che controlla login e username != uid else locaion.href [FATTO]
// - setState delle variabili quando scrivo [FATTO]
// - passa variabile e setState a CardProverbio [FATTO]
// - await aggiungi(...)
// - esempi

// - testo per specifiche (click su href con target _blank) [FATTO]
// - setState(aggiunto = true) cambia layout con quello con confetti