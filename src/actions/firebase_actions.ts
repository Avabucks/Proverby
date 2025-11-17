"use client";
import { auth, googleProvider } from "@/src/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { saveUser, getUsername } from "@/src/actions/users_actions";
import { getAuth, signOut } from "firebase/auth";
import { deleteCookie } from "cookies-next";
import { setCookie } from "cookies-next";

export async function firebaseLogIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();

    await saveUser(user.displayName || "", user.email || "", user.uid || "", user.photoURL || "", token);
    const uname = await getUsername(user.uid || "");

    const userCookie = {
      uid: user.uid,
      username: uname,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || ""
    };

    setCookie("user", JSON.stringify(userCookie), { maxAge: 365 * 24 * 60 * 60 });

    return userCookie

  } catch (error: any) {
    return false
  }

}

export async function firebaseLogOut() {
  const auth = getAuth();

  try {
    await signOut(auth);
    deleteCookie("user");
    console.log("Logout effettuato con successo!");

    return true
  } catch (error) {
    console.error("Errore durante il logout:", error);
    return false
  }
};