import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../components/Layout';
import { ProfessionalCard } from '../../components/ProfessionalCard';
import { SearchBar } from '../../components/SearchBar';
import { SkeletonCard } from '../../components/SkeletonCard';
import { CategoryIcon } from '../../components/CategoryIcon';
import { Category, Paginated, Professional } from '../../types';
import { Filter, X, SlidersHorizontal, Star, MapPin, Loader2, GitCompare, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { ComparePanel } from '../../components/ComparePanel';
import { useCatName } from '../../hooks/useCatName';

type Props = {
  professionals: Paginated<Professional>;
  filters: Record<string, string>;
  categories: Category[];
  seo?: { title?: string; description?: string; canonical?: string; h1?: string };
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

function EmptyLeadForm({ profession, city, onClear }: { profession?: string; city?: string; onClear: () => void }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSending(true);
    try {
      const profLabel = profession || t('professionals');
      const msg = encodeURIComponent(
        `Bonjour Jobly 👋\nJe cherche un *${profLabel}*${city ? ` à *${city}*` : ''} et je n'ai pas trouvé de résultat.\nMon numéro : ${phone}\nMerci de me rappeler.`
      );
      window.open(`https://wa.me/212600000000?text=${msg}`, '_blank');
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-dashed border-orange-200 dark:border-orange-800 bg-orange-50/60 dark:bg-orange-900/10 p-10 text-center"
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="sent" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white">{t('empty_sent_title')}</h3>
            <p className="text-sm text-slate-500">{t('empty_sent_sub')}</p>
            <button type="button" onClick={onClear} className="mt-2 text-sm text-orange-600 font-semibold hover:underline flex items-center gap-1">
              {t('empty_see_all')} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ) : (
          <motion.div key="form" className="flex flex-col items-center gap-4 max-w-sm mx-auto">
            <div className="text-5xl">🔍</div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
              {t('empty_title', { profession: profession || t('professionals') })}{city ? ` — ${city}` : ''}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('empty_sub')}
            </p>
            <form onSubmit={submit} className="w-full flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('empty_phone_placeholder')}
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : '📲'} WhatsApp
                </button>
              </div>
            </form>
            <button type="button" onClick={onClear} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline">
              {t('empty_see_all_available')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProfessionalsPage({ professionals, filters, categories, seo }: Props) {
  const { t } = useTranslation();
  const getCatName = useCatName();
  const [items, setItems]       = useState<Professional[]>(professionals.data);
  const [page, setPage]         = useState(professionals.current_page);
  const [lastPage, setLastPage] = useState(professionals.last_page);
  const [total, setTotal]       = useState(professionals.total);
  const [loading, setLoading]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [geoLoading, setGeoLoading]    = useState(false);
  const [geoError, setGeoError]        = useState<string | null>(null);
  const [compareList, setCompareList]  = useState<Professional[]>([]);
  const loader = useRef<HTMLDivElement | null>(null);

  const toggleCompare = (p: Professional) => {
    setCompareList((cur) =>
      cur.find((x) => x.id === p.id)
        ? cur.filter((x) => x.id !== p.id)
        : cur.length < 3 ? [...cur, p] : cur
    );
  };

  const navigate = (patch: Record<string, string | undefined>) => {
    const next = { ...filters, ...patch };
    Object.keys(next).forEach((k) => { if (!next[k]) delete next[k]; });
    router.get('/professionals', next, { preserveScroll: true, preserveState: true });
  };

  const clearFilter = (key: string) => navigate({ [key]: undefined });

  const locateMe = () => {
    if (!navigator.geolocation) {
      setGeoError(t('pros_geo_unsupported'));
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setGeoLoading(false);
        navigate({ lat: String(coords.latitude), lon: String(coords.longitude), radius_km: '50', city: undefined });
      },
      () => {
        setGeoLoading(false);
        setGeoError(t('pros_geo_denied'));
      },
      { timeout: 8000 },
    );
  };

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

  useEffect(() => {
    setItems(professionals.data);
    setPage(professionals.current_page);
    setLastPage(professionals.last_page);
    setTotal(professionals.total);
  }, [professionals]);

  const activeFilterCount = (() => {
    const { lat, lon, radius_km, ...rest } = filters;
    return Object.values(rest).filter(Boolean).length + (lat ? 1 : 0);
  })();

  const LANGUAGES = [
    { value: 'Arabe',    label: t('pros_lang_arabic') },
    { value: 'Français', label: t('pros_lang_french') },
    { value: 'Amazigh',  label: t('pros_lang_amazigh') },
    { value: 'Anglais',  label: t('pros_lang_english') },
  ];

  const Sidebar = () => (
    <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{t('pros_filters')}</h3>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => router.get('/professionals', {}, { preserveScroll: true })}
            className="text-xs text-brand-600 hover:text-brand-800 font-medium"
          >
            {t('pros_clear_all')}
          </button>
        )}
      </div>

      {/* Geo */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pros_location')}</p>
        {filters.lat ? (
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm text-brand-700 dark:text-brand-300 font-medium">
              <MapPin className="inline h-3.5 w-3.5 mr-1" />
              {t('pros_in_radius', { km: filters.radius_km || 50 })}
            </span>
            <button type="button" onClick={() => navigate({ lat: undefined, lon: undefined, radius_km: undefined })}
              className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={locateMe}
            disabled={geoLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 px-3 py-2 text-sm font-medium hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors disabled:opacity-60"
          >
            {geoLoading
              ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('pros_locating')}</>
              : <><MapPin className="h-4 w-4" /> {t('pros_near_me')}</>}
          </button>
        )}
        {geoError && <p className="mt-1.5 text-xs text-red-500">{geoError}</p>}
      </div>

      {/* Availability */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pros_availability')}</p>
        <div className="flex flex-wrap gap-2">
          <FilterButton label={t('available')} active={filters.status === 'available'}
            onClick={() => navigate({ status: filters.status === 'available' ? undefined : 'available' })} />
          <FilterButton label={t('busy')} active={filters.status === 'busy'}
            onClick={() => navigate({ status: filters.status === 'busy' ? undefined : 'busy' })} />
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pros_sort')}</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'latest',  label: t('pros_sort_recent') },
            { value: 'rating',  label: t('pros_sort_best') },
            { value: 'popular', label: t('pros_sort_popular') },
          ].map(({ value, label }) => (
            <FilterButton key={value} label={label}
              active={(filters.sort || 'latest') === value}
              onClick={() => navigate({ sort: value })} />
          ))}
        </div>
      </div>

      {/* Rating minimum */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pros_rating_min')}</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = Number(filters.rating_min) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => navigate({ rating_min: filters.rating_min === String(star) ? undefined : String(star) })}
                className="p-0.5 transition-transform hover:scale-110"
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
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pros_language')}</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(({ value, label }) => (
            <FilterButton key={value} label={label}
              active={filters.language === value}
              onClick={() => navigate({ language: filters.language === value ? undefined : value })} />
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pros_category')}</p>
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
                <CategoryIcon name={cat.name} size={20} />
                {getCatName(cat)}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );

  const pageTitle = seo?.title ?? (
    [
      filters.profession && `${filters.profession}s`,
      filters.city && `à ${filters.city}`,
    ].filter(Boolean).join(' ') || t('professionals')
  );

  return (
    <Layout>
      <Head>
        <title>{`${pageTitle} | Jobly`}</title>
        <meta name="description" content={seo?.description ?? `Trouvez les meilleurs ${filters.profession || 'professionnels'} ${filters.city ? `à ${filters.city}` : 'au Maroc'}. Contact WhatsApp direct, avis vérifiés.`} />
        {seo?.canonical && <link rel="canonical" href={seo.canonical} />}
      </Head>
      <section className="mx-auto max-w-7xl px-4 py-10">
        {seo?.h1 && (
          <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-4">
            {seo.h1}
          </h1>
        )}
        <div className="mb-6">
          <SearchBar initialCity={filters.city} initialProfession={filters.profession} />
        </div>

        {/* Active filter badges */}
        {activeFilterCount > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-500 font-medium">{t('pros_active_filters')}</span>
            {filters.city && <ActiveFilter label={t('pros_filter_city', { city: filters.city })} onRemove={() => clearFilter('city')} />}
            {filters.profession && <ActiveFilter label={t('pros_filter_job', { job: filters.profession })} onRemove={() => clearFilter('profession')} />}
            {filters.search && <ActiveFilter label={t('pros_filter_search', { q: filters.search })} onRemove={() => clearFilter('search')} />}
            {filters.status && <ActiveFilter label={filters.status === 'available' ? t('available') : t('busy')} onRemove={() => clearFilter('status')} />}
            {filters.sort && filters.sort !== 'latest' && (
              <ActiveFilter label={filters.sort === 'rating' ? t('pros_sort_best') : t('pros_sort_popular')} onRemove={() => clearFilter('sort')} />
            )}
            {filters.rating_min && (
              <ActiveFilter label={`≥ ${filters.rating_min}★`} onRemove={() => clearFilter('rating_min')} />
            )}
            {filters.language && (
              <ActiveFilter label={LANGUAGES.find(l => l.value === filters.language)?.label ?? filters.language} onRemove={() => clearFilter('language')} />
            )}
            {filters.lat && (
              <ActiveFilter label={t('pros_filter_radius', { km: filters.radius_km || 50 })} onRemove={() => navigate({ lat: undefined, lon: undefined, radius_km: undefined })} />
            )}
          </div>
        )}

        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <p className="text-sm text-slate-500">{t('pros_results', { n: total.toLocaleString('fr-MA') })}</p>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t('pros_filters')}
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
                {t('pros_results', { n: total.toLocaleString('fr-MA') })}
              </p>
              {activeFilterCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Filter className="h-3.5 w-3.5" />
                  {activeFilterCount}
                </span>
              )}
            </div>

            {items.length === 0 && !loading ? (
              <EmptyLeadForm
                profession={filters.profession}
                city={filters.city}
                onClear={() => router.get('/professionals', {}, { preserveScroll: true })}
              />
            ) : (
              <>
                <motion.div
                  className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                >
                  {items.map((professional) => (
                    <motion.div
                      key={professional.id}
                      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <ProfessionalCard
                        professional={professional}
                        onCompare={toggleCompare}
                        inCompare={!!compareList.find((x) => x.id === professional.id)}
                        compareDisabled={compareList.length >= 3}
                      />
                    </motion.div>
                  ))}
                  {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} delay={i * 80} />)}
                </motion.div>
                <div ref={loader} className="h-10" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Floating compare badge (appears when 1 item selected) */}
      {compareList.length === 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl px-5 py-3">
          <GitCompare className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {t('pros_compare_hint')}
          </span>
          <button type="button" onClick={() => setCompareList([])} className="text-slate-400 hover:text-red-500 ml-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Compare panel (2–3 pros) */}
      {compareList.length >= 2 && (
        <ComparePanel
          pros={compareList}
          onRemove={(id) => setCompareList((cur) => cur.filter((x) => x.id !== id))}
          onClose={() => setCompareList([])}
        />
      )}
    </Layout>
  );
}
