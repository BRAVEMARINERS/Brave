import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ar } from "./ar";
import { en } from "./en";

export type Language = "ar" | "en";
export type Translations = typeof ar;

const translations = { ar, en } as const;

interface I18nContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType>({
  lang: "ar",
  t: ar,
  setLang: () => {},
  isRtl: true,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem("brave_lang");
    return (stored === "en" || stored === "ar") ? stored : "ar";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("brave_lang", newLang);
  };

  useEffect(() => {
    const isRtl = lang === "ar";
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nContext.Provider value={{
      lang,
      t: translations[lang] as Translations,
      setLang,
      isRtl: lang === "ar",
    }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useLang() {
  const { lang, setLang, isRtl } = useI18n();
  return { lang, setLang, isRtl };
}
