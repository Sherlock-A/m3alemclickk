import { Head, Link } from '@inertiajs/react';
import { Layout } from '../../components/Layout';
import { CheckCircle, Zap, Shield, Star, ArrowRight, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WHATSAPP_ADMIN_FR = 'https://wa.me/212600000000?text=Bonjour%2C%20je%20souhaite%20activer%20le%20plan%20';
const WHATSAPP_ADMIN_AR = 'https://wa.me/212600000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%AA%D9%81%D8%B9%D9%8A%D9%84%20%D8%AE%D8%B7%D8%A9%20';

const PRIX_ROWS = [
    { icon: '🔧', metier_fr: 'Plombier',        metier_ar: 'سباك',         intervention: '200 – 500 MAD',     installation: '800 – 2 000 MAD' },
    { icon: '⚡', metier_fr: 'Électricien',      metier_ar: 'كهربائي',      intervention: '150 – 400 MAD',     installation: '1 000 – 3 000 MAD' },
    { icon: '🏠', metier_fr: 'Femme de ménage',  metier_ar: 'مساعدة منزلية',intervention: '80 – 150 MAD/h',    installation: '—' },
    { icon: '🎨', metier_fr: 'Peintre',          metier_ar: 'طلاء',         intervention: '25 – 60 MAD/m²',    installation: '500 – 1 500 MAD/jour' },
    { icon: '🪵', metier_fr: 'Menuisier',        metier_ar: 'نجار',         intervention: '—',                 installation: '800 – 2 500 MAD/jour' },
    { icon: '🧱', metier_fr: 'Carreleur',        metier_ar: 'رصاف',         intervention: '80 – 150 MAD/m²',   installation: '—' },
    { icon: '❄️', metier_fr: 'Climatisation',    metier_ar: 'تكييف',        intervention: '500 – 1 500 MAD',   installation: '2 000 – 5 000 MAD' },
    { icon: '🚚', metier_fr: 'Déménagement',     metier_ar: 'نقل عفش',      intervention: '800 – 2 500 MAD',   installation: '—' },
];

export default function TarifsPage() {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const waBase = isAr ? WHATSAPP_ADMIN_AR : WHATSAPP_ADMIN_FR;

    const PLANS = [
        {
            name: t('plan_free_name'),
            price: '0',
            period: '',
            badge: null,
            badgeColor: '',
            description: t('plan_free_desc'),
            color: 'border-slate-200 dark:border-slate-700',
            headerBg: 'bg-slate-50 dark:bg-slate-800/50',
            ctaColor: 'border border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20',
            features: [t('plan_free_f1'), t('plan_free_f2'), t('plan_free_f3'), t('plan_free_f4'), t('plan_free_f5')],
            missing: [t('plan_free_m1'), t('plan_free_m2'), t('plan_free_m3'), t('plan_free_m4')],
            cta: t('plan_free_cta'),
            href: '/pro/register',
            whatsapp: false,
        },
        {
            name: t('plan_pro_name'),
            price: '99',
            period: t('plan_per_month'),
            badge: t('plan_pro_badge'),
            badgeColor: 'bg-orange-500 text-white',
            description: t('plan_pro_desc'),
            color: 'border-orange-500 dark:border-orange-400 ring-2 ring-orange-500/20',
            headerBg: 'bg-orange-50 dark:bg-orange-900/20',
            ctaColor: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20',
            features: [t('plan_pro_f1'), t('plan_pro_f2'), t('plan_pro_f3'), t('plan_pro_f4'), t('plan_pro_f5'), t('plan_pro_f6'), t('plan_pro_f7'), t('plan_pro_f8')],
            missing: [t('plan_pro_m1'), t('plan_pro_m2'), t('plan_pro_m3')],
            cta: t('plan_pro_cta'),
            href: null,
            whatsapp: true,
        },
        {
            name: t('plan_premium_name'),
            price: '249',
            period: t('plan_per_month'),
            badge: t('plan_premium_badge'),
            badgeColor: 'bg-purple-600 text-white',
            description: t('plan_premium_desc'),
            color: 'border-purple-400 dark:border-purple-500 ring-2 ring-purple-500/20',
            headerBg: 'bg-purple-50 dark:bg-purple-900/20',
            ctaColor: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20',
            features: [t('plan_premium_f1'), t('plan_premium_f2'), t('plan_premium_f3'), t('plan_premium_f4'), t('plan_premium_f5'), t('plan_premium_f6')],
            missing: [],
            cta: t('plan_premium_cta'),
            href: null,
            whatsapp: true,
        },
    ];

    const STEPS = [
        { icon: <MessageCircle className="h-5 w-5" />, title: t('tarifs_s1_title'), desc: t('tarifs_s1_desc') },
        { icon: <Shield className="h-5 w-5" />,        title: t('tarifs_s2_title'), desc: t('tarifs_s2_desc') },
        { icon: <Zap className="h-5 w-5" />,           title: t('tarifs_s3_title'), desc: t('tarifs_s3_desc') },
    ];

    const FAQS = [
        { q: t('tarifs_q1'), a: t('tarifs_a1') },
        { q: t('tarifs_q2'), a: t('tarifs_a2') },
        { q: t('tarifs_q3'), a: t('tarifs_a3') },
        { q: t('tarifs_q4'), a: t('tarifs_a4') },
    ];

    return (
        <Layout>
            <Head>
                <title>{t('tarifs_seo_title')}</title>
                <meta name="description" content={t('tarifs_seo_desc')} />
                <link rel="canonical" href={`${window.location.origin}/tarifs`} />
            </Head>

            <div className="min-h-screen bg-white dark:bg-slate-900">
                {/* Hero */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
                            {t('tarifs_badge')}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{t('tarifs_title')}</h1>
                        <p className="text-slate-300 text-base max-w-xl mx-auto">{t('tarifs_subtitle')}</p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-14">

                    {/* Plans */}
                    <div className="grid gap-6 sm:grid-cols-3 mb-14">
                        {PLANS.map(plan => (
                            <div key={plan.name} className={`relative rounded-2xl border ${plan.color} bg-white dark:bg-slate-900 flex flex-col overflow-hidden`}>
                                {plan.badge && (
                                    <div className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.badgeColor}`}>
                                        {plan.badge}
                                    </div>
                                )}
                                <div className={`${plan.headerBg} px-6 py-5`}>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{plan.name}</p>
                                    <div className="flex items-end gap-1 mb-1">
                                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                                        {plan.period && <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">MAD {plan.period}</span>}
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
                                            href={`${waBase}${plan.name}`}
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
                                            {plan.cta} <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment activer */}
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 p-8 mb-14">
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white text-center mb-6">{t('tarifs_activate_title')}</h2>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {STEPS.map((s, i) => (
                                <div key={i} className="flex gap-4">
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
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white text-center mb-2">{t('tarifs_prix_title')}</h2>
                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8">{t('tarifs_prix_sub')}</p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-orange-50 dark:bg-orange-900/20 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-5 py-3 text-start font-semibold text-slate-700 dark:text-slate-300">{t('tarifs_col_metier')}</th>
                                        <th className="px-5 py-3 text-start font-semibold text-slate-700 dark:text-slate-300">{t('tarifs_col_intervention')}</th>
                                        <th className="px-5 py-3 text-start font-semibold text-slate-700 dark:text-slate-300">{t('tarifs_col_installation')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                    {PRIX_ROWS.map(row => (
                                        <tr key={row.metier_fr} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-white">{row.icon} {isAr ? row.metier_ar : row.metier_fr}</td>
                                            <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{row.intervention}</td>
                                            <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{row.installation}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-slate-400 text-center mt-3">{t('tarifs_prix_note')}</p>
                    </div>

                    {/* FAQ */}
                    <div className="mb-14">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white text-center mb-6">{t('tarifs_faq_title')}</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {FAQS.map(({ q, a }) => (
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
                        <h2 className="text-xl font-extrabold mb-2">{t('tarifs_cta_title')}</h2>
                        <p className="text-orange-100 text-sm mb-6 max-w-sm mx-auto">{t('tarifs_cta_sub')}</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href={`${waBase}Pro`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-orange-50 text-orange-600 font-bold px-6 py-3 text-sm transition-colors"
                            >
                                <MessageCircle className="h-4 w-4" /> {t('tarifs_cta_pro')}
                            </a>
                            <a
                                href={`${waBase}Premium`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 text-sm transition-colors border border-white/30"
                            >
                                {t('tarifs_cta_premium')}
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
