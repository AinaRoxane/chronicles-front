"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { ReactNode, useState } from "react";
import LeftSidebar from "@/components/sidebar/LeftSidebar";
import { usePageTranslation } from "@/components/providers/LanguageProvider";

type MobileTopBarProps = {
    children: ReactNode;
};

export default function MobileTopBar({ children }: MobileTopBarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const t = usePageTranslation("mobile_topbar");

    return (
        <div className="d-md-none shell-root position-relative" style={{ overflow: sidebarOpen ? "hidden" : undefined }}>
            {/* Overlay and sidebar */}
            {sidebarOpen && (
                <>
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ background: "rgba(0,0,0,0.35)", zIndex: 1040 }}
                        onClick={() => setSidebarOpen(false)}
                        aria-label={t("Close sidebar overlay")}
                    />
                    <div
                        className="position-fixed top-0 start-0 h-100 bg-white shadow"
                        style={{
                            width: 260,
                            maxWidth: "80vw",
                            zIndex: 1050,
                            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                            transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
                        }}
                        aria-label={t("Mobile navigation sidebar")}
                    >
                        <LeftSidebar isCollapsed={false} />
                    </div>
                </>
            )}
            <div className="container-fluid h-100">
                <div className="row shell-divider-bottom pb-2">
                    <aside className="col-2 d-flex justify-content-center pt-3">
                        <button
                            type="button"
                            className="bg-transparent border-0 p-0"
                            aria-label={t("Open navigation menu")}
                            onClick={() => setSidebarOpen(true)}
                        >
                            <p className="brand-logo brand-logo-mobile mb-0">m.</p>
                        </button>
                    </aside>
                    <div className="col-8"></div>
                    <aside className="col-2 d-flex pt-3">
                        <button type="button" className="btn btn-link p-0 text-dark" aria-label={t("Open search")}>
                            <SearchOutlinedIcon fontSize="small" />
                        </button>
                    </aside>
                </div>
                <div className="row p-2">
                    <div className="col-1"></div>
                    <div className="col-10">
                        <main className="shell-scroll">{children}</main>
                    </div>
                    <div className="col-1"></div>
                </div>
            </div>
        </div>
    );
}
