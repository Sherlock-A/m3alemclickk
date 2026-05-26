import { Head, Link } from '@inertiajs/react';
import { Layout } from '../../components/Layout';
import { Clock, ChevronRight, ArrowRight, BookOpen } from 'lucide-react';

interface Section {
    title: string;
    content: string;
}

interface Cta {
    text: string;
    url: string;
    label: string;
}

interface Article {
    slug: string;
    title: string;
    description: string;
    category: string;
    city: string | null;
    readTime: number;
    date: string;
    intro?: string | null;
    sections: Section[];
    cta: Cta;
}

interface RelatedArticle {
    slug: string;
    title: string;
    category: string;
    readTime: number;
}

interface Props {
    article: Article;
    relatedArticles: RelatedArticle[];
    canonical: string;
}

function renderMarkdown(text: string | null | undefined): JSX.Element[] {
    if (!text) return [];
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let tableLines: string[] = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={elements.length} className="space-y-1.5 my-3">
                    {listItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-sm">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^[-*✅❌]\s*/, '')) }} />
                        </li>
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    const flushTable = () => {
        if (tableLines.length < 2) { tableLines = []; return; }
        const headers = tableLines[0].split('|').map(h => h.trim()).filter(Boolean);
        const rows = tableLines.slice(2).map(r => r.split('|').map(c => c.trim()).filter(Boolean));
        elements.push(
            <div key={elements.length} className="overflow-x-auto my-4">
                <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800">
                            {headers.map((h, i) => (
                                <th key={i} className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800 even:bg-slate-50/50 dark:even:bg-slate-900/30">
                                {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-2.5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700" dangerouslySetInnerHTML={{ __html: renderInline(cell) }} />
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
            elements.push(<div key={elements.length} className="h-2" />);
        } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
            elements.push(
                <p key={elements.length} className="font-bold text-slate-800 dark:text-white text-sm mt-4 mb-1">
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
                <p key={elements.length} className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
            );
        }
    }
    flushList();
    flushTable();
    return elements;
}

function renderInline(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-white">$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export default function GuidePage({ article, relatedArticles, canonical }: Props) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        author: { '@type': 'Organization', name: 'Jobly' },
        publisher: { '@type': 'Organization', name: 'Jobly', url: window.location.origin },
        url: canonical,
    };

    return (
        <Layout>
            <Head>
                <title>{article.title} — Jobly Guides</title>
                <meta name="description" content={article.description} />
                <link rel="canonical" href={canonical} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.description} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonical} />
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Head>

            <div className="min-h-screen bg-white dark:bg-slate-900">
                <div className="max-w-3xl mx-auto px-4 py-10">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8" aria-label="Fil d'Ariane">
                        <Link href="/" className="hover:text-orange-500 transition-colors">Accueil</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/guides" className="hover:text-orange-500 transition-colors">Guides</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{article.category}</span>
                    </nav>

                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-semibold bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full">
                                {article.category}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Clock className="h-3 w-3" />
                                {article.readTime} min de lecture
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                            {article.title}
                        </h1>
                        <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed border-l-4 border-orange-400 pl-4">
                            {article.intro}
                        </p>
                    </header>

                    {/* Table of contents */}
                    {article.sections.length > 2 && (
                        <div className="mb-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Sommaire</span>
                            </div>
                            <ol className="space-y-1.5">
                                {article.sections.map((s, i) => (
                                    <li key={i}>
                                        <a
                                            href={`#section-${i}`}
                                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-1.5"
                                        >
                                            <span className="h-1 w-1 rounded-full bg-orange-400" />
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Content sections */}
                    <div className="space-y-10">
                        {article.sections.map((section, i) => (
                            <section key={i} id={`section-${i}`}>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                                    {section.title}
                                </h2>
                                <div className="space-y-2">
                                    {renderMarkdown(section.content)}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                        <p className="font-bold text-lg mb-1">{article.cta.text}</p>
                        <p className="text-orange-100 text-sm mb-4">Artisans vérifiés — contact WhatsApp direct — 0% commission</p>
                        <a
                            href={article.cta.url}
                            className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                        >
                            {article.cta.label} <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>

                    {/* Related articles */}
                    {relatedArticles.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Guides similaires</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {relatedArticles.map((rel) => (
                                    <Link
                                        key={rel.slug}
                                        href={`/guides/${rel.slug}`}
                                        className="group flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-sm transition-all bg-white dark:bg-slate-900"
                                    >
                                        <BookOpen className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                                                {rel.title}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {rel.readTime} min
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back to guides */}
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <Link
                            href="/guides"
                            className="text-sm text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-1"
                        >
                            ← Tous les guides
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
