import BreadCrumb from "@/src/components/ui/BreadCrumb";
import Footer from "@/src/components/navigation/Footer";
import ListProverbi from "@/src/components/proverbi/ListProverbi";
import AlfabetoProverbi from "@/src/components/proverbi/AlfabetoProverbi";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ l: string }>
}) {
  const { l } = await params
  const upperL = l.toUpperCase()

  return {
    title: `Proverbi con la lettera ${upperL} - Proverby`,
    description: `Visualizza tutti i proverbi della community che inziano con la lettera ${upperL}: frasi antiche, pensieri profondi e saggezza condivisa.`,
  };
}

export default async function Profilo({
  params,
}: Readonly<{
  params: Promise<{ l: string }>
}>) {
  const { l } = await params
  const upperL = l.toUpperCase()

  return (
    <>
      <section className="animate-[fade-in_.3s]">
        <BreadCrumb pagesLabel={["Home", "Sfoglia"]} pagesLink={["/", "/sfoglia"]}>Proverbi con la lettera {upperL}</BreadCrumb>
        <AlfabetoProverbi initLetter={upperL} />
        <ListProverbi type="filtered" filter={upperL}></ListProverbi>
      </section>
      <Footer />
    </>
  )
}

// TODO: lista proverbi con la lettera