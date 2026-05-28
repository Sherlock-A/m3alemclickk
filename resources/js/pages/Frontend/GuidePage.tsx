import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Layout } from '../../components/Layout';
import { Clock, ChevronRight, ArrowRight, BookOpen, Calendar, Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const CAT_MAP: Record<string, { fr: string; ar: string }> = {
    'Plomberie':     { fr: 'Plomberie',     ar: 'السباكة' },
    'Électricité':   { fr: 'Électricité',   ar: 'الكهرباء' },
    'Général':       { fr: 'Général',       ar: 'عام' },
    'Peinture':      { fr: 'Peinture',      ar: 'الطلاء' },
    'Menuiserie':    { fr: 'Menuiserie',    ar: 'النجارة' },
    'Maçonnerie':    { fr: 'Maçonnerie',    ar: 'البناء' },
    'Carrelage':     { fr: 'Carrelage',     ar: 'البلاط' },
    'Climatisation': { fr: 'Climatisation', ar: 'التكييف' },
    'Déménagement':  { fr: 'Déménagement',  ar: 'النقل' },
    'Jardinage':     { fr: 'Jardinage',     ar: 'الحدائق' },
    'Ménage':        { fr: 'Ménage',        ar: 'التنظيف' },
    'Serrurerie':    { fr: 'Serrurerie',    ar: 'الأقفال' },
};

const CAT_BADGE: Record<string, string> = {
    'Plomberie':     'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Électricité':   'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Général':       'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Peinture':      'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'Menuiserie':    'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Maçonnerie':    'bg-stone-500/20 text-stone-300 border-stone-500/30',
    'Carrelage':     'bg-teal-500/20 text-teal-300 border-teal-500/30',
    'Climatisation': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    'Déménagement':  'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Jardinage':     'bg-green-500/20 text-green-300 border-green-500/30',
    'Ménage':        'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'Serrurerie':    'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

const CAT_PROFESSION: Record<string, string> = {
    'Plomberie':     'Plombier',
    'Électricité':   'Électricien',
    'Peinture':      'Peintre',
    'Menuiserie':    'Menuisier',
    'Maçonnerie':    'Maçon',
    'Carrelage':     'Carreleur',
    'Climatisation': 'Climatisation',
    'Déménagement':  'Déménagement',
    'Jardinage':     'Jardinage',
    'Ménage':        'Femme de ménage',
    'Serrurerie':    'Serrurier',
};

const UI: Record<string, { fr: string; ar: string }> = {
    home:         { fr: 'Accueil',                ar: 'الرئيسية' },
    guides:       { fr: 'Guides',                 ar: 'الأدلة' },
    readTime:     { fr: 'min de lecture',         ar: 'دقيقة قراءة' },
    toc:          { fr: 'Sommaire',               ar: 'المحتويات' },
    ctaDesc:      { fr: 'Artisans vérifiés — WhatsApp direct — 0% commission', ar: 'حرفيون موثقون — واتساب مباشر — 0% عمولة' },
    related:      { fr: 'Guides similaires',      ar: 'أدلة مشابهة' },
    back:         { fr: '← Tous les guides',      ar: '→ جميع الأدلة' },
    ctaSidebar:   { fr: 'Besoin d\'un artisan ?', ar: 'تحتاج حرفياً؟' },
    ctaSidebarSub:{ fr: 'Artisans vérifiés, contact WhatsApp direct', ar: 'حرفيون موثقون، تواصل واتساب مباشر' },
    ctaSidebarBtn:{ fr: 'Trouver un artisan',     ar: 'ابحث عن حرفي' },
    share:        { fr: 'Partager',               ar: 'مشاركة' },
    shareCopied:  { fr: 'Lien copié !',           ar: 'تم نسخ الرابط!' },
};

interface Section { title: string; content: string; }
interface Cta { text: string; url: string; label: string; }
interface Article {
    slug: string; title: string; title_ar?: string | null;
    description: string; description_ar?: string | null;
    category: string; city: string | null; readTime: number;
    date: string; intro?: string | null; intro_ar?: string | null;
    sections: Section[]; sections_ar?: Section[] | null;
    cta: Cta; cta_ar?: Partial<Cta> | null;
}
interface RelatedArticle { slug: string; title: string; title_ar?: string | null; category: string; readTime: number; }
interface Props { article: Article; relatedArticles: RelatedArticle[]; canonical: string; }

function renderInline(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-white">$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function renderMarkdown(text: string | null | undefined): JSX.Element[] {
    try {
        if (!text) return [];
        const lines = text.split('\n');
        const elements: JSX.Element[] = [];
        let tableLines: string[] = [];
        let listItems: string[] = [];

        const flushList = () => {
            if (listItems.length === 0) return;
            elements.push(
                <ul key={elements.length} className="space-y-2 my-4">
                    {listItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^[-*✅❌]\s*/, '')) }} />
                        </li>
                    ))}
                </ul>
            );
            listItems = [];
        };

        const flushTable = () => {
            if (tableLines.length < 2) { tableLines = []; return; }
            const headers = tableLines[0].split('|').map(h => h.trim()).filter(Boolean);
            const rows = tableLines.slice(2).map(r => r.split('|').map(c => c.trim()).filter(Boolean));
            elements.push(
                <div key={elements.length} className="overflow-x-auto my-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-orange-50 dark:bg-orange-900/20">
                                {headers.map((h, i) => (
                                    <th key={i} className="px-4 py-2.5 text-start font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900">
                            {rows.map((row, i) => (
                                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 even:bg-slate-50/50 dark:even:bg-slate-800/20">
                                    {row.map((cell, j) => (
                                        <td key={j} className="px-4 py-2.5 text-slate-600 dark:text-slate-400"
                                            dangerouslySetInnerHTML={{ __html: renderInline(cell) }} />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            tableLines = [];
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('|')) {
                flushList();
                tableLines.push(line);
                continue;
            } else if (tableLines.length > 0) {
                flushTable();
            }
            if (line.match(/^[-*✅❌]/)) {
                listItems.push(line);
                continue;
            } else {
                flushList();
            }
            if (!line.trim()) {
                elements.push(<div key={elements.length} className="h-3" />);
            } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
                elements.push(
                    <p key={elements.length} className="font-bold text-slate-800 dark:text-white text-sm mt-5 mb-1">
                        {line.slice(2, -2)}
                    </p>
                );
            } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                elements.push(
                    <p key={elements.length} className="text-xs italic text-slate-400 dark:text-slate-500 mt-2">
                        {line.slice(1, -1)}
                    </p>
                );
            } else {
                elements.push(
                    <p key={elements.length} className="text-slate-600 dark:text-slate-300 text-sm leading-7"
                        dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
                );
            }
        }
        flushList();
        flushTable();
        return elements;
    } catch {
        return [<p key="err" className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{text ?? ''}</p>];
    }
}

function formatDate(dateStr: string, lang: string): string {
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-MA', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
        return dateStr;
    }
}

export default function GuidePage({ article, relatedArticles, canonical }: Props) {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const [activeSection, setActiveSection] = useState(-1);
    const [shareCopied, setShareCopied] = useState(false);

    const tr = (key: keyof typeof UI) => isAr ? UI[key].ar : UI[key].fr;
    const catEntry = CAT_MAP[article.category];
    const catLabel = catEntry ? (isAr ? catEntry.ar : catEntry.fr) : article.category;
    const catBadge = CAT_BADGE[article.category] ?? CAT_BADGE['Général'];

    const displayTitle    = isAr ? (article.title_ar    ?? article.title)    : article.title;
    const displayDesc     = isAr ? (article.description_ar ?? article.description) : article.description;
    const displayIntro    = isAr ? (article.intro_ar    ?? article.intro)    : article.intro;
    const displaySections = isAr ? (article.sections_ar ?? article.sections) : article.sections;
    const displayCta      = article.cta
        ? (isAr && article.cta_ar
            ? { ...article.cta, text: article.cta_ar.text ?? article.cta.text, label: article.cta_ar.label ?? article.cta.label }
            : article.cta)
        : null;

    const relArray = Array.isArray(relatedArticles) ? relatedArticles : [];
    const siteUrl  = canonical.replace(/\/guides\/.*$/, '');
    const proSearch = CAT_PROFESSION[article.category]
        ? `/professionals?profession=${encodeURIComponent(CAT_PROFESSION[article.category])}`
        : '/professionals';

    // IntersectionObserver: track active TOC section
    useEffect(() => {
        if (!displaySections || displaySections.length === 0) return;
        const observers: IntersectionObserver[] = [];
        displaySections.forEach((_, i) => {
            const el = document.getElementById(`section-${i}`);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(i); },
                { rootMargin: '-20% 0px -70% 0px' }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach(o => o.disconnect());
    }, [displaySections]);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({ title: displayTitle, url: canonical });
            } else {
                await navigator.clipboard.writeText(canonical);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
            }
        } catch { /* user cancelled */ }
    };

    // JSON-LD: Article + BreadcrumbList
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.description,
            datePublished: article.date,
            author: { '@type': 'Organization', name: 'Jobly', url: siteUrl },
            publisher: { '@type': 'Organization', name: 'Jobly', url: siteUrl },
            url: canonical,
            image: `${siteUrl}/images/og-guides.jpg`,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Guides', item: `${siteUrl}/guides` },
                { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
            ],
        },
    ];

    return (
        <Layout>
            <Head>
                <title>{displayTitle} — Jobly</title>
                <meta name="description" content={displayDesc} />
                <link rel="canonical" href={canonical} />
                <meta property="og:title" content={displayTitle} />
                <meta property="og:description" content={displayDesc} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonical} />
                <meta property="og:image" content={`${siteUrl}/images/og-guides.jpg`} />
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Head>

            {/* ── HERO ─────────────────────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-6xl mx-auto px-4 pt-6 pb-10">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">{tr('home')}</Link>
                        <ChevronRight className="h-3 w-3 rtl:rotate-180 text-slate-600" />
                        <Link href="/guides" className="hover:text-white transition-colors">{tr('guides')}</Link>
                        <ChevronRight className="h-3 w-3 rtl:rotate-180 text-slate-600" />
                        <span className="text-slate-300 truncate max-w-[200px]">{catLabel}</span>
                    </nav>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${catBadge}`}>
                            {catLabel}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock className="h-3.5 w-3.5" />
                            {article.readTime} {tr('readTime')}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(article.date, language)}
                        </span>
                        {article.city && (
                            <span className="text-xs text-slate-400">{article.city}</span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-4 max-w-3xl">
                        {displayTitle}
                    </h1>

                    {/* Intro */}
                    {displayIntro && (
                        <p className="text-slate-300 text-base leading-relaxed max-w-2xl border-s-4 border-orange-400 ps-4">
                            {displayIntro}
                        </p>
                    )}

                    {/* Share button */}
                    <button
                        onClick={handleShare}
                        className="mt-6 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-colors"
                    >
                        {shareCopied ? tr('shareCopied') : tr('share')}
                    </button>
                </div>
            </div>

            {/* ── MAIN ─────────────────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-900 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

                        {/* ── CONTENT ── */}
                        <div>
                            {/* TOC mobile (≤ lg) */}
                            {displaySections && displaySections.length > 2 && (
                                <div className="lg:hidden mb-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BookOpen className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{tr('toc')}</span>
                                    </div>
                                    <ol className="space-y-1.5">
                                        {displaySections.map((s, i) => (
                                            <li key={i}>
                                                <a href={`#section-${i}`}
                                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-2">
                                                    <span className="h-1 w-1 rounded-full bg-orange-400 shrink-0" />
                                                    {s.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {/* Sections */}
                            {displaySections && (
                                <div className="space-y-12">
                                    {displaySections.map((section, i) => (
                                        <section key={i} id={`section-${i}`}>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b-2 border-orange-100 dark:border-orange-900/30 flex items-center gap-3">
                                                <span className="h-6 w-1 rounded-full bg-orange-500 shrink-0" />
                                                {section.title}
                                            </h2>
                                            <div className="space-y-2 ps-4 border-s border-slate-100 dark:border-slate-800">
                                                {renderMarkdown(section.content)}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            )}

                            {/* CTA bottom */}
                            {displayCta && (
                                <div className="mt-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-7 text-white">
                                    <p className="font-bold text-lg mb-1">{displayCta.text}</p>
                                    <p className="text-orange-100 text-sm mb-5">{tr('ctaDesc')}</p>
                                    <a href={displayCta.url}
                                        className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                                        {displayCta.label} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                                    </a>
                                </div>
                            )}

                            {/* Related articles */}
                            {relArray.length > 0 && (
                                <div className="mt-12">
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-orange-500" />
                                        {tr('related')}
                                    </h2>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {relArray.map((rel) => (
                                            <Link key={rel.slug} href={`/guides/${rel.slug}`}
                                                className="group flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-md transition-all bg-white dark:bg-slate-900">
                                                <BookOpen className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                                                        {isAr ? (rel.title_ar ?? rel.title) : rel.title}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {rel.readTime} min
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Back link */}
                            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                                <Link href="/guides"
                                    className="text-sm text-slate-400 hover:text-orange-500 transition-colors inline-flex items-center gap-1.5">
                                    <ChevronRight className="h-3.5 w-3.5 rotate-180 rtl:rotate-0" />
                                    {tr('back')}
                                </Link>
                            </div>
                        </div>

                        {/* ── SIDEBAR (desktop only) ── */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-6 space-y-5">

                                {/* TOC */}
                                {displaySections && displaySections.length > 1 && (
                                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <BookOpen className="h-4 w-4 text-orange-500" />
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{tr('toc')}</span>
                                        </div>
                                        <ol className="space-y-1">
                                            {displaySections.map((s, i) => (
                                                <li key={i}>
                                                    <a href={`#section-${i}`}
                                                        className={`block text-xs py-1.5 px-2.5 rounded-lg transition-all leading-snug ${
                                                            activeSection === i
                                                                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-semibold'
                                                                : 'text-slate-500 dark:text-slate-400 hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                        }`}>
                                                        {s.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}

                                {/* CTA artisan */}
                                <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border border-orange-100 dark:border-orange-900/30 p-5">
                                    <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center mb-3">
                                        <Search className="h-5 w-5 text-white" />
                                    </div>
                                    <p className="font-bold text-sm text-slate-800 dark:text-white mb-1">{tr('ctaSidebar')} {catLabel}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{tr('ctaSidebarSub')}</p>
                                    <Link href={proSearch}
                                        className="block text-center bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2.5 text-xs font-bold transition-colors">
                                        {tr('ctaSidebarBtn')} <ArrowRight className="inline h-3.5 w-3.5 rtl:rotate-180" />
                                    </Link>
                                </div>

                                {/* Meta card */}
                                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-xs text-slate-500 dark:text-slate-400 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                                        {formatDate(article.date, language)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 shrink-0" />
                                        {article.readTime} {tr('readTime')}
                                    </div>
                                </div>

                            </div>
                        </aside>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
