import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { JoblyLogo } from '../../components/JoblyLogo';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, Star, Users, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

type Props = { error?: string };

export default function UnifiedLoginPage({ error: pageError }: Props) {
  const { t } = useTranslation();
  const { rtl } = useLanguage();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(pageError ?? '');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'google_failed') {
      setErrorMsg(t('login_google_failed'));
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.message ?? t('login_wrong_creds')); return; }
      try {
        localStorage.setItem('auth_role', data.role);
        const key = data.role === 'admin' ? 'jobly_token' : data.role === 'professional' ? 'pro_token' : 'client_token';
        localStorage.setItem(key, data.token);
      } catch {}
      window.location.href = data.dashboard;
    } catch { setErrorMsg(t('contact_network_error')); }
    finally { setLoading(false); }
  }

  async function handleGoogle() {
    setGoogleLoading(true); setErrorMsg('');
    try {
      const res  = await fetch('/api/auth/google', { credentials: 'include', headers: { Accept: 'application/json' } });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setErrorMsg(t('login_google_failed')); setGoogleLoading(false); }
    } catch { setErrorMsg(t('contact_network_error')); setGoogleLoading(false); }
  }

  const stats = [
    { icon: Users,      value: '500+',  label: t('professionals_registered') },
    { icon: MapPin,     value: '20+',   label: t('cities_covered') },
    { icon: Star,       value: '4.8',   label: t('rating') },
    { icon: ShieldCheck,value: '100%',  label: t('trust_verified_label') },
  ];

  return (
    <>
      <Head>
        <title>{t('login')} — Jobly</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen flex" dir={rtl ? 'rtl' : 'ltr'}>

        {/* ── Left brand panel (desktop only) ─────────────────────────────── */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-orange-400/5 blur-2xl" />

          {/* Logo */}
          <div className="relative z-10">
            <a href="/">
              <JoblyLogo size="lg" theme="dark" />
            </a>
          </div>

          {/* Center content */}
          <div className="relative z-10 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white leading-tight">
                {t('hero')}
              </h2>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                {t('hero_p')}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                  <Icon className="h-5 w-5 text-orange-400 mb-2" />
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5">
              <ShieldCheck className="h-4 w-4 text-green-400 shrink-0" />
              <span className="text-xs text-green-300">{t('verif_title')}</span>
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10">
            <p className="text-xs text-slate-600">{t('footer_copyright')}</p>
          </div>
        </div>

        {/* ── Right form panel ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <a href="/">
              <JoblyLogo size="lg" theme="light" className="dark:hidden" />
              <JoblyLogo size="lg" theme="dark"  className="hidden dark:block" />
            </a>
          </div>

          <div className="w-full max-w-md">
            {/* Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-800 overflow-hidden">

              {/* Card header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                <h1 className="text-xl font-black text-white">{t('welcome')}</h1>
                <p className="text-orange-100 text-sm mt-1">{t('login_subtitle')}</p>
              </div>

              <div className="px-8 py-7 space-y-5">

                {/* Error */}
                {errorMsg && (
                  <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Google */}
                <button
                  type="button" onClick={handleGoogle}
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all disabled:opacity-60"
                >
                  {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                  {t('login_google')}
                </button>

                {/* Divider */}
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <span className="text-xs font-medium text-slate-400 bg-white dark:bg-slate-900 px-2">{t('login_or')}</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('email')}
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email" autoComplete="email" required
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="vous@exemple.ma"
                        className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ps-10 pe-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('password')}</label>
                      <a href="/pro/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 hover:underline font-medium">
                        {t('forgot_password')}
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={showPwd ? 'text' : 'password'} autoComplete="current-password" required
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ps-10 pe-12 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors"
                      />
                      <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                        className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading || googleLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all disabled:opacity-60"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t('login_submit')}
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
                    <a href="/pro/register" className="font-bold text-orange-500 hover:text-orange-600 hover:underline">
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
    </>
  );
}
