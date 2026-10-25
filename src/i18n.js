import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// UI language. English is the default and lives in the code itself: every
// string is written in English and used as its own translation key, e.g.
// t("Log out"). Other languages map those English strings to their own
// text in src/locales/<code>.json; a string missing there falls back to
// the English. Only English ships in the main bundle -- a language file is
// fetched the first time someone switches to it.

export const LANGUAGES = [
  { code: "en", label: "English", locale: undefined },
  { code: "hi", label: "हिन्दी", locale: "hi-IN" },
];

const STORAGE_KEY = "pc_lang";

const LOADERS = {
  hi: () => import("./locales/hi.json"),
};

// Marks an English string that is translated later, at render time (e.g.
// in a module-level array). Returns it unchanged; check-translations
// looks for it so these strings are covered too.
export const msg = (text) => text;

function readStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.some((l) => l.code === stored) ? stored : "en";
  } catch {
    return "en";
  }
}

i18n.use(initReactI18next).init({
  lng: "en",
  resources: { en: { translation: {} } },
  fallbackLng: false,
  // Keys are English sentences, which contain "." and ":".
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false }, // React already escapes
  returnEmptyString: false,
});

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export async function setLanguage(code) {
  if (!LANGUAGES.some((l) => l.code === code)) code = "en";
  if (LOADERS[code] && !i18n.hasResourceBundle(code, "translation")) {
    const mod = await LOADERS[code]();
    i18n.addResourceBundle(code, "translation", mod.default);
  }
  await i18n.changeLanguage(code);
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Private browsing / blocked storage -- language just won't persist.
  }
}

// Locale for Intl date/number formatting. undefined keeps the browser's
// own default, which is what the English UI has always used.
export function currentLocale() {
  return LANGUAGES.find((l) => l.code === i18n.language)?.locale;
}

// Restores the saved language before the first render, so a Hindi reader
// doesn't see an English flash. Falls back to English if the file fails.
export function initLanguage() {
  const stored = readStoredLanguage();
  return stored === "en" ? Promise.resolve() : setLanguage(stored).catch(() => {});
}

export default i18n;
