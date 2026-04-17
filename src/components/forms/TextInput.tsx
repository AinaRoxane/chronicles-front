import styles from "@/app/auth/auth.module.css";

type TextInputProps = {
    id: string;
    label: string;
    subLabel?: string;
    type?: "text" | "email" | "number";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    autoComplete?: string;
    min?: number;
    max?: number;
};

export default function TextInput({
    id,
    label,
    subLabel,
    type = "text",
    value,
    onChange,
    placeholder,
    required,
    disabled,
    autoComplete,
    min,
    max,
}: TextInputProps) {
    return (
        <div className="mb-2">
            <label htmlFor={id} className={styles.formLabel}>
                {label}
            </label>
            {subLabel ? <small className={styles.formSubLabel}>{subLabel}</small> : null}
            <input
                id={id}
                type={type}
                className={styles.input}
                value={value}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                autoComplete={autoComplete}
                min={min}
                max={max}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}
