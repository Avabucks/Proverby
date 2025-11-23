"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/src/context/UserContext";
import { getUserFromUsername } from "@/src/actions/users_actions";
import { firebaseLogOut } from "@/src/actions/firebase_actions";
import Image from "next/image";
import ListProverbi from "@/src/components/proverbi/ListProverbi";
import { BiCollection, BiSolidCollection, BiBookmark, BiSolidBookmark, BiLineChart, BiMedal, BiExit } from "react-icons/bi";

interface Props {
  username: string;
}

export default function ProfiloLayout({ username }: Props) {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [isLoading, setLoading] = useState(true);
  const [isOwner, setOwner] = useState(false);
  const [userPage, setUserPage] = useState<{ displayName: string, photoURL: string, uid: string, username: string, email: string, partiteGiocate: number, bestScore: number, migliorPosizione: number, posizioneAttuale: number } | null>(null);
  const [countAccettati, setCountAccettati] = useState(false);
  const [countReviewed, setCountReviewed] = useState(false);
  const [countDeclined, setCountDeclined] = useState(false);
  const [countSalvati, setCountSalvati] = useState(false);

  const handleLogout = async () => {
    setLoading(true)
    const result = await firebaseLogOut()
    if (result) {
      setUser(null);
      router.push("/")
    }
  };

  useEffect(() => {

    async function loadUser() {
      const userPage = await getUserFromUsername(username)
      if (userPage) {
        setUserPage(userPage)
        if (user) {
          if (user.username === username) {
            setOwner(true);
          }
        }
        setLoading(false);
      } else {
        router.push("/")
      }
    }

    loadUser();

  }, [user]);

  return (
    <>
      <div className="flex items-center justify-between py-[30px]">
        <div className="flex items-center gap-5">
          {isLoading ? <div className="animate-pulse rounded-full w-[100px] md:w-[120px] h-[100px] md:h-[120px] bg-(--contrast-01)"></div> :
            <Image className="animate-[fade-in_.5s] rounded-full w-[100px] md:w-[120px] h-[100px] md:h-[120px]" width={96} height={96} src={`${userPage?.photoURL}`} alt="foto_profilo" priority />
          }
          <div>
            {isLoading ?
              <>
                <div className="animate-pulse rounded-full w-[200px] h-6 bg-(--contrast-01)"></div>
                <div className="animate-pulse rounded-full w-40 h-[15px] bg-(--contrast-01) mt-[7px]"></div>
                <div className="animate-pulse rounded-full w-[215px] h-[30px] bg-(--contrast-01) mt-[9px]"></div>
              </>
              :
              <>
                <h1 className="text-[1.2rem] font-semibold overflow-hidden text-ellipsis whitespace-nowrap w-full">{userPage?.displayName}</h1>
                <p className="text-(--text-color)/60 -mt-1.5 duration-300">@{username}</p>
                <div className="mt-[9px] flex items-center gap-2 px-[13px] py-[5px] rounded-full bg-(--primary) text-white/90">
                  <BiMedal className="text-[1.3rem] leading-0" />
                  <p className="text-[.8rem] leading-0">Punti saggezza</p>
                  <p className="text-[1rem] font-semibold leading-0">TODO</p>
                </div>
              </>
            }
          </div>
        </div>
        {isOwner ?
          <div>
            {isLoading ?
              <div className="hidden md:flex mt-2.5"><div className="border-[3px] border-solid border-(--primary) border-t-[rgba(0,0,0,0)] rounded-full w-[30px] h-[30px] animate-spin"></div></div>
              :
              <div className="animate-[fade-in_.5s] hidden md:flex items-center gap-[7px] px-[25px] py-[15px] cursor-pointer rounded-(--border-radius) border border-solid border-(--contrast-01) shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:translate-y-[5px] transition-[translate,box-shadow] duration-300 select-none" onClick={handleLogout}><BiExit className="text-[1.3rem] opacity-80" />Disconnettiti</div>
            }
          </div>
          : <></>
        }
      </div>
      <div className="section tab-profilo">
        <div className="tabbar">
          <input type="radio" id="tab-proverbi" name="tab" defaultChecked />
          {isOwner ? <input type="radio" id="tab-salvati" name="tab" /> : <></>}
          <input type="radio" id="tab-statistiche" name="tab" />

          <nav>
            <label htmlFor="tab-proverbi"><i className="bx-gallery-vertical-end"><BiCollection/></i><i className="bxs-gallery-vertical-end"><BiSolidCollection /></i><p className="hidden md:flex">Proverbi</p>{countAccettati === false ? <></> : <span>{countAccettati}</span>}</label>
            {isOwner ? <label htmlFor="tab-salvati"><i className="bx-bookmark"><BiBookmark /></i><i className="bxs-bookmark"><BiSolidBookmark /></i><p className="hidden md:flex">Salvati</p>{countSalvati === false ? <></> : <span>{countSalvati}</span>}</label> : <></>}
            <label htmlFor="tab-statistiche"><i className="bx-chart-bar-rows"><BiLineChart /></i><i className="bxs-chart-bar-rows"><BiLineChart /></i><p className="hidden md:flex">Statistiche</p></label>
          </nav>
          <div className="tab-content">
            <div className="tab-panel proverbi">
              <h2>I PROVERBI DI {username.toUpperCase()}</h2>
              <ListProverbi type="accepted" setCount={setCountAccettati} isOwner={isOwner}></ListProverbi>
              {isOwner ?
                <>
                  {countReviewed ? <h2>IN ATTESA DI REVISONE</h2> : <></>}
                  <div className={`${!countReviewed ? "hidden" : ""}`}><ListProverbi type="review" setCount={setCountReviewed} isOwner={isOwner}></ListProverbi></div>
                  {countDeclined ? <h2>RIFIUTATI</h2> : <></>}
                  <div className={`${!countDeclined ? "hidden" : ""}`}><ListProverbi type="declined" setCount={setCountDeclined} isOwner={isOwner}></ListProverbi></div>
                </> :
                <>
                </>
              }
            </div>
            {isOwner ?
              <div className="tab-panel salvati">
                {isOwner ?
                  <>
                    <h2>I TUOI PROVERBI SALVATI</h2>
                    <ListProverbi type="salvati" setCount={setCountSalvati}></ListProverbi>
                  </> :
                  <>
                  </>
                }
              </div>
              : <></>}
            <div className="tab-panel statistiche">
              <h2>STATISTICHE DEI QUIZ FATTI DA {username.toUpperCase()}</h2>
              <div>
                <div>
                  <span>Partite giocate</span>
                  <div className="hr-line"></div>
                  <span>{userPage?.partiteGiocate}</span>
                </div>
                <div>
                  <span>Miglior punteggio</span>
                  <div className="hr-line"></div>
                  <span>{userPage?.bestScore}</span>
                </div>
                <div>
                  <span>Miglior posizione in classifica</span>
                  <div className="hr-line"></div>
                  <span>{userPage?.migliorPosizione}</span>
                </div>
                <div>
                  <span>Posizione in classifica attuale</span>
                  <div className="hr-line"></div>
                  <span>{userPage?.posizioneAttuale}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// TODO:
// - count up https://reactbits.dev/text-animations/count-up