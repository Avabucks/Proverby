"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getUser } from "@/src/actions/users_actions";
import { firebaseLogOut } from "@/src/actions/firebase_actions";
import { getCookie } from "cookies-next";
import Image from "next/image";
import ListProverbi from "@/src/components/ListProverbi";

interface RippleProps {
  username: string;
}

export default function ProfiloLayout({ username }: RippleProps) {

  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [isOwner, setOwner] = useState(false);
  const [user, setUser] = useState<{ displayName: string, photoURL: string, uid: string, username: string, email: string, partiteGiocate: number, bestScore: number, migliorPosizione: number, posizioneAttuale: number } | null>(null);

  useEffect(() => {
    async function loadUser() {
      const cookieUser = await getCookie("user");
      const user = await getUser(username)
      if (user) {
        setUser(user)
        if (cookieUser) {
          const parsedUser = JSON.parse(cookieUser as string);
          if (parsedUser.username === username) {
            setOwner(true);
          }
        }
        setLoading(false);
      } else {
        router.push("/")
      }
    }

    loadUser();

  }, []);

  const handleLogout = async () => {
    const result = await firebaseLogOut()
    if (result) location.href = "/";
  };

  return (
    <>
      <div className="flex items-center justify-between py-[30px]">
        <div className="flex items-center gap-[20px]">
          {isLoading ? <div className="animate-pulse rounded-full w-[120px] h-[120px] bg-[var(--contrast-01)]"></div> :
            <Image className="animate-[fade-in_.5s] rounded-full" width={120} height={120} src={`${user?.photoURL}`} alt="foto_profilo" priority />
          }
          <div>
            {isLoading ?
              <>
                <div className="animate-pulse rounded-full w-[200px] h-[24px] bg-[var(--contrast-01)]"></div>
                <div className="animate-pulse rounded-full w-[160px] h-[15px] bg-[var(--contrast-01)] mt-[7px]"></div>
                <div className="animate-pulse rounded-full w-[215px] h-[30px] bg-[var(--contrast-01)] mt-[9px]"></div>
              </>
              :
              <>
                <h1 className="text-[1.2rem] font-semibold">{user?.displayName}</h1>
                <p className="text-[var(--text-color)]/50 mt-[-6px] duration-300">@{username}</p>
                <div className="mt-[9px] flex items-center gap-[8px] px-[13px] py-[5px] rounded-full bg-[var(--primary)] text-white/90">
                  <i className="bx bx-medal-alt-2 text-[1.3rem] leading-0"></i>
                  <p className="text-[.8rem] leading-[1px]">Punti saggezza</p>
                  <p className="text-[1rem] font-semibold leading-0">TODO</p>
                </div>
              </>
            }
          </div>
        </div>
        <div>
          {isOwner ? <div className="hidden md:flex items-center gap-[7px] px-[25px] py-[15px] cursor-pointer rounded-[var(--border-radius)] border-[1px] border-solid border-[var(--contrast-01)] shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:transform-[translateY(5px)] duration-300 select-none" onClick={handleLogout}><i className="bx bx-arrow-out-right-square-half"></i>Disconnettiti</div> : ``}
        </div>
      </div>
      <div className="section tab-profilo">
        <div className="tabbar">
          <input type="radio" id="tab-proverbi" name="tab" defaultChecked />
          {isOwner ? <input type="radio" id="tab-salvati" name="tab" /> : <></>}
          <input type="radio" id="tab-statistiche" name="tab" />

          <nav>
            <label htmlFor="tab-proverbi"><i className="bx bx-gallery-vertical-end"></i><i className="bx bxs-gallery-vertical-end"></i><p className="hidden md:flex">Proverbi</p><span>2</span></label>
            {isOwner ? <label htmlFor="tab-salvati"><i className="bx bx-bookmark"></i><i className="bx bxs-bookmark"></i><p className="hidden md:flex">Salvati</p><span>1</span></label> : <></>}
            <label htmlFor="tab-statistiche"><i className="bx bx-chart-bar-rows"></i><i className="bx bxs-chart-bar-rows"></i><p className="hidden md:flex">Statistiche</p></label>
          </nav>
          <div className="tab-content">
            <div className="tab-panel proverbi">
              <h3>I PROVERBI DI {username.toUpperCase()}</h3>
              <ListProverbi type="accepted"></ListProverbi>
              {isOwner ?
                <>
                  <h3>IN ATTESA DI REVISONE</h3>
                  <ListProverbi type="review"></ListProverbi>
                  <h3>RIFIUTATI</h3>
                  <ListProverbi type="declined"></ListProverbi>
                </> :
                <>
                </>
              }
            </div>
            {isOwner ?
              <div className="tab-panel salvati">
                {isOwner ?
                  <>
                    <h3>I TUOI PROVERBI SALVATI</h3>
                    <ListProverbi type="salvati"></ListProverbi>
                  </> :
                  <>
                  </>
                }
              </div>
              : <></>}
            <div className="tab-panel statistiche">
              <h3>STATISTICHE DEI QUIZ FATTI DA {username.toUpperCase()}</h3>
              <div>
                <div>
                  <span>Partite giocate</span>
                  <div className="hr-line"></div>
                  <span>{user?.partiteGiocate}</span>
                </div>
                <div>
                  <span>Miglior punteggio</span>
                  <div className="hr-line"></div>
                  <span>{user?.bestScore}</span>
                </div>
                <div>
                  <span>Miglior posizione in classifica</span>
                  <div className="hr-line"></div>
                  <span>{user?.migliorPosizione}</span>
                </div>
                <div>
                  <span>Posizione in classifica attuale</span>
                  <div className="hr-line"></div>
                  <span>{user?.posizioneAttuale}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}