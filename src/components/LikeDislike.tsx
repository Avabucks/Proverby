import Ripple from "@/src/components/Ripple";

interface Props {
    id: number;
}

export default function ListProverbi({ id }: Props) {
    return (
        <div className="flex items-center">
            <Ripple icon="bx bx-like"></Ripple>
            <div className="ml-[-5px]"><Ripple icon="bx bx-dislike"></Ripple></div>
        </div>
    )
}