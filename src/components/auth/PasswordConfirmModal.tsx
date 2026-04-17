import { FormEvent } from "react";
import PasswordInput from "@/components/forms/PasswordInput";
import styles from "@/app/auth/auth.module.css";

type PasswordConfirmModalProps = {
    open: boolean;
    title: string;
    body: string;
    confirmPassword: string;
    confirmLabel: string;
    cancelText: string;
    submitText: string;
    submittingText: string;
    errorMessage: string | null;
    submitting: boolean;
    onConfirmPasswordChange: (value: string) => void;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function PasswordConfirmModal({
    open,
    title,
    body,
    confirmPassword,
    confirmLabel,
    cancelText,
    submitText,
    submittingText,
    errorMessage,
    submitting,
    onConfirmPasswordChange,
    onClose,
    onSubmit,
}: PasswordConfirmModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div className={styles.modalBackdrop}>
            <form className={styles.modalCard} onSubmit={onSubmit}>
                <h2 className="h6 mb-2">{title}</h2>
                <p className={styles.formSubLabel}>{body}</p>

                <PasswordInput
                    id="confirm-password"
                    label={confirmLabel}
                    value={confirmPassword}
                    onChange={onConfirmPasswordChange}
                    required
                />

                {errorMessage ? <p className={`${styles.errorText} mb-2`}>{errorMessage}</p> : null}

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className={styles.secondaryBtn} onClick={onClose}>
                        {cancelText}
                    </button>
                    <button type="submit" className={styles.primaryBtn} disabled={submitting}>
                        {submitting ? submittingText : submitText}
                    </button>
                </div>
            </form>
        </div>
    );
}
