import Link from "next/link";
import GoogleLogin from "@/src/components/googlelogin/GoogleLogin";
import Ripple from "@/src/components/ripple/Ripple";
import "./NavBar.css";
import Image from "next/image";
import Logo from "@/public/assets/logo.png";

export default function Navbar() {
  return (
    <header>
        <div>
            <div className="shadow shadow-inactive"></div>
            <div className="headerLeft">
              <Ripple icon="toggleMenu bx bx-menu">
                <div className="logo">
                    <Link href="/">
                        <Image src={Logo} alt="Logo" width={155} />
                    </Link>
                </div>
              </Ripple>
              <div className="nav nav-inactive">
                <div>
                  <div className="logo">
                    <i className="toggleMenu bx bx-menu"></i>
                      <div>
                        <Link href="/">
                          <Image src={Logo} alt="Logo" width={155} />
                        </Link>
                      </div>
                  </div>
                  <ul className="menu">
                    <div className="v-divider"></div>
                      <Link href="/"><Ripple icon="bx bx-gallery-vertical-end">Sfoglia</Ripple></Link>
                      <Link href="/about"><Ripple icon="bx bx-gallery-vertical-end">About</Ripple></Link>
                  </ul>
                </div>
              </div>
            </div>

            <div className="menu-cont">
                <div className="ripple outline toggle-theme"><i className='bx'></i></div>
                <div className="v-divider"></div>
                <GoogleLogin></GoogleLogin>
            </div>
        </div>
    </header>
  );
}