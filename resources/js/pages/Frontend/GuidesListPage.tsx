import { Head, Link } from '@inertiajs/react';
import { Layout } from '../../components/Layout';
import { BookOpen, Clock, ChevronRight, ArrowRight } from 'lucide-react';

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
    'Plomberie':   'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    'Électricité': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
    'Général':     'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
};

export default function GuidesListPage({ articles }: Props) {
    return (
        <Layout>
            <Head>
                <title>Guides & Conseils Artisans au Maroc — Jobly</title>
                <meta name="description" content="Guides pratiques pour choisir le bon artisan au Maroc, connaître les tarifs, éviter les arnaques et réussir vos travaux." />
                <link rel="canonical" href={`${window.location.origin}/guides`} />
                <meta property="og:title" content="Guides & Conseils Artisans au Maroc — Jobly" />
                <meta property="og:description" content="Guides pratiques pour trouver et choisir les meilleurs artisans au Maroc." />
            </Head>

            <div className="min-h-screen bg-white dark:bg-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="h-6 w-6 text-orange-400" />
                            <span className="text-sm font-semibold text-orange-300">Guides Jobly</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                            Guides & Conseils
                        </h1>
                        <p className="text-slate-300 text-base max-w-xl">
                            Tout ce que vous devez savoir pour choisir le bon artisan, connaître les tarifs du marché et réussir vos travaux au Maroc.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8" aria-label="Fil d'Ariane">
                        <Link href="/" className="hover:text-orange-500 transition-colors">Accueil</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-slate-600 dark:text-slate-300">Guides</span>
                    </nav>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {articles.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/guides/${article.slug}`}
                                className="group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800 transition-all"
                            >
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CAT_COLORS[article.category] ?? CAT_COLORS['Général']}`}>
                                        {article.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                        <Clock className="h-3 w-3" />
                                        {article.readTime} min
                                    </span>
                                </div>
                                <h2 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                    {article.title}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                    {article.description}
                                </p>
                                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-orange-500 group-hover:gap-2 transition-all">
                                    Lire le guide <ArrowRight className="h-4 w-4" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-6 text-center">
                        <p className="font-bold text-slate-900 dark:text-white mb-2">Prêt à trouver votre artisan ?</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Plus de 100 artisans vérifiés disponibles dans votre ville.
                        </p>
                        <Link
                            href="/professionals"
                            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                        >
                            Trouver un artisan <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
