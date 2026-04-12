import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import LanguageProvider from "@/components/providers/LanguageProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <LanguageProvider>{children}</LanguageProvider>
            </body>
        </html>
    );
}