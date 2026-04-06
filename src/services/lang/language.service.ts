import CrudBaseHttpClient from "@/services/crud.service";

export interface Language {
    id: number;
    code: string;
    name: string;
}

class LanguageService extends CrudBaseHttpClient<Language> {
    constructor() {
        super("public/languages");
    }
}
export const languageService = new LanguageService();