import apiClient from "@/services/auth/api.client";
import { LoginRequest, LoginResponse } from "@/services/auth/interfaces";
import { errorHandlerWrapper } from "@/utils/error.handler";
import { SuccessResponse } from "@/utils/interfaces";
import { AxiosResponse } from "axios";

class LoginService {
  public async login(
    data: LoginRequest
  ): Promise<AxiosResponse<SuccessResponse<LoginResponse>>> {
    return await errorHandlerWrapper(() =>
      apiClient.post<SuccessResponse<LoginResponse>>("public/auth/login", data, { withCredentials: true })
    );
  }

  // Refresh token is sent via httpOnly cookie, no body needed
  public async refreshToken(): Promise<AxiosResponse<SuccessResponse<LoginResponse>>> {
    return await errorHandlerWrapper(() =>
      apiClient.post<SuccessResponse<LoginResponse>>("public/auth/refresh-token", {}, { withCredentials: true })
    );
  }

  public async logout(): Promise<AxiosResponse<SuccessResponse<void>>> {
    return await errorHandlerWrapper(() =>
      apiClient.post<SuccessResponse<void>>("public/auth/logout", {}, { withCredentials: true })
    );
  }
}

export const loginService = new LoginService();