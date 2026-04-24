import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Head, router } from '@inertiajs/react';
import { Layout } from '../../components/Layout';
import { ProfessionalCard } from '../../components/ProfessionalCard';
import { SearchBar } from '../../components/SearchBar';
import { SkeletonCard } from '../../components/SkeletonCard';
import { Category, Paginated, Professional } from '../../types';
import { Filter, X, SlidersHorizontal, Star } from 'lucide-react';

type Props = {
  professionals: Paginated<Professional>;
  filters: Record<string, string>;
  categories: Category[];
};

function ActiveFilter({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 px-3 py-1 text-xs font-semibold">
      {label}
      <button type="button" onClick={onRemove} className="ml-1 hover:text-brand-900 dark:hover:text-brand-100">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function FilterButton({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-600 text-white'
          : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  );
}

export default function ProfessionalsPage({ professionals, filters, categories }: Props) {
  const [items, setItems]       = useState<Professional[]>(professionals.data);
  const [page, setPage]         = useState(professionals.current_page);
  const [lastPage, setLastPage] = useState(professionals.last_page);
  const [total, setTotal]       = useState(professionals.total);
  const [loading, setLoading]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);

  const navigate = (patch: Record<string, string | undefined>) => {
    const next = { ...filters, ...patch };
    // Remove undefined/empty keys
    Object.keys(next).forEach((k) => { if (!next[k]) delete next[k]; });
    router.get('/professionals', next, { preserveScroll: true, preserveState: true });
  };

  const clearFilter = (key: string) => navigate({ [key]: undefined });

  // Infinite scroll for subsequent pages
  useEffect(() => {
    const el = loader.current;
    if (!el) return;

    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || loading || page >= lastPage) return;
      setLoading(true);
      const params = new URLSearchParams({ ...filters, page: String(page + 1) });
      const res = await axios.get(`/api/professionals?${params.toString()}`);
      setItems((cur) => [...cur, ...res.data.data]);
      setPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
      setLoading(false);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [page, lastPage, loading, filters]);

  // Reset items on filter change (Inertia navigates to fresh page)
  useEffect(() => {
    setItems(professionals.data);
    setPage(professionals.current_page);
    setLastPage(professionals.last_page);
    setTotal(professionals.total);
  }, [professionals]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const Sidebar = () => (
    <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Filtres</h3>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => router.get('/professionals', {}, { preserveScroll: true })}
            className="text-xs text-brand-600 hover:text-brand-800 font-medium"
          >
            Tout effacer
          </button>
        )}
      </div>

      {/* Availability */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Disponibilité</p>
        <div className="flex flex-wrap gap-2">
          <FilterButton label="Disponible" active={filters.status === 'available'}
            onClick={() => navigate({ status: filters.status === 'available' ? undefined : 'available' })} />
          <FilterButton label="Occupé" active={filters.status === 'busy'}
            onClick={() => navigate({ status: filters.status === 'busy' ? undefined : 'busy' })} />
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Tri</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'latest',  label: 'Récent' },
            { value: 'rating',  label: 'Mieux notés' },
            { value: 'popular', label: 'Populaires' },
          ].map(({ value, label }) => (
            <FilterButton key={value} label={label}
              active={(filters.sort || 'latest') === value}
              onClick={() => navigate({ sort: value })} />
          ))}
        </div>
      </div>

      {/* Rating minimum */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Note minimum</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = Number(filters.rating_min) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => navigate({ rating_min: filters.rating_min === String(star) ? undefined : String(star) })}
                className="p-0.5 transition-transform hover:scale-110"
                title={`${star} étoile${star > 1 ? 's' : ''} minimum`}
              >
                <Star className={`h-6 w-6 ${active ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
              </button>
            );
          })}
          {filters.rating_min && (
            <button type="button" onClick={() => navigate({ rating_min: undefined })}
              className="ml-1 text-xs text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Language */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Langue</p>
        <div className="flex flex-wrap gap-2">
          {['Arabe', 'Français', 'Amazigh', 'Anglais'].map((lang) => (
            <FilterButton key={lang} label={lang}
              active={filters.language === lang}
              onClick={() => navigate({ language: filters.language === lang ? undefined : lang })} />
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Catégorie</p>
          <div className="flex flex-col gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate({ profession: filters.profession === cat.name ? undefined : cat.name })}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-left transition-colors ${
                  filters.profession === cat.name
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300 font-semibold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-base">{cat.icon ?? '🛠️'}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );

  const pageTitle = [
    filters.profession && `${filters.profession}s`,
    filters.city && `à ${filters.city}`,
  ].filter(Boolean).join(' ') || 'Professionnels';

  return (
    <Layout>
      <Head>
        <title>{`${pageTitle} | M3allemClick`}</title>
        <meta name="description" content={`Trouvez les meilleurs ${filters.profession || 'professionnels'} ${filters.city ? `à ${filters.city}` : 'au Maroc'}. Contact WhatsApp direct, avis vérifiés.`} />
      </Head>
      <section className="mx-auto max-w-7xl px-4 py-10">
        {/* Search bar */}
        <div className="mb-6">
          <SearchBar initialCity={filters.city} initialProfession={filters.profession} />
        </div>

        {/* Active filter badges */}
        {activeFilterCount > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-500 font-medium">Filtres actifs :</span>
            {filters.city && <ActiveFilter label={`Ville : ${filters.city}`} onRemove={() => clearFilter('city')} />}
            {filters.profession && <ActiveFilter label={`Métier : ${filters.profession}`} onRemove={() => clearFilter('profession')} />}
            {filters.search && <ActiveFilter label={`Recherche : ${filters.search}`} onRemove={() => clearFilter('search')} />}
            {filters.status && <ActiveFilter label={filters.status === 'available' ? 'Disponible' : 'Occupé'} onRemove={() => clearFilter('status')} />}
            {filters.sort && filters.sort !== 'latest' && (
              <ActiveFilter label={filters.sort === 'rating' ? 'Mieux notés' : 'Populaires'} onRemove={() => clearFilter('sort')} />
            )}
            {filters.rating_min && (
              <ActiveFilter label={`≥ ${filters.rating_min}★`} onRemove={() => clearFilter('rating_min')} />
            )}
            {filters.language && (
              <ActiveFilter label={`Langue : ${filters.language}`} onRemove={() => clearFilter('language')} />
            )}
          </div>
        )}

        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <p className="text-sm text-slate-500">{total.toLocaleString('fr-MA')} résultats</p>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
            {activeFilterCount > 0 && (
              <span className="h-5 w-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden mb-4">
            <Sidebar />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              <Sidebar />
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="hidden lg:flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                {total.toLocaleString('fr-MA')} professionnel{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
              </p>
              {activeFilterCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Filter className="h-3.5 w-3.5" />
                  {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''} actif{activeFilterCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {items.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 py-16 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">Aucun résultat</h3>
                <p className="text-sm text-slate-500 mb-4">Essayez de modifier vos filtres ou votre recherche.</p>
                <button
                  type="button"
                  onClick={() => router.get('/professionals', {}, { preserveScroll: true })}
                  className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
                >
                  Effacer tous les filtres
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((professional) => (
                    <ProfessionalCard key={professional.id} professional={professional} />
                  ))}
                  {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
                <div ref={loader} className="h-10" />
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
