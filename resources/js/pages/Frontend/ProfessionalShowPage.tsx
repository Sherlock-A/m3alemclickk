import { useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import {
  Heart, MapPin, MessageCircle, Phone, ShieldCheck,
  Star, Send, CheckCircle, AlertCircle,
} from 'lucide-react';
import { Layout } from '../../components/Layout';
import { Professional } from '../../types';
import { RatingStars } from '../../components/RatingStars';
import { PortfolioLightbox } from '../../components/PortfolioLightbox';
import { ProfessionalBadges } from '../../components/ProfessionalBadges';
import { QRCodeCard } from '../../components/QRCodeCard';
import { PriceEstimator } from '../../components/PriceEstimator';

type Props = { professional: Professional };

const FAV_KEY = 'client_favorites';
function getFavIds(): number[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]'); } catch { return []; }
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="text-2xl transition-transform hover:scale-110"
        >
          <Star
            className={`h-6 w-6 ${i <= (hover || value) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProfessionalShowPage({ professional }: Props) {
  const [isFav, setIsFav] = useState(() => getFavIds().includes(professional.id));

  // Review form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName]         = useState('');
  const [rating, setRating]     = useState(5);
  const [comment, setComment]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [reviewError, setReviewError] = useState('');

  const toggleFav = () => {
    const ids = getFavIds();
    const next = ids.includes(professional.id)
      ? ids.filter((id) => id !== professional.id)
      : [...ids, professional.id];
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setIsFav(next.includes(professional.id));
  };

  const track = async (type: 'whatsapp_click' | 'call') => {
    await axios.post('/api/track', {
      professional_id: professional.id,
      type,
      meta: { slug: professional.slug },
    }).catch(() => null);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setReviewError('Votre nom est requis.'); return; }
    if (rating < 1)   { setReviewError('Veuillez sélectionner une note.'); return; }
    setSubmitting(true);
    setReviewError('');
    try {
      await axios.post('/api/reviews', {
        professional_id: professional.id,
        client_name: name.trim(),
        rating,
        comment: comment.trim(),
      });
      setSubmitted(true);
      setShowForm(false);
    } catch {
      setReviewError("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const seoTitle = `${professional.name} — ${professional.profession} à ${professional.main_city} | M3allemClick`;
  const seoDesc  = professional.description
    ? professional.description.slice(0, 155)
    : `Contactez ${professional.name}, ${professional.profession} à ${professional.main_city}. Profil vérifié sur M3allemClick.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: professional.name,
    description: professional.description || seoDesc,
    url: `${window.location.origin}/professionals/${professional.slug}`,
    image: professional.photo ?? undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: professional.main_city,
      addressCountry: 'MA',
    },
    ...(professional.rating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: professional.rating.toFixed(1),
        reviewCount: (professional.reviews || []).length || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <Layout>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        {professional.photo && <meta property="og:image" content={professional.photo} />}
        <meta property="og:type" content="profile" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* ── Left column ── */}
          <div className="space-y-6">

            {/* Hero card */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
              {/* Avatar section */}
              <div className="relative flex flex-col items-center pt-8 pb-4 bg-gradient-to-br from-orange-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                {/* Fav button */}
                <button
                  onClick={toggleFav}
                  className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-500 hover:text-red-500'
                  }`}
                  title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart className={`h-5 w-5 ${isFav ? 'fill-white' : ''}`} />
                </button>
                {professional.photo ? (
                  <img
                    src={professional.photo}
                    alt={professional.name}
                    className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-3xl font-black text-white shadow-lg border-4 border-white dark:border-slate-700">
                    {professional.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-5 p-6">
                {/* Name + status */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{professional.name}</h1>
                      {professional.verified && <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                      {professional.profession} &bull; <span className="text-slate-700 dark:text-slate-300 font-medium">{professional.main_city}</span>
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    professional.status === 'available'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {professional.status === 'available' ? '● Disponible' : '● Occupé'}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <RatingStars value={professional.rating} />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{professional.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({(professional.reviews || []).length} avis)</span>
                </div>

                {/* Badges */}
                <ProfessionalBadges professional={professional} />

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`/api/whatsapp/${professional.id}`}
                    onClick={() => track('whatsapp_click')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors shadow-md"
                  >
                    <MessageCircle className="h-4 w-4" /> Contacter sur WhatsApp
                  </a>
                  <a
                    href={`tel:${professional.phone}`}
                    onClick={() => track('call')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors shadow-md"
                  >
                    <Phone className="h-4 w-4" /> Appeler
                  </a>
                </div>

                {/* Description */}
                {professional.description && (
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{professional.description}</p>
                )}
              </div>
            </div>

            {/* Portfolio */}
            {(professional.portfolio || []).length > 0 && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-xl font-black text-slate-800 dark:text-white">🖼️ Réalisations</h2>
                <PortfolioLightbox images={professional.portfolio!} />
              </div>
            )}

            {/* Reviews */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-slate-800 dark:text-white">⭐ Avis ({(professional.reviews || []).length})</h2>
                {!submitted && (
                  <button
                    onClick={() => setShowForm((v) => !v)}
                    className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    {showForm ? '✕ Annuler' : '+ Laisser un avis'}
                  </button>
                )}
              </div>

              {/* Success message */}
              {submitted && (
                <div className="mb-4 flex items-start gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Merci pour votre avis !</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">Il sera visible après validation par notre équipe.</p>
                  </div>
                </div>
              )}

              {/* Review form */}
              {showForm && (
                <form onSubmit={submitReview} className="mb-6 space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-white">Écrire un avis</h3>

                  {reviewError && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {reviewError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Votre nom *</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Mohammed A."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Note *</label>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Commentaire</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Partagez votre expérience..."
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? 'Envoi...' : 'Publier l\'avis'}
                  </button>
                </form>
              )}

              {/* Reviews list */}
              <div className="space-y-4">
                {(professional.reviews || []).length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Star className="h-8 w-8 mx-auto mb-2 text-slate-200 dark:text-slate-700" />
                    <p className="text-sm">Aucun avis pour le moment.</p>
                    <p className="text-xs mt-1">Soyez le premier à laisser un avis !</p>
                  </div>
                ) : (
                  (professional.reviews || []).map((review) => (
                    <div key={review.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-600">
                            {review.client_name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">{review.client_name}</span>
                        </div>
                        <RatingStars value={review.rating} />
                      </div>
                      {review.comment && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <aside className="space-y-5">

            {/* Quick info */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-black text-slate-800 dark:text-white">Infos rapides</h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-400 shrink-0" />
                  <span><strong>Ville :</strong> {professional.main_city}</span>
                </div>
                {(professional.travel_cities || []).length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 shrink-0 mt-0.5">🚗</span>
                    <span><strong>Déplacements :</strong> {(professional.travel_cities || []).join(', ')}</span>
                  </div>
                )}
                {(professional.languages || []).length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 shrink-0 mt-0.5">🗣️</span>
                    <span><strong>Langues :</strong> {(professional.languages || []).join(', ')}</span>
                  </div>
                )}
                {professional.completed_missions > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 shrink-0">✅</span>
                    <span><strong>Missions :</strong> {professional.completed_missions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-black text-slate-800 dark:text-white">Localisation</h3>
              {professional.latitude && professional.longitude ? (
                <iframe
                  title="map"
                  loading="lazy"
                  className="h-52 w-full rounded-2xl border-0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${professional.longitude - 0.05},${professional.latitude - 0.05},${professional.longitude + 0.05},${professional.latitude + 0.05}&layer=mapnik&marker=${professional.latitude},${professional.longitude}`}
                />
              ) : (
                <div className="grid h-40 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-center text-sm text-slate-500">
                  <div>
                    <MapPin className="mx-auto mb-2 h-6 w-6 text-orange-400" />
                    <p className="font-medium">{professional.main_city}</p>
                    <p className="text-xs text-slate-400 mt-1">Coordonnées non disponibles</p>
                  </div>
                </div>
              )}
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(professional.main_city + ', Maroc')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-blue-300 hover:text-blue-600 transition"
              >
                <MapPin className="h-3.5 w-3.5" /> Voir sur Google Maps
              </a>
            </div>

            {/* Price Estimator */}
            <PriceEstimator profession={professional.profession} />

            {/* QR Code */}
            <QRCodeCard
              url={`${window.location.origin}/professionals/${professional.slug}`}
              name={professional.name}
            />

            {/* Contact sticky */}
            {professional.status === 'available' && (
              <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/10 p-5">
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-3">✅ Disponible maintenant</p>
                <a
                  href={`/api/whatsapp/${professional.id}`}
                  onClick={() => track('whatsapp_click')}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-sm font-bold transition-colors shadow-md w-full"
                >
                  <MessageCircle className="h-4 w-4" /> Contacter maintenant
                </a>
              </div>
            )}
          </aside>
        </div>
      </section>
    </Layout>
  );
}
