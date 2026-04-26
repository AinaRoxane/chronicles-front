"use client";

import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";


type AuthStatusContextValue = {
    isLoggedIn: boolean;
};

const AuthStatusContext = createContext<AuthStatusContextValue>({
    isLoggedIn: false,
});

type AuthStatusProviderProps = {
    children: React.ReactNode;
};

export default function AuthStatusProvider({ children, }: AuthStatusProviderProps) {
    const isLoggedIn = useSelector((state: RootState) => !!state.auth.token);
    return (
        <AuthStatusContext.Provider value={{ isLoggedIn }}>
            {children}
        </AuthStatusContext.Provider>
    );
}

export function useAuthStatus() {
    return useContext(AuthStatusContext);
}
