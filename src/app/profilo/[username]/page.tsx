import BreadCrumb from "@/src/components/ui/BreadCrumb";
import ProfiloLayout from "@/src/components/user/ProfiloLayout";
import Footer from "@/src/components/navigation/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  return {
    title: `${username} - Proverby`,
    description: `Entra nel mondo dei proverbi di ${username}: frasi antiche, pensieri profondi e saggezza condivisa.`,
  };
}

export default async function Profilo({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  return (
    <>
      <section className="animate-[fade-in_.3s]">
        <BreadCrumb pagesLabel={["Home", "Profilo"]} pagesLink={["/", "/"]}>{username}</BreadCrumb>
        <ProfiloLayout username={`${username}`}></ProfiloLayout>
      </section>
      <Footer ctaText="Aggiungi il tuo proverbio!" />
    </>
  )
}