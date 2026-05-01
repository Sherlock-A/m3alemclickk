import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { JoblyLogo } from '../../components/JoblyLogo';

export default function ClientLoginPage() {
  const { t } = useTranslation();
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
      if (!res.ok) {
        setError(data.message || 'Erreur de connexion.');
        return;
      }
      localStorage.setItem('client_token', data.token);
      window.location.href = '/dashboard/client';
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/"><JoblyLogo size="lg" /></a>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">Trouvez le bon artisan rapidement</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{t('login')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Espace chercheur d'artisan</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('email')}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="vous@exemple.ma"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 pr-10 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="/client/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
                {t('forgot_password')}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loading ? 'Connexion...' : t('login')}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('no_account')}{' '}
            <a href="/client/register" className="text-orange-500 font-medium hover:text-orange-600">
              {t('register')}
            </a>
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-2">Vous êtes un professionnel ?</p>
            <a href="/pro/login" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
              Accéder à l'espace pro →
            </a>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <a href="/" className="hover:text-orange-500">← Retour à l'accueil</a>
        </p>
      </div>
    </div>
  );
}
