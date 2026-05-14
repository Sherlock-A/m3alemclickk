import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import i18n from '../i18n';

type Language = 'fr' | 'ar' | 'en';

type LanguageContextValue = {
  language: Language;
  rtl: boolean;
  setLanguage: (lang: string) => void;
};

const VALID: Language[] = ['fr', 'ar', 'en'];

function detectInitialLang(): Language {
  // 1. User already chose
  const stored = typeof window !== 'undefined' ? localStorage.getItem('jobly_lang') : null;
  if (stored && VALID.includes(stored as Language)) return stored as Language;

  // 2. HTML lang attr (set by server)
  const htmlLang = typeof document !== 'undefined' ? document.documentElement.lang : '';
  if (htmlLang && VALID.includes(htmlLang as Language)) return htmlLang as Language;

  // 3. Browser preference — Arabic speakers → Arabic interface
  if (typeof navigator !== 'undefined') {
    const pref = navigator.language?.toLowerCase() ?? '';
    if (pref.startsWith('ar')) return 'ar';
  }

  return 'fr';
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLang);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('jobly_lang', language);
  }, [language]);

  useEffect(() => {
    const isRtl = language === 'ar';
    document.documentElement.dir  = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.style.fontFamily = isRtl
      ? '"Cairo", "Noto Sans Arabic", system-ui, sans-serif'
      : '';
  }, [language]);

  const value = useMemo(() => ({
    language,
    rtl: language === 'ar',
    setLanguage: (lang: string) =>
      setLanguageState((VALID.includes(lang as Language) ? lang : 'fr') as Language),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
