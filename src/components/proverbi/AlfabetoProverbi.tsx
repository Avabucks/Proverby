"use client";

import { getAlfabetoProverbi } from "@/src/actions/proverbi_actions";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Ripple from "../ui/Ripple";
import Link from "next/link";

interface Props {
    initLetter?: string;
}

export default function AlfabetoProverbi({ initLetter }: Readonly<Props>) {

    const [isLoading, setIsLoading] = useState(true);
    const [alfabetoProverbi, setAlfabetoProverbi] = useState<{ first_letter: string; }[]>([]);

    useEffect(() => {
        async function loadAlfabetoProverbi() {
            const result = await getAlfabetoProverbi();
            if (result) {
                setAlfabetoProverbi(result);
            }
            setIsLoading(false);
        }

        loadAlfabetoProverbi();

    }, []);

    const renderLoadingSkeleton = () => (
        <div className="flex gap-2.5 p-px overflow-hidden">
            {Array.from({ length: 20 }).map((_, idx) => (
                <div key={idx} className="animate-pulse rounded-(--border-radius) h-[50px] aspect-square bg-(--contrast-01)"></div>
            ))}
        </div>
    );

    // TODO: Migliorare stile alfabeto
    const renderAlfabeto = () => {
        const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        const lettereProverbi = alfabetoProverbi.map(item => item.first_letter.trim().toUpperCase());
        const lettereSpeciali = lettereProverbi.filter(
            l => !alfabeto.includes(l)
        ).sort((a, b) => a.localeCompare(b));

        return (
            <div className="flex items-center">
                {initLetter && (
                    <div className="w-[85px] md:w-[73px] flex items-center p-px gap-2.5 flex-nowrap overflow-x-auto scrollbar-hide pointer-events-none">
                        <Ripple opt="primary aspect-square">
                            {initLetter}
                        </Ripple>
                        <div className="h-10 border-l border-l-solid border-l-(--contrast-01)"></div>
                    </div>
                )}
                <div className="flex items-center w-full p-px gap-2.5 flex-nowrap overflow-x-auto scrollbar-hide">
                    {alfabeto.map((lettera) => (
                        <Link key={lettera} className={clsx(!lettereProverbi.includes(lettera) && "opacity-50 pointer-events-none", lettera === initLetter && "hidden")} href={`/alfabeto/${lettera}`}>
                            <Ripple opt="outline aspect-square">
                                {lettera}
                            </Ripple>
                        </Link>
                    ))}
                    {lettereSpeciali.map((lettera) => (
                        <Link key={lettera} className={clsx(lettera === initLetter && "hidden")} href={`/alfabeto/${lettera}`}>
                            <Ripple opt="outline aspect-square">
                                {lettera}
                            </Ripple>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }


    return (
        <>
            <div className="flex items-center gap-2.5 w-full"><h2 className="title">ALFABETO</h2><div className="w-full border-b border-b-solid border-b-(--contrast-01) duration-300"></div></div>
            {isLoading ? renderLoadingSkeleton() : renderAlfabeto()}
        </>
    );
}

// TODO: scrollbar personalizzato con tasto per scrollare orizzontalmente