"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { api } from "@/lib/api";

export interface User {
    id: string;
    userID: string;
    username: string;
    name?: string;
    email?: string | null;
}

interface SessionContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    refetchUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({
    children,
    session,
}: {
    children: React.ReactNode;
    session?: any;
}) {
    const [user, setUser] = useState<User | null>(() => {
        if (!session) return null;
        return {
            ...session,
            id: session.id || session.userID,
            userID: session.userID || session.id,
        };
    });
    const [isLoading, setIsLoading] = useState<boolean>(!session);

    const refetchUser = useCallback(async () => {
        try {
            const data = await api<{ user?: any }>("/auth/me");
            if (data?.user) {
                const normalized: User = {
                    ...data.user,
                    id: data.user.id || data.user.userID,
                    userID: data.user.userID || data.user.id,
                };
                setUser(normalized);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refetchUser();
    }, [refetchUser]);

    return (
        <SessionContext.Provider
            value={{ user, setUser, isLoading, refetchUser }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within SessionProvider");
    }
    return context;
}