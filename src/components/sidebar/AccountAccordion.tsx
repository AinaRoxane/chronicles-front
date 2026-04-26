"use client";

import Link from "next/link";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import { usePageTranslation } from "@/components/providers/LanguageProvider";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthStatus } from "@/components/providers/AuthStatusProvider";

const accountItems = [
    { key: "Profile", section: "profile", icon: <PersonOutlineOutlinedIcon fontSize="small" />, path: "/account/profile" },
    { key: "Notifications", section: "notifications", icon: <NotificationsNoneOutlinedIcon fontSize="small" />, path: "/account/notifications" },
    { key: "Purchases", section: "purchases", icon: <ShoppingBagOutlinedIcon fontSize="small" />, path: "/account/purchases" },
    { key: "Subscriptions", section: "subscriptions", icon: <SubscriptionsOutlinedIcon fontSize="small" />, path: "/account/subscriptions" },
];

type AccountAccordionProps = {
    collapsed?: boolean;
    defaultOpen?: boolean;
};

export default function AccountAccordion({ collapsed = false, defaultOpen = false }: AccountAccordionProps) {
    const pathname = usePathname();
    const t = usePageTranslation("account_accordion");
    const { isLoggedIn } = useAuthStatus();
    const isAccountRoute = pathname.startsWith("/account");
    const [isOpen, setIsOpen] = useState(isAccountRoute || defaultOpen);

    // Determine active section from the path (e.g., "/account/profile" → "profile")
    const activeSection = pathname.startsWith("/account/") ? pathname.split("/").pop() : null;

    if (!isLoggedIn) {
        return null;
    }

    if (collapsed) {
        return (
            <Link
                href="/account/profile"
                aria-label={t("Account")}
                className={`sidebar-nav-item d-flex align-items-center justify-content-center px-2 py-2 ${isAccountRoute ? "active" : ""
                    }`}
            >
                <span aria-hidden="true" className="d-inline-flex align-items-center">
                    <PersonOutlineOutlinedIcon fontSize="small" />
                </span>
                <span className="visually-hidden">{t("Account")}</span>
            </Link>
        );
    }

    return (
        <div>
            <button
                type="button"
                className="sidebar-nav-item d-flex align-items-center justify-content-between w-100 px-2 py-2 border-0 bg-transparent"
                aria-expanded={isOpen}
                aria-controls="account-accordion-items"
                onClick={() => setIsOpen((open) => !open)}
            >
                <span className="d-flex align-items-center gap-2">
                    <PersonOutlineOutlinedIcon fontSize="small" />
                    <span>{t("Account")}</span>
                </span>
                <ExpandMoreOutlinedIcon
                    fontSize="small"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms ease" }}
                />
            </button>

            {isOpen ? (
                <div id="account-accordion-items" className="d-flex flex-column gap-1 mt-2 ps-4">
                    {accountItems.map((item) => {
                        const isActive = activeSection === item.section;

                        return (
                            <Link
                                key={item.section}
                                href={item.path}
                                className={`sidebar-nav-item d-flex align-items-center gap-2 px-2 py-2 ${isActive ? "active" : ""}`}
                            >
                                <span aria-hidden="true" className="d-inline-flex align-items-center">
                                    {item.icon}
                                </span>
                                <span>{t(item.key)}</span>
                            </Link>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}