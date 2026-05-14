import { useState, useEffect, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, KeyRound, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle, ShieldCheck, Check } from 'lucide-react';
import { JoblyLogo } from '../../components/JoblyLogo';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  role?: 'pro' | 'client';
}

type Step = 'email' | 'code' | 'password';

export default function ForgotPasswordPage({ role = 'pro' }: Props) {
  const { t } = useTranslation();
  const { rtl } = useLanguage();
  const [step, setStep]     = useState<Step>('email');
  const [email, setEmail]   = useState('');
  const [code, setCode]     = useState('');
  const [form, setForm]     = useState({ password: '', password_confirmation: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const apiBase  = role === 'client' ? '/api/client' : '/api/pro';
  const loginUrl = role === 'client' ? '/client/login' : '/pro/login';

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!email || countdown > 0) return;
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${apiBase}/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || t('fp_err_send')); return; }
      setStep('code');
      setCountdown(60);
    } catch {
      setError(t('fp_err_network'));
    } finally {
      setLoading(false);
    }
  };

  const handleCodeNext = (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { setError(t('fp_err_code')); return; }
    setError('');
    setStep('password');
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) { setError(t('fp_err_pwd_match')); return; }
    if (form.password.length < 8) { setError(t('fp_err_pwd_min')); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${apiBase}/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ email, code, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Code invalide ou expiré.');
        if (data.message?.toLowerCase().includes('code')) setStep('code');
        return;
      }
      setSuccess(true);
    } catch {
      setError(t('fp_err_network'));
    } finally {
      setLoading(false);
    }
  };

  const steps: Step[] = ['email', 'code', 'password'];
  const stepIdx = steps.indexOf(step);
  const stepLabels: Record<Step, string> = {
    email:    t('fp_step_email'),
    code:     t('fp_step_code'),
    password: t('fp_step_pwd'),
  };
  const stepTitles: Record<Step, string> = {
    email:    t('fp_forgot_title'),
    code:     t('fp_code_title'),
    password: t('fp_new_pwd_title'),
  };

  const LeftPanel = () => (
    <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-orange-400/5 blur-2xl" />

      <div className="relative z-10">
        <a href="/"><JoblyLogo size="lg" theme="dark" /></a>
      </div>

      <div className="relative z-10 space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white leading-tight">{t('fp_page_title')}</h2>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed">{t('fp_forgot_desc')}</p>
        </div>

        {/* Step progress in left panel */}
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={s} className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
              stepIdx === i ? 'bg-white/10 border border-white/20' : ''
            }`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                stepIdx > i ? 'bg-orange-500 text-white'
                : stepIdx === i ? 'bg-orange-500/30 text-orange-300 ring-2 ring-orange-400/50'
                : 'bg-white/10 text-slate-500'
              }`}>
                {stepIdx > i ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${
                stepIdx === i ? 'text-white' : stepIdx > i ? 'text-slate-400' : 'text-slate-600'
              }`}>{stepLabels[s]}</span>
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
  );

  /* ── Success ─────────────────────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen flex" dir={rtl ? 'rtl' : 'ltr'}>
        <LeftPanel />
        <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
          <div className="w-full max-w-sm">
            <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 flex justify-center">
                <CheckCircle className="h-14 w-14 text-white" />
              </div>
              <div className="px-8 py-7 text-center space-y-4">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('fp_success_title')}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('fp_success_desc')}</p>
                <a href={loginUrl}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
                  {t('fp_login')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main ────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex" dir={rtl ? 'rtl' : 'ltr'}>
      <LeftPanel />

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
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-orange-100/80 text-xs font-medium mb-1">{stepLabels[step]}</p>
                  <h1 className="text-xl font-black text-white">{stepTitles[step]}</h1>
                </div>
                <div className="flex items-center gap-1.5 ps-4 pt-1 shrink-0">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`rounded-full transition-all duration-300 ${
                      stepIdx > i ? 'h-3 w-3 bg-white'
                      : stepIdx === i ? 'h-4 w-4 bg-white ring-4 ring-white/20'
                      : 'h-3 w-3 bg-white/30'
                    }`} />
                  ))}
                </div>
              </div>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${((stepIdx + 1) / 3) * 100}%` }} />
              </div>
            </div>

            <div className="px-8 py-7 space-y-5">

              {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  {error}
                </div>
              )}

              {/* Step 1: Email */}
              {step === 'email' && (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('fp_forgot_desc')}</p>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('fp_email_label')}</label>
                    <input type="email" required autoFocus
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder={role === 'client' ? 'vous@exemple.ma' : 'pro@exemple.ma'}
                      dir="ltr"
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors"
                    />
                  </div>
                  <button type="submit" disabled={loading || !email}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60 transition-all shadow-lg shadow-orange-500/30">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('fp_sending')}</> : <><Mail className="h-4 w-4" /> {t('fp_send_code')}</>}
                  </button>
                </form>
              )}

              {/* Step 2: Code */}
              {step === 'code' && (
                <form onSubmit={handleCodeNext} className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400"
                    dangerouslySetInnerHTML={{ __html: t('fp_code_desc', { email: `<strong>${email}</strong>` }) }}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('fp_code_label')}</label>
                    <input
                      value={code}
                      onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                      placeholder="• • • • • •"
                      maxLength={6} autoFocus dir="ltr"
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 px-4 py-4 text-center text-3xl font-mono tracking-[12px] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors"
                    />
                  </div>
                  <button type="submit" disabled={code.length !== 6}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60 transition-all shadow-lg shadow-orange-500/30">
                    <ShieldCheck className="h-4 w-4" /> {t('fp_validate_code')}
                  </button>
                  <div className="text-center">
                    {countdown > 0
                      ? <p className="text-xs text-slate-400">{t('fp_resend_wait', { n: countdown })}</p>
                      : <button type="button" onClick={() => handleSendCode()} disabled={loading}
                          className="text-xs text-orange-500 hover:text-orange-600 hover:underline flex items-center gap-1 mx-auto font-medium">
                          <Loader2 className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> {t('fp_resend')}
                        </button>
                    }
                  </div>
                </form>
              )}

              {/* Step 3: New password */}
              {step === 'password' && (
                <form onSubmit={handleReset} className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400"
                    dangerouslySetInnerHTML={{ __html: t('fp_new_pwd_desc', { email: `<strong>${email}</strong>` }) }}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('fp_new_pwd_label')}</label>
                    <div className="relative">
                      <input type={showPwd ? 'text' : 'password'} required minLength={8} autoFocus
                        value={form.password}
                        onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                        placeholder={t('fp_pwd_min_hint')}
                        className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 pe-11 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors"
                      />
                      <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                        className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {form.password && (
                      <div className="mt-2 flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                            form.password.length >= [4, 6, 8, 12][i]
                              ? ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'][i]
                              : 'bg-slate-100 dark:bg-slate-700'
                          }`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('fp_confirm_pwd_label')}</label>
                    <input type="password" required
                      value={form.password_confirmation}
                      onChange={e => { setForm({ ...form, password_confirmation: e.target.value }); setError(''); }}
                      placeholder="••••••••"
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors"
                    />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60 transition-all shadow-lg shadow-orange-500/30">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('fp_saving')}</> : <><KeyRound className="h-4 w-4" /> {t('fp_save')}</>}
                  </button>
                </form>
              )}

              <div className="text-center">
                <a href={loginUrl} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-orange-500 transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> {t('fp_back_login')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
