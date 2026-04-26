"use client";

import SectionPage from "@/components/layout/SectionPage";
import { useLanguage, usePageTranslation } from "@/components/providers/LanguageProvider";
import { Language, languageService } from "@/services/lang/language.service";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);
    const { activeLanguage, setActiveLanguage } = useLanguage();
    const t = usePageTranslation("settings_page");

    useEffect(() => {
        languageService
            .getAll()
            .then((response) => {
                setLanguages(response.data.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <SectionPage>
            <div className="row ">
                <div className="col-1"></div>
                <section className="col-10 border rounded justify-content-center p-3">
                    <h1 className="h5 shell-divider-bottom pb-3">{t("Settings")}</h1>
                    {/* system language selector */}
                    <div className="row ">
                        <div className="col-7">
                            <p className="mb-2">{t("Default system language")}</p>
                        </div>
                        <div className="col-5">
                            <select
                                id="system-language"
                                className="form-select"
                                value={activeLanguage}
                                onChange={(event) => setActiveLanguage(event.target.value)}
                                disabled={loading}
                            >
                                {loading ? (
                                    <option>{t("Loading languages...")}</option>
                                ) : (
                                    <>
                                        {languages.length === 0 ? (
                                            <option value="">{t("Choose a language")}</option>
                                        ) : null}
                                        {languages.map((lang) => (
                                            <option key={lang.id} value={lang.code.toUpperCase()}>
                                                {lang.name} ({lang.code.toUpperCase()})
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                </section>
                <div className="col-1"></div>
            </div>
        </SectionPage>
    );
}