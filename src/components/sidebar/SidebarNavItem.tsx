import Link from "next/link";
import { ReactNode } from "react";

type SidebarNavItemProps = {
    href: string;
    label: string;
    icon: ReactNode;
    active?: boolean;
    className?: string;
};

export default function SidebarNavItem({
    href,
    label,
    icon,
    active = false,
    className = "",
}: SidebarNavItemProps) {
    return (
        <Link
            href={href}
            className={`sidebar-nav-item d-flex align-items-center gap-2 px-2 py-2 ${active ? "active" : ""
                } ${className}`.trim()}
        >
            <span aria-hidden="true" className="d-inline-flex align-items-center">
                {icon}
            </span>
            <span>{label}</span>
        </Link>
    );
}
