import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Layout } from '../../components/Layout';
import { CheckCircle, Zap, Shield, Star, ArrowRight, Mail } from 'lucide-react';
import axios from 'axios';

const PLANS = [
    {
        name: 'Gratuit',
        price: '0',
        period: '',
        badge: null,
        description: 'Pour démarrer et tester la plateforme.',
        color: 'border-slate-200 dark:border-slate-700',
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
    },
    {
        name: 'Pro',
        price: '99',
        period: '/ mois',
        badge: 'Populaire',
        description: 'Pour les artisans qui veulent plus de clients.',
        color: 'border-orange-500 dark:border-orange-400 ring-2 ring-orange-500/20',
        ctaColor: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20',
        features: [
            '1 profil artisan',
            'Badge vérifié prioritaire',
            'Contact WhatsApp direct',
            'Statistiques détaillées (vues, clics)',
            'Mise en avant dans les résultats',
            'Agenda / Prise de RDV',
            'Devis & Bon de commande PDF',
            'Avis clients + réponses',
        ],
        missing: ['Position #1 par ville+catégorie', 'Rapport mensuel', 'Support WhatsApp dédié'],
        cta: 'Rejoindre la liste d\'attente',
        href: null,
    },
    {
        name: 'Premium',
        price: '249',
        period: '/ mois',
        badge: 'Bientôt',
        description: 'Pour dominer votre marché local.',
        color: 'border-slate-200 dark:border-slate-700',
        ctaColor: 'border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800',
        features: [
            'Tout le plan Pro',
            'Position #1 par ville + catégorie',
            'Profil enrichi (vidéo, galerie illimitée)',
            'Rapport mensuel de performance',
            'Support WhatsApp dédié',
            'Accès prioritaire aux nouvelles fonctions',
        ],
        missing: [],
        cta: 'Rejoindre la liste d\'attente',
        href: null,
    },
];

export default function TarifsPage() {
    const [email, setEmail]     = useState('');
    const [plan,  setPlan]      = useState('Pro');
    const [sent,  setSent]      = useState(false);
    const [error, setError]     = useState('');
    const [sending, setSending] = useState(false);

    const joinWaitlist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) { setError('Adresse email requise.'); return; }
        setSending(true);
        setError('');
        try {
            await axios.post('/api/contact', {
                name:    email.split('@')[0],
                email:   email.trim(),
                subject: `Liste d'attente plan ${plan}`,
                message: `Je souhaite rejoindre la liste d'attente pour le plan ${plan} de Jobly.`,
            });
            setSent(true);
        } catch {
            setError('Erreur lors de l\'envoi. Réessayez.');
        } finally {
            setSending(false);
        }
    };

    return (
        <Layout>
            <Head>
                <title>Tarifs Artisans — Jobly Maroc</title>
                <meta name="description" content="Découvrez les plans tarifaires Jobly pour artisans au Maroc. Démarrez gratuitement, passez Pro à 99 MAD/mois." />
                <link rel="canonical" href={`${window.location.origin}/tarifs`} />
            </Head>

            <div className="min-h-screen bg-white dark:bg-slate-900">
                {/* Hero */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block bg-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
                            Bientôt disponible
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                            Plans & Tarifs
                        </h1>
                        <p className="text-slate-300 text-base max-w-xl mx-auto">
                            Jobly est actuellement gratuit pour tous les artisans. Les plans payants arrivent bientôt — inscrivez-vous pour être parmi les premiers informés.
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-14">
                    {/* FAQ */}
                    <div className="mb-14">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white text-center mb-6">Questions fréquentes</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                { q: 'Y a-t-il une commission sur les transactions ?', a: 'Non. Jobly ne prend aucune commission sur vos contrats. Vous êtes payé directement par vos clients, comme toujours.' },
                                { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui. Vous pouvez passer de Gratuit à Pro ou annuler votre abonnement à tout moment, sans engagement.' },
                                { q: 'Comment fonctionne la vérification ?', a: 'Chaque artisan est vérifié par notre équipe (CIN + appel téléphonique). Le badge "Vérifié" rassure vos clients et améliore votre visibilité.' },
                                { q: 'Quand le plan Pro sera-t-il disponible ?', a: 'Le plan Pro est en cours de finalisation. Rejoignez la liste d\'attente pour être parmi les premiers à y avoir accès et bénéficier d\'un tarif de lancement.' },
                            ].map(({ q, a }) => (
                                <div key={q} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5">
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm mb-2">{q}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Waitlist */}
                    <div id="waitlist" className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-white text-center">
                        <div className="flex justify-center mb-3">
                            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h2 className="text-xl font-extrabold mb-2">Soyez parmi les premiers</h2>
                        <p className="text-orange-100 text-sm mb-6 max-w-sm mx-auto">
                            Les plans payants arrivent bientôt. Inscrivez-vous pour obtenir un tarif de lancement exclusif.
                        </p>
                        {sent ? (
                            <div className="flex items-center justify-center gap-2 bg-white/20 rounded-xl py-3 px-4 mx-auto max-w-xs">
                                <CheckCircle className="h-5 w-5 text-white" />
                                <span className="text-white font-semibold text-sm">Inscription confirmée !</span>
                            </div>
                        ) : (
                            <form onSubmit={joinWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                    className="flex-1 rounded-xl px-4 py-3 text-slate-900 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="rounded-xl bg-white hover:bg-orange-50 disabled:opacity-70 text-orange-600 font-bold px-5 py-3 text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    {sending ? 'Envoi...' : <><Mail className="h-4 w-4" /> M'inscrire</>}
                                </button>
                            </form>
                        )}
                        {error && <p className="text-orange-100 text-xs mt-2">{error}</p>}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
