import Link from "next/link";

interface Props {
    ctaText?: string;
}

export default function Footer({ ctaText }: Props) {
    return (
        <div className="animate-[fade-in_.5s] p-[30px] text-center">
            { ctaText ? <p>{ ctaText }</p> : <></> }
            <div>
                FOOTER
            </div>
        </div>
    );
}