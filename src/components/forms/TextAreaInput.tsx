import styles from "@/app/auth/auth.module.css";

type TextAreaInputProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
};

export default function TextAreaInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
}: TextAreaInputProps) {
    return (
        <div className="mb-2">
            <label htmlFor={id} className={styles.formLabel}>
                {label}
            </label>
            <textarea
                id={id}
                className={styles.input}
                value={value}
                rows={rows}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}
