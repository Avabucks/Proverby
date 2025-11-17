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
        <div onClick={ handleOnClick } className={`ripple ${ opt || `` } px-[15px]`}>
          { icon ? <i className={`${ icon } text-[1.3rem] md:text-[1.4rem]`}></i> : `` }
          { img ? <Image src={img} alt={alt || ""} width={20}></Image> : `` }
          { children }
        </div>
    );
}