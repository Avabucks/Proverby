"use client";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { setUsername } from "@/src/actions/users_actions";
import Ripple from "@/src/components/Ripple";
import { toSeoFriendly } from "@/src/utils/utils";

interface DeletePopupProps {
  setOpenDeletePopup: Function;
  id: number;
}

export default function DeletePopup({ setOpenDeletePopup, id }: DeletePopupProps) {

  return (
    <>
      DeletePopup { id }
    </>
  );
}