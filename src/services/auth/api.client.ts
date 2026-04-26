// services/auth/api.client.ts
import axios from 'axios';
import { BACKEND_URL } from "@/services/static";
import store from "@/store";
import { setAuth, logout } from "@/store/auth.slice";

/**
 * Determine if a request is to a public endpoint (no token required).
 * Public endpoints start with "/public/" (or "public/" after stripping leading slash).
 */
const isPublicRequest = (url?: string): boolean => {
    if (!url) return false;
    const normalized = url.startsWith('/') ? url.slice(1) : url;
    return normalized.startsWith('public/');
};

// Create Axios instance with credentials (cookies sent automatically)
const apiClient = axios.create({
    baseURL: BACKEND_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,  // sends httpOnly refresh token cookie
});

// ──────────────────────────────────────────────────────────────────
// Request interceptor: attach Bearer token unless it's a public endpoint
// ──────────────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
    (config) => {
        // Do NOT attach token for public endpoints (e.g., login, refresh, signup)
        if (isPublicRequest(config.url)) {
            delete config.headers.Authorization;
            return config;
        }

        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ──────────────────────────────────────────────────────────────────
// Response interceptor: automatically refresh token on 401
// ──────────────────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(null);
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Never attempt refresh for public endpoints
        if (isPublicRequest(originalRequest?.url)) {
            return Promise.reject(error);
        }

        // Only handle 401 and avoid infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue the request while refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => apiClient(originalRequest))
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the refresh token endpoint using the SAME apiClient
                // (withCredentials ensures the httpOnly cookie is sent)
                const refreshResponse = await apiClient.post('/public/auth/refresh-token');
                const userData = refreshResponse.data.data;  // UserDTO
                const newAccessToken = userData.jwt;

                // Update Redux state with new token and user data
                store.dispatch(setAuth({ token: newAccessToken, user: userData }));

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue();
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed → logout and clear state
                processQueue(refreshError);
                store.dispatch(logout());
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;