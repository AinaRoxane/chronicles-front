"use client";

import Link from "next/link";
import { useGuestPrompt } from "@/components/providers/GuestPromptProvider";
import { usePageTranslation } from "@/components/providers/LanguageProvider";

export default function GuestOverlay() {
    const { shouldShowOverlay, dismissOverlay } = useGuestPrompt();
    const t = usePageTranslation("guest_overlay");

    if (!shouldShowOverlay) {
        return null;
    }

    return (
        <div className="guest-overlay-backdrop" role="presentation">
            <section className="guest-overlay-panel" role="dialog" aria-modal="true" aria-labelledby="guest-overlay-title">
                <button
                    type="button"
                    className="guest-overlay-close"
                    aria-label={t("Close login prompt")}
                    onClick={dismissOverlay}
                >
                    x
                </button>
                <h2 id="guest-overlay-title" className="h5 mb-2">{t("Welcome to Chronicles")}</h2>
                <p className="text-secondary mb-3">{t("You are currently logged out. Login or sign in to unlock a better experience.")}</p>
                <div className="d-flex flex-wrap gap-2">
                    <Link href="/auth/login" className="guest-overlay-btn guest-overlay-btn-primary" onClick={dismissOverlay}>
                        {t("Login")}
                    </Link>
                    <Link href="/auth/signin" className="guest-overlay-btn" onClick={dismissOverlay}>
                        {t("Sign in")}
                    </Link>
                </div>
            </section>
        </div>
    );
}
