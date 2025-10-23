import "./Ripple.css";
import Image from "next/image";

interface RippleProps {
  handleOnClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: React.ReactNode;
  opt?: string;
  icon?: string;
  img?: string;
  alt?: string;
}

export default function Ripple({ handleOnClick, children, opt, icon, img, alt }: RippleProps) {
  return (
        <div onClick={ handleOnClick } className={`ripple ${ opt || `` }`}>
          { icon ? <i className={`${ icon }`}></i> : `` }
          { img ? <Image src={img} alt={alt || ""} width={20}></Image> : `` }
          { children }
        </div>
    );
}