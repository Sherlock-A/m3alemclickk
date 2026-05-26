import { Head, Link } from '@inertiajs/react';
import { Layout } from '../../components/Layout';
import { Star, MapPin, CheckCircle, Zap, ChevronDown, ChevronRight, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

interface Pro {
    id: number;
    name: string;
    slug: string;
    profession: string;
    photo: string | null;
    rating: number;
    main_city: string;
    verified: boolean;
    is_available: boolean;
    completed_missions: number;
    views: number;
    category_id: number | null;
}

interface Faq {
    q: string;
    a: string;
}

interface Props {
    city: string;
    category: string;
    catSlug: string;
    pros: Pro[];
    faqs: Faq[];
    seoTitle: string;
    seoDesc: string;
    faqSchema: string;
    canonical: string;
}

const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = [
    'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10',
    'border-slate-400 bg-slate-50 dark:bg-slate-800/20',
    'border-amber-600 bg-amber-50 dark:bg-amber-900/10',
];

function Stars({ rating }: { rating: number }) {
    return (
        <span className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                />
            ))}
            <span className="ms-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {rating.toFixed(1)}
            </span>
        </span>
    );
}

function FaqItem({ faq, index }: { faq: Faq; index: number }) {
    const [open, setOpen] = useState(index === 0);
    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-start bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                aria-expanded={open}
            >
                <span className="font-medium text-slate-800 dark:text-slate-100 text-sm">{faq.q}</span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="px-5 pb-4 pt-2 bg-slate-50 dark:bg-slate-800/40 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.a}
                </div>
            )}
        </div>
    );
}

