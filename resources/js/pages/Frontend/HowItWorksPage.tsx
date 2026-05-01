import { Head } from '@inertiajs/react';
import { Layout } from '../../components/Layout';
import { Search, UserCheck, Wrench, Star, ShieldCheck, Zap, Phone, BadgeCheck, ArrowRight } from 'lucide-react';

const clientSteps = [
  {
    icon: Search,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    num: '01',
    title: 'Recherchez un artisan',
    desc: 'Tapez votre besoin (plombier, électricien, maçon…) et votre ville. Notre moteur intelligent vous propose les meilleurs profils vérifiés près de chez vous.',
  },
  {
    icon: Phone,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    num: '02',
    title: 'Contactez directement',
    desc: 'Appelez ou envoyez un message WhatsApp en un clic. Pas d\'intermédiaire — vous parlez directement à l\'artisan pour discuter de votre projet et obtenir un devis.',
  },
  {
    icon: Star,
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    num: '03',
    title: 'Laissez un avis',
    desc: 'Après votre chantier, évaluez l\'artisan. Vos avis aident la communauté à identifier les meilleurs professionnels et motivent les artisans à maintenir leur qualité.',
  },
];

const proSteps = [
  {
    icon: UserCheck,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    num: '01',
    title: 'Créez votre profil',
    desc: 'Inscrivez-vous gratuitement et renseignez votre spécialité, votre ville, vos tarifs et une description. Ajoutez vos photos de réalisations pour convaincre vos futurs clients.',
  },
  {
    icon: ShieldCheck,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    num: '02',
    title: 'Validation en 24h',
    desc: 'Notre équipe vérifie votre profil sous 24h pour garantir la qualité de la plateforme. Vous recevez un email dès que votre profil est approuvé et visible.',
  },
  {
    icon: Zap,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    num: '03',
    title: 'Recevez des clients',
    desc: 'Votre profil apparaît dans les recherches locales. Les clients vous contactent directement — pas de commission, pas d\'abonnement. Vous gardez 100% de vos revenus.',
  },
];

const guarantees = [
  { icon: ShieldCheck, title: 'Profils vérifiés',  desc: 'Chaque artisan est validé par notre équipe avant d\'apparaître dans les résultats.' },
  { icon: BadgeCheck,  title: 'Zéro commission',   desc: 'Nous ne prenons aucune commission sur vos contrats. Inscription et visibilité gratuites.' },
  { icon: Star,        title: 'Avis authentiques',  desc: 'Les avis sont soumis par de vrais clients — aucun avis acheté ou falsifié.' },
  { icon: Zap,         title: 'Réponse rapide',     desc: 'Les artisans s\'engagent à répondre dans les 24h suivant votre demande.' },
];

function StepCard({ step, index }: { step: typeof clientSteps[0]; index: number }) {
  const Icon = step.icon;
  return (
    <div className="relative flex gap-5">
      {index < 2 && (
        <div className="absolute left-6 top-14 h-full w-px bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700" />
      )}
      <div className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl ${step.color} shadow-sm`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="pt-1 pb-8">
        <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500">{step.num}</span>
        <h3 className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">{step.desc}</p>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <Layout>
      <Head title="Comment ça marche — Jobly" />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold mb-6">
            <Wrench className="h-4 w-4" /> Simple · Rapide · Gratuit
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
            Comment fonctionne Jobly ?
          </h1>
          <p className="text-orange-100 text-base sm:text-lg leading-relaxed">
            Jobly connecte les particuliers avec les meilleurs artisans vérifiés au Maroc. En 3 étapes simples, trouvez l'expert qu'il vous faut.
          </p>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">

            {/* Clients */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-900/30 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400 mb-6">
                <Search className="h-3.5 w-3.5" /> Pour les particuliers
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
                Trouvez un artisan en 3 minutes
              </h2>
              <div className="space-y-0">
                {clientSteps.map((s, i) => <StepCard key={i} step={s} index={i} />)}
              </div>
              <a
                href="/professionals"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-sm mt-2"
              >
                Chercher un artisan <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Professionnels */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400 mb-6">
                <Wrench className="h-3.5 w-3.5" /> Pour les artisans
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
                Développez votre activité
              </h2>
              <div className="space-y-0">
                {proSteps.map((s, i) => <StepCard key={i} step={s} index={i} />)}
              </div>
              <a
                href="/pro/register"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white hover:bg-purple-700 transition-colors shadow-sm mt-2"
              >
                Créer mon profil pro <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Guarantees ── */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Nos engagements</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">Ce qui rend Jobly différent</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {guarantees.map((g, i) => {
              const Icon = g.icon;
              return (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm text-center">
                  <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-orange-100 dark:bg-orange-900/30 mb-4">
                    <Icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">{g.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{g.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 px-4 bg-white dark:bg-slate-950 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3">
            Des questions ? On est là.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Notre équipe répond dans les 24h.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-orange-300 px-6 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20 transition-colors"
          >
            Nous contacter <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </Layout>
  );
}
