// src/lib/seo/page-metadata.config.ts
export const pageMetadataMap: Record<string, { titleId: string; descId: string }> = {
    "/home": { titleId: "Home", descId: "Home description" },
    "/explore": { titleId: "Explore", descId: "Explore description" },
    "/account": { titleId: "Account", descId: "Account description" },
    "/account/profile": { titleId: "Profile", descId: "Profile description" },
    "/account/notifications": { titleId: "Notifications", descId: "Notifications description" },
    "/account/purchases": { titleId: "Purchases", descId: "Purchases description" },
    "/account/subscriptions": { titleId: "Subscriptions", descId: "Subscriptions description" },
    "/settings": { titleId: "Settings", descId: "Settings description" },
    "/search": { titleId: "Search", descId: "Search description" },
    "/about": { titleId: "About", descId: "About description" },
    "/contact": { titleId: "Contact", descId: "Contact description" },
};