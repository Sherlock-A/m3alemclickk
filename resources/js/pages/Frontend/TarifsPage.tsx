import { Head, Link } from '@inertiajs/react';
import { Layout } from '../../components/Layout';
import { CheckCircle, Zap, Shield, Star, ArrowRight, MessageCircle } from 'lucide-react';

const WHATSAPP_ADMIN = 'https://wa.me/212600000000?text=Bonjour%2C%20je%20souhaite%20activer%20le%20plan%20';

const PLANS = [
    {
        name: 'Gratuit',
        price: '0',
        period: '',
        badge: null,
        badgeColor: '',
        description: "Pour démarrer et tester la plateforme.",
        color: 'border-slate-200 dark:border-slate-700',
        headerBg: 'bg-slate-50 dark:bg-slate-800/50',
        ctaColor: 'border border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20',
        features: [
            '1 profil artisan',
            'Visibilité standard',
            'Contact WhatsApp direct',
            'Tableau de bord basique',
            'Avis clients',
        ],
        missing: ['Badge vérifié prioritaire', 'Statistiques détaillées', 'Mise en avant dans les résultats', 'Support dédié'],
        cta: 'Créer un profil gratuit',
        href: '/pro/register',
        whatsapp: false,
    },
    {
        name: 'Pro',
        price: '99',
        period: '/ mois',
        badge: 'Populaire',
        badgeColor: 'bg-orange-500 text-white',
        description: "Pour les artisans qui veulent plus de clients.",
        color: 'border-orange-500 dark:border-orange-400 ring-2 ring-orange-500/20',
        headerBg: 'bg-orange-50 dark:bg-orange-900/20',
        ctaColor: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20',
        features: [
            '1 profil artisan',
            'Badge Pro prioritaire dans les résultats',
            'Contact WhatsApp direct',
            'Statistiques détaillées (vues, clics)',
            'Mise en avant dans les résultats',
            'Agenda / Prise de RDV',
            'Devis & Bon de commande PDF',
            'Avis clients + réponses',
        ],
        missing: ['Position #1 par ville+catégorie', 'Rapport mensuel', 'Support WhatsApp dédié'],
        cta: 'Activer le plan Pro',
        href: null,
        whatsapp: true,
    },
    {
        name: 'Premium',
        price: '249',
        period: '/ mois',
        badge: 'Meilleure valeur',
        badgeColor: 'bg-purple-600 text-white',
        description: "Pour dominer votre marché local.",
        color: 'border-purple-400 dark:border-purple-500 ring-2 ring-purple-500/20',
        headerBg: 'bg-purple-50 dark:bg-purple-900/20',
        ctaColor: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20',
        features: [
            'Tout le plan Pro',
            'Position #1 par ville + catégorie',
            'Badge Premium exclusif',
            'Rapport mensuel de performance',
            'Support WhatsApp dédié',
            'Accès prioritaire aux nouvelles fonctions',
        ],
        missing: [],
        cta: 'Activer le plan Premium',
        href: null,
        whatsapp: true,
    },
];

