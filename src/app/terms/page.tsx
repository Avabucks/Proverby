import { Metadata } from "next";
import BreadCrumb from "@/src/components/ui/BreadCrumb";
import Footer from "@/src/components/navigation/Footer";

export const metadata: Metadata = {
  title: "Termini e condizioni - Proverby",
  description: "Proverby è una piattaforma che raccoglie proverbi condivisi dalla community: divertenti, saggi, originali o nati dall'esperienza quotidiana. Aggiungi i tuoi proverbi e guadagna punti saggezza!",
};

export default function Terms() {
  return (
    <>
      <section className="animate-[fade-in_.3s] info">
        <BreadCrumb pagesLabel={["Home"]} pagesLink={["/"]}>Termini e condizioni</BreadCrumb>
        <div className="mt-[15px]">
          <h1 className="font-bold text-[2.6rem] leading-[2.7rem]">Termini e condizioni</h1>
          <p className="mt-2.5 opacity-50 text-[.9rem]">Aggiornati a Settembre 2025</p>
        </div>
        <div>
          <div>
            <p>Benvenuto su <strong>Proverby</strong> (da qui in avanti, il “Sito”), una raccolta online di proverbi, modi di dire e frasi popolari, arricchita anche dai contributi degli utenti.
              L'accesso e l'utilizzo del Sito sono offerti dai suoi creatori (da qui in avanti, i “Creatori”) secondo i termini riportati in questa pagina (“Termini”).
            </p>
            <p>Accedendo a Proverby, creando un account personale e/o inviando contenuti, l'utente (“Utente” o “Utenti”) dichiara di aver letto e accettato integralmente i presenti Termini. I Creatori si riservano il diritto di modificarli in qualsiasi momento; l'utilizzo continuato del Sito implica l'accettazione automatica delle eventuali modifiche.</p>
          </div>
          <div>
            <h2>Disclaimer</h2>
            <p>Proverby è concepito come un archivio culturale che raccoglie e documenta proverbi ed espressioni popolari della tradizione italiana e internazionale. Alcuni proverbi possono contenere riferimenti ritenuti antiquati, discriminatori o offensivi secondo la sensibilità odierna.</p>
            <p>La presenza di tali contenuti ha finalità unicamente documentativa e informativa: non implica approvazione, consenso o incoraggiamento al loro utilizzo da parte dei Creatori.</p>
          </div>
          <div>
            <h2>Esclusione di responsabilità</h2>
            <p>I Creatori non garantiscono l'assoluta correttezza dei contenuti e non sono responsabili per eventuali errori o omissioni. L'uso delle informazioni presenti sul Sito è a esclusivo rischio dell'Utente.</p>
          </div>
          <div>
            <h2>Account e Profilo Utente</h2>
            <p>Gli Utenti possono scegliere di creare un account personale (“Profilo”), utilizzando un indirizzo email valido o un account di terze parti (es. Google o Facebook). Il Profilo può includere:</p>
            <ul>
              <li>un nome pubblico (nickname),</li>
              <li>uno username,</li>
              <li>un'immagine avatar personalizzata.</li>
            </ul>
            <p>Il Profilo consente di associare i contenuti inviati dall'Utente e di mostrarli agli altri visitatori. Alcune impostazioni sono private e accessibili solo dall'Utente stesso.</p>
          </div>
          <div>
            <h2>Età minima</h2>
            <p>In ottemperanza alla normativa italiana sul GDPR, la registrazione è vietata ai minori di 14 anni senza consenso dei genitori o di chi ne fa le veci. Registrandosi, l'Utente dichiara di avere almeno 14 anni o di disporre di tale consenso.</p>
          </div>
          <div>
            <h2>Eliminazione dei dati personali</h2>
            <p>L'Utente può richiedere la cancellazione completa dei propri dati personali scrivendo a: <a href="mailto:info@proverby.it" className="text-(--primary-light) underline">info@proverby.it</a>.
              La richiesta sarà gestita entro 30 giorni.
            </p>
          </div>
          <div>
            <h2>Condotta dell'Utente</h2>
            <p>Sul Sito non è consentito pubblicare contenuti che siano:</p>
            <ul>
              <li>diffamatori, illegali, discriminatori o offensivi;</li>
              <li>falsi, fuorvianti o volutamente imprecisi;</li>
              <li>lesivi di diritti di terzi (privacy, proprietà intellettuale, ecc.);</li>
              <li>contrari allo spirito culturale e documentativo del Sito.</li>
            </ul>
            <p>I Creatori o i Moderatori possono rifiutare, modificare o rimuovere contenuti a loro discrezione, senza che ciò comporti responsabilità verso l'Utente.</p>
          </div>
          <div>
            <h2>Privacy e Cookie</h2>
            <p>Proverby rispetta la normativa vigente in materia di protezione dei dati personali (GDPR). I dati raccolti sono limitati a email, nickname e dati tecnici di navigazione (IP, browser, sistema operativo, pagine visitate). I dati vengono utilizzati esclusivamente per gestire il Profilo, migliorare l'esperienza di navigazione e, previo consenso, per inviare comunicazioni informative o pubblicitarie. Proverby utilizza cookie tecnici (necessari al funzionamento) e, previo consenso, cookie analitici e di profilazione pubblicitaria. L'Utente può modificare le preferenze sui cookie in qualsiasi momento tramite il banner o le impostazioni del browser. Gli Utenti hanno diritto di accedere, modificare o cancellare i propri dati, nonché di revocare il consenso al trattamento scrivendo a: <a href="mailto:info@proverby.it" className="text-(--primary-light) underline">info@proverby.it</a>.</p>
          </div>
          <div id="licenza">
            <h2>Licenza e utilizzo dei contenuti</h2>
            <p>I contenuti pubblicati su Proverby sono disponibili con licenza Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).</p>
            <ul>
              <li>L'Utente può condividere e riutilizzare i contenuti, anche a scopo commerciale;</li>
              <li>Deve sempre citare l'autore e la fonte “Proverby.it”;</li>
              <li>Se modifica o rielabora i contenuti, deve distribuirli sotto la stessa licenza.</li>
            </ul>
            <p>Ulteriori informazioni sulla licenza CC BY-SA 4.0 sono disponibili <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.it" target="_blank" className="text-(--primary-light) underline">qui</a>.</p>
            <p>Gli Utenti non possono utilizzare il Sito per attività illegali, per accedere a dati riservati né per scopi contrari alla legge.</p>
          </div>
          <div>
            <h2>Attribuzione</h2>
            <p>Design originale e risorse grafiche tratte da <a href="https://www.figma.com/community/file/1351126696463064535" target="_blank" rel="noopener noreferrer" className="text-(--primary-light) underline">Figma Community</a>.</p>
          </div>
          <div>
            <h2>Copyright e proprietà intellettuale</h2>
            <p>I Creatori sono titolari dei diritti relativi al marchio, loghi, grafica e struttura del Sito. I contenuti originali caricati direttamente dai Creatori restano di loro proprietà. I contenuti inviati dagli Utenti vengono condivisi pubblicamente sotto licenza CC BY-SA 4.0. Pubblicando contenuti, l'Utente dichiara di avere tutti i diritti necessari e concede a Proverby una licenza irrevocabile, mondiale e gratuita per l'utilizzo, distribuzione e condivisione degli stessi.</p>
          </div>
          <div>
            <h2>Contatti</h2>
            <p className="flex flex-col gap-2.5">Per qualsiasi domanda o segnalazione puoi scriverci a::{' '}
              <a href="mailto:info@proverby.it" className="text-(--primary-light) underline">info@proverby.it</a>
            </p>
          </div>
        </div>
      </section>
      <Footer ctaText="Aggiungi il tuo proverbio!" />
    </>
  );
}