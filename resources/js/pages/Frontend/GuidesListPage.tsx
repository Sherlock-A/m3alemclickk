import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Layout } from '../../components/Layout';
import { BookOpen, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

interface ArticleSummary {
    slug: string;
    title: string;
    description: string;
    category: string;
    city: string | null;
    readTime: number;
    date: string;
}

interface Props {
    articles: ArticleSummary[];
}

const CAT_COLORS: Record<string, string> = {
    'Plomberie':     'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    'Électricité':   'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
    'Général':       'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
    'Peinture':      'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300',
    'Menuiserie':    'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
    'Maçonnerie':    'bg-stone-50 text-stone-700 dark:bg-stone-900/20 dark:text-stone-300',
    'Carrelage':     'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300',
    'Climatisation': 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300',
    'Déménagement':  'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
    'Jardinage':     'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    'Ménage':        'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300',
    'Serrurerie':    'bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300',
};

const CAT_I18N_KEY: Record<string, string> = {
    'Plomberie':     'cat_plomberie',
    'Électricité':   'cat_electricite',
    'Général':       'cat_general',
    'Peinture':      'cat_peinture',
    'Menuiserie':    'cat_menuiserie',
    'Maçonnerie':    'cat_maconnerie',
    'Carrelage':     'cat_carrelage',
    'Climatisation': 'cat_climatisation',
    'Déménagement':  'cat_demenagement',
    'Jardinage':     'cat_jardinage',
    'Ménage':        'cat_menage',
    'Serrurerie':    'cat_serrurerie',
};

export default function GuidesListPage({ articles }: Props) {
    const { t } = useTranslation();
    const { language } = useLanguage();

    const seoTitle = language === 'ar'
        ? 'أدلة ونصائح الحرفيين في المغرب — Jobly'
        : 'Guides & Conseils Artisans au Maroc — Jobly';
    const seoDesc = language === 'ar'
        ? 'أدلة عملية لاختيار الحرفي المناسب في المغرب، معرفة الأسعار، وتجنب الاحتيال.'
        : 'Guides pratiques pour choisir le bon artisan au Maroc, connaître les tarifs, éviter les arnaques et réussir vos travaux.';

    return (
        <Layout>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
                <link rel="canonical" href={`${window.location.origin}/guides`} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDesc} />
            </Head>

            <div className="min-h-screen bg-white dark:bg-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="h-6 w-6 text-orange-400" />
                            <span className="text-sm font-semibold text-orange-300">{t('guides_badge')}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                            {t('guides_title')}
                        </h1>
                        <p className="text-slate-300 text-base max-w-xl">
                            {t('guides_desc')}
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8" aria-label="breadcrumb">
                        <Link href="/" className="hover:text-orange-500 transition-colors">{t('nav_home')}</Link>
                        <ChevronRight className="h-3 w-3 rtl:rotate-180" />
                        <span className="text-slate-600 dark:text-slate-300">{t('guides_breadcrumb')}</span>
                    </nav>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {articles.map((article) => {
                            const catKey = CAT_I18N_KEY[article.category];
                            const catLabel = catKey ? t(catKey) : article.category;
                            const href = `/guides/${article.slug}`;
                            return (
                                <div
                                    key={article.slug}
                                    onClick={() => router.visit(href)}
                                    className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CAT_COLORS[article.category] ?? CAT_COLORS['Général']}`}>
                                            {catLabel}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                            <Clock className="h-3 w-3" />
                                            {t('guides_read_min', { n: article.readTime })}
                                        </span>
                                    </div>
                                    <h2 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                        {article.description}
                                    </p>
                                    <div className="mt-4">
                                        <Link
                                            href={href}
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            {t('guides_read_more')}
                                            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-6 text-center">
                        <p className="font-bold text-slate-900 dark:text-white mb-2">{t('guides_cta_title')}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            {t('guides_cta_desc')}
                        </p>
                        <Link
                            href="/professionals"
                            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                        >
                            {t('guides_cta_btn')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
