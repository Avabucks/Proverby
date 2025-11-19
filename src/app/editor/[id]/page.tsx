import BreadCrumb from "@/src/components/BreadCrumb";
import FormAggiungi from "@/src/components/FormAggiungi";
import Footer from "@/src/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (id == "new")
    return {
      title: `Aggiungi Proverbio - Proverby`,
      description: `Aggiungi e condividi il tuo proverbio preferito: saggezza e ispirazione a portata di click.`,
    };
  else
    return {
      title: `Modifica Proverbio - Proverby`,
      description: `Aggiungi e condividi il tuo proverbio preferito: saggezza e ispirazione a portata di click.`,
    }
}

export default async function Profilo({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <>
      <section className="animate-[fade-in_.3s]">
        <BreadCrumb pagesLabel={["Home"]} pagesLink={["/"]}>{ id == "new" ? "Aggiungi Proverbio" : "Modifica Proverbio" }</BreadCrumb>
      </section>
      <FormAggiungi></FormAggiungi>
      <Footer ctaText="Aggiungi il tuo proverbio!" />
    </>
  )
}