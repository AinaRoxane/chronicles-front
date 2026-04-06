import { AxiosError } from "axios";
import { ErrorInfo, ErrorResponse } from "@/utils/interfaces";
import { toast } from "react-toastify";

export async function errorHandlerWrapper<T>(callback: () => Promise<T>): Promise<T> {
    try {
        return await callback();
    } catch (error) {
        const info = await handleError(error as AxiosError);
        throw info; 
    }
}

export const handleError = async (error: AxiosError): Promise<ErrorInfo> => {
    let errorMessage = 'Une erreur inconnue s\'est produite';
    let errorData: ErrorInfo = { message: errorMessage };

    if (error.response) {
        const { status, data } = error.response;
        const responseBody = data as ErrorResponse;
        
        errorData = responseBody.error || { message: responseBody.message || error.message };

        if (status === 401) errorMessage = 'Veuillez vous identifier';
        else if (status === 403) errorMessage = 'Droit d\'accès insuffisant';
        else if (status === 404) errorMessage = 'Ressource introuvable';
        else if (status === 500) errorMessage = 'Erreur interne du serveur';
        else errorMessage = errorData.message;
    } else {
        errorMessage = error.message;
        errorData = { message: error.message };
    }

    // Pure string call - No JSX here!
    toast.error(errorMessage);

    return errorData;
};

export const displaySuccess = (msg: string) => {
    toast.success(msg);
};