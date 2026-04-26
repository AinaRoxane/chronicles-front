"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

type AvailabilityStatus = "idle" | "checking" | "available" | "taken" | "error";

type Step1FormatErrors = {
    email: string | null;
    username: string | null;
    usertag: string | null;
    password: string | null;
};

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

    const step1FormatErrors = useMemo<Step1FormatErrors>(() => {
        const emailValue = email.trim();
        const usernameValue = username.trim();
        const usertagValue = usertag.trim();
        const passwordValue = password.trim();

        const emailError =
            emailValue.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
                ? t("Invalid email format.")
                : null;

        const usernameError =
            usernameValue.length > 0 &&
                (usernameValue.length < 3 ||
                    usernameValue.length > 30 ||
                    !/^[A-Za-z0-9_]+( [A-Za-z0-9_]+)*$/.test(usernameValue))
                ? t("Invalid username format.")
                : null;

        const usertagError =
            usertagValue.length > 0 && !/^[A-Za-z0-9._-]{3,30}$/.test(usertagValue)
                ? t("Invalid usertag format.")
                : null;

        const passwordError =
            passwordValue.length > 0 && passwordValue.length < 6
                ? t("Invalid password format.")
                : null;

        return {
            email: emailError,
            username: usernameError,
            usertag: usertagError,
            password: passwordError,
        };
    }, [email, password, t, usertag, username]);

    const hasStep1FormatErrors =
        step1FormatErrors.email !== null ||
        step1FormatErrors.username !== null ||
        step1FormatErrors.usertag !== null ||
        step1FormatErrors.password !== null;

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
        ])
            .then(([countryRes, languageRes, roleRes]) => {
                setCountries(countryRes.data.data);
                setLanguages(languageRes.data.data);
                setRoles(roleRes.data.data);

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
                setErrorMessage(t("Unable to load countries, languages, or roles."));
            })
            .finally(() => {
                setLoadingLists(false);
            });

        genderService
            .getAll()
            .then((genderRes) => {
                setGenders(genderRes.data.data);
            })
            .catch(() => {
                setGenders([]);
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
        const emailValue = email.trim();

        if (!emailValue) {
            setEmailStatus("idle");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            setEmailStatus("idle");
            return;
        }

        setEmailStatus("checking");
        const timer = window.setTimeout(() => {
            availabilityService
                .checkEmail(emailValue)
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
        const usertagValue = usertag.trim();

        if (!usertagValue) {
            setUsertagStatus("idle");
            return;
        }

        if (!/^[A-Za-z0-9._-]{3,30}$/.test(usertagValue)) {
            setUsertagStatus("idle");
            return;
        }

        setUsertagStatus("checking");
        const timer = window.setTimeout(() => {
            availabilityService
                .checkUsertag(usertagValue)
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
            setErrorMessage(t("Password confirmation does not match."));
            return;
        }

        if (emailStatus === "taken") {
            setErrorMessage(t("Email is already used"));
            return;
        }

        if (usertagStatus === "taken") {
            setErrorMessage(t("Usertag is already used"));
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
            setErrorMessage(t("Signup failed. Please verify your information."));
        } finally {
            setSubmitting(false);
        }
    }

    function resolveRoleLabel(code: string): string {
        if (code === "MDG_ADMIN") {
            return t("Admin");
        }

        if (code === "AUTHOR" || code === "MDG_AUTHOR") {
            return t("Author");
        }

        if (code === "READER" || code === "MDG_USER") {
            return t("Reader");
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

    function availabilityText(status: AvailabilityStatus, type: "email" | "usertag"): string {
        if (status === "checking") {
            return t("Checking availability...");
        }

        if (status === "available") {
            return type === "email" ? t("Email is available") : t("Usertag is available");
        }

        if (status === "taken") {
            return type === "email" ? t("Email is already used") : t("Usertag is already used");
        }

        if (status === "error") {
            return t("Availability check failed");
        }

        return type === "email"
            ? t("Email availability will be checked")
            : t("Usertag availability will be checked");
    }

    function availabilityClass(status: AvailabilityStatus): string {
        if (status === "available") {
            return "text-success";
        }

        if (status === "taken" || status === "error") {
            return "text-danger";
        }

        return "text-body-secondary";
    }

    function goToStep2() {
        if (hasStep1FormatErrors) {
            setErrorMessage(t("Please fix format errors before continuing."));
            return;
        }

        setErrorMessage(null);
        setStep(2);
    }

    return (
        <main className="container py-4 min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow-sm border-0" style={{ width: "100%", maxWidth: "980px" }}>
                <div className="card-body p-3 p-md-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
                        <div>
                            <h1 className="h4 mb-1">{t("Create your account")}</h1>
                            <p className="text-body-secondary mb-0">
                                {step === 1 ? t("Step 1 of 2: main information") : t("Step 2 of 2: optional profile")}
                            </p>
                        </div>
                        <Link href="/auth/login" className="link-secondary">
                            {t("I already have an account")}
                        </Link>
                    </div>

                    {errorMessage ? <p className="text-danger small mb-3">{errorMessage}</p> : null}

                    {step === 1 ? (
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="signin-email" className="form-label fw-semibold">
                                    {t("Email")}
                                </label>
                                <div className="form-text mt-0 mb-2">{t("Email format: name@example.com")}</div>
                                <p className={`small mt-2 mb-0 ${availabilityClass(emailStatus)}`}>
                                    {availabilityText(emailStatus, "email")}
                                </p>
                                <input
                                    id="signin-email"
                                    type="email"
                                    className={`form-control${email.trim() && step1FormatErrors.email ? " is-invalid" : ""}`}
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                                {email.trim() && step1FormatErrors.email ? (
                                    <div className="invalid-feedback d-block">{step1FormatErrors.email}</div>
                                ) : null}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="signin-username" className="form-label fw-semibold">
                                    {t("Username")}
                                </label>
                                <div className="form-text mt-0 mb-2">
                                    {t("Username format: 3-30 letters, numbers, underscore, with single spaces")}
                                </div>
                                <input
                                    id="signin-username"
                                    type="text"
                                    className={`form-control${username.trim() && step1FormatErrors.username ? " is-invalid" : ""}`}
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    required
                                />
                                {username.trim() && step1FormatErrors.username ? (
                                    <div className="invalid-feedback d-block">{step1FormatErrors.username}</div>
                                ) : null}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="signin-usertag" className="form-label fw-semibold">
                                    {t("Usertag")}
                                </label>
                                <div className="form-text mt-0 mb-2">{t("Usertag format: 3-30 letters, numbers, dot, underscore, or hyphen")}</div>
                                <p className={`small mt-2 mb-0 ${availabilityClass(usertagStatus)}`}>
                                    {availabilityText(usertagStatus, "usertag")}
                                </p>
                                <input
                                    id="signin-usertag"
                                    type="text"
                                    className={`form-control${usertag.trim() && step1FormatErrors.usertag ? " is-invalid" : ""}`}
                                    value={usertag}
                                    onChange={(event) => setUsertag(event.target.value)}
                                    required
                                />
                                {usertag.trim() && step1FormatErrors.usertag ? (
                                    <div className="invalid-feedback d-block">{step1FormatErrors.usertag}</div>
                                ) : null}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="signin-password" className="form-label fw-semibold">
                                    {t("Signup password label")}
                                </label>
                                <div className="form-text mt-0 mb-2">{t("Password format: at least 6 characters")}</div>
                                <input
                                    id="signin-password"
                                    type="password"
                                    className={`form-control${password.trim() && step1FormatErrors.password ? " is-invalid" : ""}`}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                                {password.trim() && step1FormatErrors.password ? (
                                    <div className="invalid-feedback d-block">{step1FormatErrors.password}</div>
                                ) : null}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="signin-country" className="form-label fw-semibold">
                                    {t("Country")}
                                </label>
                                <select
                                    id="signin-country"
                                    className="form-select"
                                    value={countryIsoCode}
                                    onChange={(event) => setCountryIsoCode(event.target.value)}
                                    disabled={loadingLists}
                                    required
                                >
                                    {countryOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">{t("Role (single choice)")}</label>
                                <div className="border rounded p-2">
                                    {roles.map((role) => (
                                        <div className="form-check" key={role.code}>
                                            <input
                                                id={`signin-role-${role.code}`}
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={userRoleCode === role.code}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setUserRoleCode(role.code);
                                                    }
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor={`signin-role-${role.code}`}>
                                                {resolveRoleLabel(role.code)}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="signin-language" className="form-label fw-semibold">
                                    {t("Preferred language")}
                                </label>
                                <select
                                    id="signin-language"
                                    className="form-select"
                                    value={userPreferedLanguageCode}
                                    onChange={(event) => setUserPreferedLanguageCode(event.target.value)}
                                    disabled={loadingLists}
                                    required
                                >
                                    {languageOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 d-flex justify-content-end mt-2">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={
                                        !isStep1Valid ||
                                        loadingLists ||
                                        hasStep1FormatErrors ||
                                        emailStatus === "taken" ||
                                        usertagStatus === "taken"
                                    }
                                    onClick={goToStep2}
                                >
                                    {t("Next")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="signin-bio" className="form-label fw-semibold">
                                    {t("Bio")}
                                </label>
                                <textarea
                                    id="signin-bio"
                                    className="form-control"
                                    value={bio}
                                    onChange={(event) => setBio(event.target.value)}
                                    placeholder={t("Tell us a bit about yourself")}
                                    rows={4}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="signin-gender" className="form-label fw-semibold">
                                    {t("Gender")}
                                </label>
                                <select
                                    id="signin-gender"
                                    className="form-select"
                                    value={gender}
                                    onChange={(event) => setGender(event.target.value)}
                                >
                                    <option value="">{t("Not specified")}</option>
                                    {genderOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="signin-birthyear" className="form-label fw-semibold">
                                    {t("Birth year")}
                                </label>
                                <input
                                    id="signin-birthyear"
                                    type="number"
                                    className="form-control"
                                    value={birthYear}
                                    onChange={(event) => setBirthYear(event.target.value)}
                                    min={1900}
                                    max={2100}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="signin-avatar-url" className="form-label fw-semibold">
                                    {t("Profile picture")}
                                </label>
                                <input
                                    id="signin-avatar-url"
                                    type="url"
                                    className="form-control mb-2"
                                    value={avatarUrl}
                                    onChange={(event) => setAvatarUrl(event.target.value)}
                                    placeholder="https://example.com/avatar.jpg"
                                />
                                <input
                                    id="signin-avatar-name"
                                    type="text"
                                    className="form-control"
                                    value={avatarName}
                                    onChange={(event) => setAvatarName(event.target.value)}
                                    placeholder={t("Import image")}
                                />
                                <div className="form-text">
                                    {t("Drag and drop an image here or import it.")}
                                </div>
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={t("Avatar preview")}
                                        className="img-thumbnail mt-2"
                                        style={{ width: "112px", height: "112px", objectFit: "cover" }}
                                    />
                                ) : null}
                            </div>
                            <div className="col-12 d-flex flex-wrap gap-2 justify-content-end mt-2">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(1)}>
                                    {t("Previous")}
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => openConfirmModal(false)}>
                                    {t("Sign up")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {confirmPasswordOpen ? (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center p-3"
                    style={{ zIndex: 1200 }}
                >
                    <div className="card shadow-sm border-0" style={{ width: "100%", maxWidth: "460px" }}>
                        <div className="card-body">
                            <h2 className="h5 mb-2">{t("Password confirmation")}</h2>
                            <p className="text-body-secondary mb-3">
                                {t("Enter your password again to confirm registration.")}
                            </p>

                            <form onSubmit={submitSignup}>
                                <div className="mb-3">
                                    <label htmlFor="signin-confirm-password" className="form-label fw-semibold">
                                        {t("Confirm password")}
                                    </label>
                                    <input
                                        id="signin-confirm-password"
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        required
                                    />
                                </div>

                                {errorMessage ? <p className="text-danger small mb-3">{errorMessage}</p> : null}

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            setConfirmPasswordOpen(false);
                                            setErrorMessage(null);
                                        }}
                                    >
                                        {t("Cancel")}
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? t("Creating account...") : t("Confirm and create account")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
}
