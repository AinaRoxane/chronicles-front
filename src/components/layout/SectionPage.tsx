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

export default function SectionPage({
    pageKey,
    titleId,
    showDefaultDescription = true,
    children,
}: SectionPageProps) {
    const pageT = usePageTranslation(pageKey);
    const sharedT = usePageTranslation("section_page");

    return (
        <AppShell>
            <main>
                {showDefaultDescription ? (
                    <p className="text-secondary mb-3">{sharedT("#000body01")}</p>
                ) : null}
                {children}
            </main>
        </AppShell>
    );
}
