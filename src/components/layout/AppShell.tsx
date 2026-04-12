"use client";

import LeftSidebar from "@/components/sidebar/LeftSidebar";
import RightSidebar from "@/components/sidebar/RightSidebar";
import MobileTopBar from "@/components/sidebar/MobileTopBar";
import { ReactNode, useState } from "react";

type AppShellProps = {
    children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <>
            <div className="d-none d-md-block shell-root">
                <div className="container-fluid h-100">
                    <div className="row g-0 h-100">
                        <aside
                            className={`${isSidebarCollapsed ? "col-1" : "col-2"} shell-panel shell-scroll shell-divider-right`}
                        >
                            <LeftSidebar
                                isCollapsed={isSidebarCollapsed}
                                onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
                            />
                        </aside>

                        <main
                            className={`${isSidebarCollapsed ? "col-9" : "col-8"} shell-panel shell-scroll p-4`}
                            style={{ background: "var(--surface-main)" }}
                        >
                            {children}
                        </main>

                        <aside className="col-2 shell-panel">
                            <RightSidebar />
                        </aside>
                    </div>
                </div>
            </div>

            <MobileTopBar>{children}</MobileTopBar>
        </>
    );
}
