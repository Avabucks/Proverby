import Link from "next/link";
import Ripple from "@/src/components/ui/Ripple";
import CheckAdmin from "@/src/components/admin/CheckAdmin";
import { BiLogoInstagram, BiLogoTiktok } from "react-icons/bi";
import { SiBuymeacoffee } from "react-icons/si";

export default function Footer() {
    return (
        <div className="animate-[fade-in_.5s] mt-[50px]">
            <footer className="flex flex-col items-center w-full border-t-solid border-t border-t-(--contrast-01) duration-300">
                <section className="py-[65px]">
                    <div className="flex flex-col md:flex-row gap-10 items-start justify-between">
                        <div className="flex flex-col gap-[30px]">
                            <h1 className="text-[1.6rem] font-bold">Proverby</h1>
                            <p className="-mt-5 opacity-90 w-full md:w-[550px] leading-[1.7rem]">Proverby è una piattaforma che raccoglie proverbi condivisi dalla community: divertenti, saggi, originali o nati dall'esperienza quotidiana.</p>
                            <div className="flex items-center gap-2.5">
                                <a href="https://buymeacoffee.com/avabuckssoi" target="_blank" aria-label="Buy me a coffee"><Ripple opt="primary" icon={SiBuymeacoffee}>Buy me a coffee</Ripple></a>
                                <a href="https://www.instagram.com/proverby.it/" target="_blank" aria-label="Follow on instagram"><Ripple opt="outline" icon={BiLogoInstagram}></Ripple></a>
                                <a href="https://www.tiktok.com/@proverby.it" target="_blank" aria-label="Follow on tiktok"><Ripple opt="outline" icon={BiLogoTiktok}></Ripple></a>
                            </div>
                        </div>
                        <div>
                            <div className="relative w-fit text-(--primary-light) font-medium p-[5px_15px] after:absolute after:inset-0 after:content-[''] after:w-full after:h-full after:rounded-(--border-radius) after:opacity-20 after:bg-(--primary-light)">Pagine</div>
                            <div className="mt-[30px] space-y-3 overflow-hidden">
                                <div className="relative duration-300 transform-[translateX(-15px)] hover:transform-[translateX(0)]">
                                    <Link href="/sfoglia">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-8 border-t-transparent border-b-transparent border-l-(--primary)"></span>
                                        <span className="ml-[15px]">Sfoglia</span>
                                    </Link>
                                </div>
                                <div className="relative duration-300 transform-[translateX(-15px)] hover:transform-[translateX(0)]">
                                    <Link href="/about">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-8 border-t-transparent border-b-transparent border-l-(--primary)"></span>
                                        <span className="ml-[15px]">Cos'è Proverby?</span>
                                    </Link>
                                </div>
                                <div className="relative duration-300 transform-[translateX(-15px)] hover:transform-[translateX(0)]">
                                    <Link href="/terms">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-8 border-t-transparent border-b-transparent border-l-(--primary)"></span>
                                        <span className="ml-[15px]">Termini e condizioni</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="relative w-fit text-(--primary-light) font-medium p-[5px_15px] after:absolute after:inset-0 after:content-[''] after:w-full after:h-full after:rounded-(--border-radius) after:opacity-20 after:bg-(--primary-light)">Account</div>
                            <div className="mt-[30px] space-y-3 overflow-hidden">
                                <div className="relative duration-300 transform-[translateX(-15px)] hover:transform-[translateX(0)]">
                                    <Link href="/editor/new">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-8 border-t-transparent border-b-transparent border-l-(--primary)"></span>
                                        <span className="ml-[15px]">Aggiungi Proverbio</span>
                                    </Link>
                                </div>
                                <div className="relative duration-300 transform-[translateX(-15px)] hover:transform-[translateX(0)]">
                                    <Link href="/quiz">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-8 border-t-transparent border-b-transparent border-l-(--primary)"></span>
                                        <span className="ml-[15px]">Quiz</span>
                                    </Link>
                                </div>
                                <CheckAdmin load={false} closeOnError={false}>
                                    <div className="relative duration-300 transform-[translateX(-15px)] hover:transform-[translateX(0)]">
                                        <Link href="/admin">
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-8 border-t-transparent border-b-transparent border-l-(--primary)"></span>
                                            <span className="ml-[15px]">Admin</span>
                                        </Link>
                                    </div>
                                </CheckAdmin>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="border-t-solid border-t border-t-(--contrast-01)">
                    <a className="mx-auto py-[25px] opacity-[90] text-[.9rem]" href="https://avabucks.it/" target="_blank">© 2025 Proverby. Created by AvaBucks</a>
                </section>
            </footer>
        </div>
    );
}