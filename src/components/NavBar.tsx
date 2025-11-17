"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

import Link from "next/link";
import GoogleLogin from "@/src/components/GoogleLogin";
import Ripple from "@/src/components/Ripple";
import Popup from "@/src/components/popup/Popup";
import UsernamePopup from "@/src/components/popup/layout/UsernamePopup";
import ThemeToggle from "@/src/components/ThemeToggle";
import Image from "next/image";
import Logo from "@/public/assets/logo.webp";
import { checkUsername } from "@/src/actions/users_actions";
import { getRandomProverbioSEO } from "@/src/actions/proverbi_actions";
import { firebaseLogOut } from "@/src/actions/firebase_actions";

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [user, setUser] = useState<{ displayName: string, photoURL: string, uid: string, username: string, email: string } | null>(null);
  const [openUsernamePopup, setOpenUsernamePopup] = useState(false);
  const [randomSEO, setRandomProverbio] = useState("");

  const randomProverbio = async () => {
    const result = await getRandomProverbioSEO()
    setRandomProverbio(result)
  };

  useEffect(() => {
    const cookieUser = getCookie("user");

    if (cookieUser) {
      setUser(JSON.parse(cookieUser as string));
    }

    randomProverbio();

    window.addEventListener("resize", closeNav);
    return () => window.removeEventListener("resize", closeNav);

  }, []);

  useEffect(() => {
    const verifyUsername = async () => {
      const same = await checkUsername(user?.uid || "");
      if (same) {
        setOpenUsernamePopup(true);
      }
    };

    verifyUsername();
  }, [user]);

  const [isNavOpen, setNavOpen] = useState(false);

  const handleNavClick = () => {
    setNavOpen(isNavOpen ? false : true);
  };

  const closeNav = () => {
    setNavOpen(false);
  };

  const handleLogout = async () => {
    const result = await firebaseLogOut()
    if (result) location.href = "/";
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 z-[1000] flex items-center content-between w-full pl-[15px] pr-[20px] md:pl-[50px] md:pr-[50px] h-[75px] md:h-[95px] ${(scrolled || (!scrolled && isNavOpen)) ? "bg-[var(--bg)] shadow-[0_4px_6px_-2px_var(--contrast-01)]" : ""} duration-[.3s]`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center md:ml-[-15px] md:gap-[20px]">
            <div className="flex md:hidden items-center mx-[-10px]">
              <Ripple handleOnClick={handleNavClick} icon="bx bx-menu"></Ripple>
            </div>
            <Ripple>
              <div className="h-[55px]">
                <Link className="flex items-center h-full" href="/" onClick={closeNav}>
                  <Image className="relative mt-[2px] z-[10] max-w-[30vw] md:max-w-[18vw] h-full object-contain select-none" src={Logo} alt="Logo" width={155} priority />
                </Link>
              </div>
            </Ripple>
            <div>
              <ul className={`${!isNavOpen ? "opacity-0 pointer-events-none" : "bg-[var(--bg)]"} md:opacity-100 md:pointer-events-auto absolute top-[75px] left-0 md:relative md:top-0 w-full h-[calc(100vh-75px)] md:h-auto p-[7px] md:p-0 flex md:flex flex-col md:flex-row items-bt md:items-center gap-[10px] lg:gap-[20px] list-none duration-300`}>
                <div className="hidden md:flex border-l-[1px] border-solid border-[var(--contrast-01)] h-[40px]"></div>
                <Link href="/sfoglia" onClick={closeNav}><Ripple icon="bx bx-gallery-vertical-end">Sfoglia</Ripple></Link>
                <Link href={`/proverbio/${randomSEO}`} onClick={() => (closeNav(), randomProverbio())}><Ripple icon="bx bx-dice-roll"><span className="md:hidden lg:hidden xl:flex flex-col">Proverbio</span>Casuale</Ripple></Link>
                <Link href="/quiz" onClick={closeNav}><Ripple icon="bx bx-joystick">Quiz</Ripple></Link>
                <Link href="/aggiungi" className="flex md:hidden lg:flex" onClick={closeNav}><Ripple icon="bx bx-plus">Aggiungi<span className="md:hidden lg:hidden xl:flex flex-col">Proverbio</span></Ripple></Link>
                <div className="flex md:hidden mx-auto w-[90%] border-b-[1px] border-solid border-[var(--contrast-01)]"></div>
                <Link href="/about" className="flex md:hidden [@media(min-width:1800px)]:flex" onClick={closeNav}><Ripple icon="bx bx-badge-info">Cos’è Proverby?</Ripple></Link>
                <Link href="/terms" className="flex md:hidden [@media(min-width:1800px)]:flex" onClick={closeNav}><Ripple icon="bx bx-article">Termini e condizioni</Ripple></Link>
                {user ?
                  <>
                    <div className="flex md:hidden mx-auto w-[90%] border-b-[1px] border-solid border-[var(--contrast-01)]"></div>
                    <Link href="/" className="flex md:hidden" onClick={ handleLogout }><Ripple icon="bx bx-arrow-out-right-square-half">Disconnettiti</Ripple></Link>
                  </>
                  : <></>}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-[20px]">
            <ThemeToggle></ThemeToggle>
            <div className="border-l-[1px] border-solid border-[var(--contrast-01)] h-[40px]"></div>
            {!user ?
              <GoogleLogin setUser={setUser}><span className="hidden md:flex">Accedi con Google</span></GoogleLogin>
              :
              <Link className="ml-[-13px]" href={user.username != user.uid ? `/profilo/${user.username}` : ``} onClick={closeNav}>
                <Ripple>
                  <div className="flex items-center gap-[10px] h-[60px]">
                    <div className="flex items-center">
                      <Image className="rounded-full max-w-none" src={user.photoURL} alt="fot_profilo" width={42} height={42} />
                    </div>
                    <div className={`hidden ${user.username != user.uid ? "xl:flex" : ""} flex-col`}>
                      <span className="font-semibold text-[1.1rem]">{user.username}</span>
                      <span className="font-medium text-[.9rem] mt-[-3px] opacity-40">Visualizza Profilo</span>
                    </div>
                  </div>
                </Ripple>
              </Link>
            }
          </div>
        </div>
      </nav>
      <Popup width="md" isOpen={openUsernamePopup} canClose={false} title="Devi impostare il tuo username" setPopup={ setOpenUsernamePopup }><UsernamePopup setUser={setUser} userString={user} setOpenUsernamePopup={setOpenUsernamePopup}></UsernamePopup></Popup>
    </>
  );
}
