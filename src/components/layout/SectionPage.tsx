import AppShell from "@/components/layout/AppShell";
import { ReactNode } from "react";

type SectionPageProps = {
    title: string;
    children?: ReactNode;
};

export default function SectionPage({ title, children }: SectionPageProps) {
    return (
        <AppShell>
            <main>
                <h1 className="h3 mb-3">{title}</h1>
                <p className="text-secondary mb-0">This section is ready for your next feature.</p>
                {children}
            </main>
        </AppShell>
    );
}
