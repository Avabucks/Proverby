"use client"
import { JSX, useEffect, useState } from "react";
import { useUser } from "@/src/context/UserContext";

import Link from "next/link";
import Image from "next/image";
import Ripple from "@/src/components/ui/Ripple";
import LikeDislike from "@/src/components/user/LikeDislike";
import Popup from "@/src/components/popup/Popup";
import DeletePopup from "@/src/components/popup/layout/DeletePopup";
import { useRouter, usePathname } from "next/navigation";
import { top10Proverbi, acceptedProverbi, reviewProverbi, declinedProverbi, salvatiProverbi, similarProverbi, newProverbi } from "@/src/actions/proverbi_actions";
import { adminProverbi, accettaProverbio, declinaProverbio } from "@/src/actions/admin_actions";
import { BiAlarm, BiX, BiMedal, BiTrash, BiCheck, BiEditAlt, BiBookmark, BiCollection, BiPlus } from "react-icons/bi";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";

interface Props {
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
  likeState: number;
  scoreProverbio?: number;
}

export default function ListProverbi({ type, setCount, isOwner }: Readonly<Props>) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, fingerprint } = useUser();

  const [proverbiArray, setProverbiArray] = useState<Proverbio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [delteId, setDelteId] = useState(0);
  const [updated, setUpdated] = useState(0);

  useEffect(() => {

    async function loadTopProverbi() {
      const result = await top10Proverbi(fingerprint || "", user?.uid);
      if (result) {
        setProverbiArray(result);
      }
      setIsLoading(false);
    }
    async function loadAcceptedProverbi() {
      const result = await acceptedProverbi(fingerprint || "", pathname.split("/").findLast(Boolean), user?.uid);
      if (result) {
        setProverbiArray(result);
        if (setCount) setCount(result[0] ? result[0].totProverbi : 0);
      }
      setIsLoading(false);
    }
    async function loadReviewProverbi() {
      const result = await reviewProverbi(pathname.split("/").findLast(Boolean), user?.uid);
      if (result) {
        setProverbiArray(result);
        if (setCount) setCount(result[0] ? result[0].totProverbi : false);
      }
      setIsLoading(false);
    }
    async function loadDeclinedProverbi() {
      const result = await declinedProverbi(pathname.split("/").findLast(Boolean), user?.uid);
      if (result) {
        setProverbiArray(result);
        if (setCount) setCount(result[0] ? result[0].totProverbi : false);
      }
      setIsLoading(false);
    }
    async function loadSalvatiProverbi() {
      const result = await salvatiProverbi(fingerprint || "", pathname.split("/").findLast(Boolean), user?.uid);
      if (result) {
        setProverbiArray(result);
        if (setCount) setCount(result[0] ? result[0].totProverbi : 0);
      }
      setIsLoading(false);
    }
    async function loadAdminProverbi() {
      const result = await adminProverbi();
      if (result) {
        setProverbiArray(result);
      }
      setIsLoading(false);
    }
    async function loadSimilarProverbi() {
      const result = await similarProverbi(fingerprint || "", pathname.split("/").findLast(Boolean), user?.uid);
      if (result) {
        setProverbiArray(result);
      }
      setIsLoading(false);
    }
    async function loadNewProverbi() {
      const result = await newProverbi(fingerprint || "", user?.uid);
      if (result) {
        setProverbiArray(result);
      }
      setIsLoading(false);
    }

    const loaders: { [key: string]: () => Promise<void> } = {
      "top10": loadTopProverbi,
      "accepted": loadAcceptedProverbi,
      "review": loadReviewProverbi,
      "declined": loadDeclinedProverbi,
      "salvati": loadSalvatiProverbi,
      "admin": loadAdminProverbi,
      "similar": loadSimilarProverbi,
      "new": loadNewProverbi,
    };

    if (loaders[type]) {
      loaders[type]();
    }

  }, [openDeletePopup, user, updated]);

  const renderLoadingSkeleton = () => (
    <div className="flex flex-col gap-5">
      <div className="animate-pulse rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01)"></div>
      <div className="animate-pulse rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01)"></div>
      <div className="animate-pulse rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01)"></div>
      <div className="animate-pulse rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01)"></div>
      <div className="animate-pulse rounded-(--border-radius) w-full h-[77px] bg-(--contrast-01)"></div>
    </div>
  );

  const renderEmptyStateAccepted = () => {
    if (isOwner) {
      return (
        <div className="relative w-full border-solid border border-(--contrast-01) rounded-(--border-radius) p-[0px_20px_50px_20px] text-center">
          <h2 className="font-semibold text-[1.4rem]">Non hai ancora aggiunto nessun proverbio!</h2>
          <p className="flex items-center justify-center gap-[5px] flex-wrap"><span>Entra a far parte della community: condividi i tuoi proverbi su Proverby.</span></p>
          <Link className="absolute left-[50%] top-full transform-[translate(-50%,-50%)] flex items-center justify-center px-[25px] py-[15px] gap-[7px] text-(--text-color) bg-(--bg) rounded-(--border-radius) border-solid border border-(--contrast-01) shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:transform-[translate(-50%,calc(-50%+5px))] duration-300 cursor-pointer" href="/editor/new">
            <BiPlus className="text-[1.3rem] opacity-80" />Aggiungi Proverbio
          </Link>
        </div>
      );
    }

    return (
      <div className="relative w-full border-solid border border-(--contrast-01) rounded-(--border-radius) p-[0px_20px_50px_20px] text-center">
        <h2 className="font-semibold text-[1.4rem]">L'utente {pathname.split("/").findLast(Boolean)} non ha ancora aggiunto nessuno proverbio.</h2>
        <p className="flex items-center justify-center gap-[5px] flex-wrap"><span>Sfoglia i proverbi di altri utenti della community di Proverby.</span></p>
        <Link className="absolute left-[50%] top-full transform-[translate(-50%,-50%)] flex items-center justify-center px-[25px] py-[15px] gap-[7px] text-(--text-color) bg-(--bg) rounded-(--border-radius) border-solid border border-(--contrast-01) shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:transform-[translate(-50%,calc(-50%+5px))] duration-300 cursor-pointer" href="/sfoglia">
          <BiCollection className="text-[1.3rem] opacity-80" />Sfoglia
        </Link>
      </div>
    );
  };

  const renderEmptyStateSalvati = () => (
    <div className="relative w-full border-solid border border-(--contrast-01) rounded-(--border-radius) p-[0px_20px_50px_20px] text-center">
      <h2 className="font-semibold text-[1.4rem]">Non hai ancora salvato nessun proverbio!</h2>
      <p className="flex items-center justify-center gap-[5px] flex-wrap"><span>Sfoglia i proverbi e clicca sul bottone</span><BiBookmark /><span>per aggiungerli ai tuoi preferiti.</span></p>
      <Link className="absolute left-[50%] top-full transform-[translate(-50%,-50%)] flex items-center justify-center px-[25px] py-[15px] gap-[7px] text-(--text-color) bg-(--bg) rounded-(--border-radius) border-solid border border-(--contrast-01) shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:transform-[translate(-50%,calc(-50%+5px))] duration-300 cursor-pointer" href="/sfoglia">
        <BiCollection className="text-[1.3rem] opacity-80" />Sfoglia
      </Link>
    </div>
  );

  const renderEmptyStateAdmin = () => (
    <div className="text-center">Non ci sono proverbi da revisionare</div>
  );

  const renderEmptyState = () => {

    const empties: { [key: string]: () => JSX.Element } = {
      accepted: () => renderEmptyStateAccepted(),
      salvati: () => renderEmptyStateSalvati(),
      admin: () => renderEmptyStateAdmin(),
    };

    return empties[type]?.() || null;

  };

  const renderActionButtons = (item: Proverbio) => {
    const showLikeDislike = type === "top10" || type === "salvati" || (type === "accepted" && !isOwner) || type === "similar" || type === "new";
    const showScore = type === "accepted" || type === "top10" || type === "salvati" || type === "similar" || type === "new";

    if (showLikeDislike) {
      return (
        <div className="flex items-center">
          <LikeDislike id={item.id} likeStateProverbio={item.likeState}></LikeDislike>
          {showScore && (
            <>
              <div className="mx-[5px_20px] h-[30px] border-l border-l-solid border-l-(--contrast-01)"></div>
              <div className="flex items-center gap-2 px-[13px] py-[5px] rounded-full bg-(--primary) text-white/90">
                <BiMedal className="text-[1.3rem] leading-0" />
                <p className="text-[1rem] font-semibold leading-0">{(item.scoreProverbio && item.scoreProverbio > 0) ? item.scoreProverbio : 0}</p>
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center">
        {(isOwner || type === "admin") && (
          <>
            {type !== "declined" && (
              <Ripple icon={BiEditAlt} handleOnClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { e.stopPropagation(); router.push("/editor/" + item.seo_link); }}></Ripple>
            )}
            <div className="ml-[-5px]">
              <Ripple icon={BiTrash} handleOnClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { e.stopPropagation(); setOpenDeletePopup(true); setDelteId(item.id); }}></Ripple>
            </div>
            <div className="mx-[5px_20px] h-[30px] border-l border-l-solid border-l-(--contrast-01)"></div>
            {type === "admin" && (
              <div className="flex items-center">
                <div className="ml-[-15px]">
                  <Ripple icon={BiX} handleOnClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { e.stopPropagation(); if (user) { declinaProverbio(item.id, user.uid); setUpdated(x => x + 1) } }}></Ripple>
                </div>
                <div className="mx-[-5px_-15px]">
                  <Ripple icon={BiCheck} handleOnClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { e.stopPropagation(); if (user) { accettaProverbio(item.id, user.uid); setUpdated(x => x + 1) } }}></Ripple>
                </div>
              </div>
            )}
          </>
        )}
        {type === "review" && (
          <div className="flex items-center gap-2 px-[13px] py-[5px]">
            <p className="text-[rgb(255,140,50)] leading-0">In revisione</p>
            <div className='rounded-full p-[5px] bg-[rgb(255,140,50)] text-[rgb(255,255,255)] text-[1.2rem]'><BiAlarm /></div>
          </div>
        )}
        {type === "declined" && (
          <div className="flex items-center gap-2 px-[13px] py-[5px]">
            <p className="text-[rgb(220,50,50)] leading-0">Rifiutato</p>
            <div className='rounded-full p-[5px] bg-[rgb(220,50,50)] text-[rgb(255,255,255)] text-[1.2rem]'><BiX /></div>
          </div>
        )}
        {type === "accepted" && (
          <div className="flex items-center gap-2 px-[13px] py-[5px] rounded-full bg-(--primary) text-white/90">
            <BiMedal className="text-[1.3rem] leading-0" />
            <p className="text-[1rem] font-semibold leading-0">{(item.scoreProverbio && item.scoreProverbio > 0) ? item.scoreProverbio : 0}</p>
          </div>
        )}
      </div>
    );
  };

  const renderProverbiList = () => {
    if (proverbiArray.length === 0) {
      return renderEmptyState();
    }

    return proverbiArray.map((item) => (
      <button
        className={`animate-[slide-up_.5s] flex flex-col min-h-[72px] md:flex-row items-center gap-2.5 px-[15px] md:px-[25px] py-[15px] md:py-2.5 justify-between rounded-(--border-radius) border border-solid border-(--contrast-01) ${type === "declined" ? "" : "cursor-pointer shadow-[0_5px_0_var(--contrast-01)] active:shadow-[0_0_0_var(--contrast-01)] active:translate-y-[5px] transition-[translate,box-shadow] duration-300"}`}
        onClick={() => { if (type !== "declined") router.push("/proverbio/" + item.seo_link) }}
        disabled={type === "declined"}
        key={item.id}
      >
        <div className="flex flex-col md:flex-row items-center gap-2.5 md:gap-5">
          <div className="flex gap-2.5 items-center">
            <div><AiOutlineDoubleLeft className="text-[1.9rem] opacity-20" /></div>
            <p className="text-center">{item.proverbio.replaceAll('&nbsp;', " ").replaceAll(/\s+/g, " ").trim()}</p>
            <div><AiOutlineDoubleRight className="text-[1.9rem] opacity-20" /></div>
          </div>
          <div>
            <Link className="flex items-center text-[.9rem] ml-0 md:-ml-3" href={`/profilo/${item.username}`} onClick={(e: React.MouseEvent) => { e.stopPropagation(); }}>
              <Ripple>by {item.username}<Image className="rounded-full max-w-none" src={`${item.photoURL}`} alt="fot_profilo" width={30} height={30} /></Ripple>
            </Link>
          </div>
        </div>
        {renderActionButtons(item)}
      </button>
    ));
  };

  return (
    <>
      <div className="flex flex-col gap-5 my-[15px] w-full">
        {isLoading ? renderLoadingSkeleton() : renderProverbiList()}
      </div>
      {type !== "top10" && type !== "salvati" && (
        <Popup width="md" isOpen={openDeletePopup} canClose={true} title="Confermi l'eliminazione?" setPopup={setOpenDeletePopup}>
          <DeletePopup setOpenDeletePopup={setOpenDeletePopup} id={delteId}></DeletePopup>
        </Popup>
      )}
    </>
  );
}