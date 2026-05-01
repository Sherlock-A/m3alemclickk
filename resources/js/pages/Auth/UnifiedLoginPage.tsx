import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { JoblyLogo } from '../../components/JoblyLogo';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

// ── Google "G" SVG icon ────────────────────────────────────────────────────────
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
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(pageError ?? '');

  // Clear error when URL param is present then remove it from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'google_failed') {
      setErrorMsg('La connexion avec Google a échoué. Réessayez ou utilisez votre email.');
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  // ── Email + password ──────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message ?? 'Identifiants incorrects.');
        return;
      }
      try {
        localStorage.setItem('auth_role', data.role);
        const tokenKey = data.role === 'admin' ? 'jobly_token'
                       : data.role === 'professional' ? 'pro_token'
                       : 'client_token';
        localStorage.setItem(tokenKey, data.token);
      } catch {}
      window.location.href = data.dashboard;
    } catch {
      setErrorMsg('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }

  // ── Google OAuth ──────────────────────────────────────────────────────────
  async function handleGoogle() {
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      const res  = await fetch('/api/auth/google', { credentials: 'include', headers: { Accept: 'application/json' } });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg('Impossible d\'initialiser la connexion Google.');
        setGoogleLoading(false);
      }
    } catch {
      setErrorMsg('Erreur réseau.');
      setGoogleLoading(false);
    }
  }

  return (
    <Layout>
      <Head title="Connexion — Jobly" />

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">

            {/* Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 px-8 py-7 text-center">
              <a href="/" className="inline-block mb-5">
                <JoblyLogo size="lg" theme="light" className="dark:hidden" />
                <JoblyLogo size="lg" theme="dark"  className="hidden dark:inline-flex" />
              </a>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Bienvenue sur Jobly
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Connectez-vous pour accéder à votre espace
              </p>
            </div>

            <div className="px-8 py-7 space-y-5">

              {/* Error banner */}
              {errorMsg && (
                <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {googleLoading
                  ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  : <GoogleIcon />
                }
                Continuer avec Google
              </button>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs font-medium text-slate-400">ou</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Email + password form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="vous@exemple.ma"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Mot de passe
                    </label>
                    <a href="/pro/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 hover:underline">
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      tabIndex={-1}
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Se connecter
                </button>
              </form>

              {/* Footer links */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>
                  Pas encore de compte client ?{' '}
                  <a href="/client/register" className="font-semibold text-orange-500 hover:text-orange-600 hover:underline">
                    S'inscrire
                  </a>
                </p>
                <p>
                  Vous êtes un professionnel ?{' '}
                  <a href="/pro/register" className="font-semibold text-orange-500 hover:text-orange-600 hover:underline">
                    Créer un profil pro
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Google note */}
          <p className="mt-4 text-center text-xs text-slate-400">
            La connexion Google crée automatiquement un compte client si vous n'en avez pas.
          </p>
        </div>
      </div>
    </Layout>
  );
}
