import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTokenData } from "@/services/auth/interfaces";

export interface AuthState {
    token: string | null;
    user: UserTokenData | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<{ token: string, user: UserTokenData }>) {
            state.token = action.payload.token;
            state.user = action.payload.user;

            localStorage.setItem("token", state.token);
            localStorage.setItem("user-info", JSON.stringify(state.user));
        },

        loadAuth(state) {
            const userString = localStorage.getItem("user-info");
            const token = localStorage.getItem("token");

            if (userString && token) {
                try {
                    const userTokenData = JSON.parse(userString) as UserTokenData;
                    state.user = userTokenData;
                    state.token = token;
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
        },
    },
});

export const { setAuth, logout, loadAuth } = authSlice.actions;
export default authSlice.reducer;