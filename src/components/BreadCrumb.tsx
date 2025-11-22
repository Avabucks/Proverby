import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";

interface CardProverbioProps {
  children?: React.ReactNode;
  pagesLabel: string[];
  pagesLink: string[];
}

export default function BreadCrumb({ children, pagesLabel, pagesLink }: CardProverbioProps) {
  return (
    <div className="flex items-center gap-[5px] mt-[90px] md:mt-[110px] mb-[10px]">
      { pagesLabel?.map((page, i) => (
        <div className="flex items-center gap-[5px]" key={ i }>
          <Link className="font-medium" href={`${ pagesLink[i] }`}>{ page }</Link>
          <BiChevronRight className="text-[24px] opacity-70" />
        </div>
      ))}
      <span className="text-[var(--primary)] font-medium opacity-90 overflow-hidden text-ellipsis whitespace-nowrap w-full">{ children }</span>
    </div>
  );
}