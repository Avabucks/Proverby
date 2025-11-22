import Image from "next/image";
import { IconType } from "react-icons";

interface RippleProps {
  handleOnClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: React.ReactNode;
  opt?: string;
  icon?: IconType;
  img?: string;
  alt?: string;
}

export default function Ripple({ handleOnClick, children, opt, icon: Icon, img, alt }: RippleProps) {
  return (
    <div onClick={handleOnClick} className={`ripple ${opt || ""} px-[15px]`}>
      {Icon && <i><Icon className="text-[1.3rem] md:text-[1.4rem]" aria-label="Icona" /></i>}
      {img ? <Image src={img} alt={alt || ""} width={20}></Image> : ""}
      {children}
    </div>
  );
}