import { useState, useEffect, FormEvent } from 'react';
import { Mail, KeyRound, Eye, EyeOff, ArrowLeft, RefreshCw, CheckCircle, ShieldCheck } from 'lucide-react';
import { JoblyLogo } from '../../components/JoblyLogo';

interface Props {
  role?: 'pro' | 'client';
}

type Step = 'email' | 'code' | 'password';

export default function ForgotPasswordPage({ role = 'pro' }: Props) {
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
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Étape 1 : envoyer le code ──────────────────────────────────────────────
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
      if (!res.ok) { setError(data.message || "Erreur lors de l'envoi."); return; }
      setStep('code');
      setCountdown(60);
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // ── Étape 2 : valider le code (avance vers étape 3) ──────────────────────
  const handleCodeNext = (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { setError('Entrez le code à 6 chiffres.'); return; }
    setError('');
    setStep('password');
  };

  // ── Étape 3 : nouveau mot de passe ─────────────────────────────────────────
  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
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
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // ── Succès ─────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mot de passe modifié !</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Vous pouvez maintenant vous connecter.</p>
          <a href={loginUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors mt-2">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  const stepLabels: Record<Step, string> = {
    email:    'Votre email',
    code:     'Code reçu',
    password: 'Nouveau mot de passe',
  };
  const steps: Step[] = ['email', 'code', 'password'];
  const stepIdx = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <a href="/"><JoblyLogo size="lg" /></a>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">Réinitialisation du mot de passe</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">

          {/* Indicateur d'étapes */}
          <div className="flex items-center gap-2 mb-7">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    stepIdx > i ? 'bg-orange-500 text-white'
                    : stepIdx === i ? 'bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-900/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {stepIdx > i ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:block text-xs font-medium text-slate-500 dark:text-slate-400">{stepLabels[s]}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px ${stepIdx > i ? 'bg-orange-400' : 'bg-slate-100 dark:bg-slate-800'}`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* ── Étape 1 : Email ── */}
          {step === 'email' && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 dark:text-white">Mot de passe oublié ?</h1>
                  <p className="text-xs text-slate-400">Nous vous enverrons un code par email</p>
                </div>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Adresse email</label>
                  <input
                    type="email" required autoFocus
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder={role === 'client' ? 'vous@exemple.ma' : 'pro@exemple.ma'}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors"
                  />
                </div>
                <button type="submit" disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors">
                  {loading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Envoi…</> : <><Mail className="h-4 w-4" /> Envoyer le code</>}
                </button>
              </form>
            </>
          )}

          {/* ── Étape 2 : Code ── */}
          {step === 'code' && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 dark:text-white">Code de vérification</h1>
                  <p className="text-xs text-slate-400">Envoyé à <strong>{email}</strong> — valable 10 min</p>
                </div>
              </div>

              <form onSubmit={handleCodeNext} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Code à 6 chiffres</label>
                  <input
                    value={code}
                    onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                    placeholder="• • • • • •"
                    maxLength={6}
                    autoFocus
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-4 text-center text-3xl font-mono tracking-[12px] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors"
                  />
                </div>

                <button type="submit" disabled={code.length !== 6}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors">
                  Valider le code →
                </button>

                <div className="text-center pt-1">
                  {countdown > 0
                    ? <p className="text-xs text-slate-400">Renvoyer dans {countdown}s</p>
                    : <button type="button" onClick={() => handleSendCode()} disabled={loading}
                        className="text-xs text-orange-500 hover:underline flex items-center gap-1 mx-auto">
                        <RefreshCw className="h-3 w-3" /> Renvoyer le code
                      </button>}
                </div>
              </form>
            </>
          )}

          {/* ── Étape 3 : Nouveau mot de passe ── */}
          {step === 'password' && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <KeyRound className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 dark:text-white">Nouveau mot de passe</h1>
                  <p className="text-xs text-slate-400">Pour le compte <strong>{email}</strong></p>
                </div>
              </div>

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required minLength={8} autoFocus
                      value={form.password}
                      onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                      placeholder="Minimum 8 caractères"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 pr-12 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirmer le mot de passe</label>
                  <input
                    type="password" required
                    value={form.password_confirmation}
                    onChange={e => { setForm({ ...form, password_confirmation: e.target.value }); setError(''); }}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors"
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors">
                  {loading
                    ? <><RefreshCw className="h-4 w-4 animate-spin" /> Réinitialisation…</>
                    : <><KeyRound className="h-4 w-4" /> Enregistrer le mot de passe</>}
                </button>
              </form>
            </>
          )}

          {/* Retour connexion */}
          <div className="mt-6 text-center">
            <a href={loginUrl} className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-orange-500 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Retour à la connexion
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
