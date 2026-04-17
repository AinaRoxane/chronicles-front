import CrudBaseHttpClient from "@/services/crud.service";
import apiClient from "@/services/auth/api.client";
import { errorHandlerWrapper } from "@/utils/error.handler";
import { SuccessResponse } from "@/utils/interfaces";
import { AxiosResponse } from "axios";

export interface Gender {
    id: number;
    code: string;
    name: string;
}

export interface GenderTranslation {
    genderId: number;
    genderCode: string;
    languageCode: string;
    translatedName: string;
}

class GenderService extends CrudBaseHttpClient<Gender> {
    constructor() {
        super("public/genders");
    }

    public async getTranslations(
        languageCode?: string
    ): Promise<AxiosResponse<SuccessResponse<GenderTranslation[]>>> {
        return await errorHandlerWrapper(() =>
            apiClient.get<SuccessResponse<GenderTranslation[]>>(
                "public/genders/translations",
                {
                    params: languageCode ? { languageCode } : undefined,
                }
            )
        );
    }
}

export const genderService = new GenderService();
