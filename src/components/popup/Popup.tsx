"use client"
import Ripple from "@/src/components/ui/Ripple";
import { BiInfoCircle, BiX } from "react-icons/bi";

interface PopupProps {
  children?: React.ReactNode;
  title?: string;
  width?: string;
  isOpen?: boolean;
  setPopup: Function;
  canClose?: boolean;
}

export default function Popup({ children, title, width, isOpen, setPopup, canClose }: PopupProps) {

  return (
    <div className={`${ !isOpen ? "hidden" : "flex" } fixed inset-0 z-1001 bg-[rgba(0,0,0,.5)] items-center justify-center px-5`}>
      <div className={`${width === "sm" ? "w-[300px]" :
        width === "md" ? "w-[500px]" :
        width === "lg" ? "w-[800px]" : ""}
        bg-(--bg) rounded-(--border-radius) duration-300 animate-[popup_.3s]`}>
        <div className="flex items-center justify-between px-5 h-[60px]">
          <div className="flex items-center gap-2.5">
            <BiInfoCircle className='text-[1.4rem] opacity-90' />
            <p className="font-medium">{ title }</p>
          </div>
          { canClose ? <Ripple handleOnClick={ () => setPopup(false) } icon={BiX}></Ripple> : ``}
        </div>
        <div className="mx-auto w-full border-b border-solid border-(--contrast-01)"></div>
        <div className="p-5">
        { children }
        </div>
      </div>
    </div>
  );
}