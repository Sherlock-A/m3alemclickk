import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, ShieldCheck, Sparkles, Star, ArrowRight, BadgeCheck } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { SearchBar } from '../../components/SearchBar';
import { CategoryIcon } from '../../components/CategoryIcon';
import { useTranslation } from 'react-i18next';
import { Category, Professional } from '../../types';

type Props = {
  categories: Category[];
  featured: Professional[];
  stats: {
    professionals: number;
    verified: number;
    missions: number;
    cities: number;
  };
  geo?: { city?: string; source?: string } | null;
};

function FeaturedCard({ pro }: { pro: Professional }) {
  return (
    <a
      href={`/professionals/${pro.slug}`}
      className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Availability dot */}
      <span className={`absolute top-4 right-4 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
        pro.is_available ? 'bg-green-500' : 'bg-slate-400'
      }`} />

      <div className="flex items-center gap-3 mb-3">
        {pro.photo ? (
          <img src={pro.photo} alt={pro.name}
            className="h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
        ) : (
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-lg font-black text-white">
            {pro.name[0]}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-bold text-slate-900 dark:text-white truncate">{pro.name}</p>
            {pro.verified && <BadgeCheck className="h-4 w-4 text-brand-600 shrink-0" />}
          </div>
          <p className="text-sm text-brand-600 font-medium truncate">{pro.profession}</p>
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
          <span className="text-xs text-slate-400">Nouveau</span>
        )}
        <span className="text-xs font-semibold text-brand-600 group-hover:underline flex items-center gap-1">
          Voir le profil <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}

export default function HomePage({ categories, featured, stats, geo }: Props) {
  const { t } = useTranslation();

  const handleCategoryClick = (categoryName: string) => {
    router.get('/professionals', { profession: categoryName });
  };

  return (
    <Layout>
      <Head>
        <title>M3allemClick — Trouvez votre artisan au Maroc</title>
        <meta name="description" content="Plateforme marocaine pour trouver rapidement des artisans et professionnels vérifiés. Contact WhatsApp instantané, avis clients, géolocalisation." />
        <meta property="og:title" content="M3allemClick — Trouvez votre artisan au Maroc" />
        <meta property="og:description" content="Plombiers, électriciens, menuisiers et plus — contact direct en 30 secondes." />
        <meta property="og:type" content="website" />
      </Head>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-[1.2fr_.8fr] md:py-24">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">
            Maroc • WhatsApp • Appel immédiat
          </span>
          {geo?.city && (
            <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-brand-500" />
              Votre ville détectée : <strong className="text-slate-800 dark:text-white">{geo.city}</strong>
            </p>
          )}
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">
            {t('hero')}
          </h1>
          <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Trouvez rapidement un artisan ou un professionnel vérifié, proche de chez vous — contact WhatsApp instantané et avis clients authentiques.
          </p>
          <SearchBar initialCity={geo?.city} />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Professionnels', value: stats.professionals, icon: Briefcase },
              { label: 'Vérifiés',       value: stats.verified,      icon: ShieldCheck },
              { label: 'Missions',       value: stats.missions,      icon: Sparkles },
              { label: 'Villes',         value: stats.cities,        icon: MapPin },
            ].map((item) => (
              <div key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <item.icon className="mb-2 h-4 w-4 text-brand-600" />
                <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                  {item.value.toLocaleString('fr-MA')}
                </div>
                <div className="text-xs text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-[2rem] p-4 shadow-soft hidden md:block"
        >
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
            alt="Artisans professionnels au Maroc"
            className="h-full min-h-[380px] w-full rounded-[1.5rem] object-cover"
          />
        </motion.div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('categories')}</h2>
          <a href="/professionals" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Voir tout <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        {categories.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.name)}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700 text-left"
              >
                <div className="mb-3">
                  <CategoryIcon name={category.name} size={48} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{category.description}</p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">Aucune catégorie disponible.</p>
        )}
      </section>

      {/* ── Featured Professionals ────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Professionnels recommandés</h2>
              <p className="text-sm text-slate-500 mt-1">Vérifiés, disponibles et les mieux notés</p>
            </div>
            <a href="/professionals" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Tous les pros <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pro) => (
              <FeaturedCard key={pro.id} pro={pro} />
            ))}
          </div>
        </section>
      )}

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 mt-8">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-10 text-center">Comment ça marche ?</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Cherchez',
                desc: 'Recherchez par ville, métier ou compétence. Filtrez selon vos besoins.',
                icon: '🔍',
              },
              {
                step: '2',
                title: 'Comparez',
                desc: 'Consultez les profils, avis clients et portfolio photo de chaque artisan.',
                icon: '⭐',
              },
              {
                step: '3',
                title: 'Contactez',
                desc: 'Appelez ou envoyez un message WhatsApp directement depuis la plateforme.',
                icon: '📱',
              },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="mb-4 h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-3xl shadow-soft">
                  {icon}
                </div>
                <div className="h-6 w-6 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center mb-3">
                  {step}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
