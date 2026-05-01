import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import i18n from '../i18n';

type Language = 'fr' | 'ar' | 'en';

type LanguageContextValue = {
  language: Language;
  rtl: boolean;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const stored = typeof window !== 'undefined' ? (localStorage.getItem('jobly_lang') as Language | null) : null;
  const [language, setLanguageState] = useState<Language>(stored ?? (document.documentElement.lang as Language) ?? 'fr');

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('jobly_lang', language);
  }, [language]);


  const value = useMemo(() => ({
    language,
    rtl: language === 'ar',
    setLanguage: (lang: string) => setLanguageState((['fr', 'ar', 'en'].includes(lang) ? lang : 'fr') as Language),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
