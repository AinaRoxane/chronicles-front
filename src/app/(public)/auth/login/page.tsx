"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { usePageTranslation } from "@/components/providers/LanguageProvider";
import { loginService } from "@/services/auth/login.service";
import { setAuth } from "@/store/auth.slice";
import { useAppDispatch } from "@/store/hooks";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const t = usePageTranslation("auth_pages");

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await loginService.login({ identifier, password });
            const user = response.data.data;

            dispatch(
                setAuth({
                    token: user.jwt,
                    user,
                })
            );

            router.push("/home");
        } catch {
            setErrorMessage(t("Login failed. Please check your credentials."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="container py-4 min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow-sm border-0" style={{ width: "100%", maxWidth: "540px" }}>
                <div className="card-body p-4 p-md-5">
                    <h1 className="h4 mb-1">{t("Login")}</h1>
                    <p className="text-body-secondary mb-4">{t("Enter your email or your account tag")}</p>

                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="login-identifier" className="form-label fw-semibold">
                                {t("Identifier")}
                            </label>
                            <input
                                id="login-identifier"
                                type="text"
                                className="form-control"
                                value={identifier}
                                onChange={(event) => setIdentifier(event.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="login-password" className="form-label fw-semibold">
                                {t("Login password label")}
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <div className="form-text">{t("Enter the password you set")}</div>
                        </div>

                        {errorMessage ? <p className="text-danger small mb-3">{errorMessage}</p> : null}

                        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                            {submitting ? t("Logging in...") : t("Login")}
                        </button>
                    </form>

                    <div className="mt-3 text-center">
                        <Link href="/auth/signin" className="link-secondary">
                            {t("Create an account")}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
