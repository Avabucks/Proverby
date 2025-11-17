"use client"
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

import Link from "next/link";
import Image from "next/image";
import Ripple from "@/src/components/Ripple";
import LikeDislike from "@/src/components/LikeDislike";
import Popup from "@/src/components/popup/Popup";
import DeletePopup from "@/src/components/popup/layout/DeletePopup";
import { useRouter, usePathname } from "next/navigation";
import { top10Proverbi, acceptedProverbi, reviewProverbi, declinedProverbi } from "@/src/actions/proverbi_actions";
import { getUser } from "@/src/actions/users_actions";

interface ListProps {
  type: string;
}

interface Proverbio {
  id: number;
  proverbio: string;
  username: string;
  seo_link: string;
  photoURL: string;
}

export default function ListProverbi({ type }: ListProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [proverbiArray, setProverbiArray] = useState<Proverbio[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isOwner, setOwner] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [delteId, setDelteId] = useState(0);

  useEffect(() => {

    async function loadTopProverbi() {
      const result = await top10Proverbi();
      if (result) {
        setProverbiArray(result);
      }
      setLoading(false);
    }
    async function loadAcceptedProverbi() {
      const userUid = await loadUser();
      const result = await acceptedProverbi(pathname.split("/").filter(Boolean).pop());
      if (result) {
        setProverbiArray(result);
      }
      setLoading(false);
    }
    async function loadReviewProverbi() {
      const userUid = await loadUser();
      const result = await reviewProverbi(pathname.split("/").filter(Boolean).pop(), userUid.uid);
      if (result) {
        setProverbiArray(result);
      }
      setLoading(false);
    }
    async function loadDeclinedProverbi() {
      const userUid = await loadUser();
      const result = await declinedProverbi(pathname.split("/").filter(Boolean).pop(), userUid.uid);
      if (result) {
        setProverbiArray(result);
      }
      setLoading(false);
    }
    async function loadSalvatiProverbi() {
      // TODO
      setLoading(false);
    }

    async function loadUser() {
      const cookieUser = getCookie("user");
      let jsonCookie;
      if (cookieUser) {
        jsonCookie = JSON.parse(cookieUser as string);
        const user = await getUser(jsonCookie?.username)
        const userPage = await getUser(pathname.split("/").filter(Boolean).pop() || "")
        if (user && userPage && user.uid === userPage.uid) {
          setOwner(true);
        }
        if (user) {
          return user
        }
      }
    }

    switch (type) {
      case "top10":
        loadTopProverbi();
        break;
      case "accepted":
        loadAcceptedProverbi();
        break;
      case "review":
        loadReviewProverbi();
        break;
      case "declined":
        loadDeclinedProverbi();
        break;
      case "salvati":
        loadSalvatiProverbi();
        break;
    }

  }, []);

  return (
    <>
      <div className="flex flex-col gap-[20px] my-[15px]">
        {isLoading ?
          <div className="flex flex-col gap-[20px]">
            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)]"></div>
            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)]"></div>
            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)]"></div>
            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)]"></div>
            <div className="animate-pulse rounded-[var(--border-radius)] w-full h-[77px] bg-[var(--contrast-01)]"></div>
          </div>
          :
          proverbiArray.map((item, i) => (
            <div className={`animate-[slide-up_.5s] flex flex-col min-h-[72px] md:flex-row items-center gap-[10px] px-[25px] py-[15px] md:py-[10px] justify-between rounded-[var(--border-radius)] border-[1px] border-solid border-[var(--contrast-01)] ${type == "declined" ? "" : "cursor-pointer shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:transform-[translateY(5px)]"} duration-300`} onClick={() => { if (type != "declined") router.push("/proverbio/" + item.seo_link) }} key={i}>
              <div className="flex flex-col md:flex-row items-center gap-[10px] md:gap-[20px]">
                <div className="flex gap-[10px] items-center">
                  <i className='bx bx-quote-left text-[1.9rem] opacity-20'></i>
                  <p className="text-center">{item.proverbio.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()}</p>
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
                  {isOwner ?
                    <>
                      {type != "declined" ? <Ripple icon="bx bx-edit-alt"></Ripple> : <></>}
                      <div className="ml-[-5px]"><Ripple icon="bx bx-trash" handleOnClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {e.stopPropagation(); setOpenDeletePopup(true); setDelteId(item.id);} }></Ripple></div>
                      <div className="mx-[5px_20px] h-[30px] border-l-[1px] border-l-solid border-l-[var(--contrast-01)]"></div>
                    </>
                    :
                    <>
                    </>
                  }
                  {
                    type == "review" ?
                      <div className="flex items-center gap-[8px] px-[13px] py-[5px]">
                        <p className="text-[#FCA311] leading-0">In revisione</p>
                        <i className='bx bx-alarm rounded-full p-[5px] bg-[#FCA311] text-[rgb(255,255,255)] text-[1.2rem]'></i>
                      </div>
                      : type == "declined" ?
                        <div className="flex items-center gap-[8px] px-[13px] py-[5px]">
                          <p className="text-[#C1121F] leading-0">Rifiutato</p>
                          <i className='bx bx-x rounded-full p-[5px] bg-[#C1121F] text-[rgb(255,255,255)] text-[1.2rem]'></i>
                        </div>
                        :
                        <div className="flex items-center gap-[8px] px-[13px] py-[5px] rounded-full bg-[var(--primary)] text-white/90">
                          <i className="bx bx-medal-alt-2 text-[1.3rem] leading-0"></i>
                          <p className="text-[1rem] font-semibold leading-0">TODO</p>
                        </div>
                  }
                </div>
              }
            </div>
          ))
        }
      </div>
      {type == "top10" || type == "salvati" ? <></>
        :
        <Popup width="md" isOpen={openDeletePopup} canClose={true} title="Confermi l'eliminazione?" setPopup={setOpenDeletePopup}><DeletePopup setOpenDeletePopup={setOpenDeletePopup} id={ delteId }></DeletePopup></Popup>
      }
    </>
  );
}
