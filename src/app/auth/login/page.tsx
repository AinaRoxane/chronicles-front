"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCardShell from "@/components/auth/AuthCardShell";
import PasswordInput from "@/components/forms/PasswordInput";
import TextInput from "@/components/forms/TextInput";
import { usePageTranslation } from "@/components/providers/LanguageProvider";
import { loginService } from "@/services/auth/login.service";
import { setAuth } from "@/store/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import styles from "../auth.module.css";

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
            setErrorMessage(t("#010error01"));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthCardShell narrow>
            <form className={styles.sectionPad} onSubmit={onSubmit}>
                <TextInput
                    id="login-identifier"
                    label={t("#010label01")}
                    subLabel={t("#010help01")}
                    value={identifier}
                    onChange={setIdentifier}
                    autoComplete="username"
                    required
                />

                <PasswordInput
                    id="login-password"
                    label={t("#010label02")}
                    subLabel={t("#010help02")}
                    value={password}
                    onChange={setPassword}
                    autoComplete="current-password"
                    required
                />

                {errorMessage ? <p className={`${styles.errorText} mb-2`}>{errorMessage}</p> : null}

                <div className="row mb-3">
                    <div className="col-12">
                        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
                            {submitting ? t("#010status01") : t("#010cta01")}
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <Link href="/auth/signin" className={styles.linkText}>
                            {t("#010link01")}
                        </Link>
                    </div>
                </div>
            </form>
        </AuthCardShell>
    );
}
