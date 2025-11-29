"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
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

interface Props {
    children: ReactNode;
    initialUser?: User;
}

export function UserProvider({ children, initialUser }: Readonly<Props>) {
    const [user, setUser] = useState<User | null>(initialUser || null);
    const [fingerprint, setFingerprint] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFingerprint = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setFingerprint(`${result.visitorId ?? ""}`);
            setLoading(false);
        };

        loadFingerprint();
    }, [user]);

    const contextValue = useMemo(
        () => ({ user, setUser, fingerprint: fingerprint! }),
        [user, fingerprint]
    );

    if (loading) {
        return <div></div>;
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}