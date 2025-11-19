import Link from "next/link";
import Ripple from "@/src/components/Ripple";
import CheckAdmin from "@/src/admin_components/CheckAdmin";

interface Props {
    ctaText?: string;
}

export default function Footer({ ctaText }: Props) {
    return (
        <div className="animate-[fade-in_.5s] mt-[50px]">
            <footer className="flex flex-col items-center w-full border-t-solid border-t-[1px] border-t-[var(--contrast-01)] duration-300">
                <section className="py-[65px]">
                    <div className="flex flex-col md:flex-row gap-[40px] items-start justify-between">
                        <div className="flex flex-col gap-[30px]">
                            <h1 className="text-[1.6rem] font-bold">Proverby</h1>
                            <p className="mt-[-20px] opacity-90 w-full md:w-[550px] leading-[1.7rem]">Proverby è una piattaforma che raccoglie proverbi condivisi dalla community: divertenti, saggi, originali o nati dall'esperienza quotidiana.</p>
                            <div className="flex items-center gap-[10px]">
                                <a href="https://buymeacoffee.com/avabuckssoi" target="_blank"><Ripple opt="primary" icon="bxl bx-buy-me-a-coffee">Buy me a coffee</Ripple></a>
                                <a href="https://www.instagram.com/proverby.it/" target="_blank"><Ripple opt="outline" icon="bxl bx-instagram"></Ripple></a>
                                <a href="https://www.tiktok.com/@proverby.it" target="_blank"><Ripple opt="outline" icon="bxl bx-tiktok"></Ripple></a>
                            </div>
                        </div>
                        <div>
                            TODO: Links: sfoglia, cos'è proverby, termini e condizioni, licenza
                        </div>
                        <div>
                            TODO: Links: aggiungi proverbio, quiz
                            <CheckAdmin load={ false } closeOnError={ false }>Admin</CheckAdmin>
                        </div>
                    </div>
                </section>
                <section className="border-t-solid border-t-[1px] border-t-[var(--contrast-01)]">
                        <a className="mx-auto py-[25px] opacity-[90] text-[.9rem]" href="https://avabucks.it/" target="_blank">© 2025 Proverby. Created by AvaBucks</a>
                </section>
            </footer>
        </div>
    );
}