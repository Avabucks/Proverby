"use client";

import { getAlfabetoProverbi } from "@/src/actions/proverbi_actions";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Ripple from "../ui/Ripple";
import Link from "next/link";

export default function AlfabetoProverbi() {

    const [isLoading, setIsLoading] = useState(true);
    const [alfabetoProverbi, setAlfabetoProverbi] = useState<{ first_letter: string; }[]>([]);

    useEffect(() => {
        async function loadAlfabetoProverbi() {
            const result = await getAlfabetoProverbi();
            if (result) {
                setAlfabetoProverbi(result);
                console.log(result);
            }
            setIsLoading(false);
        }

        loadAlfabetoProverbi();

    }, []);

    // TODO: Skeleton loading style
    const renderLoadingSkeleton = () => (
        <div className="flex gap-2.5 p-1 overflow-hidden">
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
            <div className="flex gap-2.5 flex-nowrap overflow-x-auto p-1 scrollbar-hide">
                {alfabeto.map((lettera) => (
                    <Link key={lettera} className={clsx(!lettereProverbi.includes(lettera) && "opacity-50 pointer-events-none")} href={`/alfabeto/${lettera}`}>
                        <Ripple opt="outline aspect-square">
                            {lettera}
                        </Ripple>
                    </Link>
                ))}
                {lettereSpeciali.map((lettera) => (
                    <Link key={lettera} href={`/alfabeto/${lettera}`}>
                        <Ripple opt="outline aspect-square">
                            {lettera}
                        </Ripple>
                    </Link>
                ))}
            </div>
        );
    }


    return (
        <>{isLoading ? renderLoadingSkeleton() : renderAlfabeto()}</>
    );
}

// TODO: scrollbar personalizzato