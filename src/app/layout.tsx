import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import LanguageProvider from "@/components/providers/LanguageProvider";
import AuthStatusProvider from "@/components/providers/AuthStatusProvider";
import { cookies } from "next/headers";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies();
    const hasRefreshToken = ["refresh-token", "refresh_token", "refreshToken"].some((name) =>
        cookieStore.has(name)
    );

    return (
        <html lang="en">
            <body>
                <AuthStatusProvider initialLoggedIn={hasRefreshToken}>
                    <LanguageProvider>{children}</LanguageProvider>
                </AuthStatusProvider>
            </body>
        </html>
    );
}