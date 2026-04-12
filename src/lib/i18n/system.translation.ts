export type TranslationRow = {
    component_id: string;
    languages: Record<string, string>;
};

export type TranslationPayload = Record<string, TranslationRow[]>;
export type TranslationIndex = Record<string, Record<string, Record<string, string>>>;

export function normalizeLangCode(langCode: string): string {
    return langCode.trim().toUpperCase();
}

export function buildTranslationIndex(payload: TranslationPayload): TranslationIndex {
    const index: TranslationIndex = {};

    for (const [pageTitle, rows] of Object.entries(payload)) {
        index[pageTitle] = {};

        for (const row of rows) {
            if (!row.component_id || !row.languages) {
                continue;
            }

            index[pageTitle][row.component_id] = {};

            for (const [langCode, translatedValue] of Object.entries(row.languages)) {
                index[pageTitle][row.component_id][normalizeLangCode(langCode)] = translatedValue;
            }
        }
    }

    return index;
}

export function getTranslatedText(
    index: TranslationIndex,
    pageTitle: string,
    componentId: string,
    languageCode: string,
    fallbackLanguage = "EN"
): string {
    const pageMap = index[pageTitle];
    if (!pageMap) {
        return componentId;
    }

    const componentMap = pageMap[componentId];
    if (!componentMap) {
        return componentId;
    }

    const langKey = normalizeLangCode(languageCode);
    const fallbackKey = normalizeLangCode(fallbackLanguage);

    return componentMap[langKey] || componentMap[fallbackKey] || componentId;
}

export function getPageTranslator(
    index: TranslationIndex,
    pageTitle: string,
    languageCode: string,
    fallbackLanguage = "EN"
): (componentId: string) => string {
    return (componentId: string) =>
        getTranslatedText(index, pageTitle, componentId, languageCode, fallbackLanguage);
}
