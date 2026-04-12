"use client";
import { useState, useRef } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

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

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        setLoading(true);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setLoading(false), 900);
    }

    // Desktop: 3-col row (icon | input | loading dots)
    // Mobile: icon only (top right)
    return (
        <aside className="h-100 p-3">
            {/* Desktop */}
            <div className="d-none d-md-block">
                <form className="row align-items-center g-0" role="search" aria-label="Search chronicles" autoComplete="off">
                    <div className="col-10 px-2">
                        <input
                            id="sidebar-search"
                            type="text"
                            className="form-control search-input"
                            placeholder="Search..."
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
            </div>

            {/* Mobile: icon only, top right */}
            <div className="d-md-none d-flex justify-content-end">
                <button type="button" className="btn btn-link p-0 text-dark" aria-label="Open search">
                    <SearchOutlinedIcon fontSize="medium" />
                </button>
            </div>
        </aside>
    );
}
