import { useState, useEffect, useRef, FormEvent } from 'react';
import { Eye, EyeOff, Check, ArrowLeft, ArrowRight, User, Lock, Briefcase, Mail, MessageCircle, RefreshCw, CheckCircle, ShieldCheck } from 'lucide-react';
import { JoblyLogo } from '../../components/JoblyLogo';

type City = { id: number; name: string; name_ar?: string | null };
type ProfessionSuggestion = { label: string; category: string };
type FieldErrors = Record<string, string>;
type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1 as Step, label: 'Identité',       icon: User },
  { id: 2 as Step, label: 'Activité',       icon: Briefcase },
  { id: 3 as Step, label: 'Sécurité',       icon: Lock },
  { id: 4 as Step, label: 'Vérification',   icon: ShieldCheck },
];

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
  const [step, setStep]           = useState<Step>(1);
  const [form, setForm]           = useState({
    name: '', email: '', password: '', password_confirmation: '',
    phone: '', profession: '', main_city: '',
  });
  const [showPwd, setShowPwd]         = useState(false);
  const [loading, setLoading]         = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess]         = useState(false);
  const [emailTaken, setEmailTaken]   = useState(false);
  const [cities, setCities]           = useState<City[]>([]);

  // Autocomplete métier
  const [suggestions, setSuggestions]   = useState<ProfessionSuggestion[]>([]);
  const [showSug, setShowSug]           = useState(false);
  const sugRef                          = useRef<HTMLDivElement>(null);

  // Vérification email / WhatsApp
  const [userId, setUserId]             = useState<number | null>(null);
  const [verifyMethod, setVerifyMethod] = useState<'email' | 'whatsapp'>('email');
  const [codeSent, setCodeSent]         = useState(false);
  const [codePreview, setCodePreview]   = useState('');
  const [code, setCode]                 = useState('');
  const [verifying, setVerifying]       = useState(false);
  const [sending, setSending]           = useState(false);
  const [countdown, setCountdown]       = useState(0);

  useEffect(() => {
    fetch('/api/cities')
      .then((r) => r.ok ? r.json() : [])
      .then((data: City[]) => setCities(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Fermer dropdown si clic hors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sugRef.current && !sugRef.current.contains(e.target as Node)) setShowSug(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
      if (!form.name.trim())  errs.name  = 'Nom requis.';
      if (!form.email.trim()) errs.email = 'Email requis.';
      if (form.phone && !/^\+?[0-9\s]{8,15}$/.test(form.phone)) errs.phone = 'Numéro invalide (ex: +212 6XX XXX XXX).';
    }
    if (s === 2) {
      if (!form.profession.trim()) errs.profession = 'Métier requis.';
      if (!form.main_city)         errs.main_city  = 'Ville requise.';
    }
    if (s === 3) {
      if (form.password.length < 8) errs.password = 'Minimum 8 caractères.';
      if (form.password !== form.password_confirmation) errs.password_confirmation = 'Les mots de passe ne correspondent pas.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep((step + 1) as Step); };
  const prev = () => setStep((step - 1) as Step);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setGlobalError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/pro/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('pro_token', data.token);
        localStorage.setItem('auth_role', 'professional');
        setUserId(data.user.id);
        setStep(4);
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

  const handleSendCode = async () => {
    if (!userId || countdown > 0) return;
    setSending(true);
    setGlobalError('');
    try {
      const res  = await fetch('/api/verify/send-code', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ user_id: userId, method: verifyMethod }),
      });
      const data = await res.json();
      if (!res.ok) { setGlobalError(translateError(data.message || '')); return; }
      setCodeSent(true);
      setCodePreview(data.preview || '');
      setCountdown(60);
    } catch {
      setGlobalError('Erreur réseau. Réessayez.');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId || code.length !== 6) return;
    setVerifying(true);
    setGlobalError('');
    try {
      const res  = await fetch('/api/verify/check-code', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ user_id: userId, code }),
      });
      const data = await res.json();
      if (!res.ok) { setGlobalError(translateError(data.message || '')); return; }
      setSuccess(true);
    } catch {
      setGlobalError('Erreur réseau. Réessayez.');
    } finally {
      setVerifying(false);
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
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Demande envoyée !</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Notre équipe examine votre profil sous <strong>24 à 48h</strong>. Vous recevrez un email de confirmation dès validation.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-left space-y-2">
              {[
                "Profil examiné par l'équipe",
                'Email de confirmation envoyé',
                "Accès à l'espace professionnel",
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="h-5 w-5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
            <a href="/pro/login"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
              Retour à la connexion
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
            Rejoignez des milliers de professionnels.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Créez votre profil en 2 minutes et commencez à recevoir des contacts qualifiés directement sur WhatsApp ou par téléphone.
          </p>
          <ul className="space-y-3">
            {[
              'Profil public visible par tous les clients',
              'Contacts directs WhatsApp & appel',
              'Statistiques de visibilité en temps réel',
              'Validation rapide sous 24-48h',
            ].map((item) => (
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
              {step === 1 && 'Vos coordonnées'}
              {step === 2 && 'Votre activité'}
              {step === 3 && 'Mot de passe'}
              {step === 4 && 'Vérification'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {step === 1 && 'Comment vous identifier sur la plateforme'}
              {step === 2 && 'Votre métier et zone d\'intervention'}
              {step === 3 && 'Sécurisez votre compte'}
              {step === 4 && 'Confirmez votre identité'}
            </p>
          </div>

          {globalError && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {globalError}
            </div>
          )}
          {emailTaken && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              Cet email est déjà enregistré.{' '}
              <a href="/pro/login" className="font-bold underline hover:text-amber-900">Se connecter →</a>
            </div>
          )}

          <form onSubmit={step === 3 ? handleSubmit : step === 4 ? handleVerify : (e) => { e.preventDefault(); next(); }} className="space-y-4">

            {/* ── Step 1 ── */}
            {step === 1 && <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nom complet <span className="text-red-400">*</span>
                </label>
                <input type="text" required value={form.name} onChange={set('name')}
                  placeholder="Mohammed Alaoui" autoFocus className={inp('name')} />
                <Err f="name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Adresse email <span className="text-red-400">*</span>
                </label>
                <input type="email" required value={form.email} onChange={set('email')}
                  placeholder="pro@exemple.ma" className={inp('email')} />
                <Err f="email" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Téléphone <span className="text-red-400">*</span>
                </label>
                <input type="tel" required value={form.phone} onChange={set('phone')}
                  placeholder="+212 6XX XXX XXX" className={inp('phone')} />
                <Err f="phone" />
              </div>
            </>}

            {/* ── Step 2 ── */}
            {step === 2 && <>
              <div ref={sugRef} className="relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Métier / Profession <span className="text-red-400">*</span>
                </label>
                <input type="text" required value={form.profession} onChange={set('profession')}
                  onFocus={() => suggestions.length > 0 && setShowSug(true)}
                  placeholder="Ex : Plombier, Électricien, Menuisier..." autoFocus className={inp('profession')} />
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ville principale <span className="text-red-400">*</span>
                </label>
                <select required value={form.main_city} onChange={set('main_city')} className={inp('main_city')}>
                  <option value="">Sélectionner une ville</option>
                  {cities.map((c) => <option key={c.id} value={c.name}>{c.name}{c.name_ar ? ` — ${c.name_ar}` : ''}</option>)}
                </select>
                <Err f="main_city" />
              </div>
            </>}

            {/* ── Step 3 ── */}
            {step === 3 && <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mot de passe <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} required minLength={8} autoFocus
                    value={form.password} onChange={set('password')}
                    placeholder="Minimum 8 caractères" className={inp('password') + ' pr-11'} />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Err f="password" />
                {/* strength hint */}
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
                  Confirmer le mot de passe <span className="text-red-400">*</span>
                </label>
                <input type="password" required value={form.password_confirmation}
                  onChange={set('password_confirmation')}
                  placeholder="••••••••" className={inp('password_confirmation')} />
                <Err f="password_confirmation" />
              </div>
            </>}

            {/* ── Step 4 — Vérification ── */}
            {step === 4 && (
              <div className="space-y-4">
                {!codeSent && (
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setVerifyMethod('email')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                        verifyMethod === 'email'
                          ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-orange-300'
                      }`}>
                      <Mail className="h-5 w-5 text-orange-500" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Par email</span>
                    </button>
                    <button type="button" onClick={() => setVerifyMethod('whatsapp')}
                      disabled={!form.phone}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                        !form.phone
                          ? 'border-slate-100 bg-slate-50 dark:bg-slate-800/50 opacity-50 cursor-not-allowed'
                          : verifyMethod === 'whatsapp'
                            ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-green-300'
                      }`}>
                      <MessageCircle className="h-5 w-5 text-green-500" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">WhatsApp</span>
                    </button>
                  </div>
                )}
                {codeSent && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-sm text-green-700 dark:text-green-400">
                    ✅ Code envoyé à <strong>{codePreview}</strong> — valable 10 min
                  </div>
                )}
                {codeSent && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Code à 6 chiffres</label>
                      <input
                        value={code}
                        onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setGlobalError(''); }}
                        placeholder="• • • • • •"
                        maxLength={6}
                        autoFocus
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-4 text-center text-2xl font-mono tracking-[10px] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                    <div className="text-center">
                      {countdown > 0
                        ? <p className="text-xs text-slate-400">Renvoyer dans {countdown}s</p>
                        : <button type="button" onClick={handleSendCode} disabled={sending}
                            className="text-xs text-orange-500 hover:underline flex items-center gap-1 mx-auto">
                            <RefreshCw className="h-3 w-3" /> Renvoyer le code
                          </button>}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-3 pt-1">
              {step > 1 && step < 4 && (
                <button type="button" onClick={prev}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Retour
                </button>
              )}
              {step < 3 && (
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 active:scale-[.98] transition-all shadow-lg shadow-orange-500/20">
                  <ArrowRight className="h-4 w-4" /> Continuer
                </button>
              )}
              {step === 3 && (
                <button type="submit" disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 active:scale-[.98] disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20">
                  {loading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Création…</> : <><Check className="h-4 w-4" /> Créer mon compte</>}
                </button>
              )}
              {step === 4 && !codeSent && (
                <button type="button" onClick={handleSendCode} disabled={sending}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20">
                  {sending ? <><RefreshCw className="h-4 w-4 animate-spin" /> Envoi…</> : verifyMethod === 'whatsapp' ? <><MessageCircle className="h-4 w-4" /> Envoyer via WhatsApp</> : <><Mail className="h-4 w-4" /> Envoyer par email</>}
                </button>
              )}
              {step === 4 && codeSent && (
                <button type="submit" disabled={verifying || code.length !== 6}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20">
                  {verifying ? <><RefreshCw className="h-4 w-4 animate-spin" /> Vérification…</> : <><CheckCircle className="h-4 w-4" /> Valider</>}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Déjà un compte ?{' '}
            <a href="/pro/login" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">Se connecter</a>
          </p>

          <p className="text-center text-xs text-slate-400">
            <a href="/" className="hover:text-orange-500 transition-colors">← Retour à l'accueil</a>
          </p>
        </div>
      </div>
    </div>
  );
}
