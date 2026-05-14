import { useLanguage } from '../contexts/LanguageContext';

const langs = [
  { code: 'fr',  label: 'FR',       title: 'Français'  },
  { code: 'ar',  label: 'عربي',     title: 'العربية'   },
  { code: 'dz',  label: 'الدارجة',  title: 'الدارجة المغربية' },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {langs.map((l) => (
          <button
            key={l.code}
            onClick={() => setLanguage(l.code)}
            title={l.title}
            className={`rounded-md px-2 py-1 text-xs font-bold transition-all ${
              language === l.code
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          title={l.title}
          className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
            language === l.code
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
