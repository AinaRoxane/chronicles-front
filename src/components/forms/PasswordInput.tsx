import styles from "@/app/auth/auth.module.css";

type PasswordInputProps = {
    id: string;
    label: string;
    subLabel?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    autoComplete?: string;
};

export default function PasswordInput({
    id,
    label,
    subLabel,
    value,
    onChange,
    placeholder,
    required,
    disabled,
    autoComplete,
}: PasswordInputProps) {
    return (
        <div className="mb-2">
            <label htmlFor={id} className={styles.formLabel}>
                {label}
            </label>
            {subLabel ? <small className={styles.formSubLabel}>{subLabel}</small> : null}
            <input
                id={id}
                type="password"
                className={styles.input}
                value={value}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                autoComplete={autoComplete}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}
