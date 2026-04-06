import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTokenData } from "@/services/auth/interfaces";

export interface AuthState {
    token: string | null; // access token
    refreshToken: string | null;
    user: UserTokenData | null;
}

const initialState: AuthState = {
    token: null,
    refreshToken: null,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<{ token: string, refreshToken: string, user: UserTokenData }>) {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user;

            localStorage.setItem("token", state.token);
            localStorage.setItem("refresh-token", state.refreshToken);
            localStorage.setItem("user-info", JSON.stringify(state.user));
        },

        loadAuth(state) {
            const userString = localStorage.getItem("user-info");
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refresh-token");

            if (userString && token && refreshToken) {
                try {
                    const userTokenData = JSON.parse(userString) as UserTokenData;
                    const now = Math.floor(Date.now() / 1000);

                    if (now > userTokenData.exp) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user-info");
                        localStorage.removeItem("refresh-token");
                        return;
                    }

                    state.user = userTokenData;
                    state.token = token;
                    state.refreshToken = refreshToken;
                } catch (e) {
                    console.error("Failed to parse user data", e);
                }
            }
        },
        
        // LOGOUT: Wipe everything
        logout(state: AuthState) {
            state.token = null;
            state.user = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user-info");
            localStorage.removeItem("refresh-token");
        },
    },
});

export const { setAuth, logout, loadAuth } = authSlice.actions;
export default authSlice.reducer;