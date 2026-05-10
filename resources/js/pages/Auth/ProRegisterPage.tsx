import { useState, useEffect, useRef, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Check, ArrowLeft, ArrowRight, User, Lock, Briefcase, RefreshCw } from 'lucide-react';
import { JoblyLogo } from '../../components/JoblyLogo';

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

type City = { id: number; name: string; name_ar?: string | null };
type Category = { id: number; name: string; icon: string; slug: string };
type ProfessionSuggestion = { label: string; category: string };
type FieldErrors = Record<string, string>;
type Step = 1 | 2 | 3;

function translateError(msg: string): string {
  if (!msg) return "Une erreur est survenue.";
  const m = msg.toLowerCase();
  if (m.includes('too many') || m.includes('throttle') || m.includes('many attempts'))
    return "Trop de tentatives. Attendez 1 minute avant de réessayer.";
  if (m.includes('unique') || m.includes('already') || m.includes('taken'))
    return "Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.";
  if (m.includes('password') && m.includes('confirm'))
    return "Les mots de passe ne correspondent pas.";
  if (m.includes('min') && m.includes('8'))
    return "Le mot de passe doit contenir au moins 8 caractères.";
  return msg;
}

export default function ProRegisterPage() {
  const { t } = useTranslation();

  const STEPS = [
    { id: 1 as Step, label: t('reg_step_identity'), icon: User },
    { id: 2 as Step, label: t('reg_step_activity'), icon: Briefcase },
    { id: 3 as Step, label: t('reg_step_security'), icon: Lock },
  ];

  const [step, setStep]           = useState<Step>(1);
  const [form, setForm]           = useState({
    name: '', email: '', password: '', password_confirmation: '',
    phone: '', profession: '', main_city: '',
  });
  const [showPwd, setShowPwd]         = useState(false);
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [globalError, setGlobalError]     = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess]         = useState(false);
  const [emailTaken, setEmailTaken]       = useState(false);
  const [cities, setCities]               = useState<City[]>([]);
  const [categories, setCategories]       = useState<Category[]>([]);
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);

  // Autocomplete métier
  const [suggestions, setSuggestions]   = useState<ProfessionSuggestion[]>([]);
  const [showSug, setShowSug]           = useState(false);
  const sugRef                          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/cities')
      .then((r) => r.ok ? r.json() : [])
      .then((data: City[]) => setCities(data))
      .catch(() => {});
    fetch('/api/categories')
      .then((r) => r.ok ? r.json() : [])
      .then((data: Category[]) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sugRef.current && !sugRef.current.contains(e.target as Node)) setShowSug(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setGlobalError('');
    try {
      const res  = await fetch('/api/auth/google?role=professional', { headers: { Accept: 'application/json' } });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setGlobalError('Impossible d\'initialiser Google.');
    } catch {
      setGlobalError('Erreur réseau.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setForm({ ...form, [k]: val });
    if (fieldErrors[k]) setFieldErrors(prev => { const n = { ...prev }; delete n[k]; return n; });
    if (k === 'email') setEmailTaken(false);
    setGlobalError('');
    if (k === 'profession' && val.length >= 2) {
      fetch(`/api/professions/autocomplete?q=${encodeURIComponent(val)}`)
        .then(r => r.ok ? r.json() : [])
        .then((d: ProfessionSuggestion[]) => { setSuggestions(d); setShowSug(d.length > 0); })
        .catch(() => {});
    } else if (k === 'profession') {
      setSuggestions([]); setShowSug(false);
    }
  };

  const pickSuggestion = (label: string) => {
    setForm(f => ({ ...f, profession: label }));
    setSuggestions([]); setShowSug(false);
    if (fieldErrors.profession) setFieldErrors(prev => { const n = { ...prev }; delete n.profession; return n; });
  };

  const validateStep = (s: Step): boolean => {
    const errs: FieldErrors = {};
    if (s === 1) {
      if (!form.name.trim())  errs.name  = t('reg_name_required');
      if (!form.email.trim()) errs.email = t('reg_email_required');
      if (form.phone && !/^\+?[0-9\s]{8,15}$/.test(form.phone)) errs.phone = t('reg_phone_invalid');
    }
    if (s === 2) {
      if (!form.profession.trim())    errs.profession  = t('reg_profession_required');
      if (!form.main_city)            errs.main_city   = t('reg_city_required');
      if (selectedCatIds.length === 0) errs.category_ids = t('reg_cat_required');
    }
    if (s === 3) {
      if (form.password.length < 8) errs.password = t('reg_pwd_min_err');
      if (form.password !== form.password_confirmation) errs.password_confirmation = t('reg_pwd_no_match');
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep((step + 1) as Step); };
  const prev = () => setStep((step - 1) as Step);

  const toggleCategory = (id: number) => {
    setSelectedCatIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
    if (fieldErrors.category_ids) setFieldErrors(p => { const n = { ...p }; delete n.category_ids; return n; });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setGlobalError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/pro/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, category_ids: selectedCatIds }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('pro_token', data.token);
        localStorage.setItem('auth_role', 'professional');
        setSuccess(true);
        return;
      }
      if (res.status === 429) {
        setGlobalError(translateError('too many attempts'));
        return;
      }
      if (res.status === 422 && data.errors) {
        const errors: FieldErrors = {};
        for (const [field, messages] of Object.entries(data.errors as Record<string, string[]>)) {
          errors[field] = Array.isArray(messages) ? messages[0] : String(messages);
        }
        setFieldErrors(errors);
        if (errors.email?.toLowerCase().match(/unique|pris|taken/)) setEmailTaken(true);
        if (errors.name || errors.email || errors.phone) setStep(1);
        else if (errors.profession || errors.main_city) setStep(2);
        return;
      }
      setGlobalError(translateError(data.message || "Erreur lors de l'inscription."));
    } catch {
      setGlobalError('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const inp = (field: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
      fieldErrors[field]
        ? 'border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900'
        : 'border-slate-200 dark:border-slate-700 focus:border-orange-400 focus:ring-orange-100 dark:focus:ring-orange-900'
    }`;

  const Err = ({ f }: { f: string }) =>
    fieldErrors[f] ? <p className="mt-1.5 text-xs text-red-500">{fieldErrors[f]}</p> : null;

  /* ── Success ─────────────────────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-2/5 bg-slate-950" />
        <div className="flex-1 flex items-center justify-center px-6 bg-white dark:bg-slate-900">
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Check className="h-10 w-10 text-green-500" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('reg_success_title')}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {t('reg_success_desc')}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-left space-y-2">
              {[t('reg_success_step1'), t('reg_success_step2'), t('reg_success_step3')].map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="h-5 w-5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
            <a href="/pro/login"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
              {t('back_to_login')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-slate-950 flex-col justify-between p-12">
        <a href="/">
          <JoblyLogo size="md" theme="dark" />
        </a>
        <div className="space-y-5">
          <div className="h-1 w-12 bg-orange-500 rounded-full" />
          <h2 className="text-3xl font-black text-white leading-tight">
            {t('reg_join_title')}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t('reg_join_desc')}
          </p>
          <ul className="space-y-3">
            {[t('reg_benefit_1'), t('reg_benefit_2'), t('reg_benefit_3'), t('reg_benefit_4')].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="h-5 w-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Jobly</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-sm space-y-7">

          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <a href="/">
              <JoblyLogo size="md" />
            </a>
          </div>

          {/* Google — uniquement visible à l'étape 1 */}
          {step === 1 && (
            <>
              <button type="button" onClick={handleGoogle} disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 transition-colors disabled:opacity-60">
                {googleLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                {googleLoading ? t('reg_redirecting') : t('reg_google')}
              </button>
              <p className="text-xs text-center text-slate-400 -mt-1">
                {t('reg_google_note')}
              </p>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">{t('reg_or_form')}</span>
                </div>
              </div>
            </>
          )}

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map(({ id, label }, idx) => (
              <div key={id} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-1.5 ${step >= id ? 'text-orange-500' : 'text-slate-300 dark:text-slate-600'}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > id  ? 'bg-orange-500 text-white'
                    : step === id ? 'bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-900/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  }`}>
                    {step > id ? <Check className="h-3.5 w-3.5" /> : id}
                  </div>
                  <span className="hidden sm:block text-xs font-medium">{label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-px transition-colors ${step > id ? 'bg-orange-400' : 'bg-slate-100 dark:bg-slate-800'}`} />
                )}
              </div>
            ))}
          </div>

          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {step === 1 && t('reg_your_info')}
              {step === 2 && t('reg_your_activity')}
              {step === 3 && t('reg_secure')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {step === 1 && t('reg_your_info_sub')}
              {step === 2 && t('reg_your_activity_sub')}
              {step === 3 && t('reg_secure_sub')}
            </p>
          </div>

          {globalError && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {globalError}
            </div>
          )}
          {emailTaken && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              {t('reg_email_taken')}{' '}
              <a href="/pro/login" className="font-bold underline hover:text-amber-900">{t('login')} →</a>
            </div>
          )}

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); next(); }} className="space-y-4">

            {/* ── Step 1 ── */}
            {step === 1 && <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('name')} <span className="text-red-400">*</span>
                </label>
                <input type="text" required value={form.name} onChange={set('name')}
                  placeholder="Mohammed Alaoui" autoFocus className={inp('name')} />
                <Err f="name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('email')} <span className="text-red-400">*</span>
                </label>
                <input type="email" required value={form.email} onChange={set('email')}
                  placeholder="pro@exemple.ma" className={inp('email')} />
                <Err f="email" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('phone')} <span className="text-red-400">*</span>
                </label>
                <input type="tel" required value={form.phone} onChange={set('phone')}
                  placeholder="+212 6XX XXX XXX" className={inp('phone')} />
                <Err f="phone" />
              </div>
            </>}

            {/* ── Step 2 ── */}
            {step === 2 && <>
              {/* Catégories — multi-select (max 3) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('categories')} <span className="text-red-400">*</span>
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    ({selectedCatIds.length}/3 {t('reg_categories_chosen')})
                  </span>
                </label>
                <p className="text-xs text-slate-400 mb-2">{t('reg_cat_desc')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map(cat => {
                    const selected = selectedCatIds.includes(cat.id);
                    const maxReached = selectedCatIds.length >= 3 && !selected;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        disabled={maxReached}
                        onClick={() => toggleCategory(cat.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left
                          ${selected
                            ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                            : maxReached
                              ? 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
                          }`}
                      >
                        <span className="text-lg leading-none">{cat.icon}</span>
                        <span className="truncate">{cat.name}</span>
                        {selected && <span className="ml-auto text-orange-500 shrink-0">✓</span>}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.category_ids && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.category_ids}</p>
                )}
              </div>

              {/* Métier libre */}
              <div ref={sugRef} className="relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('reg_profession_title')} <span className="text-red-400">*</span>
                </label>
                <input type="text" required value={form.profession} onChange={set('profession')}
                  onFocus={() => suggestions.length > 0 && setShowSug(true)}
                  placeholder={t('reg_profession_placeholder')} className={inp('profession')} />
                <Err f="profession" />
                {showSug && suggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    {suggestions.map((s, i) => (
                      <button key={i} type="button" onMouseDown={() => pickSuggestion(s.label)}
                        className="w-full text-left px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors">
                        <span className="text-sm font-medium text-slate-800 dark:text-white">{s.label}</span>
                        <span className="text-xs text-slate-400 shrink-0">{s.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ville */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('reg_main_city')} <span className="text-red-400">*</span>
                </label>
                <select required value={form.main_city} onChange={set('main_city')} className={inp('main_city')}>
                  <option value="">{t('reg_select_city')}</option>
                  {cities.map((c) => <option key={c.id} value={c.name}>{c.name}{c.name_ar ? ` — ${c.name_ar}` : ''}</option>)}
                </select>
                <Err f="main_city" />
              </div>
            </>}

            {/* ── Step 3 ── */}
            {step === 3 && <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('password')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} required minLength={8} autoFocus
                    value={form.password} onChange={set('password')}
                    placeholder={t('reg_pwd_placeholder')} className={inp('password') + ' pr-11'} />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Err f="password" />
                {form.password && (
                  <div className="mt-2 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        form.password.length >= [4,6,8,12][i]
                          ? ['bg-red-400','bg-orange-400','bg-yellow-400','bg-green-400'][i]
                          : 'bg-slate-100 dark:bg-slate-700'
                      }`} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('confirm_password')} <span className="text-red-400">*</span>
                </label>
                <input type="password" required value={form.password_confirmation}
                  onChange={set('password_confirmation')}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    fieldErrors.password_confirmation
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                      : form.password_confirmation && form.password === form.password_confirmation
                      ? 'border-green-400 focus:border-green-400 focus:ring-green-100'
                      : form.password_confirmation && form.password !== form.password_confirmation
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                      : 'border-slate-200 dark:border-slate-700 focus:border-orange-400 focus:ring-orange-100 dark:focus:ring-orange-900'
                  }`} />
                <Err f="password_confirmation" />
                {!fieldErrors.password_confirmation && form.password_confirmation && form.password === form.password_confirmation && (
                  <p className="text-xs text-green-600 mt-1">{t('reg_pwd_match')}</p>
                )}
                {!fieldErrors.password_confirmation && form.password_confirmation && form.password !== form.password_confirmation && (
                  <p className="text-xs text-red-500 mt-1">{t('reg_pwd_no_match')}</p>
                )}
              </div>
            </>}

            {/* Navigation */}
            <div className="flex items-center gap-3 pt-1">
              {step > 1 && (
                <button type="button" onClick={prev}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> {t('reg_back')}
                </button>
              )}
              {step < 3 && (
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 active:scale-[.98] transition-all shadow-lg shadow-orange-500/20">
                  <ArrowRight className="h-4 w-4" /> {t('reg_continue')}
                </button>
              )}
              {step === 3 && (
                <button type="submit" disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 active:scale-[.98] disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20">
                  {loading ? <><RefreshCw className="h-4 w-4 animate-spin" /> {t('reg_creating')}</> : <><Check className="h-4 w-4" /> {t('reg_create')}</>}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t('reg_already_account')}{' '}
            <a href="/pro/login" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">{t('login')}</a>
          </p>

          <p className="text-center text-xs text-slate-400">
            <a href="/" className="hover:text-orange-500 transition-colors">{t('reg_back_home')}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
