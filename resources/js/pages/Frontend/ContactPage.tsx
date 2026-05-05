import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Layout } from '../../components/Layout';
import { Send, CheckCircle, AlertCircle, Loader2, MessageSquare, Clock } from 'lucide-react';

const SUBJECTS = [
  'Question générale',
  'Problème technique',
  'Signaler un profil',
  'Partenariat',
  'Inscription pro',
  'Autre',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setFieldErrors(e => ({ ...e, [field]: '' }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          const flat: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.errors)) flat[k] = (v as string[])[0];
          setFieldErrors(flat);
        } else {
          setErrorMsg(data.message ?? 'Une erreur est survenue.');
        }
        return;
      }
      setSuccess(true);
    } catch {
      setErrorMsg('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Head title="Contact — Jobly" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-14 px-4 text-center text-white">
        <div className="mx-auto max-w-xl">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-orange-500/20 mb-5">
            <MessageSquare className="h-7 w-7 text-orange-400" />
          </div>
          <h1 className="text-3xl font-black mb-3">Contactez-nous</h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Une question, un problème ou une suggestion ? Notre équipe vous répond dans les 24h.
          </p>
        </div>
      </section>

      <section className="py-14 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl grid md:grid-cols-5 gap-10">

          {/* ── Infos ── */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/20 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/40">
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Délai de réponse</p>
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-300 leading-relaxed">
                Nous répondons à tous les messages dans un délai de 24h (jours ouvrés).
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-5 space-y-3 shadow-sm">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pourquoi nous contacter ?</p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
                <li className="flex gap-2"><span className="text-orange-400 font-bold">›</span> Question sur la plateforme</li>
                <li className="flex gap-2"><span className="text-orange-400 font-bold">›</span> Problème avec un profil ou un avis</li>
                <li className="flex gap-2"><span className="text-orange-400 font-bold">›</span> Demande d'inscription professionnelle</li>
                <li className="flex gap-2"><span className="text-orange-400 font-bold">›</span> Proposition de partenariat</li>
                <li className="flex gap-2"><span className="text-orange-400 font-bold">›</span> Signalement d'un contenu inapproprié</li>
              </ul>
            </div>
          </div>

          {/* ── Formulaire ── */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              {success ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message envoyé !</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                    Nous avons bien reçu votre message et vous répondrons dans les 24h.
                  </p>
                  <button
                    onClick={() => { setSuccess(false); setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' }); }}
                    className="mt-2 text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Envoyez-nous un message</h2>

                  {errorMsg && (
                    <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Nom */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nom complet *</label>
                      <input
                        type="text" required value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder="Votre nom"
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-colors ${fieldErrors.name ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                      {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email *</label>
                      <input
                        type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                        placeholder="vous@exemple.ma"
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-colors ${fieldErrors.email ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                      {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                    </div>
                  </div>

                  {/* Sujet */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sujet *</label>
                    <select
                      required value={form.subject} onChange={e => set('subject', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-colors"
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Message * <span className="text-xs text-slate-400 font-normal">({form.message.length}/2000)</span>
                    </label>
                    <textarea
                      required rows={5} value={form.message} onChange={e => set('message', e.target.value)}
                      placeholder="Décrivez votre demande en détail…"
                      maxLength={2000}
                      className={`w-full rounded-xl border px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-colors resize-none ${fieldErrors.message ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                    {fieldErrors.message && <p className="mt-1 text-xs text-red-500">{fieldErrors.message}</p>}
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors disabled:opacity-60 shadow-sm"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? 'Envoi en cours…' : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
