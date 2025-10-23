"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

import Link from "next/link";
import GoogleLogin from "@/src/components/GoogleLogin";
import Ripple from "@/src/components/ripple/Ripple";
import ThemeToggle from "@/src/components/ThemeToggle";
import Image from "next/image";
import Logo from "@/public/assets/logo.png";

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [user, setUser] = useState<{ displayName: string, photoURL: string } | null>(null);

  useEffect(() => {
    const cookieUser = getCookie("user");
    if (cookieUser) setUser(JSON.parse(cookieUser as string));
  }, []);

  return (
    <nav className={`fixed z-[1000] flex items-center content-between w-full px-[50px] py-[10px] h-[95px] ${scrolled ? "bg-[var(--bg)] shadow-[0_4px_6px_-2px_var(--contrast-01)]" : ""} duration-[.3s]`}>
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[20px] ml-[-15px]">
              <Ripple>
                <div className="py-[12px]">
                    <Link href="/">
                        <Image className="relative mt-[2px] z-[10]" src={Logo} alt="Logo" width={155} />
                    </Link>
                </div>
              </Ripple>
              <div>
                <ul className="flex items-center gap-[20px] list-none">
                  <div className="border-l-[1px] border-solid border-[var(--contrast-01)] h-[40px]"></div>
                    <Link href="/sfoglia"><Ripple icon="bx bx-gallery-vertical-end">Sfoglia</Ripple></Link>
                    <Link href="/TODO"><Ripple icon="bx bx-dice-roll">Proverbio Casuale</Ripple></Link>
                    <Link href="/quiz"><Ripple icon="bx bx-joystick">Quiz</Ripple></Link>
                    <Link href="/aggiungi"><Ripple icon="bx bx-plus">Aggiungi Proverbio</Ripple></Link>
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-[20px]">
                  <ThemeToggle></ThemeToggle>
                  <div className="border-l-[1px] border-solid border-[var(--contrast-01)] h-[40px]"></div>
                { !user ? <GoogleLogin setUser={setUser}></GoogleLogin>
                : <Link href="/profilo"><Ripple>
                    <div className="flex items-center gap-[10px] h-[60px] rounded-full">
                      <div className="flex items-center">
                        <Image src={ user.photoURL } alt="fot_profilo" width={42} height={42} className="rounded-full" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[1.1rem]">{ user.displayName }</span>
                        <span className="font-medium text-[.9rem] mt-[-3px] opacity-40">Visualizza Profilo</span>
                      </div>
                    </div>
                    </Ripple>
                  </Link> }
            </div>
        </div>
    </nav>
  );
}

// TODO:
// - login cookie
// - responsive