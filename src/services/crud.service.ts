import { AxiosResponse } from 'axios';
import { errorHandlerWrapper } from "@/utils/error.handler";
import { SuccessResponse } from "@/utils/interfaces";
import apiClient  from "@/services/auth/api.client"; 

export interface QueryParams {
    [key: string]: string | number | boolean | undefined;
}

class CrudBaseHttpClient<T> {
    protected axiosInstance = apiClient;

    constructor(protected endpoint: string) {}

    public async getAll(params?: QueryParams): Promise<AxiosResponse<SuccessResponse<T[]>>> {
        return await errorHandlerWrapper(() =>
            this.axiosInstance.get<SuccessResponse<T[]>>(`/${this.endpoint}`, { params })
        );
    }

    public async getById(id: number | string): Promise<AxiosResponse<SuccessResponse<T>>> {
        return await errorHandlerWrapper(() =>
            this.axiosInstance.get<SuccessResponse<T>>(`/${this.endpoint}/${id}`)
        );
    }

    public async save(data: Record<string, unknown>): Promise<AxiosResponse<SuccessResponse<T>>> {
        return await errorHandlerWrapper(() =>
            this.axiosInstance.post<SuccessResponse<T>>(`/${this.endpoint}`, data)
        );
    }

    public async update(id: number | string, data: Record<string, unknown>): Promise<AxiosResponse<SuccessResponse<T>>> {
        return await errorHandlerWrapper(() =>
            this.axiosInstance.put<SuccessResponse<T>>(`/${this.endpoint}/${id}`, data)
        );
    }

    public async remove(id: number | string): Promise<AxiosResponse<SuccessResponse<void>>> {
        return await errorHandlerWrapper(() =>
            this.axiosInstance.delete<SuccessResponse<void>>(`/${this.endpoint}/${id}`)
        );
    }
}

export default CrudBaseHttpClient;