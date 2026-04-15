"use client";

import AppShell from "@/components/layout/AppShell";
import { usePageTranslation } from "@/components/providers/LanguageProvider";
import { ReactNode } from "react";

type SectionPageProps = {
    pageKey: string;
    titleId: string;
    showDefaultDescription?: boolean;
    children?: ReactNode;
};

export default function SectionPage({children }: SectionPageProps) {
    return (
        <AppShell>
            <main>
                {children}
            </main>
        </AppShell>
    );
}
