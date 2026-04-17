import fs from "node:fs";
import path from "node:path";

const LOCALES = ["en", "fr", "mg"];
const baseDir = path.resolve(process.cwd(), "public", "i18n");

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function assert(condition, errors, message) {
    if (!condition) {
        errors.push(message);
    }
}

function rowLabel(section, componentId) {
    return `${section} -> ${componentId}`;
}

const payloads = Object.fromEntries(
    LOCALES.map((locale) => {
        const filePath = path.join(baseDir, `${locale}.json`);
        return [locale, readJson(filePath)];
    })
);

const errors = [];
const baseLocale = LOCALES[0];
const basePayload = payloads[baseLocale];

const baseSections = Object.keys(basePayload);

for (const locale of LOCALES.slice(1)) {
    const sections = Object.keys(payloads[locale]);

    const missingSections = baseSections.filter((section) => !sections.includes(section));
    const extraSections = sections.filter((section) => !baseSections.includes(section));

    if (missingSections.length > 0) {
        errors.push(`[${locale}] missing sections: ${missingSections.join(", ")}`);
    }

    if (extraSections.length > 0) {
        errors.push(`[${locale}] extra sections: ${extraSections.join(", ")}`);
    }
}

for (const section of baseSections) {
    const baseRows = basePayload[section];

    assert(Array.isArray(baseRows), errors, `[${baseLocale}] ${section} must be an array`);
    if (!Array.isArray(baseRows)) {
        continue;
    }

    const baseComponentMap = new Map();
    const baseKeyMap = new Map();

    for (const row of baseRows) {
        assert(typeof row.component_id === "string", errors, `[${baseLocale}] ${section} row missing component_id`);
        assert(typeof row.translation === "string", errors, `[${baseLocale}] ${section} ${row.component_id || "<unknown>"} missing translation`);

        if (typeof row.component_id === "string") {
            if (baseComponentMap.has(row.component_id)) {
                errors.push(`[${baseLocale}] duplicate component_id in ${section}: ${row.component_id}`);
            }
            baseComponentMap.set(row.component_id, row);
        }

        if (typeof row.key === "string") {
            if (baseKeyMap.has(row.key)) {
                errors.push(`[${baseLocale}] duplicate key in ${section}: ${row.key}`);
            }
            baseKeyMap.set(row.key, row.component_id);
        }
    }

    for (const locale of LOCALES.slice(1)) {
        const rows = payloads[locale][section];
        assert(Array.isArray(rows), errors, `[${locale}] ${section} must be an array`);

        if (!Array.isArray(rows)) {
            continue;
        }

        const componentMap = new Map();
        const keyMap = new Map();

        for (const row of rows) {
            assert(typeof row.component_id === "string", errors, `[${locale}] ${section} row missing component_id`);
            assert(typeof row.translation === "string", errors, `[${locale}] ${section} ${row.component_id || "<unknown>"} missing translation`);

            if (typeof row.component_id === "string") {
                if (componentMap.has(row.component_id)) {
                    errors.push(`[${locale}] duplicate component_id in ${section}: ${row.component_id}`);
                }
                componentMap.set(row.component_id, row);
            }

            if (typeof row.key === "string") {
                if (keyMap.has(row.key)) {
                    errors.push(`[${locale}] duplicate key in ${section}: ${row.key}`);
                }
                keyMap.set(row.key, row.component_id);
            }
        }

        const baseComponentIds = [...baseComponentMap.keys()];
        const localeComponentIds = [...componentMap.keys()];

        const missingComponentIds = baseComponentIds.filter((id) => !componentMap.has(id));
        const extraComponentIds = localeComponentIds.filter((id) => !baseComponentMap.has(id));

        if (missingComponentIds.length > 0) {
            errors.push(`[${locale}] ${section} missing component_ids: ${missingComponentIds.join(", ")}`);
        }

        if (extraComponentIds.length > 0) {
            errors.push(`[${locale}] ${section} extra component_ids: ${extraComponentIds.join(", ")}`);
        }

        for (const componentId of baseComponentIds) {
            const baseRow = baseComponentMap.get(componentId);
            const localeRow = componentMap.get(componentId);

            if (!baseRow || !localeRow) {
                continue;
            }

            const baseHasKey = typeof baseRow.key === "string";
            const localeHasKey = typeof localeRow.key === "string";

            if (baseHasKey !== localeHasKey) {
                errors.push(
                    `[${locale}] key mismatch for ${rowLabel(section, componentId)}: expected key presence = ${baseHasKey}`
                );
            }

            if (baseHasKey && localeHasKey && baseRow.key !== localeRow.key) {
                errors.push(
                    `[${locale}] key value mismatch for ${rowLabel(section, componentId)}: expected \"${baseRow.key}\" got \"${localeRow.key}\"`
                );
            }
        }

        for (const [key, componentId] of baseKeyMap.entries()) {
            const mapped = keyMap.get(key);
            if (mapped !== componentId) {
                errors.push(
                    `[${locale}] key mapping mismatch in ${section}: key \"${key}\" should map to ${componentId}${mapped ? ` but maps to ${mapped}` : ""}`
                );
            }
        }
    }
}

if (errors.length > 0) {
    console.error("i18n coherence check failed:\n");
    for (const issue of errors) {
        console.error(`- ${issue}`);
    }
    process.exit(1);
}

console.log("i18n coherence check passed for locales:", LOCALES.join(", "));
