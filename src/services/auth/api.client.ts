import axios from 'axios';
import { BACKEND_URL } from "@/services/static";
import store from "@/store";
import { setAuth, logout } from "@/store/auth.slice";

// Create Axios instance
const apiClient = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies (for refresh token)
});

// Attach access token to requests
apiClient.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercept 401 responses to auto-refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh if 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Use loginService to fetch new tokens (returns UserTokenData)
                const { loginService } = await import("@/services/auth/login.service");
                const res = await loginService.refreshToken();
                const userData = res.data.data;
                const newAccessToken = userData.jwt;

                // Update Redux + localStorage
                store.dispatch(setAuth({
                    token: newAccessToken,
                    user: userData,
                }));

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest);

            } catch (refreshError) {
                // Refresh failed → logout
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;