"use client"
import Ripple from "@/src/components/Ripple";

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
    <div className={`${ !isOpen ? "hidden" : "flex" } fixed inset-0 z-[1001] bg-[rgba(0,0,0,.5)] items-center justify-center px-[20px]`}>
      <div className={`${width === "sm" ? "w-[300px]" :
        width === "md" ? "w-[500px]" :
        width === "lg" ? "w-[800px]" : ""}
        bg-[var(--bg)] rounded-[var(--border-radius)] duration-300 animate-[popup_.3s]`}>
        <div className="flex items-center justify-between px-[20px] h-[60px]">
          <div className="flex items-center gap-[10px]">
            <i className='bx bx-info-circle text-[1.4rem] opacity-90'></i> 
            <p className="font-medium">{ title }</p>
          </div>
          { canClose ? <Ripple handleOnClick={ () => setPopup(false) } icon="bx bx-x"></Ripple> : ``}
        </div>
        <div className="mx-auto w-full border-b-[1px] border-solid border-[var(--contrast-01)]"></div>
        <div className="p-[20px]">
        { children }
        </div>
      </div>
    </div>
  );
}