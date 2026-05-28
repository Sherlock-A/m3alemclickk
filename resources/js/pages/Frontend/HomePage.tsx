import { useEffect, useRef, useState, ElementType, useCallback } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Briefcase, MapPin, ShieldCheck, Sparkles, ArrowRight, BadgeCheck, Star, Phone, MessageCircle, Award, Zap, ChevronLeft, ChevronRight, AlertTriangle, X, Loader2, CheckCircle } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { SearchBar } from '../../components/SearchBar';
import { Category, Professional } from '../../types';
import { useCatName } from '../../hooks/useCatName';
import { getCategoryIcon } from '../../utils/categoryIconMap';

type Testimonial = {
  id: number;
  client_name: string;
  rating: number;
  comment: string;
  professional?: { id: number; name: string; profession: string; main_city: string } | null;
};

type Props = {
  categories: Category[];
  featured: Professional[];
  stats: {
    professionals: number;
    verified: number;
    missions: number;
    cities: number;
    avg_rating?: number;
    weekly_contacts?: number;
  };
  testimonials?: Testimonial[];
  geo?: { city?: string; source?: string } | null;
};

// Maps a category name to its i18n key
const CAT_KEYS: Record<string, string> = {
  'plomberie': 'cat_plomberie',
  'electricite': 'cat_electricite',
  'electricité': 'cat_electricite',
  'électricité': 'cat_electricite',
  'peinture': 'cat_peinture',
  'climatisation': 'cat_climatisation',
  'menuiserie': 'cat_menuiserie',
  'ménage': 'cat_menage',
  'menage': 'cat_menage',
  'maçonnerie': 'cat_maconnerie',
  'maconnerie': 'cat_maconnerie',
  'serrurerie': 'cat_serrurerie',
  'jardinage': 'cat_jardinage',
  'informatique': 'cat_informatique',
  'déménagement': 'cat_demenagement',
  'demenagement': 'cat_demenagement',
  'soudure': 'cat_soudure',
  'carrelage': 'cat_carrelage',
  'vitrerie': 'cat_vitrerie',
  'chauffage': 'cat_chauffage',
  'décoration': 'cat_decoration',
  'decoration': 'cat_decoration',
  'nettoyage': 'cat_nettoyage',
  'charpenterie': 'cat_charpenterie',
  'aluminium': 'cat_aluminium',
  'ferronnerie': 'cat_ferronnerie',
  'cuisine': 'cat_cuisine',
  'marbre': 'cat_marbre',
  'toiture': 'cat_toiture',
  'coiffure': 'cat_coiffure',
};

function getCatKey(name: string): string {
  return CAT_KEYS[name.toLowerCase()] ?? ('cat_' + name.toLowerCase().replace(/\s+/g, '_'));
}

// ── Animated counter hook ──────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

// ── Futuristic stat card ───────────────────────────────────────────────────
function StatCard({
  label, target, icon: Icon, started, delay,
}: {
  label: string; target: number; icon: ElementType; started: boolean; delay: number;
}) {
  const value   = useCountUp(target, 1800, started);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const nx = (e.clientX - left) / width;
    const ny = (e.clientY - top) / height;
    setTilt({ x: (ny - 0.5) * -12, y: (nx - 0.5) * 12 });
    setGlow({ x: nx * 100, y: ny * 100 });
  }, []);

  const onLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
    setHovered(false);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.88, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.33, 1, 0.68, 1] }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
      className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 backdrop-blur-sm p-5 shadow-[0_4px_24px_rgba(249,115,22,0.10)] dark:border-white/10 dark:bg-slate-900/60"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(249,115,22,0.22) 0%, transparent 65%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
      <div className="pointer-events-none absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/20" />
      <div className="relative z-10">
        <div className="mb-3 inline-flex rounded-xl bg-orange-500/10 p-2.5 ring-1 ring-orange-500/20">
          <Icon className="h-5 w-5 text-orange-500" />
        </div>
        <div className="text-3xl font-black tabular-nums text-slate-900 dark:text-white leading-none">
          {value.toLocaleString('fr-MA')}
          <span className="text-orange-500">+</span>
        </div>
        <div className="mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-b-2xl"
        style={{ width: started ? '100%' : '0%', transition: `width 1.8s cubic-bezier(0.33,1,0.68,1) ${delay}s` }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 transition-all duration-300"
        style={{ boxShadow: hovered ? '0 0 20px rgba(249,115,22,0.25), inset 0 0 0 1px rgba(249,115,22,0.3)' : 'none' }}
      />
    </motion.div>
  );
}

