import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LogOut, Wrench, Eye, Phone, MessageCircle, Save,
  ToggleLeft, ToggleRight, LayoutDashboard, User, BarChart3,
  ExternalLink, Copy, Star, CheckCircle, XCircle, AlertCircle,
  X, Loader2, TrendingUp, Camera, Upload, Trash2,
} from 'lucide-react';
import { SentimentDashboard } from '../../components/SentimentDashboard';
import { QRCodeCard } from '../../components/QRCodeCard';
import { computeBadges } from '../../components/ProfessionalBadges';

// ── Photo upload component ─────────────────────────────────────────────────────
function PhotoUpload({
  value, onChange, token,
}: { value: string; onChange: (url: string) => void; token: string | null }) {
  const inputRef                      = useRef<HTMLInputElement>(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragging, setDragging]       = useState(false);

  const upload = async (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      setUploadError('Format accepté : JPG, PNG, WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Taille maximale : 5 Mo');
      return;
    }
    setUploadError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const res = await axios.post('/api/pro/upload-photo', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url);
    } catch {
      setUploadError("Erreur lors de l'upload. Réessayez.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Photo de profil</label>

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="shrink-0 relative">
          {value ? (
            <>
              <img src={value} alt="Photo de profil"
                className="h-24 w-24 rounded-2xl object-cover border-2 border-orange-200 dark:border-orange-800 shadow-lg" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="h-24 w-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
              <Camera className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            </div>
          )}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex-1 cursor-pointer rounded-xl border-2 border-dashed px-5 py-6 text-center transition-all ${
            dragging
              ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/10'
              : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
              <p className="text-xs text-slate-500">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className={`h-6 w-6 ${dragging ? 'text-orange-500' : 'text-slate-400'}`} />
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Glissez une photo ou <span className="text-orange-500">parcourir</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WebP — max 5 Mo</p>
              </div>
            </div>
          )}
        </div>

        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
      </div>

      {uploadError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {uploadError}
        </p>
      )}
    </div>
  );
}

// ── Schema ─────────────────────────────────────────────────────────────────────
const schema = z.object({
  name:           z.string().min(2, 'Minimum 2 caractères'),
  profession:     z.string().min(2, 'Minimum 2 caractères'),
  main_city:      z.string().min(2, 'Requis'),
  description:    z.string().optional(),
  photo:          z.string().url('URL invalide').optional().or(z.literal('')),
  is_available:   z.boolean().default(true),
  travel_cities:  z.array(z.string()).default([]),
  languages:      z.array(z.string()).default([]),
  portfolio:      z.array(z.string()).default([]),
});
type FormData = z.infer<typeof schema>;

type Tab = 'overview' | 'profile' | 'stats' | 'reviews';

