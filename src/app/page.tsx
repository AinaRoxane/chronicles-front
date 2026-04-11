"use client";

import { languageService, Language } from "@/services/lang/language.service";
import { useEffect, useState } from "react";

export default function LanguagesPage() {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        languageService.getAll()
            .then((res) => {
                console.log("Fetched languages:", res);
                setLanguages(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Erreur lors du chargement des langues");
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <main style={{ padding: 24 }}>
            <h1>Liste des langues</h1>
            <ul>
                {languages.map((lang) => (
                    <li key={lang.id}>
                        <strong>{lang.name}</strong> ({lang.code})
                    </li>
                ))}
            </ul>
        </main>
    );
}
