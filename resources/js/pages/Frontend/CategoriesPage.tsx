import { Search } from 'lucide-react';
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

const POPULAR_COUNT = 14;

export default function CategoriesPage({ categories }: Props) {
    const { language, rtl } = useLanguage();
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    function label(cat: Category): string {
        return (
            cat.translations?.[language as keyof typeof cat.translations] ??
            cat.translations?.fr ??
            cat.name
        );
    }

    const popular = categories.slice(0, POPULAR_COUNT);

    const filtered = search.trim()
        ? categories.filter(c => label(c).toLowerCase().includes(search.toLowerCase()))
        : categories;

    const showPopular = !search.trim();

    return (
        <Layout>
            <div className="min-h-screen bg-[#0B1220]" dir={rtl ? 'rtl' : 'ltr'}>
                {/* ── Hero ─────────────────────────────────────────────────── */}
                <div className="bg-gradient-to-br from-[#0B1220] via-[#0F1829] to-[#0B1220] py-14 px-4 text-center border-b border-white/5">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                        {t('cat_title_1')}{' '}
                        <span className="text-orange-400">{t('cat_title_2')}</span>
                    </h1>
                    <p className="text-gray-400 text-base max-w-xl mx-auto mb-8">
                        {t('cat_subtitle')}
                    </p>

                    {/* Search */}
                    <div className="relative max-w-md mx-auto">
                        <Search
                            className={`absolute top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 ${rtl ? 'right-3' : 'left-3'}`}
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={t('cat_search_placeholder')}
                            className={`w-full bg-[#161E2E] border border-white/10 rounded-xl py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500/50 transition-colors ${rtl ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
                        />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
                    {/* ── Popular section ──────────────────────────────────── */}
                    {showPopular && popular.length > 0 && (
                        <section>
                            <div className={`flex items-center gap-2 mb-6 ${rtl ? 'flex-row-reverse' : ''}`}>
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                <h2 className="text-lg font-semibold text-white">
                                    {t('cat_popular_label')}
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                                {popular.map(cat => (
                                    <CategoryCard key={cat.id} cat={cat} label={label(cat)} popular />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── All categories / search results ──────────────────── */}
                    {filtered.length > 0 ? (
                        <section>
                            {showPopular && (
                                <h2 className="text-lg font-semibold text-white mb-6">
                                    {t('cat_all_label')}
                                </h2>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                                {filtered.map(cat => (
                                    <CategoryCard key={cat.id} cat={cat} label={label(cat)} />
                                ))}
                            </div>
                        </section>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-lg mb-1">{t('cat_empty')}</p>
                            <p className="text-sm">{t('cat_hint_q')}</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

function CategoryCard({
    cat,
    label,
    popular = false,
}: {
    cat: Category;
    label: string;
    popular?: boolean;
}) {
    const { Icon, color, bgColor } = getCategoryIcon(cat.slug);
    const searchParam = encodeURIComponent(cat.translations?.fr ?? cat.name);

    return (
        <a
            href={`/professionals?profession=${searchParam}`}
            className="group flex flex-col items-center gap-3 rounded-2xl bg-[#161E2E] border border-white/5 p-4 text-center transition-all duration-200 hover:bg-[#1E2740] hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30 hover:border-white/10"
        >
            {/* Icon bubble */}
            <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
                <Icon className={`w-6 h-6 ${color}`} />
                {popular && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-[#161E2E]" />
                )}
            </div>

            {/* Label */}
            <span className="text-xs font-medium text-gray-300 group-hover:text-white leading-tight line-clamp-2 transition-colors">
                {label}
            </span>

            {/* Popular badge */}
            {popular && (
                <span className="text-[10px] font-semibold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full leading-none">
                    ★ Top
                </span>
            )}
        </a>
    );
}
