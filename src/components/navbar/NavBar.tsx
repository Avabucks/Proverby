import Link from "next/link";
import GoogleLogin from "@/src/components/googlelogin/GoogleLogin";
import Ripple from "@/src/components/ripple/Ripple";
import "./NavBar.css";
import Image from "next/image";
import Logo from "@/public/assets/logo.png";

export default function Navbar() {
  return (
    <nav>
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[20px] ml-[-15px]">
              <Ripple icon="hidden">
                <div className="logo">
                    <Link href="/">
                        <Image src={Logo} alt="Logo" width={155} />
                    </Link>
                </div>
              </Ripple>
              <div>
                <ul className="menu">
                  <div className="v-divider"></div>
                    <Link href="/"><Ripple icon="bx bx-gallery-vertical-end">Sfoglia</Ripple></Link>
                    <Link href="/about"><Ripple icon="bx bx-gallery-vertical-end">About</Ripple></Link>
                </ul>
              </div>
            </div>
            <div className="menu-cont">
                <div className="ripple outline toggle-theme"><i className='bx'></i></div>
                <div className="v-divider"></div>
                <GoogleLogin></GoogleLogin>
            </div>
        </div>
    </nav>
  );
}