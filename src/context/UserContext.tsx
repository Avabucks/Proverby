"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

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
    fingerprint: string;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    fingerprint: "",
});

interface UserProviderProps {
    children: ReactNode;
    initialUser?: User;
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(initialUser || null);
    const [fingerprint, setFingerprint] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFingerprint = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setFingerprint(`${result.visitorId ?? ""}${user?.uid ?? ""}`);
            setLoading(false);
        };

        loadFingerprint();
    }, [user]);

    if (loading) {
        // fallback mentre il fingerprint non è pronto
        return <div></div>;
    }

    return (
        <UserContext.Provider value={{ user, setUser, fingerprint: fingerprint! }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}