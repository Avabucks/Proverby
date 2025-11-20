"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCookie } from "cookies-next";
import { getUser } from "@/src/actions/users_actions";

interface User {
    uid: string;
    username: string;
    photoURL: string;
    displayName: string;
    email: string;
    partiteGiocate: number;
    bestScore: number;
    migliorPosizione: number;
    posizioneAttuale: number;
    isAdmin: number;
}

interface UserContextType {
    user: User | null;
    setUser: (u: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
});

export function UserProvider({ children, initialUser }: { children: ReactNode, initialUser: User }) {
    const [user, setUser] = useState<User | null>(initialUser || null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
  return useContext(UserContext);
}