export default function TarifsPage() {
    return (
        <Layout>
            <Head>
                <title>Tarifs Artisans — Jobly Maroc</title>
                <meta name="description" content="Plans tarifaires Jobly pour artisans au Maroc : Gratuit, Pro à 99 MAD/mois, Premium à 249 MAD/mois. Activation immédiate par virement." />
                <link rel="canonical" href={`${window.location.origin}/tarifs`} />
            </Head>

            <div className="min-h-screen bg-white dark:bg-slate-900">
                {/* Hero */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
                            Plans disponibles maintenant
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Plans & Tarifs</h1>
                        <p className="text-slate-300 text-base max-w-xl mx-auto">
                            Choisissez le plan qui correspond à vos ambitions. Activation par virement bancaire — aucune carte requise.
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-14">

                    {/* Plans */}
                    <div className="grid gap-6 sm:grid-cols-3 mb-14">
                        {PLANS.map(plan => (
                            <div key={plan.name} className={`relative rounded-2xl border ${plan.color} bg-white dark:bg-slate-900 flex flex-col overflow-hidden`}>
                                {plan.badge && (
                                    <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.badgeColor}`}>
                                        {plan.badge}
                                    </div>
                                )}
                                <div className={`${plan.headerBg} px-6 py-5`}>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{plan.name}</p>
                                    <div className="flex items-end gap-1 mb-1">
                                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                                        {plan.period && <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">MAD{plan.period}</span>}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{plan.description}</p>
                                </div>
                                <div className="px-6 py-5 flex-1 flex flex-col">
                                    <ul className="space-y-2 flex-1 mb-5">
                                        {plan.features.map(f => (
                                            <li key={f} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                                {f}
                                            </li>
                                        ))}
                                        {plan.missing.map(f => (
                                            <li key={f} className="flex items-start gap-2 text-sm text-slate-400 line-through">
                                                <span className="h-4 w-4 shrink-0 mt-0.5 text-slate-300">✗</span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    {plan.whatsapp ? (
                                        <a
                                            href={`${WHATSAPP_ADMIN}${plan.name}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${plan.ctaColor}`}
                                        >
                                            <MessageCircle className="h-4 w-4" /> {plan.cta}
                                        </a>
                                    ) : (
                                        <Link
                                            href={plan.href!}
                                            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${plan.ctaColor}`}
                                        >
                                            {plan.cta} <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment ça marche */}
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 p-8 mb-14">
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white text-center mb-6">Comment activer votre abonnement ?</h2>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {[
                                { step: '1', icon: <MessageCircle className="h-5 w-5" />, title: 'Contactez-nous', desc: 'Cliquez sur "Activer" et envoyez-nous un message WhatsApp avec le plan choisi.' },
                                { step: '2', icon: <Shield className="h-5 w-5" />, title: 'Effectuez le virement', desc: 'Virez le montant mensuel sur notre compte CIH ou Attijariwafa. Aucune carte bancaire requise.' },
                                { step: '3', icon: <Zap className="h-5 w-5" />, title: 'Activation immédiate', desc: 'Dès réception du virement, votre plan est activé dans les 2 heures par notre équipe.' },
                            ].map(s => (
                                <div key={s.step} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shrink-0">
                                        {s.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">{s.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Prix moyens */}
                    <div className="mb-14">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white text-center mb-2">Prix moyens des artisans au Maroc</h2>
                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8">Estimations indicatives — varient selon la ville et la complexité des travaux</p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-orange-50 dark:bg-orange-900/20 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Métier</th>
                                        <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Intervention / Dépannage</th>
                                        <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Installation / Journée</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                    {[
                                        { metier: '🔧 Plombier',         intervention: '200 – 500 MAD',     installation: '800 – 2 000 MAD' },
                                        { metier: '⚡ Électricien',      intervention: '150 – 400 MAD',     installation: '1 000 – 3 000 MAD' },
                                        { metier: '🏠 Femme de ménage',  intervention: '80 – 150 MAD/h',    installation: '—' },
                                        { metier: '🎨 Peintre',          intervention: '25 – 60 MAD/m²',    installation: '500 – 1 500 MAD/jour' },
                                        { metier: '🪵 Menuisier',        intervention: '—',                 installation: '800 – 2 500 MAD/jour' },
                                        { metier: '🧱 Carreleur',        intervention: '80 – 150 MAD/m²',   installation: '—' },
                                        { metier: '❄️ Climatisation',    intervention: '500 – 1 500 MAD',   installation: '2 000 – 5 000 MAD' },
                                        { metier: '🚚 Déménagement',     intervention: '800 – 2 500 MAD',   installation: '—' },
                                    ].map(row => (
                                        <tr key={row.metier} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-white">{row.metier}</td>
                                            <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{row.intervention}</td>
                                            <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{row.installation}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-slate-400 text-center mt-3">* Prix moyens indicatifs — peuvent varier selon la ville et la complexité des travaux.</p>
                    </div>

                    {/* FAQ */}
                    <div className="mb-14">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white text-center mb-6">Questions fréquentes</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                { q: 'Y a-t-il une commission sur les transactions ?', a: "Non. Jobly ne prend aucune commission sur vos contrats. Vous êtes payé directement par vos clients, comme toujours." },
                                { q: 'Comment activer le plan Pro ou Premium ?', a: "Cliquez sur \"Activer le plan Pro\" (ou Premium), envoyez-nous un message WhatsApp et effectuez un virement CIH ou Attijariwafa. Votre plan est activé dans les 2 heures." },
                                { q: 'Comment fonctionne la vérification ?', a: "Chaque artisan est vérifié par notre équipe (CIN + appel téléphonique). Le badge \"Vérifié\" rassure vos clients et améliore votre visibilité." },
                                { q: "Puis-je annuler mon abonnement ?", a: "Oui, à tout moment. Contactez-nous par WhatsApp et votre plan reviendra au niveau Gratuit à la fin de la période payée. Aucun engagement minimum." },
                            ].map(({ q, a }) => (
                                <div key={q} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5">
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm mb-2">{q}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA final */}
                    <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-white text-center">
                        <div className="flex justify-center mb-3">
                            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Star className="h-6 w-6 text-white fill-white" />
                            </div>
                        </div>
                        <h2 className="text-xl font-extrabold mb-2">Prêt à recevoir plus de clients ?</h2>
                        <p className="text-orange-100 text-sm mb-6 max-w-sm mx-auto">
                            Rejoignez les artisans Pro et Premium qui apparaissent en tête des résultats Jobly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href={`${WHATSAPP_ADMIN}Pro`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-orange-50 text-orange-600 font-bold px-6 py-3 text-sm transition-colors"
                            >
                                <MessageCircle className="h-4 w-4" /> Activer le plan Pro — 99 MAD/mois
                            </a>
                            <a
                                href={`${WHATSAPP_ADMIN}Premium`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 text-sm transition-colors border border-white/30"
                            >
                                Premium — 249 MAD/mois
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
