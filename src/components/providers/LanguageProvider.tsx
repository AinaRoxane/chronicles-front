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

function resolveLanguageFileCode(languageCode: string): string {
    const normalized = normalizeLangCode(languageCode).toLowerCase();
    return normalized.split("-")[0];
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [fallbackIndex, setFallbackIndex] = useState<TranslationIndex>({});
    const [activeIndex, setActiveIndex] = useState<TranslationIndex>({});
    const [fallbackReady, setFallbackReady] = useState(false);
    const [activeReady, setActiveReady] = useState(false);
    const [activeLanguage, setActiveLanguageState] = useState<string>(FALLBACK_LANGUAGE);

    useEffect(() => {
        const persisted = readPersistedLanguage();
        if (persisted) {
            setActiveLanguageState(persisted);
        }
    }, []);

    useEffect(() => {
        let ignore = false;

        fetch(`/i18n/${FALLBACK_LANGUAGE.toLowerCase()}.json`)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Missing fallback translation file");
                }

                const payload = (await response.json()) as TranslationPayload;
                if (!ignore) {
                    setFallbackIndex(buildTranslationIndex(payload));
                }
            })
            .catch(() => {
                if (!ignore) {
                    setFallbackIndex({});
                }
            })
            .finally(() => {
                if (!ignore) {
                    setFallbackReady(true);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        setActiveReady(false);

        const normalized = resolveLanguageFileCode(activeLanguage);
        if (normalized === FALLBACK_LANGUAGE.toLowerCase()) {
            setActiveIndex({});
            setActiveReady(true);
            return;
        }

        const targetUrl = `/i18n/${normalized}.json`;

        fetch(targetUrl)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Missing translation file");
                }

                const payload = (await response.json()) as TranslationPayload;
                if (!ignore) {
                    setActiveIndex(buildTranslationIndex(payload));
                }
            })
            .catch(() => {
                if (!ignore) {
                    setActiveIndex({});
                }
            })
            .finally(() => {
                if (!ignore) {
                    setActiveReady(true);
                }
            });

        return () => {
            ignore = true;
        };
    }, [activeLanguage]);

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

    const index = useMemo<TranslationIndex>(() => {
        const merged: TranslationIndex = {};

        for (const [pageTitle, pageMap] of Object.entries(fallbackIndex)) {
            merged[pageTitle] = { ...pageMap };
        }

        for (const [pageTitle, pageMap] of Object.entries(activeIndex)) {
            merged[pageTitle] = {
                ...(merged[pageTitle] || {}),
                ...pageMap,
            };
        }

        return merged;
    }, [activeIndex, fallbackIndex]);

    const ready = fallbackReady && activeReady;

    const t = useMemo(
        () => (pageTitle: string, componentId: string) =>
            getTranslatedText(index, pageTitle, componentId),
        [index]
    );

    const getPageT = useMemo(
        () => (pageTitle: string) => getPageTranslator(index, pageTitle),
        [index]
    );

    const contextValue: LanguageContextValue = {
        activeLanguage,
        setActiveLanguage,
        t,
        getPageT,
        ready,
    };

    if (!fallbackReady) {
        return null;
    }

    return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export function usePageTranslation(pageTitle: string) {
    const { getPageT } = useLanguage();
    return getPageT(pageTitle);
}