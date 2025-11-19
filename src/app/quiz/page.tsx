import BreadCrumb from "@/src/components/BreadCrumb";
import Footer from "@/src/components/Footer";

export async function generateMetadata() {
  return {
    title: `Quiz - Proverby`,
    description: `Metti alla prova la tua conoscenza dei proverbi con divertenti quiz e scopri quanto ne sai!`,
  };
}

export default async function Profilo() {
  return (
    <>
      <section className="animate-[fade-in_.3s]">
        <BreadCrumb pagesLabel={["Home"]} pagesLink={["/"]}>Quiz</BreadCrumb>
        TODO: Quiz, coming soon
      </section>
      <Footer ctaText="Aggiungi il tuo proverbio!" />
    </>
  )
}