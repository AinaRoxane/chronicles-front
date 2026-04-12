"use client";

import SidebarNavItem from "@/components/sidebar/SidebarNavItem";
import AccountAccordion from "@/components/sidebar/AccountAccordion";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { usePageTranslation } from "@/components/providers/LanguageProvider";
import { usePathname } from "next/navigation";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";

type LeftSidebarProps = {
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
};

export default function LeftSidebar({ isCollapsed = false, onToggleCollapse }: LeftSidebarProps) {
    const pathname = usePathname();
    const t = usePageTranslation("left_sidebar");

    return (
        <nav className="h-100 d-flex flex-column p-3">
            <div className="shell-divider-bottom pb-3 mb-3">
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="w-100 border-0 bg-transparent p-0 text-start"
                    aria-label={isCollapsed ? t("#600aria01") : t("#600aria02")}
                    title={isCollapsed ? t("#600aria01") : t("#600aria02")}
                >
                    <p
                        className={`brand-logo brand-logo-desktop mb-0${isCollapsed ? " text-center" : ""}`}
                        style={isCollapsed ? { margin: "0 auto" } : {}}
                    >
                        {isCollapsed ? t("#600logo02") : t("#600logo01")}
                    </p>
                </button>
            </div>

            <div className="d-flex flex-column gap-1">
                <SidebarNavItem
                    href="/home"
                    label={t("#600nav01")}
                    icon={<HomeOutlinedIcon fontSize="small" />}
                    active={pathname === "/home"}
                    collapsed={isCollapsed}
                />
                <SidebarNavItem
                    href="/explore"
                    label={t("#600nav02")}
                    icon={<ExploreOutlinedIcon fontSize="small" />}
                    active={pathname === "/explore"}
                    collapsed={isCollapsed}
                />
                {/* account managing */}
                <AccountAccordion collapsed={isCollapsed} defaultOpen={!isCollapsed} />

                <SidebarNavItem
                    href="/settings"
                    label={t("#600nav03")}
                    icon={<SettingsOutlinedIcon fontSize="small" />}
                    active={pathname === "/settings"}
                    collapsed={isCollapsed}
                />
            </div>

            {!isCollapsed ? (
                <div className="mt-auto pt-3 shell-divider-top">
                    <div className="d-flex justify-content-end gap-3 small text-secondary">
                        <a href="#about">{t("#600footer01")}</a>
                        <a href="#contact">{t("#600footer02")}</a>
                    </div>
                </div>
            ) : (
                <div className="mt-auto pt-3 shell-divider-top">
                    <div className="row justify-content-center g-0">
                        <div className="col-auto">
                            <a href="#about" aria-label={t("#600footer01")} className="text-secondary d-flex justify-content-center align-items-center">
                                <InfoOutlinedIcon fontSize="small" />
                            </a>
                        </div>
                        <div className="col-auto">
                            <a href="#contact" aria-label={t("#600footer02")} className="text-secondary d-flex justify-content-center align-items-center">
                                <AlternateEmailOutlinedIcon fontSize="small" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