// ── Helpers ───────────────────────────────────────────────────────────────────
function profileCompletion(pro: any): number {
  if (!pro) return 0;
  const fields = [
    pro.name, pro.profession, pro.main_city, pro.phone,
    pro.description, pro.photo,
    (pro.travel_cities ?? []).length > 0,
    (pro.languages ?? []).length > 0,
    (pro.portfolio ?? []).length > 0,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <Skeleton className="h-10 w-10 rounded-xl mb-3" />
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

// ── Tag input ──────────────────────────────────────────────────────────────────
function TagInput({
  label, placeholder, value, onChange,
}: { label: string; placeholder: string; value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setDraft('');
  };

  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
      <div className="min-h-[42px] w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-orange-400">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs px-2.5 py-1 font-medium">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="hover:text-orange-900 dark:hover:text-orange-100 transition-colors">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          onBlur={add}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-800 dark:text-white outline-none placeholder-slate-400"
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">Appuyez sur Entrée ou virgule pour ajouter</p>
    </div>
  );
}

// ── Portfolio upload button ────────────────────────────────────────────────────
function PortfolioUploadButton({
  token, onUploaded,
}: { token: string | null; onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      setError('Format accepté : JPG, PNG, WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Taille maximale : 5 Mo');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const res = await axios.post('/api/pro/upload-photo', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(res.data.url);
    } catch {
      setError("Erreur upload. Réessayez.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-600 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center gap-2 transition-all group disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
        ) : (
          <>
            <Upload className="h-6 w-6 text-slate-300 dark:text-slate-600 group-hover:text-orange-400 transition-colors" />
            <span className="text-xs text-slate-400 group-hover:text-orange-500 transition-colors">Ajouter une photo</span>
          </>
        )}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }}
      />
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ProfessionalDashboardPage() {
  const [token] = useState<string | null>(() => localStorage.getItem('pro_token'));
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [tab, setTab]         = useState<Tab>('overview');
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [copied, setCopied]   = useState(false);
  const [cities, setCities]   = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { travel_cities: [], languages: [], portfolio: [], is_available: true },
  });
  const { formState: { errors } } = form;

  useEffect(() => {
    fetch('/api/cities')
      .then((r) => r.ok ? r.json() : [])
      .then((d: { name: string }[]) => setCities(d.map((c) => c.name)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!token) { window.location.href = '/pro/login'; return; }
    const controller = new AbortController();
    axios
      .get('/api/dashboard/professional', {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then((res) => {
        setData(res.data);
        form.reset({
          ...res.data.professional,
          travel_cities: res.data.professional.travel_cities ?? [],
          languages:     res.data.professional.languages ?? [],
          portfolio:     res.data.professional.portfolio ?? [],
          photo:         res.data.professional.photo ?? '',
          description:   res.data.professional.description ?? '',
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem('pro_token');
          window.location.href = '/pro/login';
        } else {
          setApiError(true);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const pro        = data?.professional;
  const completion = profileCompletion(pro);
  const isAvailable = form.watch('is_available');
  const photoUrl    = form.watch('photo');

  const cards = useMemo(() => [
    {
      label: 'Vues du profil', value: data?.stats?.views ?? 0,
      icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20',
      trend: null,
    },
    {
      label: 'Clics WhatsApp', value: data?.stats?.whatsappClicks ?? 0,
      icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20',
      trend: null,
    },
    {
      label: 'Appels reçus', value: data?.stats?.calls ?? 0,
      icon: Phone, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20',
      trend: null,
    },
  ], [data]);

  const logout = () => {
    localStorage.removeItem('pro_token');
    window.location.href = '/pro/login';
  };

  const copyProfileLink = () => {
    if (!pro?.slug) return;
    navigator.clipboard.writeText(`${window.location.origin}/professionals/${pro.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const save = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      await axios.put('/api/dashboard/professional', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Re-fetch to refresh overview with new data
      const res = await axios.get('/api/dashboard/professional', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  });

  const inputCls = (field?: string) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
      field && errors[field as keyof typeof errors]
        ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-800'
        : 'border-slate-200 dark:border-slate-700 focus:ring-orange-300 focus:border-orange-400'
    }`;

  const FieldError = ({ name }: { name: keyof typeof errors }) =>
    errors[name] ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" /> {errors[name]?.message as string}
      </p>
    ) : null;

  const navTabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Aperçu',       icon: LayoutDashboard },
    { id: 'profile',  label: 'Mon profil',   icon: User },
    { id: 'stats',    label: 'Statistiques', icon: BarChart3 },
    { id: 'reviews',  label: 'Avis',         icon: Star },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 text-lg font-black text-orange-500 shrink-0">
            <Wrench className="h-5 w-5" />
            <span className="hidden sm:inline">M3allem<span className="text-slate-800 dark:text-white">Click</span></span>
          </a>

          {/* Tab nav */}
          <nav className="flex items-center gap-1">
            {navTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === id
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {pro?.slug && (
              <button
                onClick={copyProfileLink}
                title="Copier le lien de mon profil"
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {copied ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copié !' : 'Mon lien'}
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-5">

        {apiError && tab !== 'reviews' && (
          <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center space-y-3">
            <XCircle className="h-8 w-8 text-red-400 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">Erreur de chargement</p>
              <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">Impossible de récupérer vos données. Vérifiez votre connexion.</p>
            </div>
            <button
              onClick={() => { setApiError(false); setLoading(true); window.location.reload(); }}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* ── OVERVIEW ──────────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-5">

            {/* Profile hero */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  {loading ? (
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                  ) : pro?.photo ? (
                    <img src={pro.photo} alt={pro.name}
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-orange-100 dark:border-orange-900/30" />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-black text-white">
                      {pro?.name?.[0] ?? '?'}
                    </div>
                  )}
                  <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 ${
                    pro?.is_available ? 'bg-green-500' : 'bg-slate-400'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  {loading ? (
                    <>
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </>
                  ) : (
                    <>
                      <h1 className="text-lg font-black text-slate-800 dark:text-white truncate">{pro?.name}</h1>
                      <p className="text-sm text-orange-500 font-semibold">{pro?.profession}</p>
                      <p className="text-xs text-slate-400 mt-0.5">📍 {pro?.main_city}</p>
                    </>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {loading ? <Skeleton className="h-7 w-24 rounded-full" /> : (
                    <button
                      onClick={() => { form.setValue('is_available', !isAvailable); save(); }}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                        isAvailable
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {isAvailable ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      {isAvailable ? 'Disponible' : 'Indisponible'}
                    </button>
                  )}
                  {pro?.rating > 0 && (
                    <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      {pro.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile completion */}
              {!loading && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Complétion du profil</span>
                    <span className={`text-xs font-bold ${completion >= 80 ? 'text-green-600' : completion >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                      {completion}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        completion >= 80 ? 'bg-green-500' : completion >= 50 ? 'bg-orange-500' : 'bg-red-400'
                      }`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  {completion < 80 && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      {completion < 50
                        ? 'Profil incomplet — ajoutez une photo et une description pour être mieux référencé.'
                        : 'Encore quelques infos pour maximiser votre visibilité.'}
                      {' '}
                      <button onClick={() => setTab('profile')} className="text-orange-500 hover:text-orange-600 font-medium">Compléter →</button>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* KPI cards */}
            <div className="grid gap-4 grid-cols-3">
              {loading
                ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
                : cards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                    <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.bg} mb-3`}>
                      <card.icon className={`h-4.5 w-4.5 ${card.color}`} strokeWidth={2.5} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{card.label}</p>
                    <p className="mt-0.5 text-2xl font-black text-slate-800 dark:text-white tabular-nums">{card.value.toLocaleString('fr-MA')}</p>
                  </div>
                ))}
            </div>

            {/* Weekly chart */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Activité — 7 derniers jours</h2>
                <TrendingUp className="h-4 w-4 text-slate-400" />
              </div>
              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : (data?.weekly ?? []).length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-slate-400">
                  Pas encore de données d'activité.
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weekly} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }}
                        cursor={{ fill: '#f97316', opacity: 0.08, radius: 4 }}
                      />
                      <Bar dataKey="total" fill="#f97316" radius={[6, 6, 0, 0]} name="Interactions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="grid gap-3 sm:grid-cols-3">
              {pro?.slug && (
                <a
                  href={`/professionals/${pro.slug}`}
                  target="_blank"
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all group"
                >
                  <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-orange-500 transition-colors">Voir mon profil</p>
                    <p className="text-xs text-slate-400">Tel que les clients le voient</p>
                  </div>
                </a>
              )}
              <button
                onClick={copyProfileLink}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all group text-left"
              >
                <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-purple-500" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-orange-500 transition-colors">
                    {copied ? 'Lien copié !' : 'Partager mon profil'}
                  </p>
                  <p className="text-xs text-slate-400">Copier le lien direct</p>
                </div>
              </button>
              <button
                onClick={() => setTab('profile')}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all group text-left"
              >
                <div className="h-9 w-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-orange-500 transition-colors">Modifier le profil</p>
                  <p className="text-xs text-slate-400">Infos, photo, description</p>
                </div>
              </button>
            </div>

            {/* Badges */}
            {pro && (() => {
              const badges = computeBadges({ ...pro, reviews: data?.reviews ?? [] });
              if (badges.length === 0) return null;
              return (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                  <h2 className="text-sm font-black text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                    🏆 Mes badges
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {badges.map((b) => (
                      <span key={b.label} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${b.bg} ${b.color}`}>
                        {b.icon} {b.label}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* QR Code */}
            {pro?.slug && (
              <QRCodeCard
                url={`${window.location.origin}/professionals/${pro.slug}`}
                name={pro.name ?? ''}
              />
            )}
          </div>
        )}

        {/* ── PROFILE ───────────────────────────────────────────────────────── */}
        {tab === 'profile' && (
          <form onSubmit={save} className="space-y-5">

            {/* Photo + Availability */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <PhotoUpload
                value={photoUrl ?? ''}
                onChange={(url) => form.setValue('photo', url)}
                token={token}
              />
              <div className="flex items-center gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Disponibilité</span>
                <button
                  type="button"
                  onClick={() => form.setValue('is_available', !isAvailable)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    isAvailable
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {isAvailable ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  {isAvailable ? 'Je suis disponible' : 'Indisponible'}
                </button>
              </div>
            </div>

            {/* Basic info */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white">Informations générales</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Nom complet <span className="text-red-400">*</span></label>
                  <input {...form.register('name')} placeholder="Mohammed Alaoui" className={inputCls('name')} />
                  <FieldError name="name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Métier / Profession <span className="text-red-400">*</span></label>
                  <input {...form.register('profession')} placeholder="Plombier, Électricien..." className={inputCls('profession')} />
                  <FieldError name="profession" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Ville principale <span className="text-red-400">*</span></label>
                  {cities.length > 0 ? (
                    <select {...form.register('main_city')} className={inputCls('main_city')}>
                      <option value="">Sélectionner une ville</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input {...form.register('main_city')} placeholder="Casablanca" className={inputCls('main_city')} />
                  )}
                  <FieldError name="main_city" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Description / Présentation</label>
                <textarea
                  {...form.register('description')}
                  placeholder="Décrivez votre expérience, vos spécialités et vos tarifs indicatifs..."
                  rows={4}
                  className={`${inputCls()} resize-none`}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white">Zones & compétences</h2>
              <TagInput
                label="Villes de déplacement"
                placeholder="Rabat, Salé, Kénitra…"
                value={form.watch('travel_cities') ?? []}
                onChange={(v) => form.setValue('travel_cities', v)}
              />
              <TagInput
                label="Langues parlées"
                placeholder="Arabe, Français, Darija…"
                value={form.watch('languages') ?? []}
                onChange={(v) => form.setValue('languages', v)}
              />
            </div>

            {/* Portfolio */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Portfolio (photos de réalisations)</h2>
                <span className="text-xs text-slate-400">{(form.watch('portfolio') ?? []).filter(Boolean).length} / 8 photos</span>
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(form.watch('portfolio') ?? []).filter(Boolean).map((url, i) => (
                  <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={url}
                      alt={`Réalisation ${i + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          const arr = (form.getValues('portfolio') ?? []).filter(Boolean);
                          form.setValue('portfolio', arr.filter((_, j) => j !== i));
                        }}
                        className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Upload button */}
                {(form.watch('portfolio') ?? []).filter(Boolean).length < 8 && (
                  <PortfolioUploadButton
                    token={token}
                    onUploaded={(url) => {
                      const current = (form.getValues('portfolio') ?? []).filter(Boolean);
                      form.setValue('portfolio', [...current, url]);
                    }}
                  />
                )}
              </div>

              <p className="text-xs text-slate-400">
                Formats acceptés : JPG, PNG, WebP — max 5 Mo par photo. Jusqu'à 8 photos.
              </p>
            </div>

            {/* Save */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4">
              <p className="text-xs text-slate-400">Les modifications sont visibles immédiatement sur votre profil public.</p>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors"
              >
                {saving
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : saved
                  ? <CheckCircle className="h-4 w-4" />
                  : <Save className="h-4 w-4" />}
                {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer'}
              </button>
            </div>
          </form>
        )}

        {/* ── STATS ─────────────────────────────────────────────────────────── */}
        {tab === 'stats' && (
          <div className="space-y-5">

            {/* Total stats cards */}
            <div className="grid gap-4 grid-cols-3">
              {loading
                ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
                : cards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} mb-3`}>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
                    <p className="text-3xl font-black text-slate-800 dark:text-white tabular-nums mt-1">{card.value.toLocaleString('fr-MA')}</p>
                    <p className="text-xs text-slate-400 mt-1">Total depuis inscription</p>
                  </div>
                ))}
            </div>

            {/* Activity bar chart */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Interactions — 7 derniers jours</h2>
              {loading ? <Skeleton className="h-56 w-full" /> : (
                (data?.weekly ?? []).length === 0 ? (
                  <div className="h-56 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <BarChart3 className="h-8 w-8" />
                    <p className="text-sm">Pas encore d'activité enregistrée.</p>
                    <p className="text-xs">Partagez votre profil pour commencer à recevoir des contacts.</p>
                  </div>
                ) : (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.weekly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.08)', fontSize: 12 }}
                        />
                        <Bar dataKey="total" fill="#f97316" radius={[6, 6, 0, 0]} name="Total" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )
              )}
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10 p-5">
              <h3 className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-3">💡 Conseils pour augmenter votre visibilité</h3>
              <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 shrink-0" /> Ajoutez une photo professionnelle — les profils avec photo reçoivent 3× plus de contacts.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 shrink-0" /> Rédigez une description détaillée avec vos spécialités et zones d'intervention.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 shrink-0" /> Partagez votre lien de profil sur WhatsApp et les réseaux sociaux.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 shrink-0" /> Restez en statut "Disponible" pour apparaître en priorité dans les résultats.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── REVIEWS ───────────────────────────────────────────────────────── */}
        {tab === 'reviews' && (
          <ReviewsTab token={token} />
        )}
      </main>
    </div>
  );
}

// ── Reviews tab ────────────────────────────────────────────────────────────────
function ReviewsTab({ token }: { token: string | null }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get('/api/dashboard/professional', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setReviews(r.data.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
      ))}
    </div>
  );

  const approvedReviews  = reviews.filter((r) => r.approved);
  const pendingReviews   = reviews.filter((r) => !r.approved);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-800 dark:text-white">
          Avis clients <span className="text-sm font-normal text-slate-400">({approvedReviews.length} approuvés)</span>
        </h2>
        {pendingReviews.length > 0 && (
          <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold px-2.5 py-1">
            {pendingReviews.length} en attente
          </span>
        )}
      </div>

      {/* Sentiment Analysis */}
      {approvedReviews.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-500" /> Analyse de sentiment IA
          </h3>
          <SentimentDashboard reviews={approvedReviews} />
        </div>
      )}

      {approvedReviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 py-12 text-center">
          <Star className="h-8 w-8 mx-auto mb-3 text-slate-200 dark:text-slate-700" />
          <p className="text-sm text-slate-500">Aucun avis approuvé pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvedReviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-600">
                    {review.client_name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{review.client_name}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {review.comment && (
                <p className="text-sm text-slate-600 dark:text-slate-400">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
