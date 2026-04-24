import { useState, useEffect, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, UserPlus, Search } from 'lucide-react';

type City = { id: number; name: string; name_ar?: string | null };

const AVATARS = ['👤','👨','👩','🧔','👱','👴','👵','🧒'];

export default function ClientRegisterPage() {
  const { t } = useTranslation();
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    phone: '', city: '',
  });
  const [avatar, setAvatar] = useState('👤');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/cities')
      .then((r) => r.ok ? r.json() : [])
      .then((d: City[]) => setCities(d))
      .catch(() => {});
  }, []);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/client/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs = data.errors ? Object.values(data.errors).flat().join(' ') : data.message;
        setError(msgs || "Erreur lors de l'inscription.");
        return;
      }
      localStorage.setItem('client_token', data.token);
      setSuccess(true);
      setTimeout(() => { window.location.href = '/dashboard/client'; }, 1500);
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Compte créé !</h2>
          <p className="text-slate-500 dark:text-slate-400">Redirection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-2xl font-black text-orange-500">
            <Search className="h-7 w-7" />
            M3allem<span className="text-slate-800 dark:text-white">Click</span>
          </a>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">Créez votre compte pour trouver un artisan</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{t('register')}</h1>

          {/* Avatar selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Choisissez un avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`text-2xl rounded-xl p-2 border-2 transition-colors ${
                    avatar === a
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-orange-300'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('name')}</label>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="Votre nom complet"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('email')}</label>
              <input type="email" required value={form.email} onChange={set('email')} placeholder="vous@exemple.ma"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('phone')} <span className="text-slate-400">(optionnel)</span></label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+212 6XX XXX XXX"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('city')} <span className="text-slate-400">(optionnel)</span></label>
              <select value={form.city} onChange={set('city')}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900">
                <option value="">Sélectionner une ville</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}{c.name_ar ? ` — ${c.name_ar}` : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('password')}</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} required minLength={8} value={form.password} onChange={set('password')} placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 pr-10 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900" />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('confirm_password')}</label>
              <input type="password" required value={form.password_confirmation} onChange={set('password_confirmation')} placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {loading ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {loading ? 'Création...' : t('register')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('already_have_account')}{' '}
            <a href="/client/login" className="text-orange-500 font-medium hover:text-orange-600">{t('login')}</a>
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-2">Vous êtes un professionnel ?</p>
            <a href="/pro/register" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
              Créer un compte professionnel →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
