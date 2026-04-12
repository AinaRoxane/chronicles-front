"use client";

import SidebarNavItem from "@/components/sidebar/SidebarNavItem";
import AccountAccordion from "@/components/sidebar/AccountAccordion";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { usePathname } from "next/navigation";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";

type LeftSidebarProps = {
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
};

export default function LeftSidebar({ isCollapsed = false, onToggleCollapse }: LeftSidebarProps) {
    const pathname = usePathname();

    return (
        <nav className="h-100 d-flex flex-column p-3">
            <div className="shell-divider-bottom pb-3 mb-3">
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="w-100 border-0 bg-transparent p-0 text-start"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <p
                        className={`brand-logo brand-logo-desktop mb-0${isCollapsed ? " text-center" : ""}`}
                        style={isCollapsed ? { margin: "0 auto" } : {}}
                    >
                        m.
                    </p>
                </button>
            </div>

            <div className="d-flex flex-column gap-1">
                <SidebarNavItem
                    href="/home"
                    label="Home"
                    icon={<HomeOutlinedIcon fontSize="small" />}
                    active={pathname === "/home"}
                    collapsed={isCollapsed}
                />
                <SidebarNavItem
                    href="/explore"
                    label="Explore"
                    icon={<ExploreOutlinedIcon fontSize="small" />}
                    active={pathname === "/explore"}
                    collapsed={isCollapsed}
                />
                {/* account managing */}
                <AccountAccordion collapsed={isCollapsed} defaultOpen={!isCollapsed} />

                <SidebarNavItem
                    href="/settings"
                    label="Settings"
                    icon={<SettingsOutlinedIcon fontSize="small" />}
                    active={pathname === "/settings"}
                    collapsed={isCollapsed}
                />
            </div>

            {!isCollapsed ? (
                <div className="mt-auto pt-3 shell-divider-top">
                    <div className="d-flex justify-content-end gap-3 small text-secondary">
                        <a href="#about">About</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
            ) : (
                <div className="mt-auto pt-3 shell-divider-top">
                    <div className="row justify-content-center g-0">
                        <div className="col-auto px-2">
                            <a href="#about" aria-label="About" className="text-secondary d-flex justify-content-center align-items-center">
                                <InfoOutlinedIcon fontSize="small" />
                            </a>
                        </div>
                        <div className="col-auto px-2">
                            <a href="#contact" aria-label="Contact" className="text-secondary d-flex justify-content-center align-items-center">
                                <AlternateEmailOutlinedIcon fontSize="small" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
