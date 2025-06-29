"use client";
import { createContext, useContext, useEffect, useState } from "react";
import en from "./en/translation.json";
import id from "./id/translation.json";

type TTranslation = typeof en | typeof id;
export type TLanguage = "en" | "id";

type LanguageContextType = {
  lang: TTranslation;
  language: TLanguage;
  setLanguage: (lang: TLanguage) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLang] = useState<TLanguage>("en");
  const [translation, setTranslation] = useState<TTranslation>(en);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as TLanguage | null;

    if (saved === "id" || saved === "en") {
      setLang(saved);
      setTranslation(saved === "id" ? id : en);
    } else {
      localStorage.setItem("lang", "en"); // buat default jika belum ada
      setLang("en");
      setTranslation(en);
    }
  }, []);

  useEffect(() => {
    document.cookie = `lang=${language}; path=/`;
    localStorage.setItem("lang", language);
    setTranslation(language === "id" ? id : en);
  }, [language]);

  const setLanguage = (lang: TLanguage) => {
    setLang(lang);
  };

  return (
    <LanguageContext.Provider
      value={{ lang: translation, language, setLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }

  return context;
};
