// store/auth.slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserTokenData } from "@/services/auth/interfaces";
import apiClient from "@/services/auth/api.client";

export interface AuthState {
    token: string | null;
    user: UserTokenData | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isLoading: false,
};

export const refreshTokenThunk = createAsyncThunk( 'auth/refreshToken', async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/public/auth/refresh-token');
            const userDTO = response.data.data;
            return { token: userDTO.jwt, user: userDTO };
        } catch (error) {
            return rejectWithValue(null);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<{ token: string; user: UserTokenData }>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logout(state) {
            state.token = null;
            state.user = null;
            apiClient.post('/public/auth/logout').catch(console.error);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshTokenThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(refreshTokenThunk.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isLoading = false;
            })
            .addCase(refreshTokenThunk.rejected, (state) => {
                state.token = null;
                state.user = null;
                state.isLoading = false;
            });
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;