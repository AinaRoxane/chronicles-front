export type TranslationRow = {
    component_id: string;
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
            if (!row.component_id || !row.translation) {
                continue;
            }

            index[pageTitle][row.component_id] = row.translation;
        }
    }

    return index;
}

export function getTranslatedText(
    index: TranslationIndex,
    pageTitle: string,
    componentId: string
): string {
    const pageMap = index[pageTitle];
    if (!pageMap) {
        return componentId;
    }

    const translatedValue = pageMap[componentId];
    if (!translatedValue) {
        return componentId;
    }

    return translatedValue;
}

export function getPageTranslator(
    index: TranslationIndex,
    pageTitle: string
): (componentId: string) => string {
    return (componentId: string) => getTranslatedText(index, pageTitle, componentId);
}
