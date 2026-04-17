"use client";

import { loadAuth } from "@/store/auth.slice";
import { Provider } from "react-redux";
import store from "@/store";
import { useEffect } from "react";

type ReduxProviderProps = {
    children: React.ReactNode;
};

export default function ReduxProvider({ children }: ReduxProviderProps) {
    useEffect(() => {
        store.dispatch(loadAuth());
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
