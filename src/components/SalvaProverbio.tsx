import Ripple from "@/src/components/Ripple";

interface Props {
    id: number;
}

export default function SalvaProverbio({ id }: Props) {

    // TODO: salva function (con controllo login e username)
    // - return { success: false, error: "Errore del database" };
    // - return { success: true };

    return (
        <div className="animate-[fade-in_.5s] flex items-center">
            <Ripple icon="bx bx-bookmark"></Ripple>
        </div>
    )
}

// TODO
// - controlla login per visualizzare il tasto
// - controllo se è salvato icona piena