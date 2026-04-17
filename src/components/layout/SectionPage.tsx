"use client";

import AppShell from "@/components/layout/AppShell";
import { ReactNode } from "react";

type SectionPageProps = {
    children?: ReactNode;
};

export default function SectionPage({ children }: SectionPageProps) {
    return (
        <AppShell>
            <main>
                {children}
            </main>
        </AppShell>
    );
}
