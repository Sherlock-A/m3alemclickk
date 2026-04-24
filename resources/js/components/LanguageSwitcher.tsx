import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const langs = [
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'EN' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <Globe className="h-4 w-4" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border-none bg-transparent text-sm focus:ring-0"
      >
        {langs.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
