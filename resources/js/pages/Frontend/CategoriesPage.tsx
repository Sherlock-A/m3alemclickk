import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCategoryIcon } from '../../utils/categoryIconMap';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    translations: { fr?: string; ar?: string; en?: string };
    sort_order: number;
}

interface Props {
    categories: Category[];
    seo: { title: string; description: string };
}

const ITEMS_PER_PAGE = 21; // 3 cols × 7 rows
const POPULAR_COUNT = 12; // 3 cols × 4 rows — grille complète

// Gradient palette for emoji fallbacks (deterministic by index)
const PALETTE = [
    'from-blue-600 to-blue-400',
    'from-purple-600 to-purple-400',
    'from-emerald-600 to-emerald-400',
    'from-pink-600 to-pink-400',
    'from-amber-600 to-amber-400',
    'from-teal-600 to-teal-400',
    'from-indigo-600 to-indigo-400',
    'from-rose-600 to-rose-400',
    'from-cyan-600 to-cyan-400',
    'from-orange-600 to-orange-400',
    'from-fuchsia-600 to-fuchsia-400',
    'from-lime-600 to-lime-400',
    'from-sky-600 to-sky-400',
    'from-violet-600 to-violet-400',
];

export default function CategoriesPage({ categories }: Props) {
    const { language, rtl } = useLanguage();
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    function label(cat: Category): string {
        return (
            cat.translations?.[language as keyof typeof cat.translations] ??
            cat.translations?.fr ??
            cat.name
        );
    }

    // Populaires = les POPULAR_COUNT premiers (grille fixe, toujours visible sans recherche)
    const showPopular = !search.trim();
    const popular = categories.slice(0, Math.min(POPULAR_COUNT, categories.length));

    // "Toutes les catégories" = liste sans les populaires (quand visible) ou résultats de recherche
    const allSource = showPopular
        ? categories.slice(POPULAR_COUNT)
        : categories.filter(c => label(c).toLowerCase().includes(search.toLowerCase()));

    const totalPages = Math.ceil(allSource.length / ITEMS_PER_PAGE);
    const paginated = allSource.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    function handleSearch(val: string) {
        setSearch(val);
        setPage(1);
    }

    function changePage(p: number) {
        setPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220]" dir={rtl ? 'rtl' : 'ltr'}>

                {/* ── Hero ─────────────────────────────────────────────────── */}
                <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0B1220] dark:via-[#0F1829] dark:to-[#0B1220] py-14 px-4 text-center border-b border-slate-200 dark:border-white/5">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        {t('cat_title_1')}{' '}
                        <span className="text-orange-500 dark:text-orange-400">{t('cat_title_2')}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 text-base max-w-xl mx-auto mb-8">
                        {t('cat_subtitle')}
                    </p>

                    <div className="relative max-w-md mx-auto">
                        <Search
                            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4 ${rtl ? 'right-3' : 'left-3'}`}
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            placeholder={t('cat_search_placeholder')}
                            className={`w-full bg-white dark:bg-[#161E2E] border border-slate-200 dark:border-white/10 rounded-xl py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500/50 transition-colors shadow-sm dark:shadow-none ${rtl ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
                        />
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">

                    {/* ── Populaires ───────────────────────────────────────── */}
                    {showPopular && popular.length > 0 && (
                        <section>
                            <SectionTitle rtl={rtl} pulse>
                                {t('cat_popular_label')}
                            </SectionTitle>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {popular.map((cat, i) => (
                                    <CategoryCard
                                        key={cat.id}
                                        cat={cat}
                                        label={label(cat)}
                                        index={i}
                                        popular
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── Toutes les catégories ────────────────────────────── */}
                    {paginated.length > 0 ? (
                        <section>
                            {showPopular && allSource.length > 0 && (
                                <SectionTitle rtl={rtl}>
                                    {t('cat_all_label')}
                                </SectionTitle>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {paginated.map((cat, i) => (
                                    <CategoryCard
                                        key={cat.id}
                                        cat={cat}
                                        label={label(cat)}
                                        index={(page - 1) * ITEMS_PER_PAGE + i}
                                    />
                                ))}
                            </div>

                            {/* ── Pagination ─────────────────────────────── */}
                            {totalPages > 1 && (
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    rtl={rtl}
                                    onChange={changePage}
                                />
                            )}
                        </section>
                    ) : !showPopular ? (
                        <div className="text-center py-24">
                            <p className="text-4xl mb-4">🔍</p>
                            <p className="text-lg font-medium text-slate-600 dark:text-gray-400 mb-1">{t('cat_empty')}</p>
                            <p className="text-sm text-slate-400 dark:text-gray-500">{t('cat_hint_q')}</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </Layout>
    );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function SectionTitle({
    children, rtl, pulse = false,
}: {
    children: React.ReactNode; rtl: boolean; pulse?: boolean;
}) {
    return (
        <div className={`flex items-center gap-2 mb-6 ${rtl ? 'flex-row-reverse' : ''}`}>
            {pulse && (
                <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.7)] animate-pulse" />
            )}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{children}</h2>
        </div>
    );
}

function CategoryCard({
    cat, label, index, popular = false,
}: {
    cat: Category; label: string; index: number; popular?: boolean;
}) {
    const { Icon, color, bgColor, isFallback } = getCategoryIcon(cat.slug);
    const searchParam = encodeURIComponent(cat.translations?.fr ?? cat.name);
    const gradientClass = PALETTE[index % PALETTE.length];

    return (
        <a
            href={`/professionals?profession=${searchParam}`}
            onClick={(e) => { e.preventDefault(); window.location.href = `/professionals?profession=${searchParam}`; }}
            className="group relative flex flex-col items-center gap-4 rounded-2xl bg-white dark:bg-[#161E2E] border border-slate-200 dark:border-white/5 p-6 text-center transition-all duration-200 hover:bg-slate-50 dark:hover:bg-[#1E2740] hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80 dark:hover:shadow-black/40 hover:border-orange-400/40 dark:hover:border-orange-500/25 shadow-sm dark:shadow-none"
        >
            {/* Glowing dot for popular */}
            {popular && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            )}

            {/* Icon bubble */}
            <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                    isFallback
                        ? `bg-gradient-to-br ${gradientClass}`
                        : bgColor
                }`}
            >
                {isFallback ? (
                    <span className="text-2xl leading-none select-none">{cat.icon}</span>
                ) : (
                    <Icon className={`w-7 h-7 ${color}`} />
                )}
            </div>

            {/* Label */}
            <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white leading-snug line-clamp-2 transition-colors">
                    {label}
                </p>
                {popular && (
                    <p className="text-[11px] font-medium text-orange-500 dark:text-orange-400">★ Top</p>
                )}
            </div>
        </a>
    );
}

function Pagination({
    page, totalPages, rtl, onChange,
}: {
    page: number; totalPages: number; rtl: boolean; onChange: (p: number) => void;
}) {
    const btnBase =
        'w-10 h-10 rounded-xl border text-sm font-medium transition-all flex items-center justify-center';
    const inactive =
        'bg-white dark:bg-[#161E2E] border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:border-orange-400/50 dark:hover:border-orange-500/50';
    const active =
        'bg-orange-500 border-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]';
    const disabled =
        'bg-slate-100 dark:bg-[#161E2E] border-slate-100 dark:border-white/5 text-slate-300 dark:text-gray-600 cursor-not-allowed opacity-40';

    return (
        <div className={`flex items-center justify-center gap-2 mt-10 flex-wrap ${rtl ? 'flex-row-reverse' : ''}`}>
            <button
                onClick={() => onChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`${btnBase} ${page === 1 ? disabled : inactive}`}
            >
                {rtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`${btnBase} ${p === page ? active : inactive}`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`${btnBase} ${page === totalPages ? disabled : inactive}`}
            >
                {rtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
        </div>
    );
}
