import type { Metadata } from "next";
import CardProverbio from "@/src/components/proverbi/CardProverbio";
import Timer from "@/src/components/ui/Timer";
import ListProverbi from "@/src/components/proverbi/ListProverbi";
import Link from "next/link";
import Footer from "@/src/components/navigation/Footer";
import { BiRightArrowAlt } from "react-icons/bi";

export const metadata: Metadata = {
  metadataBase: new URL('https://proverby.it'),
  title: "Proverby | Proverbi della community",
  description: "Proverby è una raccolta di proverbi condivisi dalla community. Aggiungi i tuoi e accumula punti saggezza!",
};

export default async function Home() {
  return (
    <div className="animate-[fade-in_.3s]">
      <CardProverbio type="giorno"></CardProverbio>
      <section className="mt-[-110px] mb-2.5">
        <div className="flex flex-col md:flex-row gap-2.5 items-center justify-between">
          <div className="title">TOP 10 PROVERBI DELLA SETTIMANA</div>
          <div className="hidden md:flex w-full border-b border-b-solid border-b-(--contrast-01) duration-300"></div>
          <div className="flex items-center gap-2.5 text-nowrap"><span>Termina tra:</span><Timer></Timer></div>
        </div>
      </section>
      <section>
        <ListProverbi type="top10"></ListProverbi>
        <Link className="group my-2.5 flex items-center justify-between gap-2.5 px-[30px] py-5 rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01) select-none" href="/sfoglia">
          <p>Sfoglia tutti i proverbi della community</p>
          <BiRightArrowAlt className='text-[1.6rem] opacity-80 duration-300 group-hover:translate-x-2.5' />
        </Link>
      </section>
      <Footer />
    </div>
  );
}