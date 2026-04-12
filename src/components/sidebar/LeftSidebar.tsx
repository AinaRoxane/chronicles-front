"use client";

import SidebarNavItem from "@/components/sidebar/SidebarNavItem";
import AccountAccordion from "@/components/sidebar/AccountAccordion";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { usePathname } from "next/navigation";

export default function LeftSidebar() {
    const pathname = usePathname();

    return (
        <nav className="h-100 d-flex flex-column p-3">
            <div className="shell-divider-bottom pb-3 mb-3">
                <p className="brand-logo brand-logo-desktop">m.</p>
            </div>

            <div className="d-flex flex-column gap-1">
                <SidebarNavItem
                    href="/home"
                    label="Home"
                    icon={<HomeOutlinedIcon fontSize="small" />}
                    active={pathname === "/home"}
                />
                <SidebarNavItem
                    href="/explore"
                    label="Explore"
                    icon={<ExploreOutlinedIcon fontSize="small" />}
                    active={pathname === "/explore"}
                />
                {/* account managing */}
                <AccountAccordion />

                <SidebarNavItem
                    href="/settings"
                    label="Settings"
                    icon={<SettingsOutlinedIcon fontSize="small" />}
                    active={pathname === "/settings"}
                />
            </div>



            <div className="mt-auto pt-3 shell-divider-top">
                <div className="d-flex justify-content-end gap-3 small text-secondary">
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </div>
            </div>
        </nav>
    );
}
