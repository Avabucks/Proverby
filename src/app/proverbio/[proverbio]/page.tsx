import { getProverbioFromSEO } from "@/src/actions/proverbi_actions";
import BreadCrumb from "@/src/components/BreadCrumb";
import CardProverbio from "@/src/components/CardProverbio";
import ProverbioBody from "@/src/components/ProverbioBody";
import Footer from "@/src/components/Footer";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ proverbio: string }>
}) {
    const { proverbio } = await params
    const result = await getProverbioFromSEO(proverbio)

    return {
        title: `${result?.proverbio.replaceAll(".", "")} - Proverby`,
        description: `${result?.spiegazione}`,
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
                <BreadCrumb pagesLabel={["Home", "Proverbio"]} pagesLink={["/", "/"]}>{result?.proverbio.replaceAll(".", "")}</BreadCrumb>
            </section>
            <CardProverbio type="dettagli"></CardProverbio>
            <section>
                <ProverbioBody></ProverbioBody>
            </section>
            <Footer ctaText="Hai un proverbio migliore? Aggiungilo" />
        </>
    )
}