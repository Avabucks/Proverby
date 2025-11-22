import BreadCrumb from "@/src/components/ui/BreadCrumb";
import Footer from "@/src/components/navigation/Footer";

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
        TODO: Sfoglia
      </section>
      <Footer ctaText="Aggiungi il tuo proverbio!" />
    </>
  )
}