import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { JoblyLogo } from '../../components/JoblyLogo';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ProLoginPage() {
  const { t } = useTranslation();
  const { rtl } = useLanguage();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [adminNotice, setAdminNotice] = useState(false);

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.email) { window.location.href = '/pro/forgot-password'; return; }
    const res = await fetch('/api/admin/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: form.email }),
    }).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      if (data.is_admin) { setAdminNotice(true); return; }
    }
    window.location.href = '/pro/forgot-password';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const proRes  = await fetch('/api/pro/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const proData = await proRes.json();
      if (proRes.ok) {
        localStorage.setItem('pro_token', proData.token);
        window.location.href = '/dashboard/professional';
        return;
      }
      if (proRes.status === 403) { setError(proData.message || 'Accès refusé.'); return; }

      const adminRes  = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const adminData = await adminRes.json();
      if (adminRes.ok) {
        localStorage.setItem('jobly_token', adminData.token);
        window.location.href = '/dashboard/admin';
        return;
      }
      setError(t('pro_login_wrong_creds'));
    } catch {
      setError(t('pro_login_network_err'));
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: t('pro_login_stat_active'),   value: '500+' },
    { label: t('pro_login_stat_cities'),   value: '20+' },
    { label: t('pro_login_stat_contacts'), value: '1000+' },
    { label: t('pro_login_stat_rating'),   value: '4.8★' },
  ];

  /* ── Admin notice screen ─────────────────────────────────────────────────── */
  if (adminNotice) {
    return (
      <div className="min-h-screen flex" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />
        </div>
        <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
          <div className="w-full max-w-sm">
            <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 flex items-center justify-center">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="px-8 py-7 text-center space-y-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{t('pro_admin_account')}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('pro_admin_reset_sent')}</p>
                <button onClick={() => setAdminNotice(false)}
                  className="text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors">
                  {t('pro_admin_back')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex" dir={rtl ? 'rtl' : 'ltr'}>

      {/* ── Left brand panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-orange-400/5 blur-2xl" />

        <div className="relative z-10">
          <a href="/"><JoblyLogo size="lg" theme="dark" /></a>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-black text-white leading-tight">{t('pro_login_manage')}</h2>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">{t('pro_login_desc')}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => (
              <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-orange-400">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
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

            {/* Card header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
              <h1 className="text-xl font-black text-white">{t('pro_login_page_title')}</h1>
              <p className="text-orange-100 text-sm mt-1">{t('pro_login_page_sub')}</p>
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
                    {t('pro_login_email_label')}
                  </label>
                  <input type="email" required autoComplete="email"
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setError(''); }}
                    placeholder="pro@exemple.ma" dir="ltr"
                    className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pro_login_pwd_label')}</label>
                    <a href="#" onClick={handleForgotPassword}
                      className="text-xs text-orange-500 hover:text-orange-600 hover:underline font-medium">
                      {t('pro_login_forgot_link')}
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
                  {loading ? t('pro_login_loading') : t('pro_login_btn')}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              {/* Links */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-center text-sm text-slate-500">
                <p>
                  {t('pro_login_no_account_text')}{' '}
                  <a href="/pro/register" className="font-bold text-orange-500 hover:text-orange-600 hover:underline">
                    {t('pro_login_create_account')}
                  </a>
                </p>
                <p>
                  <a href="/" className="text-xs text-slate-400 dark:text-slate-600 hover:text-orange-500 transition-colors">
                    {t('pro_login_back_home')}
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
