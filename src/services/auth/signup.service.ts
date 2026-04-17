import apiClient from "@/services/auth/api.client";
import { UserTokenData } from "@/services/auth/interfaces";
import { errorHandlerWrapper } from "@/utils/error.handler";
import { SuccessResponse } from "@/utils/interfaces";
import { AxiosResponse } from "axios";

export interface SignupRequest {
    email: string;
    password: string;
    countryIsoCode: string;
    username: string;
    usertag: string;
    userRoleCode: string;
    userPreferedLanguageCode: string;
    birthYear?: number | null;
    gender?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
}

class SignupService {
    public async signup(
        data: SignupRequest
    ): Promise<AxiosResponse<SuccessResponse<UserTokenData>>> {
        return await errorHandlerWrapper(() =>
            apiClient.post<SuccessResponse<UserTokenData>>("public/auth/signup", data, {
                withCredentials: true,
            })
        );
    }
}

export const signupService = new SignupService();
