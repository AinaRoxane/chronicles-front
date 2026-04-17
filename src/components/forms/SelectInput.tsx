import styles from "@/app/auth/auth.module.css";

type SelectOption = {
    value: string;
    label: string;
};

type SelectInputProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    subLabel?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
};

export default function SelectInput({
    id,
    label,
    value,
    onChange,
    options,
    subLabel,
    disabled,
    required,
    placeholder,
}: SelectInputProps) {
    return (
        <div className="mb-2">
            <label htmlFor={id} className={styles.formLabel}>
                {label}
            </label>
            {subLabel ? <small className={styles.formSubLabel}>{subLabel}</small> : null}
            <select
                id={id}
                className={styles.input}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                required={required}
            >
                {placeholder ? <option value="">{placeholder}</option> : null}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
