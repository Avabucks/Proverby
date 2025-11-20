"use client"
import { useEffect, useState } from "react";
import { useUser } from "@/src/context/UserContext";

import Link from "next/link";
import Image from "next/image";
import Ripple from "@/src/components/Ripple";
import LikeDislike from "@/src/components/LikeDislike";
import Popup from "@/src/components/popup/Popup";
import DeletePopup from "@/src/components/popup/layout/DeletePopup";
import { useRouter, usePathname } from "next/navigation";
import { top10Proverbi, acceptedProverbi, reviewProverbi, declinedProverbi } from "@/src/actions/proverbi_actions";
import { adminProverbi, accettaProverbio, declinaProverbio } from "@/src/actions/admin_actions";

interface ListProps {
  type: string;
  setCount?: Function;
  isOwner?: boolean;
}

interface Proverbio {
  id: number;
  proverbio: string;
  username: string;
  seo_link: string;
  photoURL: string;
  totProverbi: number;
}

export default function ListProverbi({ type, setCount, isOwner }: ListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const [proverbiArray, setProverbiArray] = useState<Proverbio[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [delteId, setDelteId] = useState(0);
  const [updated, setUpdated] = useState(0);

  useEffect(() => {

    async function loadTopProverbi() {
      const result = await top10Proverbi();
      if (result) {
        setProverbiArray(result);
      }
      setLoading(false);
    }
    async function loadAcceptedProverbi() {
      const result = await acceptedProverbi(pathname.split("/").filter(Boolean).pop());
      if (result) {
        setProverbiArray(result);
        if (setCount) setCount(result[0] ? result[0].totProverbi : 0);
      }
      setLoading(false);
    }
    async function loadReviewProverbi() {
      const result = await reviewProverbi(pathname.split("/").filter(Boolean).pop(), user?.uid);
      if (result) {
        setProverbiArray(result);
        if (setCount) setCount(result[0] ? result[0].totProverbi : false);
      }
      setLoading(false);
    }
    async function loadDeclinedProverbi() {
      const result = await declinedProverbi(pathname.split("/").filter(Boolean).pop(), user?.uid);
      if (result) {
        setProverbiArray(result);
        if (setCount) setCount(result[0] ? result[0].totProverbi : false);
      }
      setLoading(false);
    }
    async function loadSalvatiProverbi() {
      // TODO
      // TODO: count -> if (setCount) setCount(result[0] ? result[0].totProverbi : 0);
      setLoading(false);
    }
    async function loadAdminProverbi() {
      const result = await adminProverbi();
      if (result) {
        setProverbiArray(result);
      }
      setLoading(false);
    }

    const loaders: { [key: string]: () => Promise<void> } = {
      "top10": loadTopProverbi,
      "accepted": loadAcceptedProverbi,
      "review": loadReviewProverbi,
      "declined": loadDeclinedProverbi,
      "salvati": loadSalvatiProverbi,
      "admin": loadAdminProverbi,
    };

    if (loaders[type]) {
      loaders[type]();
    }

  }, [openDeletePopup, user, updated]);

  return (
    <>
      <div className="flex flex-col gap-[20px] my-[15px] w-full">
        {isLoading ?
          <div className="flex flex-col gap-[20px]">
            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)]"></div>
            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)]"></div>
            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)]"></div>
            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)]"></div>
            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)]"></div>
          </div>
          :
          proverbiArray.length > 0 ? proverbiArray.map((item, i) => (
            <div className={`animate-[slide-up_.5s] flex flex-col min-h-[72px] md:flex-row items-center gap-[10px] px-[25px] py-[15px] md:py-[10px] justify-between rounded-[var(--border-radius)] border-[1px] border-solid border-[var(--contrast-01)] ${type == "declined" ? "" : "cursor-pointer shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:transform-[translateY(5px)]"} duration-300`} onClick={() => { if (type != "declined") router.push("/proverbio/" + item.seo_link) }} key={i}>
              <div className="flex flex-col md:flex-row items-center gap-[10px] md:gap-[20px]">
                <div className="flex gap-[10px] items-center">
                  <i className='bx bx-quote-left text-[1.9rem] opacity-20'></i>
                  <p className="text-center">{item.proverbio.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()}.</p>
                  <i className='bx bx-quote-right text-[1.9rem] opacity-20'></i>
                </div>
                <div>
                  <Link className="flex items-center gap-[10px] text-[.9rem]" href={`/profilo/${item.username}`} onClick={(e) => { e.stopPropagation(); }}>by {item.username}<Image className="rounded-full max-w-none" src={`${item.photoURL}`} alt="fot_profilo" width={30} height={30} /></Link>
                </div>
              </div>
              {type == "top10" || type == "salvati" ?
                <>
                  <LikeDislike id={item.id}></LikeDislike>
                </> :
                <div className="flex items-center">
                  {isOwner || type == "admin" ?
                    <>
                      {type != "declined" ? <Ripple icon="bx bx-edit-alt" handleOnClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { e.stopPropagation(); router.push("/editor/" + item.seo_link); }}></Ripple> : <></>}
                      <div className="ml-[-5px]"><Ripple icon="bx bx-trash" handleOnClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { e.stopPropagation(); setOpenDeletePopup(true); setDelteId(item.id); }}></Ripple></div>
                      <div className="mx-[5px_20px] h-[30px] border-l-[1px] border-l-solid border-l-[var(--contrast-01)]"></div>
                      {type == "admin" ?
                        <div className="flex items-center">
                          <div className="ml-[-15px]"><Ripple icon="bx bx-x" handleOnClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { e.stopPropagation(); if (user) {declinaProverbio(item.id, user.uid); setUpdated(x => x + 1)} }}></Ripple></div>
                          <div className="mx-[-5px_-15px]"><Ripple icon="bx bx-check" handleOnClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { e.stopPropagation(); if (user) {accettaProverbio(item.id, user.uid); setUpdated(x => x + 1)} }}></Ripple></div>
                        </div>
                        : <></>
                      }
                    </>
                    :
                    <>
                    </>
                  }
                  {
                    type == "review" ?
                      <div className="flex items-center gap-[8px] px-[13px] py-[5px]">
                        <p className="text-[rgb(255,140,50)] leading-0">In revisione</p>
                        <i className='bx bx-alarm rounded-full p-[5px] bg-[rgb(255,140,50)] text-[rgb(255,255,255)] text-[1.2rem]'></i>
                      </div>
                      : type == "declined" ?
                        <div className="flex items-center gap-[8px] px-[13px] py-[5px]">
                          <p className="text-[rgb(220,50,50)] leading-0">Rifiutato</p>
                          <i className='bx bx-x rounded-full p-[5px] bg-[rgb(220,50,50)] text-[rgb(255,255,255)] text-[1.2rem]'></i>
                        </div>
                        : type == "accepted" ?
                          <div className="flex items-center gap-[8px] px-[13px] py-[5px] rounded-full bg-[var(--primary)] text-white/90">
                            <i className="bx bx-medal-alt-2 text-[1.3rem] leading-0"></i>
                            <p className="text-[1rem] font-semibold leading-0">TODO</p>
                          </div>
                          : <></>
                  }
                </div>
              }
            </div>
          ))
            :
            <>
              {type == "accepted" ?
                <>
                  {isOwner ?
                    <div className="relative w-full border-solid border-[1px] border-[var(--contrast-01)] rounded-[var(--border-radius)] p-[0px_20px_50px_20px] text-center">
                      <h3 className="font-semibold text-[1.4rem]">Non hai ancora aggiunto nessun proverbio!</h3>
                      <p className="flex items-center justify-center gap-[5px] flex-wrap"><span>Entra a far parte della community: condividi i tuoi proverbi su Proverby.</span></p>
                      <Link className="absolute left-[50%] top-[100%] transform-[translate(-50%,-50%)] flex items-center justify-center px-[25px] py-[15px] gap-[7px] text-[var(--text-color)] bg-[var(--bg)] rounded-[var(--border-radius)] border-solid border-[1px] border-[var(--contrast-01)] shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:transform-[translate(-50%,calc(-50%+5px))] duration-300 cursor-pointer" href="/editor/new">
                        <i className="bx bx-gallery-vertical-end text-[1.3rem] opacity-80"></i>Aggiungi Proverbio
                      </Link>
                    </div>
                    :
                    <div className="relative w-full border-solid border-[1px] border-[var(--contrast-01)] rounded-[var(--border-radius)] p-[0px_20px_50px_20px] text-center">
                      <h3 className="font-semibold text-[1.4rem]">L'utente {pathname.split("/").filter(Boolean).pop()} non ha ancora aggiunto nessuno proverbio.</h3>
                      <p className="flex items-center justify-center gap-[5px] flex-wrap"><span>Sfoglia i proverbi di altri utenti della community di Proverby.</span></p>
                      <Link className="absolute left-[50%] top-[100%] transform-[translate(-50%,-50%)] flex items-center justify-center px-[25px] py-[15px] gap-[7px] text-[var(--text-color)] bg-[var(--bg)] rounded-[var(--border-radius)] border-solid border-[1px] border-[var(--contrast-01)] shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:transform-[translate(-50%,calc(-50%+5px))] duration-300 cursor-pointer" href="/sfoglia">
                        <i className="bx bx-gallery-vertical-end text-[1.3rem] opacity-80"></i>Sfoglia
                      </Link>
                    </div>
                  }
                </>
                :
                type == "salvati" ?
                  <div className="relative w-full border-solid border-[1px] border-[var(--contrast-01)] rounded-[var(--border-radius)] p-[0px_20px_50px_20px] text-center">
                    <h3 className="font-semibold text-[1.4rem]">Non hai ancora salvato nessun proverbio!</h3>
                    <p className="flex items-center justify-center gap-[5px] flex-wrap"><span>Sfoglia i proverbi e clicca sul bottone</span><i className="bx bx-bookmark"></i><span>per aggiungerli ai tuoi preferiti.</span></p>
                    <Link className="absolute left-[50%] top-[100%] transform-[translate(-50%,-50%)] flex items-center justify-center px-[25px] py-[15px] gap-[7px] text-[var(--text-color)] bg-[var(--bg)] rounded-[var(--border-radius)] border-solid border-[1px] border-[var(--contrast-01)] shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:transform-[translate(-50%,calc(-50%+5px))] duration-300 cursor-pointer" href="/sfoglia">
                      <i className="bx bx-gallery-vertical-end text-[1.3rem] opacity-80"></i>Sfoglia
                    </Link>
                  </div>
                  :
                  type == "admin" ?
                    <div className="text-center">Non ci sono proverbi da revisionare</div>
                    :
                    <></>
              }

            </>
        }
      </div>
      {type == "top10" || type == "salvati" ? <></>
        :
        <Popup width="md" isOpen={openDeletePopup} canClose={true} title="Confermi l'eliminazione?" setPopup={setOpenDeletePopup}><DeletePopup setOpenDeletePopup={setOpenDeletePopup} id={delteId}></DeletePopup></Popup>
      }
    </>
  );
}