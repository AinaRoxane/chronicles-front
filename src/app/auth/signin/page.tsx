"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCardShell from "@/components/auth/AuthCardShell";
import PasswordConfirmModal from "@/components/auth/PasswordConfirmModal";
import AvatarUploadBox from "@/components/forms/AvatarUploadBox";
import AvailabilityIndicator, {
    AvailabilityStatus,
} from "@/components/forms/AvailabilityIndicator";
import PasswordInput from "@/components/forms/PasswordInput";
import SelectInput from "@/components/forms/SelectInput";
import TextAreaInput from "@/components/forms/TextAreaInput";
import TextInput from "@/components/forms/TextInput";
import {
    availabilityService,
} from "@/services/auth/availability.service";
import { genderService, Gender } from "@/services/auth/gender.service";
import { setAuth } from "@/store/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import { countryService, Country } from "@/services/country/country.service";
import { Language, languageService } from "@/services/lang/language.service";
import { signupService } from "@/services/auth/signup.service";
import { UserRole, userRoleService } from "@/services/auth/user-role.service";
import {
    useLanguage,
    usePageTranslation,
} from "@/components/providers/LanguageProvider";
import styles from "../auth.module.css";

export default function SigninPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [usertag, setUsertag] = useState("");
    const [password, setPassword] = useState("");
    const [countryIsoCode, setCountryIsoCode] = useState("MG");
    const [userRoleCode, setUserRoleCode] = useState("");
    const [userPreferedLanguageCode, setUserPreferedLanguageCode] = useState("EN");

    const [bio, setBio] = useState("");
    const [gender, setGender] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarName, setAvatarName] = useState("");

    const [countries, setCountries] = useState<Country[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [roles, setRoles] = useState<UserRole[]>([]);
    const [genders, setGenders] = useState<Gender[]>([]);
    const [translatedGenderLabels, setTranslatedGenderLabels] = useState<Record<string, string>>({});
    const [loadingLists, setLoadingLists] = useState(true);
    const [emailStatus, setEmailStatus] = useState<AvailabilityStatus>("idle");
    const [usertagStatus, setUsertagStatus] = useState<AvailabilityStatus>("idle");

    const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const router = useRouter();
    const t = usePageTranslation("auth_pages");
    const { activeLanguage } = useLanguage();

    const isStep1Valid = useMemo(() => {
        return (
            email.trim().length > 0 &&
            username.trim().length > 0 &&
            usertag.trim().length > 0 &&
            password.trim().length >= 6 &&
            countryIsoCode.trim().length > 0 &&
            userRoleCode.trim().length > 0 &&
            userPreferedLanguageCode.trim().length > 0
        );
    }, [
        countryIsoCode,
        email,
        password,
        userPreferedLanguageCode,
        userRoleCode,
        username,
        usertag,
    ]);

    useEffect(() => {
        Promise.all([
            countryService.getAll(),
            languageService.getAll(),
            userRoleService.getAll(),
            genderService.getAll(),
        ])
            .then(([countryRes, languageRes, roleRes, genderRes]) => {
                setCountries(countryRes.data.data);
                setLanguages(languageRes.data.data);
                setRoles(roleRes.data.data);
                setGenders(genderRes.data.data);

                if (countryRes.data.data.length > 0) {
                    setCountryIsoCode((prev) => prev || countryRes.data.data[0].isoCode);
                }

                if (languageRes.data.data.length > 0) {
                    setUserPreferedLanguageCode((prev) => prev || languageRes.data.data[0].code.toUpperCase());
                }

                if (roleRes.data.data.length > 0) {
                    setUserRoleCode((prev) => prev || roleRes.data.data[0].code);
                }
            })
            .catch(() => {
                setErrorMessage(t("#020error01"));
            })
            .finally(() => {
                setLoadingLists(false);
            });
    }, [t]);

    useEffect(() => {
        genderService
            .getTranslations(activeLanguage)
            .then((response) => {
                const translations = response.data.data.reduce<Record<string, string>>(
                    (acc, item) => {
                        acc[item.genderCode] = item.translatedName;
                        return acc;
                    },
                    {}
                );
                setTranslatedGenderLabels(translations);
            })
            .catch(() => {
                setTranslatedGenderLabels({});
            });
    }, [activeLanguage]);

    useEffect(() => {
        if (!email.trim()) {
            setEmailStatus("idle");
            return;
        }

        setEmailStatus("checking");
        const timer = window.setTimeout(() => {
            availabilityService
                .checkEmail(email.trim())
                .then((response) => {
                    setEmailStatus(response.data.data.exists ? "taken" : "available");
                })
                .catch(() => {
                    setEmailStatus("error");
                });
        }, 450);

        return () => {
            window.clearTimeout(timer);
        };
    }, [email]);

    useEffect(() => {
        if (!usertag.trim()) {
            setUsertagStatus("idle");
            return;
        }

        setUsertagStatus("checking");
        const timer = window.setTimeout(() => {
            availabilityService
                .checkUsertag(usertag.trim())
                .then((response) => {
                    setUsertagStatus(response.data.data.exists ? "taken" : "available");
                })
                .catch(() => {
                    setUsertagStatus("error");
                });
        }, 450);

        return () => {
            window.clearTimeout(timer);
        };
    }, [usertag]);

    function openConfirmModal(skipOptional: boolean) {
        if (skipOptional) {
            setBio("");
            setGender("");
            setBirthYear("");
            setAvatarUrl("");
            setAvatarName("");
        }

        setConfirmPassword("");
        setConfirmPasswordOpen(true);
        setErrorMessage(null);
    }

    async function submitSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (confirmPassword !== password) {
            setErrorMessage(t("#030error01"));
            return;
        }

        if (emailStatus === "taken") {
            setErrorMessage(t("#020status04"));
            return;
        }

        if (usertagStatus === "taken") {
            setErrorMessage(t("#020status07"));
            return;
        }

        setSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await signupService.signup({
                email,
                username,
                usertag,
                password,
                countryIsoCode,
                userRoleCode,
                userPreferedLanguageCode,
                bio: bio.trim() ? bio.trim() : null,
                gender: gender.trim() ? gender : null,
                birthYear: birthYear.trim() ? Number(birthYear) : null,
                avatarUrl: avatarUrl.trim() ? avatarUrl : null,
            });

            const user = response.data.data;
            dispatch(
                setAuth({
                    token: user.jwt,
                    user,
                })
            );

            router.push("/home");
        } catch {
            setErrorMessage(t("#030error02"));
        } finally {
            setSubmitting(false);
        }
    }

    function resolveRoleLabel(code: string): string {
        if (code === "MDG_ADMIN") {
            return t("#020role01");
        }

        if (code === "AUTHOR" || code === "MDG_AUTHOR") {
            return t("#020role02");
        }

        if (code === "READER" || code === "MDG_USER") {
            return t("#020role03");
        }

        return code;
    }

    const countryOptions = countries.map((country) => ({
        value: country.isoCode,
        label: `${country.name} (${country.isoCode})`,
    }));

    const languageOptions = languages.map((language) => ({
        value: language.code.toUpperCase(),
        label: `${language.name} (${language.code.toUpperCase()})`,
    }));

    const genderOptions = genders.map((item) => ({
        value: item.code,
        label: translatedGenderLabels[item.code] || item.name,
    }));

    return (
        <AuthCardShell>
            {step === 1 ? (
                <div className="row g-0">
                    <div className={`col-md-6 ${styles.splitPanel} shell-divider-right p-2`}>
                        <div className="p-2">
                            <p className="mb-1 fw-semibold">{t("#020title01")}</p>
                            <p className={styles.formSubLabel}>{t("#020body01")}</p>
                            <Link href="/auth/login" className={styles.linkText}>
                                {t("#020link01")}
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-6 p-3">
                        <TextInput
                            id="signin-email"
                            type="email"
                            label={t("#020label01")}
                            value={email}
                            onChange={setEmail}
                            required
                        />
                        <AvailabilityIndicator
                            status={emailStatus}
                            idleText={t("#020status01")}
                            checkingText={t("#020status02")}
                            availableText={t("#020status03")}
                            takenText={t("#020status04")}
                            errorText={t("#020status05")}
                        />

                        <TextInput
                            id="signin-username"
                            label={t("#020label02")}
                            value={username}
                            onChange={setUsername}
                            required
                        />

                        <TextInput
                            id="signin-usertag"
                            label={t("#020label03")}
                            value={usertag}
                            onChange={setUsertag}
                            required
                        />
                        <AvailabilityIndicator
                            status={usertagStatus}
                            idleText={t("#020status06")}
                            checkingText={t("#020status02")}
                            availableText={t("#020status08")}
                            takenText={t("#020status07")}
                            errorText={t("#020status05")}
                        />

                        <PasswordInput
                            id="signin-password"
                            label={t("#020label04")}
                            value={password}
                            onChange={setPassword}
                            required
                        />

                        <SelectInput
                            id="signin-country"
                            label={t("#020label05")}
                            value={countryIsoCode}
                            onChange={setCountryIsoCode}
                            options={countryOptions}
                            disabled={loadingLists}
                            required
                        />

                        <div className="mb-2">
                            <label className={styles.formLabel}>{t("#020label06")}</label>
                            <div className="d-grid gap-2">
                                {roles.map((role) => (
                                    <label key={role.code} className={`${styles.roleChoice} d-flex align-items-center gap-2`}>
                                        <input
                                            type="checkbox"
                                            checked={userRoleCode === role.code}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    setUserRoleCode(role.code);
                                                }
                                            }}
                                        />
                                        <span>{resolveRoleLabel(role.code)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <SelectInput
                            id="signin-language"
                            label={t("#020label07")}
                            value={userPreferedLanguageCode}
                            onChange={setUserPreferedLanguageCode}
                            options={languageOptions}
                            disabled={loadingLists}
                            required
                        />

                        <button
                            type="button"
                            className={styles.primaryBtn}
                            disabled={!isStep1Valid || loadingLists || emailStatus === "taken" || usertagStatus === "taken"}
                            onClick={() => setStep(2)}
                        >
                            {t("#020cta01")}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="row g-0">
                    <div className={`col-md-6 ${styles.splitPanel} shell-divider-right p-3`}>
                        <TextAreaInput
                            id="signin-bio"
                            label={t("#030label01")}
                            value={bio}
                            onChange={setBio}
                            placeholder={t("#030placeholder01")}
                        />

                        <SelectInput
                            id="signin-gender"
                            label={t("#030label02")}
                            value={gender}
                            onChange={setGender}
                            options={genderOptions}
                            placeholder={t("#030placeholder02")}
                        />

                        <TextInput
                            id="signin-birthyear"
                            type="number"
                            label={t("#030label03")}
                            value={birthYear}
                            onChange={setBirthYear}
                            min={1900}
                            max={2100}
                        />
                    </div>

                    <div className="col-md-6 p-3">
                        <AvatarUploadBox
                            label={t("#030label04")}
                            emptyText={t("#030body01")}
                            buttonText={t("#030cta01")}
                            previewAlt={t("#030aria01")}
                            avatarUrl={avatarUrl}
                            avatarName={avatarName}
                            onAvatarChange={({ avatarUrl: nextAvatarUrl, avatarName: nextAvatarName }) => {
                                setAvatarUrl(nextAvatarUrl);
                                setAvatarName(nextAvatarName);
                            }}
                        />
                    </div>

                    <div className="col-12 d-flex gap-2 justify-content-end p-3 shell-divider-top">
                        <button type="button" className={styles.secondaryBtn} onClick={() => setStep(1)}>
                            {t("#030cta02")}
                        </button>
                        <button type="button" className={styles.secondaryBtn} onClick={() => openConfirmModal(true)}>
                            {t("#030cta03")}
                        </button>
                        <button type="button" className={styles.primaryBtn} onClick={() => openConfirmModal(false)}>
                            {t("#030cta04")}
                        </button>
                    </div>
                </div>
            )}
            <PasswordConfirmModal
                open={confirmPasswordOpen}
                title={t("#040title01")}
                body={t("#040body01")}
                confirmPassword={confirmPassword}
                confirmLabel={t("#040label01")}
                cancelText={t("#040cta01")}
                submitText={t("#040cta02")}
                submittingText={t("#040status01")}
                submitting={submitting}
                errorMessage={errorMessage}
                onConfirmPasswordChange={setConfirmPassword}
                onClose={() => {
                    setConfirmPasswordOpen(false);
                    setErrorMessage(null);
                }}
                onSubmit={submitSignup}
            />
        </AuthCardShell>
    );
}
