import Ripple from "@/src/components/ui/Ripple";
import { useEffect, useState } from "react";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { likeProverbio } from "@/src/actions/proverbi_actions";
import { useUser } from "@/src/context/UserContext";

interface Props {
    id: number;
    likeStateProverbio: number;
}

export default function ListProverbi({ id, likeStateProverbio }: Props) {
    const { user, fingerprint } = useUser();
    const [likeState, setLike] = useState<number>(0);

    useEffect(() => {
        setLike(likeStateProverbio)
    }, []);

    let lock = false
    async function handleLike(nextLike: number) {
        if (lock) return;
        lock = true
        setLike(nextLike)
        const result = await likeProverbio(fingerprint || "", nextLike, id, user?.uid)
        if (!result) {
            console.log(JSON.parse(result).error) // TODO: toast on error
        }
    }

    return (
        <div className="flex items-center">
            {likeState == 1 ?
                <div className="animate-[fade-in_.5s]"><Ripple icon={BiSolidLike} handleOnClick={(e) => { e.stopPropagation() }}></Ripple></div>
                :
                <div className="animate-[fade-in_.5s]"><Ripple icon={BiLike} handleOnClick={(e) => { e.stopPropagation(); handleLike(1) }}></Ripple></div>
            }
            {likeState == 2 ?
                <div className="animate-[fade-in_.5s] ml-[-5px]"><Ripple icon={BiSolidDislike} handleOnClick={(e) => { e.stopPropagation(); }}></Ripple></div>
                :
                <div className="animate-[fade-in_.5s] ml-[-5px]"><Ripple icon={BiDislike} handleOnClick={(e) => { e.stopPropagation(); handleLike(2) }}></Ripple></div>
            }
        </div>
    )
}