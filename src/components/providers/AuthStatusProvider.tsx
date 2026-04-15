"use client";

import { createContext, useContext } from "react";

type AuthStatusContextValue = {
    isLoggedIn: boolean;
};

const AuthStatusContext = createContext<AuthStatusContextValue>({
    isLoggedIn: false,
});

type AuthStatusProviderProps = {
    initialLoggedIn: boolean;
    children: React.ReactNode;
};

export default function AuthStatusProvider({
    initialLoggedIn,
    children,
}: AuthStatusProviderProps) {
    return (
        <AuthStatusContext.Provider value={{ isLoggedIn: initialLoggedIn }}>
            {children}
        </AuthStatusContext.Provider>
    );
}

export function useAuthStatus() {
    return useContext(AuthStatusContext);
}
