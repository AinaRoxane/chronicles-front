// components/providers/ReduxProvider.tsx
"use client";

import { Provider } from "react-redux";
import store from "@/store";
import { useEffect } from "react";
import { refreshTokenThunk } from "@/store/auth.slice";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(refreshTokenThunk());
    }, []);

    return <Provider store={store}>{children}</Provider>;
}