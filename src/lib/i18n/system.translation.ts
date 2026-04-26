// src/lib/i18n/system.translation.ts

export type TranslationRow = {
    key: string;
    translation: string;
};

export type TranslationPayload = Record<string, TranslationRow[]>;
export type TranslationIndex = Record<string, Record<string, string>>;

export function normalizeLangCode(langCode: string): string {
    return langCode.trim().toUpperCase();
}

export function buildTranslationIndex(payload: TranslationPayload): TranslationIndex {
    const index: TranslationIndex = {};

    for (const [pageTitle, rows] of Object.entries(payload)) {
        index[pageTitle] = {};

        for (const row of rows) {
            if (!row.key || !row.translation) continue;
            index[pageTitle][row.key] = row.translation;
        }
    }

    return index;
}

export function getTranslatedText(
    index: TranslationIndex,
    pageTitle: string,
    key: string
): string {
    const pageMap = index[pageTitle];
    if (!pageMap) return key;
    return pageMap[key] ?? key;
}

export function getPageTranslator(
    index: TranslationIndex,
    pageTitle: string
): (key: string) => string {
    return (key: string) => getTranslatedText(index, pageTitle, key);
}