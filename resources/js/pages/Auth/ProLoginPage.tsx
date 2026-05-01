import { useState, FormEvent } from 'react';
import { Eye, EyeOff, LogIn, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

type Step = 'form' | 'admin_notice';

export default function ProLoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [step, setStep]       = useState<Step>('form');

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.email) { window.location.href = '/pro/forgot-password'; return; }
    const res = await fetch('/api/admin/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: form.email }),
    }).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      if (data.is_admin) { setStep('admin_notice'); return; }
    }
    window.location.href = '/pro/forgot-password';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const proRes  = await fetch('/api/pro/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const proData = await proRes.json();

      if (proRes.ok) {
        localStorage.setItem('pro_token', proData.token);
        window.location.href = '/dashboard/professional';
        return;
      }
      if (proRes.status === 403) { setError(proData.message || 'Accès refusé.'); return; }

      const adminRes  = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const adminData = await adminRes.json();
      if (adminRes.ok) {
        localStorage.setItem('jobly_token', adminData.token);
        window.location.href = '/dashboard/admin';
        return;
      }
      setError('Email ou mot de passe incorrect.');
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'admin_notice') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Compte administrateur</h2>
            <p className="text-slate-400 text-sm">Un lien de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception et vos spams.</p>
          </div>
          <button onClick={() => setStep('form')}
            className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-2/5 bg-slate-950 flex-col justify-between p-12">
        <a href="/" className="flex items-center gap-2 text-xl font-black text-orange-500">
          <Wrench className="h-6 w-6" />
          Jobly
        </a>
        <div className="space-y-6">
          <div className="h-1 w-12 bg-orange-500 rounded-full" />
          <h2 className="text-3xl font-black text-white leading-tight">
            Gérez votre activité depuis un seul endroit.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Profil public, statistiques de contact, disponibilité en temps réel — tout ce dont vous avez besoin pour développer votre clientèle au Maroc.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              { label: 'Professionnels actifs', value: '500+' },
              { label: 'Villes couvertes', value: '20+' },
              { label: 'Contacts par jour', value: '1000+' },
              { label: 'Note moyenne', value: '4.8★' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/5 p-4">
                <p className="text-2xl font-black text-orange-400">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Jobly</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <a href="/" className="inline-flex items-center gap-2 text-xl font-black text-orange-500">
              <Wrench className="h-5 w-5" />
              Jobly
            </a>
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Connexion</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Accédez à votre espace professionnel</p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Adresse email</label>
              <input
                type="email" required autoComplete="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }}
                placeholder="pro@exemple.ma"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Mot de passe</label>
                <a href="#" onClick={handleForgotPassword}
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} required autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 pr-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-colors"
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white hover:bg-orange-600 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20">
              {loading
                ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                : <LogIn className="h-4 w-4" />}
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
            <div className="relative flex justify-center"><span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400">Pas encore de compte ?</span></div>
          </div>

          <a href="/pro/register"
            className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-500 transition-all">
            Créer un compte professionnel <ArrowRight className="h-4 w-4" />
          </a>

          <p className="text-center text-xs text-slate-400">
            <a href="/" className="hover:text-orange-500 transition-colors">← Retour à l'accueil</a>
          </p>
        </div>
      </div>
    </div>
  );
}
