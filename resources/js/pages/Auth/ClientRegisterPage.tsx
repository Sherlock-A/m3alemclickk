import { useState, useEffect, FormEvent } from 'react';
import { Eye, EyeOff, UserPlus, Search, CheckCircle, Mail, MessageCircle, RefreshCw, ArrowLeft } from 'lucide-react';

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
  const [step, setStep]     = useState<'form' | 'verify'>('form');
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm]     = useState({
    name: '', email: '', password: '', password_confirmation: '',
    phone: '', city: '',
  });
  const [avatar, setAvatar]   = useState('👤');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Vérification
  const [userId, setUserId]             = useState<number | null>(null);
  const [verifyMethod, setVerifyMethod] = useState<'email' | 'whatsapp'>('email');
  const [codeSent, setCodeSent]         = useState(false);
  const [codePreview, setCodePreview]   = useState('');
  const [code, setCode]                 = useState('');
  const [verifying, setVerifying]       = useState(false);
  const [sending, setSending]           = useState(false);
  const [countdown, setCountdown]       = useState(0);
  const [verified, setVerified]         = useState(false);

  useEffect(() => {
    fetch('/api/cities')
      .then(r => r.ok ? r.json() : [])
      .then((d: City[]) => setCities(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({ ...form, [k]: e.target.value });
      setError('');
    };

  const handleRegister = async (e: FormEvent) => {
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
      setUserId(data.user.id);
      setStep('verify');
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!userId || countdown > 0) return;
    setSending(true);
    setError('');
    try {
      const res  = await fetch('/api/verify/send-code', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ user_id: userId, method: verifyMethod }),
      });
      const data = await res.json();
      if (!res.ok) { setError(translateError(data.message || '')); return; }
      setCodeSent(true);
      setCodePreview(data.preview || '');
      setCountdown(60);
    } catch {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId || code.length !== 6) return;
    setVerifying(true);
    setError('');
    try {
      const res  = await fetch('/api/verify/check-code', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ user_id: userId, code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(translateError(data.message || '')); return; }
      setVerified(true);
      setTimeout(() => { window.location.href = '/dashboard/client'; }, 1500);
    } catch {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setVerifying(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Compte vérifié !</h2>
          <p className="text-slate-500">Redirection…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-2xl font-black text-orange-500">
            <Search className="h-7 w-7" />
            Jobly
          </a>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
            {step === 'form' ? 'Créez votre compte pour trouver un artisan' : 'Vérification de votre identité'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">

          {/* ── FORMULAIRE ─────────────────────────────────────────── */}
          {step === 'form' && (
            <>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">S'inscrire</h1>

              <div className="mb-5">
                <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Choisissez un avatar</p>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map(a => (
                    <button key={a} type="button" onClick={() => setAvatar(a)}
                      className={`text-2xl rounded-xl p-2 border-2 transition-colors ${
                        avatar === a
                          ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-orange-300'
                      }`}>{a}</button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nom complet</label>
                  <input value={form.name} onChange={set('name')} required placeholder="Ahmed El Fassi"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Adresse email</label>
                  <input value={form.email} onChange={set('email')} type="email" required placeholder="ahmed@example.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Téléphone <span className="text-slate-400 font-normal">(pour WhatsApp)</span>
                  </label>
                  <input value={form.phone} onChange={set('phone')} type="tel" placeholder="+212 6XX XXX XXX"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Ville <span className="text-slate-400 font-normal">(optionnel)</span>
                  </label>
                  <select value={form.city} onChange={set('city')}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors">
                    <option value="">-- Choisir une ville --</option>
                    {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <input value={form.password} onChange={set('password')} required
                      type={showPwd ? 'text' : 'password'} placeholder="Minimum 8 caractères"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 pr-12 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors" />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirmer le mot de passe</label>
                  <input value={form.password_confirmation} onChange={set('password_confirmation')} required
                    type="password" placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
                  {loading
                    ? <><RefreshCw className="h-4 w-4 animate-spin" /> Inscription…</>
                    : <><UserPlus className="h-4 w-4" /> S'inscrire</>}
                </button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Déjà un compte ?{' '}
                  <a href="/client/login" className="text-orange-500 font-semibold hover:underline">Se connecter</a>
                </p>
                <p className="text-xs text-slate-400">
                  Vous êtes un professionnel ?{' '}
                  <a href="/pro/register" className="text-orange-500 hover:underline">Créer un compte pro →</a>
                </p>
              </div>
            </>
          )}

          {/* ── VÉRIFICATION ───────────────────────────────────────── */}
          {step === 'verify' && (
            <>
              <button onClick={() => setStep('form')}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-5">
                <ArrowLeft className="h-4 w-4" /> Retour
              </button>

              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Vérification</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Recevez un code à 6 chiffres pour sécuriser votre compte.
              </p>

              {!codeSent && (
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button onClick={() => setVerifyMethod('email')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                      verifyMethod === 'email'
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-orange-300'
                    }`}>
                    <Mail className="h-6 w-6 text-orange-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Par email</span>
                    <span className="text-xs text-slate-400 truncate max-w-full px-1 text-center">
                      {form.email.split('@')[0].slice(0, 3)}***@{form.email.split('@')[1]}
                    </span>
                  </button>
                  <button onClick={() => setVerifyMethod('whatsapp')}
                    disabled={!form.phone}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                      !form.phone
                        ? 'border-slate-100 bg-slate-50 dark:bg-slate-800/50 opacity-50 cursor-not-allowed'
                        : verifyMethod === 'whatsapp'
                          ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-green-300'
                    }`}>
                    <MessageCircle className="h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">WhatsApp</span>
                    <span className="text-xs text-slate-400">{form.phone || 'Non renseigné'}</span>
                  </button>
                </div>
              )}

              {codeSent && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-5 text-sm text-green-700 dark:text-green-400">
                  ✅ Code envoyé à <strong>{codePreview}</strong> — valable <strong>10 minutes</strong>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              {!codeSent ? (
                <button onClick={handleSendCode} disabled={sending}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  {sending
                    ? <><RefreshCw className="h-4 w-4 animate-spin" /> Envoi…</>
                    : verifyMethod === 'whatsapp'
                      ? <><MessageCircle className="h-4 w-4" /> Envoyer via WhatsApp</>
                      : <><Mail className="h-4 w-4" /> Envoyer par email</>}
                </button>
              ) : (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Code à 6 chiffres</label>
                    <input
                      value={code}
                      onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                      placeholder="• • • • • •"
                      maxLength={6}
                      autoFocus
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-4 text-center text-3xl font-mono tracking-[12px] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors" />
                  </div>

                  <button type="submit" disabled={verifying || code.length !== 6}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    {verifying
                      ? <><RefreshCw className="h-4 w-4 animate-spin" /> Vérification…</>
                      : <><CheckCircle className="h-4 w-4" /> Valider mon compte</>}
                  </button>

                  <div className="text-center pt-1">
                    {countdown > 0
                      ? <p className="text-sm text-slate-400">Renvoyer le code dans {countdown}s</p>
                      : <button type="button" onClick={handleSendCode} disabled={sending}
                          className="text-sm text-orange-500 hover:underline flex items-center gap-1.5 mx-auto">
                          <RefreshCw className="h-3.5 w-3.5" /> Renvoyer le code
                        </button>}
                  </div>
                </form>
              )}

              <p className="mt-5 text-xs text-center text-slate-400">
                Problème ?{' '}
                <a href="mailto:support@jobly.ma" className="text-orange-500 hover:underline">support@jobly.ma</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
