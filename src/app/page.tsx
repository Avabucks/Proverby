import CardProverbio from "@/src/components/CardProverbio";
import Timer from "@/src/components/Timer";
import ListProverbi from "@/src/components/ListProverbi";
import Link from "next/link";
import { generateCodeSecure } from "@/src/utils/utils";
import Footer from "@/src/components/Footer";

export default async function Home() {

  return (
    <div className="animate-[fade-in_.3s]">
      <CardProverbio type="giorno"></CardProverbio>
      <section className="mt-[-110px] mb-[10px]">
        <div className="flex flex-col md:flex-row gap-[7px] items-center justify-between">
          <div className="title">TOP 10 PROVERBI DELLA SETTIMANA</div>
          <div className="flex items-center gap-[10px]"><span>Termina tra:</span><Timer></Timer></div>
        </div>
      </section>
      <section>
        <ListProverbi type="top10"></ListProverbi>
        <Link className="group my-[10px] flex items-center justify-between gap-[10px] px-[30px] py-[20px] rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)] select-none" href="/sfoglia">
          <p>Sfoglia tutti i proverbi della community</p>
          <i className='bx bx-arrow-right-stroke text-[1.6rem] opacity-80 duration-500 group-hover:translate-x-[10px]'></i>
        </Link>
      </section>
      <Footer ctaText="Aggiungi il tuo proverbio!" />
    </div>
  );
}