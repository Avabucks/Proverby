"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/src/context/UserContext";
import Link from "next/link";
import GoogleLogo from "@/public/assets/google_logo.svg";
import Ripple from "@/src/components/ui/Ripple";
import Popup from "@/src/components/popup/Popup";
import UsernamePopup from "@/src/components/popup/layout/UsernamePopup";
import ThemeToggle from "@/src/components/ui/ThemeToggle";
import Image from "next/image";
import Logo from "@/public/assets/logo.webp";
import { checkUsernameSameUid } from "@/src/actions/users_actions";
import { getRandomProverbioSEO } from "@/src/actions/proverbi_actions";
import { firebaseLogIn, firebaseLogOut } from "@/src/actions/firebase_actions";
import { BiMenu, BiCollection, BiJoystick, BiPlus, BiEditAlt, BiInfoCircle, BiExit, BiDice2, BiReceipt } from "react-icons/bi";
import clsx from "clsx";


export default function Navbar() {
  const { user, setUser } = useUser();
  const router = useRouter()
  const pathname = usePathname()

  const [scrolled, setScrolled] = useState(false);
  const [openUsernamePopup, setOpenUsernamePopup] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const profileUrl = user?.username && user?.username !== user?.uid && `/profilo/${user.username}`;
  const navClasses = clsx(
    "md:opacity-100 md:pointer-events-auto absolute top-[75px] left-0 md:relative md:top-0 w-full h-[calc(100vh-75px)] md:h-auto p-[7px] md:p-0 flex md:flex flex-col md:flex-row items-bt md:items-center gap-2.5 lg:gap-5 list-none duration-300",
    isNavOpen ? "bg-(--bg)" : "opacity-0 pointer-events-none"
  );

  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  const handleClickRandom = async () => {
    const result = await getRandomProverbioSEO()
    router.push(`/proverbio/${result}`)
    closeNav()
  };

  const handleClickNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleClickNew = () => {
    if (user) router.push("/editor/new");
    else handleLogin();
    closeNav();
  }

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const handleLogin = async () => {
    setLoading(true)
    const result = await firebaseLogIn();
    if (result) {
      setUser(result)
    }
    setLoading(false)
  };

  const handleLogout = async () => {
    const result = await firebaseLogOut()
    if (result) {
      setUser(null);
      router.push("/");
      closeNav();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", closeNav);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", closeNav);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const verifyUsername = async () => {
      const same = await checkUsernameSameUid(user?.uid || "");
      if (same) {
        setOpenUsernamePopup(true);
      }
    };

    verifyUsername();
  }, [user]);

  return (
    <>
      <nav className={`fixed top-0 left-0 z-1000 flex items-center content-between w-full pl-[15px] pr-[5px] md:pl-[50px] md:pr-[50px] h-[75px] md:h-[95px] ${(scrolled || (!scrolled && isNavOpen)) ? "bg-(--bg) shadow-[0_4px_6px_-2px_var(--contrast-01)]" : ""} duration-300`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center md:ml-[-15px] md:gap-5">
            <div className="flex md:hidden items-center -mx-2.5">
              <Ripple handleOnClick={handleClickNav} icon={BiMenu}></Ripple>
            </div>
            <Ripple>
              <div className="h-[55px]">
                <Link className="flex items-center h-full" href="/" onClick={closeNav}>
                  <Image className="relative mt-0.5 z-10 max-w-[30vw] md:max-w-[18vw] h-full object-contain select-none" src={Logo} alt="Logo" width={155} priority />
                </Link>
              </div>
            </Ripple>
            <div>
              <div className={navClasses}>
                <div className="hidden md:flex border-l border-solid border-(--contrast-01) h-10"></div>
                <Link href="/sfoglia" onClick={closeNav}><Ripple icon={BiCollection}>Sfoglia</Ripple></Link>
                <button onClick={handleClickRandom}><Ripple icon={BiDice2}><span className="md:hidden lg:hidden xl:flex flex-col -mr-0.5">Proverbio</span><span>Casuale</span></Ripple></button>
                <Link href="/quiz" onClick={closeNav}><Ripple icon={BiJoystick}>Quiz</Ripple></Link>
                <Link href="/editor/new" className="flex md:hidden" onClick={closeNav}><Ripple icon={BiPlus}>Aggiungi<span className="md:hidden lg:hidden xl:flex flex-col">Proverbio</span></Ripple></Link>
                <div className="flex md:hidden mx-auto w-[90%] border-b border-solid border-(--contrast-01)"></div>
                <Link href="/about" className="flex md:hidden [@media(min-width:1800px)]:flex" onClick={closeNav}><Ripple icon={BiInfoCircle}>Cos’è Proverby?</Ripple></Link>
                <Link href="/terms" className="flex md:hidden [@media(min-width:1800px)]:flex" onClick={closeNav}><Ripple icon={BiReceipt}>Termini e condizioni</Ripple></Link>
                {user ?
                  <>
                    <div className="flex md:hidden mx-auto w-[90%] border-b border-solid border-(--contrast-01)"></div>
                    <Link href="/" className="flex md:hidden" onClick={handleLogout}><Ripple icon={BiExit}>Disconnettiti</Ripple></Link>
                  </>
                  : <></>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            {pathname == "/editor/new" ? <></> :
              <button onClick={handleClickNew}
                className="animate-[bounce-in_.5s_cubic-bezier(0.68,-0.6,0.32,1.6)] hidden md:flex cursor-pointer">
                <Ripple opt="accient" icon={BiPlus}>Aggiungi<span className="md:hidden lg:hidden xl:flex flex-col">Proverbio</span></Ripple>
              </button>
            }
            <ThemeToggle></ThemeToggle>
            <div className="border-l border-solid border-(--contrast-01) h-10"></div>
            {user ?
              <Link className="ml-[-13px]" href={profileUrl || "#"} onClick={closeNav}>
                <Ripple>
                  <div className="flex items-center gap-2.5 h-[60px]">
                    <div className="flex items-center">
                      <Image className="rounded-full max-w-none" src={user.photoURL} alt="fot_profilo" width={42} height={42} />
                    </div>
                    <div className={`hidden ${(user.username !== user.uid) && ("xl:flex")} flex-col`}>
                      <span className="font-semibold text-[1.1rem]">{user.username}</span>
                      <span className="font-medium text-[.9rem] mt-[-3px] opacity-40">Visualizza Profilo</span>
                    </div>
                  </div>
                </Ripple>
              </Link>
              :
              <>
                {loading ?
                  <div className="border-[3px] border-solid border-(--primary) border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div>
                  :
                  <Ripple handleOnClick={handleLogin} opt="outline" img={GoogleLogo} alt="google_logo"><span className="hidden md:flex">Accedi con Google</span></Ripple>
                }
              </>
            }
          </div>
        </div>
      </nav>
      {pathname == "/editor/new" ? <></> :
        <div className="fixed bottom-[25px] right-[25px] z-1000 flex md:hidden bg-(--bg) rounded-(--border-radius) duration-300 transform-[scale(1.1)] origin-bottom-right">
          <button onClick={handleClickNew}
            className="animate-[bounce-in_.5s_cubic-bezier(0.68,-0.6,0.32,1.6)] cursor-pointer">
            <Ripple opt="accient" icon={BiEditAlt}></Ripple>
          </button>
        </div>
      }
      <Popup width="md" isOpen={openUsernamePopup} canClose={false} title="Devi impostare il tuo username" setPopup={setOpenUsernamePopup}><UsernamePopup setOpenUsernamePopup={setOpenUsernamePopup}></UsernamePopup></Popup>
    </>
  );
}