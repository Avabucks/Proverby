import Ripple from "@/src/components/Ripple";
import { BiLike, BiDislike } from "react-icons/bi";

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
            <Ripple icon={BiLike}></Ripple>
            <div className="ml-[-5px]"><Ripple icon={BiDislike}></Ripple></div>
        </div>
    )
}

// TODO:
// - controllo se è salvato icona piena