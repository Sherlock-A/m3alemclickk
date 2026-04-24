import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft, Wrench } from 'lucide-react';

interface Props {
  role?: 'pro' | 'client';
}

export default function ForgotPasswordPage({ role = 'pro' }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const apiEndpoint = role === 'client' ? '/api/client/forgot-password' : '/api/pro/forgot-password';
  const loginHref   = role === 'client' ? '/client/login' : '/pro/login';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 200) {
        setError(data.message || "Erreur lors de l'envoi.");
        return;
      }
      setSent(true);
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-2xl font-black text-orange-500">
            <Wrench className="h-7 w-7" />
            M3allem<span className="text-slate-800 dark:text-white">Click</span>
          </a>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Email envoyé !</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Si l'adresse <strong>{email}</strong> est enregistrée, vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>
              <p className="text-xs text-slate-400 mb-6">Vérifiez également vos spams.</p>
              <a href={loginHref} className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium">
                <ArrowLeft className="h-4 w-4" />
                {t('back_to_login')}
              </a>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('forgot_password')}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('email')}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'client' ? 'vous@exemple.ma' : 'pro@exemple.ma'}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Mail className="h-4 w-4" />}
                  {loading ? 'Envoi...' : t('send_reset_link')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <a href={loginHref} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-orange-500">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t('back_to_login')}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
