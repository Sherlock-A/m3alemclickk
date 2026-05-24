import { useState, useEffect } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
  Heart, MapPin, MessageCircle, Phone, ShieldCheck,
  Star, Send, CheckCircle, AlertCircle, Mail, BadgeCheck, LogIn, Share2,
} from 'lucide-react';
import { Layout } from '../../components/Layout';
import { Category, Professional } from '../../types';
import { useCatName } from '../../hooks/useCatName';
import { RatingStars } from '../../components/RatingStars';
import { PortfolioLightbox } from '../../components/PortfolioLightbox';
import { ProfessionalBadges } from '../../components/ProfessionalBadges';
import { QRCodeCard } from '../../components/QRCodeCard';
import { PriceEstimator } from '../../components/PriceEstimator';

type SimilarPro = Pick<Professional, 'id' | 'name' | 'slug' | 'profession' | 'photo' | 'main_city' | 'rating' | 'is_available' | 'verified'>;
type Seo = { title?: string; description?: string; canonical?: string; image?: string; jsonLd?: string };
type Props = { professional: Professional; similar?: SimilarPro[]; seo?: Seo };

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

export default function ProfessionalShowPage({ professional, similar = [], seo }: Props) {
  const { t } = useTranslation();
  const getCatName = useCatName();
  const [isFav, setIsFav] = useState(() => getFavIds().includes(professional.id));

  // Authenticated client (if logged in)
  const [clientUser, setClientUser] = useState<{ name: string; email: string } | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('client_token');
    if (!token) return;
    axios.get('/api/client/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setClientUser({ name: r.data.name, email: r.data.email }))
      .catch(() => {});
  }, []);

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

  // Pre-WhatsApp lead capture modal
  const [showWaModal, setShowWaModal] = useState(false);
  const [waName, setWaName]           = useState('');
  const [waNeed, setWaNeed]           = useState('');

  const openWhatsApp = (name?: string, need?: string) => {
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (need) params.set('need', need);
    const qs = params.toString();
    window.location.href = `/api/whatsapp/${professional.id}${qs ? '?' + qs : ''}`;
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    track('whatsapp_click');
    if (clientUser) {
      openWhatsApp(clientUser.name);
    } else {
      setWaName('');
      setWaNeed('');
      setShowWaModal(true);
    }
  };

  const [shareCopied, setShareCopied] = useState(false);
  const shareProfile = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${professional.name} — ${professional.profession} sur Jobly`,
          text: `Découvrez ${professional.name}, ${professional.profession} à ${professional.main_city}. Profil vérifié sur Jobly !`,
          url,
        });
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch {}
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientUser && !name.trim()) { setReviewError(t('show_review_err_name')); return; }
    if (rating < 1) { setReviewError(t('show_review_err_rating')); return; }
    setSubmitting(true);
    setReviewError('');
    try {
      const token = localStorage.getItem('client_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post('/api/reviews', {
        professional_id: professional.id,
        client_name: clientUser ? clientUser.name : name.trim(),
        rating,
        comment: comment.trim(),
      }, { headers });
      setSubmitted(true);
      setShowForm(false);
    } catch {
      setReviewError(t('show_review_err_send'));
    } finally {
      setSubmitting(false);
    }
  };

  // Report review state
  const [reportingId, setReportingId]     = useState<number | null>(null);
  const [reportReason, setReportReason]   = useState('');
  const [reportSending, setReportSending] = useState(false);
  const [reportedIds, setReportedIds]     = useState<number[]>([]);

  const submitReport = async (reviewId: number) => {
    if (!reportReason.trim()) return;
    setReportSending(true);
    try {
      await axios.post(`/api/reviews/${reviewId}/report`, { reason: reportReason.trim() });
      setReportedIds((prev) => [...prev, reviewId]);
      setReportingId(null);
      setReportReason('');
    } catch {
      // silent
    } finally {
      setReportSending(false);
    }
  };

  // Contact/quote form state
  const [contactName, setContactName]       = useState('');
  const [contactEmail, setContactEmail]     = useState('');
  const [contactPhone, setContactPhone]     = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMsg, setContactMsg]         = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [contactDone, setContactDone]       = useState(false);
  const [contactError, setContactError]     = useState('');

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMsg.trim()) {
      setContactError(t('show_quote_err_required'));
      return;
    }
    setContactSending(true);
    setContactError('');
    try {
      await axios.post(`/api/professionals/${professional.id}/contact`, {
        client_name:  contactName.trim(),
        client_email: contactEmail.trim() || undefined,
        client_phone: contactPhone.trim() || undefined,
        subject:      contactSubject.trim() || undefined,
        message:      contactMsg.trim(),
      });
      setContactDone(true);
    } catch {
      setContactError(t('show_quote_err_send'));
    } finally {
      setContactSending(false);
    }
  };

  const seoTitle = `${professional.name} — ${professional.profession} à ${professional.main_city} | Jobly`;
  const seoDesc  = professional.description
    ? professional.description.slice(0, 155)
    : `Contactez ${professional.name}, ${professional.profession} à ${professional.main_city}. Profil vérifié sur Jobly.`;

  const reviews = professional.reviews || [];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: professional.name,
    description: professional.description || seoDesc,
    url: `${window.location.origin}/professionals/${professional.slug}`,
    image: professional.photo ?? undefined,
    telephone: professional.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: professional.main_city,
      addressCountry: 'MA',
    },
    ...(professional.latitude && professional.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: professional.latitude,
        longitude: professional.longitude,
      },
    }),
    ...(professional.rating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: professional.rating.toFixed(1),
        reviewCount: reviews.length || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(reviews.length > 0 && {
      review: reviews.slice(0, 3).map(r => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.client_name },
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
        reviewBody: r.comment || '',
      })),
    }),
  };

  return (
    <Layout>
      <Head>
        <title>{seo?.title ?? seoTitle}</title>
        <meta name="description" content={seo?.description ?? seoDesc} />
        {(seo?.canonical) && <link rel="canonical" href={seo.canonical} />}
        <meta property="og:title" content={seo?.title ?? seoTitle} />
        <meta property="og:description" content={seo?.description ?? seoDesc} />
        <meta property="og:url" content={seo?.canonical ?? ''} />
        {(seo?.image ?? professional.photo) && <meta property="og:image" content={seo?.image ?? professional.photo ?? ''} />}
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo?.title ?? seoTitle} />
        <meta name="twitter:description" content={seo?.description ?? seoDesc} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seo?.jsonLd ?? JSON.stringify(jsonLd) }} />
      </Head>
      <section className="mx-auto max-w-7xl px-4 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <a href="/" className="hover:text-orange-500 transition-colors">Accueil</a>
          <span>/</span>
          {professional.main_city && (
            <>
              <a
                href={`/professionnels/${encodeURIComponent(professional.main_city.toLowerCase())}`}
                className="hover:text-orange-500 transition-colors"
              >
                {professional.main_city}
              </a>
              <span>/</span>
            </>
          )}
          {professional.category && (
            <>
              <a
                href={`/professionnels/${encodeURIComponent(professional.main_city.toLowerCase())}/${encodeURIComponent(professional.category.name.toLowerCase())}`}
                className="hover:text-orange-500 transition-colors"
              >
                {professional.category.name}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[160px]">{professional.name}</span>
        </nav>

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
                  aria-label={isFav ? t('show_fav_remove') : t('show_fav_add')}
                  className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFav ? 'fill-white' : ''}`} />
                </button>
                {professional.photo ? (
                  <img
                    src={professional.photo}
                    alt={professional.name}
                    className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
                    loading="lazy"
                    decoding="async"
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
                    <p className="text-slate-500 dark:text-slate-400 mb-2">
                      {professional.profession} &bull; <span className="text-slate-700 dark:text-slate-300 font-medium">{professional.main_city}</span>
                    </p>
                    {/* Catégories multiples */}
                    {(professional.categories ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {(professional.categories as Category[]).map(cat => (
                          <span key={cat.id}
                            className="inline-flex items-center gap-1 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
                            {cat.icon} {getCatName(cat)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    professional.status === 'available'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {professional.status === 'available' ? t('show_available') : t('show_busy')}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <RatingStars value={professional.rating} />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{professional.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({reviews.length} avis)</span>
                </div>

                {/* Badges */}
                <ProfessionalBadges professional={professional} />

                {/* CTA buttons */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    aria-label={`${t('show_whatsapp')} — ${professional.name}`}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 py-4 text-base font-bold text-white transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden="true" /> {t('show_whatsapp')}
                  </button>
                  <div className="flex gap-2.5">
                    <a
                      href={`tel:${professional.phone}`}
                      onClick={() => track('call')}
                      aria-label={`${t('show_call')} ${professional.name}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" /> {t('show_call')}
                    </a>
                    <button
                      type="button"
                      onClick={shareProfile}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Share2 className="h-4 w-4" aria-hidden="true" />
                      {shareCopied ? '✓ Copié !' : 'Partager'}
                    </button>
                  </div>
                </div>

                {/* Description */}
                {professional.description && (
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{professional.description}</p>
                )}

                {/* Social networks */}
                {(professional.facebook_url || professional.instagram_url) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {professional.facebook_url && (
                      <a
                        href={professional.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                      >
                        📘 Facebook
                      </a>
                    )}
                    {professional.instagram_url && (
                      <a
                        href={professional.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 px-3 py-1.5 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:bg-pink-100 transition-colors"
                      >
                        📸 Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Portfolio */}
            {(professional.portfolio || []).length > 0 && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-xl font-black text-slate-800 dark:text-white">{t('show_portfolio')}</h2>
                <PortfolioLightbox images={professional.portfolio!} />
              </div>
            )}

            {/* Contact / Devis form */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-500" />
                </div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">{t('show_quote_title')}</h2>
              </div>

              {contactDone ? (
                <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{t('show_quote_done')}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">{t('show_quote_done_desc', { name: professional.name })}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={submitContact} className="space-y-4">
                  {contactError && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {contactError}
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">{t('show_quote_name')}</label>
                      <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Mohammed A."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">{t('show_quote_phone')}</label>
                      <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+212 6XX XXX XXX" type="tel"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{t('show_quote_email')}</label>
                    <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="vous@exemple.ma" type="email"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{t('show_quote_subject')}</label>
                    <input value={contactSubject} onChange={e => setContactSubject(e.target.value)} placeholder="Ex: Devis rénovation salle de bain"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{t('show_quote_msg')}</label>
                    <textarea value={contactMsg} onChange={e => setContactMsg(e.target.value)}
                      placeholder="Décrivez votre besoin, la surface, l'urgence..." rows={4}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none" />
                  </div>
                  <button type="submit" disabled={contactSending}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50">
                    <Send className="h-4 w-4" />
                    {contactSending ? t('show_quote_sending') : t('show_quote_send')}
                  </button>
                </form>
              )}
            </div>

            {/* Reviews */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-slate-800 dark:text-white">{t('show_reviews_title', { n: reviews.length })}</h2>
                {!submitted && (
                  <button
                    onClick={() => setShowForm((v) => !v)}
                    className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    {showForm ? t('show_cancel_review') : t('show_leave_review')}
                  </button>
                )}
              </div>

              {/* Success message */}
              {submitted && (
                <div className="mb-4 flex items-start gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{t('show_review_thanks')}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">Il sera visible après validation par notre équipe.</p>
                  </div>
                </div>
              )}

              {/* Review form */}
              {showForm && (
                <form onSubmit={submitReview} className="mb-6 space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-white">Écrire un avis</h3>

                  {/* Identity block */}
                  {clientUser ? (
                    <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-3">
                      <BadgeCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Avis soumis en tant que <span className="font-black">{clientUser.name}</span></p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-500">{clientUser.email} · Identité vérifiée ✓</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Avis anonyme — non vérifié</p>
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-500 mb-2">Les avis vérifiés ont plus de poids et sont traités en priorité.</p>
                      <a href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 underline underline-offset-2">
                        <LogIn className="h-3.5 w-3.5" /> Se connecter pour un avis vérifié
                      </a>
                    </div>
                  )}

                  {reviewError && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {reviewError}
                    </div>
                  )}

                  {/* Name field — only if not logged in */}
                  {!clientUser && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Votre nom *</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Mohammed A."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                      />
                    </div>
                  )}

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
                    {submitting ? t('show_quote_sending') : t('show_leave_review').replace('+', '').trim()}
                  </button>
                </form>
              )}

              {/* Reviews list */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Star className="h-8 w-8 mx-auto mb-2 text-slate-200 dark:text-slate-700" />
                    <p className="text-sm">Aucun avis pour le moment.</p>
                    <p className="text-xs mt-1">Soyez le premier à laisser un avis !</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-600">
                            {review.client_name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-sm text-slate-800 dark:text-white">{review.client_name}</span>
                              {(review as any).verified_client && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  <BadgeCheck className="h-3 w-3" /> Vérifié
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RatingStars value={review.rating} />
                          {reportedIds.includes(review.id) ? (
                            <span className="text-xs text-slate-400">Signalé</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setReportingId(reportingId === review.id ? null : review.id)}
                              className="text-[11px] text-slate-400 hover:text-red-500 transition-colors underline underline-offset-2"
                            >
                              Signaler
                            </button>
                          )}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.comment}</p>
                      )}
                      {reportingId === review.id && (
                        <div className="rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 p-3 space-y-2">
                          <p className="text-xs font-semibold text-red-700 dark:text-red-400">Signaler cet avis</p>
                          <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="Raison du signalement (ex : faux avis, contenu inapproprié...)"
                            rows={2}
                            className="w-full rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => submitReport(review.id)}
                              disabled={reportSending || !reportReason.trim()}
                              className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                            >
                              {reportSending ? 'Envoi...' : 'Envoyer le signalement'}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setReportingId(null); setReportReason(''); }}
                              className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
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

            {/* Contact sticky + availability notice */}
            {(() => {
              const today = new Date().toISOString().split('T')[0];
              const currentPeriod = (professional.unavailabilities ?? []).find(
                (u: any) => u.from_date <= today && u.to_date >= today
              );
              const nextDate = currentPeriod
                ? new Date(currentPeriod.to_date + 'T00:00:00')
                : null;
              if (nextDate) nextDate.setDate(nextDate.getDate() + 1);

              return currentPeriod ? (
                <div className="rounded-[2rem] border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10 p-5">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1">
                    🗓️ Indisponible en ce moment
                  </p>
                  {nextDate && (
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      Disponible à partir du{' '}
                      <strong>{nextDate.toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
                    </p>
                  )}
                </div>
              ) : professional.status === 'available' ? (
                <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/10 p-5">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-3">✅ Disponible maintenant</p>
                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-sm font-bold transition-colors shadow-md w-full"
                  >
                    <MessageCircle className="h-4 w-4" /> Contacter maintenant
                  </button>
                </div>
              ) : null;
            })()}
          </aside>
        </div>

        {/* ── Voir plus dans cette ville ──────────────────────────────────── */}
        {professional.main_city && professional.category && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 rounded-3xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-orange-900/10 p-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Vous cherchez d'autres <strong>{professional.category.name}s</strong> à <strong>{professional.main_city}</strong> ?
            </p>
            <a
              href={`/professionnels/${encodeURIComponent(professional.main_city.toLowerCase())}/${encodeURIComponent(professional.category.name.toLowerCase())}`}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-sm font-bold transition-colors whitespace-nowrap"
            >
              Voir tous les {professional.category.name}s →
            </a>
          </div>
        )}

        {/* ── Pros similaires ────────────────────────────────────────────────── */}
        {similar.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-5">
              🔍 Professionnels similaires
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <a
                  key={p.id}
                  href={`/professionals/${p.slug}`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-md transition-all group"
                >
                  {p.photo
                    ? <img src={p.photo} alt={p.name} className="h-12 w-12 rounded-full object-cover shrink-0 border-2 border-orange-100" loading="lazy" decoding="async" />
                    : <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-lg shrink-0">{p.name[0]}</div>
                  }
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 dark:text-white text-sm truncate group-hover:text-orange-500 transition-colors">{p.name}</p>
                    <p className="text-xs text-orange-500 font-medium truncate">{p.profession}</p>
                    <p className="text-xs text-slate-400 mt-0.5">📍 {p.main_city}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {p.rating > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">
                        <Star className="h-3 w-3 fill-amber-400" /> {p.rating.toFixed(1)}
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.is_available ? 'Dispo' : 'Occupé'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
      {/* Pre-WhatsApp lead capture modal */}
      {showWaModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowWaModal(false)}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-black text-slate-800 dark:text-white">Contacter {professional.name}</p>
                <p className="text-xs text-slate-400">via WhatsApp · 2 secondes</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Votre prénom</label>
                <input
                  value={waName}
                  onChange={(e) => setWaName(e.target.value)}
                  placeholder="Mohammed..."
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && openWhatsApp(waName, waNeed)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Votre besoin <span className="text-slate-400 font-normal">(optionnel)</span>
                </label>
                <input
                  value={waNeed}
                  onChange={(e) => setWaNeed(e.target.value)}
                  placeholder="Ex: fuite d'eau, prise électrique…"
                  onKeyDown={(e) => e.key === 'Enter' && openWhatsApp(waName, waNeed)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowWaModal(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => openWhatsApp(waName, waNeed)}
                className="flex-1 rounded-xl bg-green-500 hover:bg-green-600 text-white py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" /> Envoyer
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-400">
              Votre prénom sera partagé avec l'artisan dans le message WhatsApp
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}
