import { Metadata } from "next";
import BreadCrumb from "@/src/components/ui/BreadCrumb";
import Link from "next/link";
import Footer from "@/src/components/navigation/Footer";

export const metadata: Metadata = {
  title: "Cos'è Proverby? - Proverby",
  description: "Proverby è una piattaforma che raccoglie proverbi condivisi dalla community: divertenti, saggi, originali o nati dall'esperienza quotidiana. Aggiungi i tuoi proverbi e guadagna punti saggezza!",
};

export default function About() {
  return (
    <>
      <section className="animate-[fade-in_.3s] info">
        <BreadCrumb pagesLabel={["Home"]} pagesLink={["/"]}>Cos'è Proverby?</BreadCrumb>
        <div className="mt-5">
          <h1 className="font-bold text-[2.6rem] leading-10">Cos'è Proverby?</h1>
        </div>
        <div>
          <div>
            <div className="flex flex-col gap-2.5">
              <span>Proverby è un sito online che raccoglie proverbi, modi di dire ed espressioni popolari della tradizione italiana e internazionale, con l'obiettivo di conservarne il valore culturale e renderli facilmente accessibili a tutti. Gli utenti possono contribuire arricchendo il sito con nuovi proverbi, favorendo così la condivisione e la riscoperta della saggezza popolare.</span>
              <span>Aggiungere un proverbio è semplice:</span>
              <ul>
                <li>Accedi alla community di Porverby;</li>
                <li>Vai alla pagina dedicata all'inserimento <Link href="/editor/new" className="text-(--primary-light) underline">qui</Link>;</li>
                <li>Indica il proverbio che vuoi condividere;</li>
                <li>Inserisci il significato o la spiegazione del proverbio, per chiarirne il senso;</li>
                <li>Aggiungi uno o più esempi di utilizzo del proverbio in un contesto reale;</li>
                <li>Se vuoi aggiungerne altri, fai clic sul pulsante +.</li>
              </ul>
              La proposta di proverbio andrà in coda di moderazione, in attesa di essere accettata o rifiutata da un moderatore.
            </div>
          </div>
          <div>
            <h2>Gioca ai Quiz</h2>
            <div className="flex flex-col gap-2.5">
              <span>Su Proverby non ci si limita solo a leggere o inserire proverbi: è anche possibile mettersi alla prova con divertenti quiz.</span>
              <span>I quiz ti permettono di:</span>
              <ul>
                <li>Indovinare il significato dei proverbi;</li>
                <li>Completare proverbi mancanti;</li>
                <li>Sfidare te stesso o altri utenti.</li>
              </ul>
              Accedendo con il tuo account puoi salvare i tuoi progressi e confrontare i tuoi risultati con quelli della community.
            </div>
          </div>
        </div>
      </section>
      <Footer ctaText="Aggiungi il tuo proverbio!" />
    </>
  );
}