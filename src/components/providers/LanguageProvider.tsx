"use client";

import {
    TranslationIndex,
    TranslationPayload,
    buildTranslationIndex,
    getPageTranslator,
    getTranslatedText,
    normalizeLangCode,
} from "@/lib/i18n/system.translation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type PersistedLanguage = {
    language: string;
    expiresAt: number;
};

type LanguageContextValue = {
    activeLanguage: string;
    setActiveLanguage: (languageCode: string) => void;
    t: (pageTitle: string, componentId: string) => string;
    getPageT: (pageTitle: string) => (componentId: string) => string;
    ready: boolean;
};

const STORAGE_KEY = "chronicles:system-language";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const FALLBACK_LANGUAGE = "EN";

const LanguageContext = createContext<LanguageContextValue>({
    activeLanguage: FALLBACK_LANGUAGE,
    setActiveLanguage: () => undefined,
    t: (_pageTitle: string, componentId: string) => componentId,
    getPageT: (_pageTitle: string) => (componentId: string) => componentId,
    ready: false,
});

function readPersistedLanguage(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawValue) as PersistedLanguage;
        if (!parsed.language || !parsed.expiresAt) {
            window.localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        if (Date.now() > parsed.expiresAt) {
            window.localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return normalizeLangCode(parsed.language);
    } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function writePersistedLanguage(languageCode: string): void {
    if (typeof window === "undefined") {
        return;
    }

    const payload: PersistedLanguage = {
        language: normalizeLangCode(languageCode),
        expiresAt: Date.now() + THIRTY_DAYS_MS,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [index, setIndex] = useState<TranslationIndex>({});
    const [ready, setReady] = useState(false);
    const [activeLanguage, setActiveLanguageState] = useState<string>(FALLBACK_LANGUAGE);

    useEffect(() => {
        const persisted = readPersistedLanguage();
        if (persisted) {
            setActiveLanguageState(persisted);
        }

        fetch("/system.translation.json")
            .then(async (response) => {
                const payload = (await response.json()) as TranslationPayload;
                setIndex(buildTranslationIndex(payload));
            })
            .catch(() => {
                setIndex({});
            })
            .finally(() => {
                setReady(true);
            });
    }, []);

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.lang = activeLanguage.toLowerCase();
        }
    }, [activeLanguage]);

    const setActiveLanguage = (languageCode: string) => {
        const normalized = normalizeLangCode(languageCode);
        setActiveLanguageState(normalized);
        writePersistedLanguage(normalized);
    };

    const t = useMemo(
        () => (pageTitle: string, componentId: string) =>
            getTranslatedText(index, pageTitle, componentId, activeLanguage, FALLBACK_LANGUAGE),
        [activeLanguage, index]
    );

    const getPageT = useMemo(
        () => (pageTitle: string) => getPageTranslator(index, pageTitle, activeLanguage, FALLBACK_LANGUAGE),
        [activeLanguage, index]
    );

    const contextValue: LanguageContextValue = {
        activeLanguage,
        setActiveLanguage,
        t,
        getPageT,
        ready,
    };

    return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export function usePageTranslation(pageTitle: string) {
    const { getPageT } = useLanguage();
    return getPageT(pageTitle);
}