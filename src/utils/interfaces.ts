export interface ErrorInfo {
    message: string;
    code?: string;
    details?: unknown;
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    error?: ErrorInfo;
}

export interface SuccessResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}