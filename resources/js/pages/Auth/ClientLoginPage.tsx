import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Check, ArrowRight, Loader2, AlertCircle, Star, Users, MapPin, ShieldCheck } from 'lucide-react';
import { JoblyLogo } from '../../components/JoblyLogo';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ClientLoginPage() {
  const { t } = useTranslation();
  const { rtl } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || t('login_wrong_creds')); return; }
      localStorage.setItem('client_token', data.token);
      localStorage.setItem('auth_role', 'client');
      window.location.href = '/dashboard/client';
    } catch {
      setError(t('contact_network_error'));
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Users,       value: '500+', label: t('professionals_registered') },
    { icon: MapPin,      value: '20+',  label: t('cities_covered') },
    { icon: Star,        value: '4.8',  label: t('rating') },
    { icon: ShieldCheck, value: '100%', label: t('trust_verified_label') },
  ];

  return (
    <div className="min-h-screen flex" dir={rtl ? 'rtl' : 'ltr'}>

      {/* ── Left brand panel (desktop only) ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-orange-400/5 blur-2xl" />

        <div className="relative z-10">
          <a href="/"><JoblyLogo size="lg" theme="dark" /></a>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-black text-white leading-tight">{t('hero')}</h2>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">{t('hero_p')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                <Icon className="h-5 w-5 text-orange-400 mb-2" />
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5">
            <ShieldCheck className="h-4 w-4 text-green-400 shrink-0" />
            <span className="text-xs text-green-300">{t('verif_title')}</span>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Jobly</p>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <a href="/">
            <JoblyLogo size="lg" theme="light" className="dark:hidden" />
            <JoblyLogo size="lg" theme="dark" className="hidden dark:block" />
          </a>
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-800 overflow-hidden">

            {/* Orange gradient header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
              <h1 className="text-xl font-black text-white">{t('welcome')}</h1>
              <p className="text-orange-100 text-sm mt-1">{t('login_subtitle')}</p>
            </div>

            <div className="px-8 py-7 space-y-5">

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('email')}
                  </label>
                  <input type="email" required autoComplete="email"
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setError(''); }}
                    placeholder="vous@exemple.ma" dir="ltr"
                    className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('password')}</label>
                    <a href="/client/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 hover:underline font-medium">
                      {t('forgot_password')}
                    </a>
                  </div>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} required autoComplete="current-password"
                      value={form.password}
                      onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                      placeholder="••••••••"
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 pe-11 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                      className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all disabled:opacity-60">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {loading ? t('login_submit') : t('login_submit')}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              {/* Links */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-center text-sm text-slate-500">
                <p>
                  {t('login_no_account')}{' '}
                  <a href="/client/register" className="font-bold text-orange-500 hover:text-orange-600 hover:underline">
                    {t('register')}
                  </a>
                </p>
                <p>
                  {t('login_are_pro')}{' '}
                  <a href="/pro/login" className="font-bold text-orange-500 hover:text-orange-600 hover:underline">
                    {t('pro_register')}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-600 leading-relaxed px-4">
            {t('login_google_note')}
          </p>
        </div>
      </div>
    </div>
  );
}
