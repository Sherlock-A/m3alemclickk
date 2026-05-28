import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../components/Layout';
import { ProfessionalCard } from '../../components/ProfessionalCard';
import { SearchBar } from '../../components/SearchBar';
import { SkeletonCard } from '../../components/SkeletonCard';
import { getCategoryIcon } from '../../utils/categoryIconMap';
import { Category, Paginated, Professional } from '../../types';
import { Filter, X, SlidersHorizontal, Star, MapPin, Loader2, GitCompare, Phone, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { ComparePanel } from '../../components/ComparePanel';
import { useCatName } from '../../hooks/useCatName';

type LandingData = {
  faqs: { q: string; a: string }[];
  price: { min: number; max: number; unit: string; label: string } | null;
  related: { city: string; url: string }[];
  faqSchema: string;
};

type Props = {
  professionals: Paginated<Professional>;
  filters: Record<string, string>;
  categories: Category[];
  suggestions?: Professional[];
  available_count?: number;
  landing?: LandingData | null;
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
  const { t, i18n } = useTranslation();
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSending(true);
    try {
      const profLabel = profession || t('professionals');
      const isAr = i18n.language === 'ar';
      const cityPart = city ? (isAr ? ` في *${city}*` : ` à *${city}*`) : '';
      const msg = encodeURIComponent(
        isAr
          ? `مرحباً Jobly 👋\nأبحث عن *${profLabel}*${cityPart} ولم أجد نتيجة.\nرقمي: ${phone}\nشكراً لإعادة الاتصال.`
          : `Bonjour Jobly 👋\nJe cherche un *${profLabel}*${cityPart} et je n'ai pas trouvé de résultat.\nMon numéro : ${phone}\nMerci de me rappeler.`
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

function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-slate-800 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            {item.q}
            <ChevronDown className={`h-4 w-4 shrink-0 ml-4 text-slate-400 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && (
            <p className="pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProfessionalsPage({ professionals, filters, categories, suggestions, available_count, landing, seo }: Props) {
  const { t } = useTranslation();
  const getCatName = useCatName();
  const [items, setItems]       = useState<Professional[]>(professionals.data);
  const [page, setPage]         = useState(professionals.current_page);
  const [lastPage, setLastPage] = useState(professionals.last_page);
  const [total, setTotal]       = useState(professionals.total);
  const [loading, setLoading]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catPage, setCatPage]          = useState(1);
  const CAT_PER_PAGE = 8;
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

  const catTotalPages = categories.length > 0 ? Math.ceil(categories.length / CAT_PER_PAGE) : 0;
  const catSlice = categories.slice((catPage - 1) * CAT_PER_PAGE, catPage * CAT_PER_PAGE);

  const sidebar = (
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
          <button
            type="button"
            onClick={() => navigate({ status: filters.status === 'available' ? undefined : 'available' })}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filters.status === 'available'
                ? 'bg-green-600 text-white'
                : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            {t('available')}
            {available_count != null && available_count > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filters.status === 'available' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                {available_count}
              </span>
            )}
          </button>
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pros_category')}</p>
            {catTotalPages > 1 && (
              <span className="text-xs text-slate-400 dark:text-slate-500">{catPage}/{catTotalPages}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {catSlice.map((cat) => {
              const { Icon, color, bgColor, isFallback } = getCategoryIcon(cat.slug);
              const isActive = filters.profession === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => navigate({ profession: isActive ? undefined : cat.name })}
                  className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-left transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-orange-100 dark:bg-orange-900/30' : bgColor}`}>
                    {isFallback
                      ? <span className="text-sm leading-none">{cat.icon ?? '🔧'}</span>
                      : <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600 dark:text-orange-400' : color}`} />
                    }
                  </span>
                  <span className="truncate">{getCatName(cat)}</span>
                </button>
              );
            })}
          </div>
          {catTotalPages > 1 && (
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCatPage(p => Math.max(1, p - 1))}
                disabled={catPage === 1}
                className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Préc.
              </button>
              <div className="flex gap-1">
                {Array.from({ length: catTotalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCatPage(p)}
                    className={`w-5 h-5 rounded text-[10px] font-medium transition-colors ${
                      p === catPage
                        ? 'bg-orange-500 text-white'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCatPage(p => Math.min(catTotalPages, p + 1))}
                disabled={catPage === catTotalPages}
                className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Suiv.
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
        {landing?.faqSchema && (
          <script type="application/ld+json">{landing.faqSchema}</script>
        )}
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

        {/* Disponibles maintenant — quick CTA when no status filter */}
        {!filters.status && available_count != null && available_count > 0 && (
          <button
            type="button"
            onClick={() => navigate({ status: 'available' })}
            className="mb-4 w-full flex items-center justify-between gap-3 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm font-semibold text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {available_count} artisan{available_count > 1 ? 's' : ''} disponible{available_count > 1 ? 's' : ''} maintenant
            </span>
            <span className="text-xs font-medium opacity-70">Voir →</span>
          </button>
        )}

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
            {sidebar}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              {sidebar}
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
              <>
                <EmptyLeadForm
                  profession={filters.profession}
                  city={filters.city}
                  onClear={() => router.get('/professionals', {}, { preserveScroll: true })}
                />
                {suggestions && suggestions.length > 0 && (
                  <div className="mt-12">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-2">
                        {t('suggestions_title')}
                      </p>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <motion.div
                      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                      initial="hidden"
                      animate="visible"
                      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                    >
                      {suggestions.map((professional) => (
                        <motion.div
                          key={professional.id}
                          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                          transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                        >
                          <ProfessionalCard professional={professional} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                )}
              </>
            ) : (
              <>
                <motion.div
                  className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                >
                  {items.map((professional, idx) => (
                    <motion.div
                      key={professional.id}
                      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                      className="relative"
                    >
                      {/* Rank badge — shown only on city×category SEO pages, first 3 results */}
                      {landing && idx < 3 && page === 1 && (
                        <div className="absolute -top-2 -left-2 z-10 flex items-center gap-1">
                          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm shadow-md border-2 border-white dark:border-slate-900 ${
                            idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-slate-300' : 'bg-orange-300'
                          }`}>
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                          </span>
                        </div>
                      )}
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

      {/* SEO landing sections (only on /professionnels/{city}/{category}) */}
      {landing && (
        <div className="mx-auto max-w-7xl px-4 pb-16 space-y-10">

          {/* Price estimate */}
          {landing.price && (
            <div className="rounded-3xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-orange-900/10 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-4xl shrink-0">💰</div>
              <div>
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-0.5">
                  Tarif indicatif — {landing.price.label}
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {landing.price.min} – {landing.price.max} <span className="text-base font-semibold text-slate-500">MAD</span>
                  <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">{landing.price.unit}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Prix moyens constatés à {filters.city ? filters.city.charAt(0).toUpperCase() + filters.city.slice(1) : 'votre ville'}. Demandez un devis gratuit aux artisans ci-dessus.
                </p>
              </div>
            </div>
          )}

          {/* FAQ */}
          {landing.faqs.length > 0 && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6">
              <h2 className="text-lg font-black text-slate-800 dark:text-white mb-4">Questions fréquentes</h2>
              <FaqAccordion items={landing.faqs} />
            </div>
          )}

          {/* Cross-city links */}
          {landing.related.length > 0 && filters.profession && (
            <div>
              <h2 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-3">
                {filters.profession.charAt(0).toUpperCase() + filters.profession.slice(1)}s dans d'autres villes
              </h2>
              <div className="flex flex-wrap gap-2">
                {landing.related.map(({ city, url }) => (
                  <a
                    key={city}
                    href={url}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-orange-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    <MapPin className="h-3 w-3 opacity-60" />
                    {city}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
