import { getProverbioFromSEO } from "@/src/actions/proverbi_actions";
import BreadCrumb from "@/src/components/ui/BreadCrumb";
import CardProverbio from "@/src/components/proverbi/CardProverbio";
import ProverbioBody from "@/src/components/proverbi/ProverbioBody";
import Footer from "@/src/components/navigation/Footer";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ proverbio: string }>
}) {
    const { proverbio } = await params
    const result = await getProverbioFromSEO(proverbio)

    return {
        title: `${result?.proverbio.replaceAll(".", "")} - Proverby`,
        description: "Proverby è una raccolta di proverbi condivisi dalla community. Aggiungi i tuoi e accumula punti saggezza!",
        openGraph: {
            title: `${result?.proverbio.replaceAll(".", "")} - Proverby`,
            description: "Proverby è una raccolta di proverbi condivisi dalla community. Aggiungi i tuoi e accumula punti saggezza!",
            images: ["/assets/social.png"],
        },
        twitter: {
            card: 'summary',
            title: `${result?.proverbio.replaceAll(".", "")} - Proverby`,
            description: "Proverby è una raccolta di proverbi condivisi dalla community. Aggiungi i tuoi e accumula punti saggezza!",
        },
    };
}

export default async function Profilo({
    params,
}: {
    params: Promise<{ proverbio: string }>
}) {
    const { proverbio } = await params
    const result = await getProverbioFromSEO(proverbio)

    return (
        <>
            <section>
                <BreadCrumb pagesLabel={["Home", "Proverbio"]} pagesLink={["/", "/sfoglia"]}>{result?.proverbio.replaceAll(".", "")}</BreadCrumb>
            </section>
            <CardProverbio type="dettagli"></CardProverbio>
            <section>
                <ProverbioBody></ProverbioBody>
            </section>
            <Footer ctaText="Hai un proverbio migliore? Aggiungilo" />
        </>
    )
}