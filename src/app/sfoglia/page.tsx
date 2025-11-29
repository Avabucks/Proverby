import BreadCrumb from "@/src/components/ui/BreadCrumb";
import Footer from "@/src/components/navigation/Footer";
import ListProverbi from "@/src/components/proverbi/ListProverbi";
import AlfabetoProverbi from "@/src/components/proverbi/AlfabetoProverbi";

export async function generateMetadata() {
  return {
    title: `Sfoglia - Proverby`,
    description: `Sfoglia i proverbi condivisi dalla community e lasciati ispirare dalla saggezza collettiva.`,
  };
}

export default async function Profilo() {
  return (
    <>
      <section className="animate-[fade-in_.3s]">
        <BreadCrumb pagesLabel={["Home"]} pagesLink={["/"]}>Sfoglia</BreadCrumb>
        <AlfabetoProverbi></AlfabetoProverbi>
        <div className="flex items-center gap-2.5 w-full mt-5"><h2 className="title">PROVERBI AGGIUNTI DI RECENTE</h2><div className="w-full border-b border-b-solid border-b-(--contrast-01) duration-300"></div></div>
        <ListProverbi type="new"></ListProverbi>
      </section>
      <Footer />
    </>
  )
}

// TODO: Input cerca proverbi