"use client";

import Link from "next/link";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import { usePageTranslation } from "@/components/providers/LanguageProvider";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const accountItems = [
    { labelId: "#700item01", section: "profile", icon: <PersonOutlineOutlinedIcon fontSize="small" /> },
    {
        labelId: "#700item02",
        section: "notifications",
        icon: <NotificationsNoneOutlinedIcon fontSize="small" />,
    },
    { labelId: "#700item03", section: "purchases", icon: <ShoppingBagOutlinedIcon fontSize="small" /> },
    {
        labelId: "#700item04",
        section: "subscriptions",
        icon: <SubscriptionsOutlinedIcon fontSize="small" />,
    },
];

type AccountAccordionProps = {
    collapsed?: boolean;
    defaultOpen?: boolean;
};

export default function AccountAccordion({ collapsed = false, defaultOpen = false }: AccountAccordionProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = usePageTranslation("account_accordion");
    const isAccountRoute = pathname.startsWith("/account");
    const [isOpen, setIsOpen] = useState(isAccountRoute || defaultOpen);

    const activeSection = useMemo(() => searchParams.get("section"), [searchParams]);

    if (collapsed) {
        return (
            <Link
                href="/account?section=profile"
                aria-label={t("#700title01")}
                className={`sidebar-nav-item d-flex align-items-center justify-content-center px-2 py-2 ${isAccountRoute ? "active" : ""
                    }`}
            >
                <span aria-hidden="true" className="d-inline-flex align-items-center">
                    <PersonOutlineOutlinedIcon fontSize="small" />
                </span>
                <span className="visually-hidden">{t("#700title01")}</span>
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
                    <span>{t("#700title01")}</span>
                </span>
                <ExpandMoreOutlinedIcon
                    fontSize="small"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms ease" }}
                />
            </button>

            {isOpen ? (
                <div id="account-accordion-items" className="d-flex flex-column gap-1 mt-2 ps-4">
                    {accountItems.map((item) => {
                        const isActive = isAccountRoute && activeSection === item.section;

                        return (
                            <Link
                                key={item.section}
                                href={`/account?section=${item.section}`}
                                className={`sidebar-nav-item d-flex align-items-center gap-2 px-2 py-2 ${isActive ? "active" : ""}`}
                            >
                                <span aria-hidden="true" className="d-inline-flex align-items-center">
                                    {item.icon}
                                </span>
                                <span>{t(item.labelId)}</span>
                            </Link>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
