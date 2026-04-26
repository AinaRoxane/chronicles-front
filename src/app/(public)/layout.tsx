// app/(public)/layout.tsx
import { cookies, headers } from "next/headers";
import en from "../../../public/i18n/en.json";
import fr from "../../../public/i18n/fr.json";
import mg from "../../../public/i18n/mg.json";
import { pageMetadataMap } from "@/lib/seo/page-metadata.config";

const translations: Record<string, any> = { en, fr, mg };

function getTranslation(locale: string, pageName: string, componentId: string): string {
    const pageData = translations[locale]?.[pageName];
    if (!pageData) return componentId;
    const row = pageData.find((r: any) => r.component_id === componentId);
    return row?.translation || componentId;
}

export async function generateMetadata() {
    // ✅ await headers() – required in 16.2.3
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "/";
    const cleanPath = pathname.replace(/\/$/, "").split("?")[0];

    const config = pageMetadataMap[cleanPath];
    if (!config) return {};

    // ✅ await cookies() – required in 16.2.3
    const cookieStore = await cookies();
    const lang = cookieStore.get("NEXT_LOCALE")?.value || "en";
    const locale = lang.toLowerCase();

    const pageName = cleanPath.slice(1) + "_page";
    const title = getTranslation(locale, pageName, config.titleId);
    const description = getTranslation(locale, pageName, config.descId);
    return { title, description };
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return children;
}