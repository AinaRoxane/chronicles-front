import { ChangeEvent, DragEvent, useRef } from "react";
import styles from "@/app/auth/auth.module.css";

type AvatarUploadBoxProps = {
    label: string;
    emptyText: string;
    buttonText: string;
    previewAlt: string;
    avatarUrl: string;
    avatarName: string;
    onAvatarChange: (payload: { avatarUrl: string; avatarName: string }) => void;
};

export default function AvatarUploadBox({
    label,
    emptyText,
    buttonText,
    previewAlt,
    avatarUrl,
    avatarName,
    onAvatarChange,
}: AvatarUploadBoxProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            readAvatarFile(file);
        }
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            readAvatarFile(file);
        }
    }

    function readAvatarFile(file: File) {
        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === "string" ? reader.result : "";
            onAvatarChange({
                avatarUrl: result,
                avatarName: file.name,
            });
        };
        reader.readAsDataURL(file);
    }

    return (
        <div>
            <p className="mb-2 fw-semibold">{label}</p>
            <div
                className={styles.avatarDrop}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
            >
                <div>
                    {avatarUrl ? (
                        <>
                            <img src={avatarUrl} alt={previewAlt} className={styles.avatarPreview} />
                            <p className="mt-2 mb-1">{avatarName}</p>
                        </>
                    ) : (
                        <p className="mb-2">{emptyText}</p>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
