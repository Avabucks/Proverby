"use client";

import { getAlfabetoProverbi } from "@/src/actions/proverbi_actions";
import clsx from "clsx";
import { useEffect, useState } from "react";

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
        <div className="flex flex-col gap-5">
            <div className="animate-pulse rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01)"></div>
            <div className="animate-pulse rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01)"></div>
            <div className="animate-pulse rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01)"></div>
            <div className="animate-pulse rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01)"></div>
            <div className="animate-pulse rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01)"></div>
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
            <div className="alfabeto">
                {alfabeto.map((lettera) => (
                    <span key={lettera} className={clsx(lettereProverbi.includes(lettera) && "text-red-500")}>
                        {lettera}
                    </span>
                ))}
                {lettereSpeciali.map((lettera) => (
                    <span
                        key={lettera}
                        className="text-red-500"
                    >
                        {lettera}
                    </span>
                ))}
            </div>
        );
    }


    return (
        <>{isLoading ? renderLoadingSkeleton() : renderAlfabeto()}</>
    );
}