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
      apiClient.post<SuccessResponse<LoginResponse>>("/auth/login", data)
    );
  }
}

export const loginService = new LoginService();