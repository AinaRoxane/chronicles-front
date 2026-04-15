"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStatus } from "@/components/providers/AuthStatusProvider";

type GuestPromptContextValue = {
    hydrated: boolean;
    isLoggedOut: boolean;
    shouldShowOverlay: boolean;
    shouldShowCompactPrompt: boolean;
    dismissOverlay: () => void;
};

const GuestPromptContext = createContext<GuestPromptContextValue>({
    hydrated: false,
    isLoggedOut: false,
    shouldShowOverlay: false,
    shouldShowCompactPrompt: false,
    dismissOverlay: () => undefined,
});

const DISMISS_KEY = "chronicles:guest-overlay-dismissed";

export default function GuestPromptProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isLoggedIn } = useAuthStatus();
    const [hydrated, setHydrated] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
        setHydrated(true);
    }, []);

    const isAuthRoute = pathname.startsWith("/auth");
    const isLoggedOut = !isLoggedIn;
    const shouldShowOverlay = hydrated && isLoggedOut && !isAuthRoute && !dismissed;
    const shouldShowCompactPrompt = hydrated && isLoggedOut && !isAuthRoute && dismissed;

    const dismissOverlay = () => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(DISMISS_KEY, "1");
        }
        setDismissed(true);
    };

    const contextValue = useMemo(
        () => ({
            hydrated,
            isLoggedOut,
            shouldShowOverlay,
            shouldShowCompactPrompt,
            dismissOverlay,
        }),
        [hydrated, isLoggedOut, shouldShowOverlay, shouldShowCompactPrompt]
    );

    return <GuestPromptContext.Provider value={contextValue}>{children}</GuestPromptContext.Provider>;
}

export function useGuestPrompt() {
    return useContext(GuestPromptContext);
}
