import BreadCrumb from "@/src/components/ui/BreadCrumb";
import Footer from "@/src/components/navigation/Footer";
import QuizComingSoon from "@/src/components/quiz/QuizComingSoon";

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
        <QuizComingSoon />
      </section>
      <Footer />
    </>
  )
}