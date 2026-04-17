"use client";
import { useState, useRef } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { usePageTranslation } from "@/components/providers/LanguageProvider";
import Link from "next/link";
import { useGuestPrompt } from "@/components/providers/GuestPromptProvider";

function LoadingDots() {
    return (
        <span className="d-inline-block" aria-label="Loading">
            <span className="dot" style={{ animationDelay: "0ms" }}>.</span>
            <span className="dot" style={{ animationDelay: "150ms" }}>.</span>
            <span className="dot" style={{ animationDelay: "300ms" }}>.</span>
            <style>{`
                .dot {
                    font-size: 1.5rem;
                    color: var(--color-gray-500);
                    opacity: 0.7;
                    animation: blink 1s infinite both;
                }
                .dot:not(:first-child) {
                    margin-left: 0.1em;
                }
                @keyframes blink {
                    0%, 80%, 100% { opacity: 0.7; }
                    40% { opacity: 1; }
                }
            `}</style>
        </span>
    );
}

export default function RightSidebar() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const t = usePageTranslation("right_sidebar");
    const { shouldShowCompactPrompt } = useGuestPrompt();

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        setLoading(true);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setLoading(false), 900);
    }

    return (
        <aside className="h-100 p-3">
            {/* Desktop */}
            <div className="d-none d-md-block">
                <form className="row align-items-center g-0" role="search" aria-label={t("Search chronicles")} autoComplete="off">
                    <div className="col-10 px-2">
                        <input
                            id="sidebar-search"
                            type="text"
                            className="form-control search-input"
                            placeholder={t("Search...")}
                            name="q"
                            value={search}
                            onChange={handleInput}
                            autoComplete="off"
                        />
                    </div>
                    <div className="col-2 d-flex justify-content-center">
                        {loading ? <LoadingDots /> : <SearchOutlinedIcon fontSize="small" />}
                    </div>
                </form>

                {shouldShowCompactPrompt ? (
                    <section className="guest-teaser-card mt-4" aria-label={t("Logged out quick actions")}>
                        <p className="small text-secondary mb-2">{t("Continue after login or sign in")}</p>
                        <div className="d-flex gap-2">
                            <Link href="/auth/login" className="guest-teaser-btn guest-teaser-btn-primary">
                                {t("Login")}
                            </Link>
                            <Link href="/auth/signin" className="guest-teaser-btn">
                                {t("Sign in")}
                            </Link>
                        </div>
                    </section>
                ) : null}
            </div>

            {/* Mobile: icon only, top right */}
            <div className="d-md-none d-flex justify-content-end">
                <button type="button" className="btn btn-link p-0 text-dark" aria-label={t("Open search")}>
                    <SearchOutlinedIcon fontSize="medium" />
                </button>
            </div>
        </aside>
    );
}