export default function LeaderboardPage({ city, category, catSlug, pros, faqSchema, canonical }: Props) {
    const { t } = useTranslation();
    const { language } = useLanguage();

    const catLabel = t(`top_cat_${catSlug}`, { defaultValue: category });
    const topProName = pros[0]?.name ?? null;

    const whatsappUrl = (pro: Pro) => `/api/whatsapp/${pro.id}`;

    const localFaqs: Faq[] = [
        {
            q: t('lb_faq1_q', { cat: catLabel, city }),
            a: topProName
                ? t('lb_faq1_a', { cat: catLabel, city, pro: topProName })
                : t('lb_faq1_a_empty', { cat: catLabel, city }),
        },
        {
            q: t('lb_faq2_q', { cat: catLabel, city }),
            a: t('lb_faq2_a', { cat: catLabel, city }),
        },
        {
            q: t('lb_faq3_q', { cat: catLabel, city }),
            a: t('lb_faq3_a', { cat: catLabel, city }),
        },
    ];

    const seoTitle = language === 'ar'
        ? `أفضل 10 ${catLabel} في ${city} — Jobly`
        : `Top 10 ${catLabel} à ${city} — Jobly`;
    const seoDesc = language === 'ar'
        ? `أفضل ${catLabel} الموثقين في ${city} مصنفون حسب تقييم العملاء. تواصل معهم مباشرة على واتساب.`
        : `Les meilleurs ${catLabel} vérifiés à ${city}, classés par note clients. Contactez-les directement sur WhatsApp.`;

    return (
        <Layout>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
                <link rel="canonical" href={canonical} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDesc} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonical} />
                <script type="application/ld+json">{faqSchema}</script>
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: language === 'ar' ? 'الرئيسية' : 'Accueil', item: '/' },
                        { '@type': 'ListItem', position: 2, name: `${catLabel} — ${city}`, item: `/professionnels/${city.toLowerCase()}/${catSlug}` },
                        { '@type': 'ListItem', position: 3, name: seoTitle },
                    ],
                })}</script>
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Trophy className="h-8 w-8 text-yellow-300" />
                            <span className="text-sm font-semibold bg-white/20 rounded-full px-3 py-1">
                                {t('lb_badge')}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
                            {t('lb_breadcrumb_top10')} {catLabel}<br />{language === 'ar' ? 'في' : 'à'} {city}
                        </h1>
                        <p className="text-orange-100 text-base max-w-xl mx-auto">
                            {t('lb_desc', { cat: catLabel, city })}
                        </p>

                        {/* Breadcrumb */}
                        <nav className="mt-6 flex items-center justify-center gap-2 text-xs text-orange-200" aria-label="Fil d'Ariane">
                            <Link href="/" className="hover:text-white transition-colors">
                                {t('nav_home')}
                            </Link>
                            <ChevronRight className="h-3 w-3 rtl:rotate-180" />
                            <Link href={`/professionnels/${city.toLowerCase()}/${catSlug}`} className="hover:text-white transition-colors">
                                {catLabel} — {city}
                            </Link>
                            <ChevronRight className="h-3 w-3 rtl:rotate-180" />
                            <span className="text-white font-medium">{t('lb_breadcrumb_top10')}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-10">
                    {/* Leaderboard */}
                    {pros.length === 0 ? (
                        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p className="font-semibold">{t('lb_empty', { city })}</p>
                            <p className="text-sm mt-2">{t('lb_empty_sub')}</p>
                            <Link
                                href={`/professionnels/${city.toLowerCase()}/${catSlug}`}
                                className="mt-6 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                            >
                                {t('lb_see_all_cat', { cat: catLabel })}
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pros.map((pro, index) => {
                                const isMedal = index < 3;
                                return (
                                    <div
                                        key={pro.id}
                                        className={`relative flex items-center gap-4 rounded-2xl border-2 p-4 transition-shadow hover:shadow-md bg-white dark:bg-slate-900 ${
                                            isMedal ? MEDAL_COLORS[index] : 'border-slate-100 dark:border-slate-800'
                                        }`}
                                    >
                                        {/* Rank */}
                                        <div className="flex-shrink-0 w-10 text-center">
                                            {isMedal ? (
                                                <span className="text-2xl leading-none">{MEDALS[index]}</span>
                                            ) : (
                                                <span className="text-lg font-bold text-slate-400 dark:text-slate-500">
                                                    #{index + 1}
                                                </span>
                                            )}
                                        </div>

                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            {pro.photo ? (
                                                <img
                                                    src={pro.photo.startsWith('http') ? pro.photo : `/storage/${pro.photo}`}
                                                    alt={pro.name}
                                                    className="h-14 w-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                                                />
                                            ) : (
                                                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-bold">
                                                    {pro.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Link
                                                    href={`/professionals/${pro.slug}`}
                                                    className="font-bold text-slate-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors truncate"
                                                >
                                                    {pro.name}
                                                </Link>
                                                {pro.verified && (
                                                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-500" />
                                                )}
                                                {pro.is_available && (
                                                    <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                        <Zap className="h-3 w-3" />
                                                        {t('available')}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{pro.profession}</p>
                                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                <Stars rating={pro.rating} />
                                                <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                                    <MapPin className="h-3 w-3" />
                                                    {pro.main_city}
                                                </span>
                                                {pro.completed_missions > 0 && (
                                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                                        {t('lb_missions', { n: pro.completed_missions })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="flex-shrink-0">
                                            <a
                                                href={whatsappUrl(pro)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
                                            >
                                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                                    <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.107 1.523 5.833L.057 23.885a.5.5 0 0 0 .611.611l6.053-1.466A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 11.999 0zm0 21.818a9.806 9.806 0 0 1-5.001-1.368l-.359-.214-3.718.9.918-3.719-.233-.372A9.808 9.808 0 0 1 2.182 12c0-5.418 4.4-9.818 9.818-9.818 5.417 0 9.818 4.4 9.818 9.818 0 5.417-4.401 9.818-9.819 9.818z"/>
                                                </svg>
                                                <span className="hidden sm:inline">{t('lb_contact')}</span>
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* CTA annuaire complet */}
                    <div className="mt-8 text-center">
                        <Link
                            href={`/professionnels/${city.toLowerCase()}/${catSlug}`}
                            className="inline-flex items-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                        >
                            {t('lb_see_all_city', { cat: catLabel, city })}
                            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                        </Link>
                    </div>

                    {/* FAQ Section */}
                    <section className="mt-14" aria-label={t('lb_faq_title')}>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
                            {t('lb_faq_title')}
                        </h2>
                        <div className="space-y-3">
                            {localFaqs.map((faq, i) => (
                                <FaqItem key={i} faq={faq} index={i} />
                            ))}
                        </div>
                    </section>

                    {/* Bottom note */}
                    <p className="mt-10 text-center text-xs text-slate-400 dark:text-slate-600">
                        {t('lb_updated', { n: pros.length })}
                    </p>
                </div>
            </div>
        </Layout>
    );
}