// ── Featured card ──────────────────────────────────────────────────────────
function FeaturedCard({ pro, proNew }: { pro: Professional; proNew: string }) {
  return (
    <a
      href={`/professionals/${pro.slug}`}
      className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <span className={`absolute top-4 right-4 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
        pro.is_available ? 'bg-green-500' : 'bg-slate-400'
      }`} />

      <div className="flex items-center gap-3 mb-3">
        {pro.photo ? (
          <img src={pro.photo} alt={pro.name}
            className="h-20 w-20 rounded-full object-cover border-2 border-orange-200 dark:border-orange-800"
            loading="lazy" decoding="async" />
        ) : (
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-lg font-black text-white">
            {pro.name[0]}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-bold text-slate-900 dark:text-white truncate">{pro.name}</p>
            {pro.verified && <BadgeCheck className="h-4 w-4 text-orange-500 shrink-0" />}
          </div>
          <p className="text-sm text-orange-600 font-medium truncate">{pro.profession}</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
        <MapPin className="h-3 w-3 shrink-0" /> {pro.main_city}
      </p>

      {pro.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">{pro.description}</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        {pro.rating > 0 ? (
          <span className="flex items-center gap-1 text-sm text-amber-500 font-semibold">
            <Star className="h-4 w-4 fill-amber-400" />
            {pro.rating.toFixed(1)}
          </span>
        ) : (
          <span className="text-xs text-slate-400">{proNew}</span>
        )}
        <div className="flex items-center gap-2">
          <a
            href={`/api/whatsapp/${pro.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 rounded-lg bg-green-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </a>
          <a
            href={`/api/call/${pro.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white dark:bg-slate-700 hover:bg-slate-800 transition-colors"
          >
            <Phone className="h-3 w-3" />
            {/* "Appel" stays same in all languages */}
            Appel
          </a>
        </div>
      </div>
    </a>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
const CAT_PER_PAGE = 12;

export default function HomePage({ categories, featured, stats, testimonials, geo }: Props) {
  const { t } = useTranslation();
  const getCatName = useCatName();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [catPage, setCatPage] = useState(1);

  // SOS modal state
  const [showSos, setShowSos]       = useState(false);
  const [sosCity, setSosCity]       = useState(geo?.city ?? '');
  const [sosCatId, setSosCatId]     = useState('');
  const [sosMsg, setSosMsg]         = useState('');
  const [sosName, setSosName]       = useState('');
  const [sosSending, setSosSending] = useState(false);
  const [sosResult, setSosResult]   = useState<string | null>(null);
  const catTotalPages = Math.ceil(categories.length / CAT_PER_PAGE);
  const catPaged = categories.slice((catPage - 1) * CAT_PER_PAGE, catPage * CAT_PER_PAGE);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    router.get('/professionals', { profession: categoryName });
  };

  return (
    <Layout>
      <Head>
        <title>Jobly — Trouvez votre artisan au Maroc</title>
        <meta name="description" content="Plateforme marocaine pour trouver rapidement des artisans et professionnels vérifiés. Contact WhatsApp instantané, avis clients, géolocalisation." />
        <meta property="og:title" content="Jobly — Trouvez votre artisan au Maroc" />
        <meta property="og:description" content="Plombiers, électriciens, menuisiers et plus — contact direct en 30 secondes." />
        <meta property="og:type" content="website" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 md:pt-24 md:pb-14">
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <span className="inline-flex rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
            {t('hero_badge')}
          </span>

          {geo?.city && (
            <p className="flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-orange-500" />
              {t('hero_city_detected')} <strong className="text-slate-800 dark:text-white">{geo.city}</strong>
            </p>
          )}

          <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl leading-tight">
            {geo?.city ? (
              <>
                Trouvez votre{' '}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">artisan</span>
                {' '}à{' '}
                <span className="text-orange-500">{geo.city}</span>
              </>
            ) : t('hero')}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('hero_p')}
          </p>

          <SearchBar initialCity={geo?.city} />

          {/* Social proof counter */}
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <strong className="text-slate-700 dark:text-slate-200">{stats.professionals}+</strong>
              {' '}{t('home_artisans_actifs')}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <strong className="text-slate-700 dark:text-slate-200">{(stats.avg_rating ?? 4.8).toFixed(1)}/5</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            {stats.weekly_contacts != null && stats.weekly_contacts > 0 ? (
              <span className="font-medium text-orange-600 dark:text-orange-400">🔥 {stats.weekly_contacts}+ {t('home_contacts_week')}</span>
            ) : (
              <span className="font-medium text-orange-600 dark:text-orange-400">{stats.cities}+ {t('home_villes')}</span>
            )}
          </p>

          {/* Quick actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <a
              href="/professionals?status=available"
              className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
            >
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {t('home_disponibles')}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </a>
            <button
              onClick={() => { setSosCity(geo?.city ?? ''); setSosResult(null); setShowSos(true); }}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 animate-pulse"
            >
              {t('home_besoin_urgent')}
            </button>
            <a
              href="/pro/register"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              {t('home_etes_artisan')}{' '}
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {t('home_creer_profil')}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: t('trust_reviews_label'), sub: t('trust_reviews_sub'), color: 'text-green-600' },
              { icon: Zap,        label: t('trust_fast_label'),    sub: t('trust_fast_sub'),   color: 'text-orange-500' },
              { icon: Award,      label: t('trust_free_label'),    sub: t('trust_free_sub'),   color: 'text-purple-600' },
            ].map(({ icon: Icon, label, sub, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className={`shrink-0 rounded-xl bg-white dark:bg-slate-800 p-2.5 shadow-sm ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats KPIs ───────────────────────────────────────────────────── */}
      <section ref={statsRef} className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label={t('professionals_registered')} target={stats.professionals} icon={Briefcase}  started={statsVisible} delay={0} />
          <StatCard label={t('cities_covered')}           target={stats.cities}        icon={MapPin}     started={statsVisible} delay={0.1} />
          <StatCard label="Contacts ce mois"              target={stats.missions}      icon={Sparkles}   started={statsVisible} delay={0.2} />
          <StatCard label="Artisans vérifiés"             target={stats.verified}      icon={BadgeCheck} started={statsVisible} delay={0.3} />
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('categories')}</h2>
          <a href="/categories" className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            {t('cat_see_all')} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        {categories.length > 0 ? (
          <>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {catPaged.map((category, i) => {
                const { Icon, color, bgColor, isFallback } = getCategoryIcon(category.slug);
                return (
                  <motion.button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryClick(category.name)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-soft hover:border-orange-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-700 text-left"
                  >
                    <div className={`mb-3 w-14 h-14 rounded-2xl flex items-center justify-center ${isFallback ? 'bg-orange-50 dark:bg-orange-900/20' : bgColor}`}>
                      {isFallback
                        ? <span className="text-2xl leading-none">{category.icon ?? '🔧'}</span>
                        : <Icon className={`w-7 h-7 ${color}`} />
                      }
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors text-sm leading-snug">
                      {getCatName(category)}
                    </h3>
                  </motion.button>
                );
              })}
            </div>

            {/* Pagination */}
            {catTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCatPage(p => Math.max(1, p - 1))}
                  disabled={catPage === 1}
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:border-orange-400 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: catTotalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCatPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all ${
                      p === catPage
                        ? 'bg-orange-500 border-orange-500 text-white shadow shadow-orange-300/40'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-orange-400 hover:text-orange-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCatPage(p => Math.min(catTotalPages, p + 1))}
                  disabled={catPage === catTotalPages}
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:border-orange-400 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-slate-400 text-sm">{t('cat_none')}</p>
        )}
      </section>

      {/* ── Featured Professionals ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('feat_title')}</h2>
            <p className="text-sm text-slate-500 mt-1">{t('feat_sub')}</p>
          </div>
          <a href="/professionals" className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            {t('feat_all')} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        {featured.length > 0 ? (
          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {featured.map((pro) => (
              <motion.div
                key={pro.id}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
              >
                <FeaturedCard pro={pro} proNew={t('pro_new')} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10 p-10 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{t('feat_discover')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-sm mx-auto">
              {t('feat_discover_sub')}
            </p>
            <a
              href="/professionals"
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-sm font-bold transition-colors shadow-lg shadow-orange-500/20"
            >
              {t('feat_explore')} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 mt-8">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-10 text-center">{t('hiw_section_title')}</h2>
          <div className="grid gap-8 sm:grid-cols-3">

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 relative">
                <svg viewBox="0 0 48 48" width="64" height="64" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                  <rect width="48" height="48" rx="12" fill="#3b82f6"/>
                  <circle cx="20" cy="20" r="11" fill="none" stroke="white" strokeWidth="4"/>
                  <circle cx="17" cy="17" r="4" fill="white" opacity="0.2"/>
                  <line x1="28" y1="28" x2="40" y2="40" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                </svg>
                <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shadow">1</div>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 mt-3">{t('hiw_step1_title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('hiw_step1_desc')}</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 relative">
                <svg viewBox="0 0 48 48" width="64" height="64" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                  <rect width="48" height="48" rx="12" fill="#f59e0b"/>
                  <rect x="5" y="12" width="16" height="24" rx="4" fill="white" opacity="0.95"/>
                  <rect x="8" y="17" width="10" height="2" rx="1" fill="#f59e0b" opacity="0.5"/>
                  <rect x="8" y="21" width="7" height="2" rx="1" fill="#f59e0b" opacity="0.35"/>
                  <rect x="27" y="12" width="16" height="24" rx="4" fill="white"/>
                  <rect x="30" y="17" width="10" height="2" rx="1" fill="#f59e0b" opacity="0.5"/>
                  <path d="M32 30 L33 28 L34 30 L36 30 L34.5 31.5 L35 33.5 L33 32 L31 33.5 L31.5 31.5 L30 30 Z" fill="#f59e0b"/>
                  <circle cx="24" cy="24" r="6" fill="#0f172a"/>
                  <text x="24" y="27.5" fontFamily="Outfit,sans-serif" fontWeight="800" fontSize="7" fill="white" textAnchor="middle">VS</text>
                </svg>
                <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shadow">2</div>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 mt-3">{t('hiw_step2_title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('hiw_step2_desc')}</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 relative">
                <svg viewBox="0 0 48 48" width="64" height="64" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                  <rect width="48" height="48" rx="12" fill="#25d366"/>
                  <path d="M8 10 Q8 6 12 6 L36 6 Q40 6 40 10 L40 28 Q40 32 36 32 L20 32 L12 40 L14 32 L12 32 Q8 32 8 28 Z" fill="white" opacity="0.95"/>
                  <circle cx="18" cy="20" r="3" fill="#25d366" opacity="0.7"/>
                  <circle cx="26" cy="20" r="3" fill="#25d366"/>
                  <circle cx="34" cy="20" r="3" fill="#25d366" opacity="0.7"/>
                  <circle cx="38" cy="38" r="8" fill="#0f172a"/>
                  <path d="M34.5 35.5 C34.5 35.5 35.5 34.5 36.5 34.5 C37 34.5 37.5 35 37.5 35 L38.5 36.5 C38.5 37 38 37.5 38 37.5 C38 37.5 39 39 40 39.5 C40 39.5 40.5 39 41 39 L42 39.5 C42.5 40 42.5 41 42 41.5 C41.5 42 40.5 42.5 39.5 42 C37.5 41 35 38.5 34.5 36.5 C34.5 36 34.5 35.5 34.5 35.5 Z" fill="white"/>
                </svg>
                <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-green-600 text-white text-xs font-black flex items-center justify-center shadow">3</div>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 mt-3">{t('hiw_step3_title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('hiw_step3_desc')}</p>
            </div>

          </div>
        </div>
      </section>
      {/* ── Artisans CTA section ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-600 dark:to-orange-900 p-8 md:p-12 relative overflow-hidden">
          {/* Background pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white" />
            <div className="absolute bottom-4 left-12 w-20 h-20 rounded-full bg-white" />
            <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-white" />
          </div>

          <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white mb-4">
                {t('cta_pro_badge')}
              </span>
              <h2 className="text-3xl font-black text-white mb-3 leading-tight">
                {t('cta_pro_title')}
              </h2>
              <p className="text-orange-100 text-sm mb-6 max-w-md">
                {t('cta_pro_desc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/pro/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50 transition-colors shadow-lg"
                >
                  <Sparkles className="h-4 w-4" />
                  {t('cta_pro_register')}
                </a>
                <a
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  {t('how_it_works')} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '📱', titleKey: 'cta_feat_direct_title',     descKey: 'cta_feat_direct_desc' },
                { emoji: '🎯', titleKey: 'cta_feat_commission_title', descKey: 'cta_feat_commission_desc' },
                { emoji: '⭐', titleKey: 'cta_feat_reviews_title',    descKey: 'cta_feat_reviews_desc' },
                { emoji: '📊', titleKey: 'cta_feat_stats_title',      descKey: 'cta_feat_stats_desc' },
              ].map(({ emoji, titleKey, descKey }) => (
                <div key={titleKey} className="rounded-2xl bg-white/15 backdrop-blur-sm p-4 border border-white/20">
                  <div className="text-2xl mb-2">{emoji}</div>
                  <h3 className="text-sm font-bold text-white mb-1">{t(titleKey)}</h3>
                  <p className="text-xs text-orange-100 leading-relaxed">{t(descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('testi_title')}</h2>
          <p className="text-sm text-slate-500 mt-2">{t('testi_sub')}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {(() => {
            const COLORS = ['from-orange-400 to-orange-600', 'from-rose-400 to-orange-400', 'from-sky-400 to-blue-600'];
            const FALLBACK = [
              { name: 'Karim B.', city: 'Casablanca', rating: 5, text: "J'ai trouvé un plombier en moins de 5 minutes. Il est arrivé le jour même et a réglé la fuite sans surprise sur la facture. Je recommande !", job: 'Plomberie' },
              { name: 'Fatima-Zahra A.', city: 'Rabat', rating: 5, text: "J'ai contacté 3 peintres via WhatsApp directement depuis Jobly. Super facile, devis clairs, travail impeccable. La plateforme change la vie.", job: 'Peinture' },
              { name: 'Youssef M.', city: 'Marrakech', rating: 5, text: "Mon électricien est venu le lendemain matin. Travail propre, rapide et prix honnête. Je reviens sur Jobly pour chaque besoin à la maison.", job: 'Électricité' },
            ];
            const items = testimonials && testimonials.length >= 3
              ? testimonials.map((t) => ({
                  name: t.client_name,
                  city: t.professional?.main_city ?? '',
                  rating: t.rating,
                  text: t.comment,
                  job: t.professional?.profession ?? '',
                }))
              : FALLBACK;
            return items.map(({ name, city, rating, text, job }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col gap-4 shadow-soft hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">"{text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-sm font-black text-white shrink-0`}>
                    {name[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{name}</p>
                    <p className="text-xs text-slate-500">
                      {city && <>{city} · </>}{t('testi_by')} <span className="text-orange-600 font-medium">{job}</span>
                    </p>
                  </div>
                  <BadgeCheck className="h-4 w-4 text-emerald-500 ms-auto shrink-0" />
                </div>
              </motion.div>
            ));
          })()}
        </div>
      </section>


      {/* ── Top Artisans Leaderboard links ───────────────────────────── */}
      <section className="border-t border-slate-100 dark:border-slate-800 bg-gradient-to-b from-orange-50/50 to-transparent dark:from-orange-950/10 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              🏆 {t('top_pros_title')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('top_pros_sub')}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { city: 'Casablanca', cat: 'plomberie',     catKey: 'top_cat_plomberie',     emoji: '🔧', slug: 'plomberie' },
              { city: 'Casablanca', cat: 'electricite',   catKey: 'top_cat_electricite',   emoji: '⚡', slug: 'electricite' },
              { city: 'Casablanca', cat: 'menage',        catKey: 'top_cat_menage',        emoji: '🧹', slug: 'menage' },
              { city: 'Rabat',      cat: 'plomberie',     catKey: 'top_cat_plomberie',     emoji: '🔧', slug: 'plomberie' },
              { city: 'Rabat',      cat: 'electricite',   catKey: 'top_cat_electricite',   emoji: '⚡', slug: 'electricite' },
              { city: 'Marrakech',  cat: 'climatisation', catKey: 'top_cat_climatisation', emoji: '❄️', slug: 'climatisation' },
            ].map(({ city, catKey, emoji, slug }) => (
              <a
                key={`${city}-${slug}`}
                href={`/top-artisans/${city.toLowerCase()}/${slug}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 hover:border-orange-300 hover:shadow-sm dark:hover:border-orange-700 transition-all group"
              >
                <span className="text-2xl shrink-0">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    Top 10 {t(catKey)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{city}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-orange-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOS Urgence modal ─────────────────────────────────────────── */}
      {showSos && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSos(false)} />

          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl p-6 animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🚨</span>
              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-white">{t('sos_title')}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('sos_subtitle')}</p>
              </div>
              <button onClick={() => setShowSos(false)} className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            {sosResult ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="font-semibold text-slate-800 dark:text-white">{sosResult}</p>
                <button
                  onClick={() => setShowSos(false)}
                  className="mt-4 w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 transition-colors"
                >
                  {t('sos_close')}
                </button>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setSosSending(true);
                try {
                  const res = await axios.post('/api/sos', {
                    city:        sosCity,
                    category_id: sosCatId || undefined,
                    message:     sosMsg || undefined,
                    client_name: sosName || undefined,
                  });
                  setSosResult(res.data.message);
                } catch {
                  setSosResult(t('sos_error'));
                } finally {
                  setSosSending(false);
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{t('sos_city_label')}</label>
                  <input
                    required
                    value={sosCity}
                    onChange={e => setSosCity(e.target.value)}
                    placeholder={t('sos_city_placeholder')}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{t('sos_service_type')}</label>
                  <select
                    value={sosCatId}
                    onChange={e => setSosCatId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">{t('sos_all_services')}</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{t('sos_name_label')}</label>
                  <input
                    value={sosName}
                    onChange={e => setSosName(e.target.value)}
                    placeholder={t('sos_name_placeholder')}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{t('sos_desc_label')}</label>
                  <textarea
                    value={sosMsg}
                    onChange={e => setSosMsg(e.target.value)}
                    placeholder={t('sos_desc_placeholder')}
                    rows={2}
                    maxLength={300}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sosSending || !sosCity.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3.5 text-sm transition-colors"
                >
                  {sosSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                  {sosSending ? t('sos_sending') : t('sos_submit')}
                </button>
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-500">
                  {t('sos_privacy')}
                </p>
              </form>
            )}
          </div>
        </div>
      )}

    </Layout>
  );
}
