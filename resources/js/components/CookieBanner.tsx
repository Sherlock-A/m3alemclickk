import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useCookieConsent, ConsentPrefs } from '../contexts/CookieConsentContext';
import { Cookie, ChevronDown, ChevronUp, ShieldCheck, TrendingUp, Target } from 'lucide-react';

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 ${
        on
          ? 'border-orange-500 bg-orange-500'
          : 'border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700'
      }`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
        on ? 'translate-x-3.5' : 'translate-x-0.5'
      }`} />
    </button>
  );
}

export function CookieBanner() {
  const { t }                                              = useTranslation();
  const { rtl }                                            = useLanguage();
  const { consented, prefs, grantAll, denyAll, savePrefs } = useCookieConsent();
  const [expanded, setExpanded]                            = useState(false);
  const [local, setLocal]                                  = useState<ConsentPrefs>(prefs);

  if (consented) return null;

  const categories: Array<{
    key:    'analytics' | 'marketing';
    icon:   typeof TrendingUp;
    color:  string;
    always: false;
    title:  string;
    desc:   string;
  } | {
    key:    'essential';
    icon:   typeof ShieldCheck;
    color:  string;
    always: true;
    title:  string;
    desc:   string;
  }> = [
    {
      key:   'essential',
      icon:  ShieldCheck,
      color: 'emerald',
      always: true,
      title: t('cookie_cat_essential_title'),
      desc:  t('cookie_cat_essential_desc'),
    },
    {
      key:   'analytics',
      icon:  TrendingUp,
      color: 'orange',
      always: false,
      title: t('cookie_cat_analytics_title'),
      desc:  t('cookie_cat_analytics_desc'),
    },
    {
      key:   'marketing',
      icon:  Target,
      color: 'sky',
      always: false,
      title: t('cookie_cat_marketing_title'),
      desc:  t('cookie_cat_marketing_desc'),
    },
  ];

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 sm:px-5 sm:pb-5 pointer-events-none"
    >
      <div className="mx-auto max-w-3xl pointer-events-auto">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/25 overflow-hidden">

          {/* ── Main row ─────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4">

            {/* Icon + text */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="shrink-0 h-9 w-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Cookie className="h-5 w-5 text-orange-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {t('cookie_title')}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('cookie_desc')}{' '}
                  <button
                    type="button"
                    onClick={() => setExpanded(v => !v)}
                    className="inline-flex items-center gap-0.5 text-orange-500 hover:text-orange-600 font-semibold focus:outline-none"
                  >
                    {t('cookie_customize')}
                    {expanded
                      ? <ChevronUp className="h-3 w-3" />
                      : <ChevronDown className="h-3 w-3" />}
                  </button>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={denyAll}
                className="rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
              >
                {t('cookie_essential')}
              </button>

              {expanded && (
                <button
                  type="button"
                  onClick={() => savePrefs(local)}
                  className="rounded-xl border-2 border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 px-3.5 py-2 text-xs font-semibold text-orange-600 dark:text-orange-300 hover:border-orange-400 transition-all"
                >
                  {t('cookie_save_prefs')}
                </button>
              )}

              <button
                type="button"
                onClick={grantAll}
                className="rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-orange-500/30 hover:bg-orange-600 transition-all"
              >
                {t('cookie_accept_all')}
              </button>
            </div>
          </div>

          {/* ── Expanded categories with toggles ─────────────────────────── */}
          {expanded && (
            <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 grid sm:grid-cols-3 gap-3">
              {categories.map(({ key, icon: Icon, color, always, title, desc }) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Icon className={`h-3.5 w-3.5 text-${color}-500 shrink-0`} />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {title}
                      </span>
                    </div>
                    {always ? (
                      <span className="shrink-0 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-full px-2 py-0.5">
                        {t('cookie_always_on')}
                      </span>
                    ) : (
                      <Toggle
                        on={local[key]}
                        onChange={v => setLocal(p => ({ ...p, [key]: v }))}
                      />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
