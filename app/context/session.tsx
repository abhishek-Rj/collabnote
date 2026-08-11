"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface user {
    userID: string;
    username: string;
}

interface SessionContextType {
    user: user | null;
    setUser: (user: user | null) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({
    children,
    session,
}: {
    children: React.ReactNode;
    session: any;
}) {
    const [user, setUser] = useState<user | null>(session || null);

    useEffect(() => {
        if (session) {
            setUser(session);
        }
    }, [session]);

    return (
        <SessionContext.Provider value={{ user, setUser }}>
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
