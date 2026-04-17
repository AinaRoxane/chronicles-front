import styles from "@/app/auth/auth.module.css";

export type AvailabilityStatus =
    | "idle"
    | "checking"
    | "available"
    | "taken"
    | "error";

type AvailabilityIndicatorProps = {
    status: AvailabilityStatus;
    idleText: string;
    checkingText: string;
    availableText: string;
    takenText: string;
    errorText: string;
};

export default function AvailabilityIndicator({
    status,
    idleText,
    checkingText,
    availableText,
    takenText,
    errorText,
}: AvailabilityIndicatorProps) {
    if (status === "idle") {
        return <small className={styles.formSubLabel}>{idleText}</small>;
    }

    if (status === "checking") {
        return <small className={styles.formSubLabel}>{checkingText}</small>;
    }

    if (status === "available") {
        return <small className={styles.successText}>{availableText}</small>;
    }

    if (status === "taken") {
        return <small className={styles.errorText}>{takenText}</small>;
    }

    return <small className={styles.errorText}>{errorText}</small>;
}
