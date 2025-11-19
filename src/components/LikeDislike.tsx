import Ripple from "@/src/components/Ripple";

interface Props {
    id: number;
}

export default function ListProverbi({ id }: Props) {

    // TODO: like e dislike functions (con controllo login e username)
    // - return { success: false, error: "No login" };
    // - return { success: false, error: "Errore del database" };
    // - return { success: true };

    return (
        <div className="flex items-center">
            <Ripple icon="bx bx-like"></Ripple>
            <div className="ml-[-5px]"><Ripple icon="bx bx-dislike"></Ripple></div>
        </div>
    )
}

// TODO:
// - controllo se è salvato icona piena