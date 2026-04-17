import { ReactNode } from "react";
import styles from "@/app/auth/auth.module.css";

type AuthCardShellProps = {
    children: ReactNode;
    narrow?: boolean;
    brandText?: string;
    className?: string;
};

export default function AuthCardShell({
    children,
    narrow = false,
    brandText = "mdg-chronicles.",
    className = "",
}: AuthCardShellProps) {
    return (
        <main className={styles.authPage}>
            <section className={`${styles.authCard} ${narrow ? styles.authCardNarrow : ""} ${className}`.trim()}>
                <div className={styles.brandRow}>
                    <p className={`${styles.brandText} shell-divider-bottom pb-2`}>{brandText}</p>
                </div>
                {children}
            </section>
        </main>
    );
}
