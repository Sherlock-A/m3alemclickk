import { useState, useEffect, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Check, ArrowRight, Loader2, AlertCircle, Star, Users, MapPin, ShieldCheck } from 'lucide-react';
import { JoblyLogo } from '../../components/JoblyLogo';
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

type City = { id: number; name: string; name_ar?: string | null };

const AVATARS = ['👤', '👨', '👩', '🧔', '👱', '👴', '👵', '🧒'];

function translateError(msg: string): string {
  if (!msg) return "Une erreur est survenue.";
  const m = msg.toLowerCase();
  if (m.includes('too many') || m.includes('throttle') || m.includes('many attempts'))
    return "Trop de tentatives. Attendez 1 minute avant de réessayer.";
  if (m.includes('unique') || m.includes('already') || m.includes('pris') || m.includes('taken'))
    return "Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.";
  if (m.includes('password') && m.includes('confirm'))
    return "Les mots de passe ne correspondent pas.";
  if (m.includes('min') && m.includes('8'))
    return "Le mot de passe doit contenir au moins 8 caractères.";
  if (m.includes('required'))
    return "Tous les champs obligatoires doivent être remplis.";
  return msg;
}

export default function ClientRegisterPage() {
  const { t } = useTranslation();
  const { rtl } = useLanguage();
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm]     = useState({
    name: '', email: '', password: '', password_confirmation: '',
    phone: '', city: '',
  });
  const [avatar, setAvatar]   = useState('👤');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    fetch('/api/cities')
      .then(r => r.ok ? r.json() : [])
      .then((d: City[]) => setCities(d))
      .catch(() => {});
  }, []);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/auth/google?role=client', { headers: { Accept: 'application/json' } });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError('Impossible d\'initialiser Google.');
    } catch {
      setError('Erreur réseau.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({ ...form, [k]: e.target.value });
      setError('');
    };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) {
      setError(t('reg_pwd_no_match'));
      return;
    }
    if (form.password.length < 8) {
      setError(t('reg_pwd_min_err'));
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch('/api/client/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ ...form, avatar }),
      });
      const data = await res.json();
      if (!res.ok) {
        const raw = data.errors
          ? Object.values(data.errors as Record<string, string[]>).flat().join(' ')
          : data.message || '';
        setError(translateError(raw));
        return;
      }
      localStorage.setItem('client_token', data.token);
      localStorage.setItem('auth_role', 'client');
      window.location.href = '/dashboard/client';
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  const inp = `w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors`;

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
              <h1 className="text-xl font-black text-white">{t('reg_client_title')}</h1>
              <p className="text-orange-100 text-sm mt-1">{t('reg_client_sub')}</p>
            </div>

            <div className="px-8 py-7 space-y-5">

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Google */}
              <button type="button" onClick={handleGoogle} disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all disabled:opacity-60">
                {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                {googleLoading ? t('reg_redirecting') : t('reg_google')}
              </button>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs font-medium text-slate-400 bg-white dark:bg-slate-900 px-2">{t('login_or')}</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Avatar selector */}
              <div>
                <p className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('reg_choose_avatar') ?? 'Choisissez un avatar'}</p>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map(a => (
                    <button key={a} type="button" onClick={() => setAvatar(a)}
                      className={`text-2xl rounded-xl p-2.5 border-2 transition-all ${
                        avatar === a
                          ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 ring-2 ring-orange-400/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}>{a}</button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('name')} <span className="text-red-400">*</span></label>
                  <input value={form.name} onChange={set('name')} required placeholder="Ahmed El Fassi" autoFocus className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('email')} <span className="text-red-400">*</span></label>
                  <input value={form.email} onChange={set('email')} type="email" required placeholder="ahmed@exemple.ma" dir="ltr" className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('phone')} <span className="text-slate-400 text-xs font-normal">(WhatsApp)</span>
                  </label>
                  <input value={form.phone} onChange={set('phone')} type="tel" placeholder="+212 6XX XXX XXX" dir="ltr" className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('city')} <span className="text-slate-400 text-xs font-normal">({t('optional') ?? 'optionnel'})</span>
                  </label>
                  <select value={form.city} onChange={set('city')} className={inp}>
                    <option value="">{t('reg_select_city')}</option>
                    {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('password')} <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <input value={form.password} onChange={set('password')} required
                      type={showPwd ? 'text' : 'password'} placeholder={t('reg_pwd_placeholder')}
                      className={inp + ' pe-11'} />
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
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('confirm_password')} <span className="text-red-400">*</span></label>
                  <input value={form.password_confirmation} onChange={set('password_confirmation')} required
                    type="password" placeholder="••••••••"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                      form.password_confirmation && form.password !== form.password_confirmation
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
                        : form.password_confirmation && form.password === form.password_confirmation
                        ? 'border-green-400 focus:ring-green-200 focus:border-green-400'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-orange-400/20 focus:border-orange-400'
                    }`} />
                  {form.password_confirmation && form.password !== form.password_confirmation && (
                    <p className="text-xs text-red-500 mt-1.5">{t('reg_pwd_no_match')}</p>
                  )}
                  {form.password_confirmation && form.password === form.password_confirmation && (
                    <p className="text-xs text-green-600 mt-1.5">{t('reg_pwd_match')}</p>
                  )}
                </div>

                <button type="submit" disabled={loading || googleLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all disabled:opacity-60 mt-2">
                  {loading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('reg_creating')}</>
                    : <><Check className="h-4 w-4" /> {t('reg_create_client')}</>
                  }
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              {/* Bottom links */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-center text-sm text-slate-500">
                <p>
                  {t('already_have_account')}{' '}
                  <a href="/client/login" className="font-bold text-orange-500 hover:text-orange-600 hover:underline">{t('login')}</a>
                </p>
                <p>
                  {t('login_are_pro')}{' '}
                  <a href="/pro/register" className="font-bold text-orange-500 hover:text-orange-600 hover:underline">{t('pro_register')}</a>
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
