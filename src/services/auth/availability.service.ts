import apiClient from "@/services/auth/api.client";
import { errorHandlerWrapper } from "@/utils/error.handler";
import { SuccessResponse } from "@/utils/interfaces";
import { AxiosResponse } from "axios";

export interface EmailAvailabilityData {
    email: string;
    exists: boolean;
}

export interface UsertagAvailabilityData {
    usertag: string;
    exists: boolean;
}

class AvailabilityService {
    public async checkEmail(
        email: string
    ): Promise<AxiosResponse<SuccessResponse<EmailAvailabilityData>>> {
        return await errorHandlerWrapper(() =>
            apiClient.get<SuccessResponse<EmailAvailabilityData>>(
                "public/auth/check/email",
                { params: { email } }
            )
        );
    }

    public async checkUsertag(
        usertag: string
    ): Promise<AxiosResponse<SuccessResponse<UsertagAvailabilityData>>> {
        return await errorHandlerWrapper(() =>
            apiClient.get<SuccessResponse<UsertagAvailabilityData>>(
                "public/auth/check/usertag",
                { params: { usertag } }
            )
        );
    }
}

export const availabilityService = new AvailabilityService();
