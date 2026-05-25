import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import {
  Heart, LogOut, MapPin, Search, Star, User2,
  Trash2, ExternalLink, ChevronRight, Mail, Save, CheckCircle, X, ArrowRight, Award,
} from 'lucide-react';
import { JoblyLogo } from '../../components/JoblyLogo';

type ClientUser = { name: string; email: string; phone?: string; city?: string };
type FavPro = {
  id: number; name: string; profession: string; main_city: string;
  photo?: string; rating: number; is_available: boolean; slug: string;
};
type ContactReq = {
  id: number;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  professional: { name: string; profession: string; main_city: string; slug: string } | null;
};

function Avatar({ name, photo, size = 'md' }: { name: string; photo?: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'sm' ? 'h-9 w-9 text-sm' : size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-16 w-16 text-xl';
  if (photo) return <img src={photo} alt={name} className={`${cls} rounded-full object-cover`} />;
  return (
    <div className={`${cls} rounded-full bg-orange-100 flex items-center justify-center font-black text-orange-600`}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

const STORAGE_KEY = 'client_favorites';
function getFavIds(): number[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}
function setFavIds(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function ClientDashboardPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('client_token'));
  const [user, setUser] = useState<ClientUser | null>(null);
  const [favPros, setFavPros] = useState<FavPro[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'demandes' | 'profil'>('overview');

  // Demandes de contact
  const [demandes, setDemandes] = useState<ContactReq[]>([]);
  const [demandesLoading, setDemandesLoading] = useState(false);

  // Profile edit
  const [profileName, setProfileName]   = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCity, setProfileCity]   = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved]   = useState(false);

  // Onboarding wizard
  const isOnboarding = new URLSearchParams(window.location.search).get('onboarding') === '1';
  const [onboardingDone, setOnboardingDone]     = useState(() => !!localStorage.getItem('client_onboarding_done'));
  const [showOnboarding, setShowOnboarding]     = useState(isOnboarding && !localStorage.getItem('client_onboarding_done'));
  const [onboardStep, setOnboardStep]           = useState(0);
  const [onboardCity, setOnboardCity]           = useState('');
  const [onboardCatId, setOnboardCatId]         = useState('');
  const [onboardCatSlug, setOnboardCatSlug]     = useState('');
  const [onboardWhen, setOnboardWhen]           = useState('');
  const [onboardCategories, setOnboardCategories] = useState<{id:number; name:string; icon:string; slug:string}[]>([]);

  useEffect(() => {
    if (!token) {
      // Try to restore from httpOnly cookie
      fetch('/api/auth/status', { credentials: 'include', headers: { Accept: 'application/json' } })
        .then(r => r.json())
        .then(d => {
          if (d.authenticated && d.role === 'client' && d.token) {
            localStorage.setItem('client_token', d.token);
            setToken(d.token);
          } else {
            window.location.href = '/login';
          }
        }).catch(() => { window.location.href = '/login'; });
      return;
    }
    const controller = new AbortController();
    fetch('/api/client/me', {
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: controller.signal,
    })
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) {
          localStorage.removeItem('client_token');
          window.location.href = '/client/login';
          return;
        }
        const d = await r.json();
        const u = d.user ?? null;
        setUser(u);
        if (u) {
          setProfileName(u.name ?? '');
          setProfilePhone(u.phone ?? '');
          setProfileCity(u.city ?? '');
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        // Network error — don't clear token, just keep showing the page
      });
    return () => controller.abort();
  }, [token]);

  // Load categories for onboarding wizard
  useEffect(() => {
    if (!showOnboarding) return;
    axios.get('/api/categories').then(r => setOnboardCategories(r.data)).catch(() => {});
  }, [showOnboarding]);

  const finishOnboarding = () => {
    localStorage.setItem('client_onboarding_done', '1');
    setShowOnboarding(false);
    setOnboardingDone(true);
    // Clean URL
    window.history.replaceState({}, '', '/dashboard/client');
    // Redirect to matching professionals
    if (onboardCity && onboardCatSlug) {
      window.location.href = `/professionnels/${encodeURIComponent(onboardCity.toLowerCase())}/${onboardCatSlug}`;
    } else if (onboardCity) {
      window.location.href = `/professionals?city=${encodeURIComponent(onboardCity)}`;
    } else if (onboardCatSlug) {
      window.location.href = `/professionals?profession=${encodeURIComponent(onboardCatSlug)}`;
    }
  };

  // Load favorites from localStorage → API
  useEffect(() => {
    const ids = getFavIds();
    if (ids.length === 0) { setLoading(false); return; }
    fetch(`/api/favorites?${ids.map((id) => `ids[]=${id}`).join('&')}`)
      .then((r) => r.json())
      .then((d) => setFavPros(d.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const removeFav = (id: number) => {
    const next = getFavIds().filter((f) => f !== id);
    setFavIds(next);
    setFavPros((p) => p.filter((pro) => pro.id !== id));
  };

  const logout = () => {
    fetch('/api/client/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    }).finally(() => {
      localStorage.removeItem('client_token');
      window.location.href = '/';
    });
  };

  const loadDemandes = () => {
    if (!token || demandesLoading) return;
    setDemandesLoading(true);
    fetch('/api/client/contact-requests', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then(r => r.json())
      .then(d => setDemandes(d.items ?? []))
      .catch(() => {})
      .finally(() => setDemandesLoading(false));
  };

  // Load demandes on mount for loyalty level computation
  useEffect(() => {
    if (token && demandes.length === 0) loadDemandes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setProfileSaving(true);
    setProfileSaved(false);
    try {
      const r = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: profileName, phone: profilePhone, city: profileCity }),
      });
      if (r.ok) {
        const d = await r.json();
        setUser(d.user);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } catch {
      // silently ignore
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.get('/professionals', { profession: search.trim() });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          <a href="/">
            <JoblyLogo size="md" />
          </a>
          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Avatar name={user.name} size="sm" />
                <span className="font-medium">{user.name}</span>
              </div>
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

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">

        {/* Hero card */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Bonjour 👋</p>
              <h1 className="text-2xl font-black mt-0.5">{user?.name ?? '…'}</h1>
              <p className="text-orange-100 text-xs mt-1">{user?.email}</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
          </div>
          <div className="mt-5 flex gap-2 flex-wrap">
            <div className="bg-white/15 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" /> {favPros.length} favori{favPros.length !== 1 ? 's' : ''}
            </div>
            <a href="/professionals" className="bg-white/15 hover:bg-white/25 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors">
              Parcourir les artisans <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Plombier, électricien, peintre..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 text-sm font-semibold transition-colors"
          >
            Rechercher
          </button>
        </form>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex-wrap">
          {[
            { id: 'overview',  label: 'Accès rapide', icon: User2 },
            { id: 'favorites', label: `Favoris (${favPros.length})`, icon: Heart },
            { id: 'demandes',  label: 'Mes demandes', icon: Mail },
            { id: 'profil',    label: 'Mon profil', icon: User2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id as any);
                if (id === 'demandes') loadDemandes();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs sm:text-sm font-medium transition-colors min-w-[80px] ${
                activeTab === id
                  ? 'bg-white dark:bg-slate-900 text-orange-500 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (() => {
          const contactCount = demandes.length;
          const loyalty = (() => {
            if (contactCount >= 25) return { name: 'Expert', emoji: '🏆', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', progress: 100, next: null };
            if (contactCount >= 10) return { name: 'Régulier', emoji: '⭐', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', progress: Math.round((contactCount - 10) / 15 * 100), next: 25 };
            if (contactCount >= 3)  return { name: 'Explorateur', emoji: '🔍', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', progress: Math.round((contactCount - 3) / 7 * 100), next: 10 };
            return { name: 'Nouveau', emoji: '🌱', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', progress: Math.round(contactCount / 3 * 100), next: 3 };
          })();

          return (
            <div className="space-y-4">
              {/* Loyalty card */}
              <div className={`rounded-2xl border ${loyalty.border} ${loyalty.bg} p-4 flex items-center gap-4`}>
                <div className="text-4xl shrink-0">{loyalty.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className={`h-4 w-4 ${loyalty.color}`} />
                    <span className={`text-sm font-bold ${loyalty.color}`}>Niveau {loyalty.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {contactCount} artisan{contactCount !== 1 ? 's' : ''} contacté{contactCount !== 1 ? 's' : ''} via Jobly
                    {loyalty.next ? ` · encore ${loyalty.next - contactCount} pour ${contactCount >= 10 ? 'Expert' : contactCount >= 3 ? 'Régulier' : 'Explorateur'}` : ' · Niveau maximum atteint !'}
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-700"
                      style={{ width: `${loyalty.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { href: '/professionals', label: 'Tous les artisans', sub: 'Parcourir l\'annuaire complet', icon: User2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { href: '/professionals?sort=rating', label: 'Mieux notés', sub: 'Les artisans les mieux évalués', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                  { href: '/professionals?status=available', label: 'Disponibles', sub: 'Artisans disponibles maintenant', icon: MapPin, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group"
                  >
                    <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-orange-500 transition-colors">{item.label}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.sub}</p>
                  </a>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Tab: Favorites */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Chargement...</div>
            ) : favPros.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 py-16 text-center">
                <Heart className="h-10 w-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-medium">Aucun artisan en favoris</p>
                <p className="text-slate-400 text-xs mt-1">Cliquez sur ❤️ sur le profil d'un artisan pour l'ajouter ici</p>
                <a href="/professionals"
                   className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 text-white px-4 py-2 text-sm font-semibold hover:bg-orange-600 transition-colors">
                  Découvrir les artisans
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {favPros.map((pro) => (
                  <div key={pro.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center gap-4">
                    <Avatar name={pro.name} photo={pro.photo} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800 dark:text-white truncate">{pro.name}</h3>
                        <span className={`h-2 w-2 rounded-full shrink-0 ${pro.is_available ? 'bg-green-500' : 'bg-slate-300'}`} />
                      </div>
                      <p className="text-xs text-orange-500 font-medium">{pro.profession}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <MapPin className="h-3 w-3" /> {pro.main_city}
                        {pro.rating > 0 && <><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{pro.rating.toFixed(1)}</>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a href={`/professionals/${pro.slug}`}
                         className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-orange-500 hover:border-orange-300 transition-colors"
                         title="Voir le profil">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => removeFav(pro.id)}
                        className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
                        title="Retirer des favoris"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Tab: Mes demandes */}
        {activeTab === 'demandes' && (
          <div className="space-y-4">
            {demandesLoading ? (
              <div className="text-center py-12 text-slate-400">Chargement...</div>
            ) : demandes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 py-16 text-center">
                <Mail className="h-10 w-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-medium">Aucune demande envoyée</p>
                <p className="text-slate-400 text-xs mt-1">Vos demandes de devis apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-3">
                {demandes.map((d) => (
                  <div key={d.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-white">{d.subject || 'Demande de renseignement'}</p>
                        {d.professional && (
                          <a href={`/professionals/${d.professional.slug}`} className="text-xs text-orange-500 font-medium hover:underline">
                            {d.professional.name} · {d.professional.profession}
                          </a>
                        )}
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        d.status === 'replied' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : d.status === 'read'  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {d.status === 'replied' ? 'Répondu' : d.status === 'read' ? 'Lu' : 'Nouveau'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{d.message}</p>
                    <p className="text-xs text-slate-400 mt-2">{new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Mon profil */}
        {activeTab === 'profil' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-800 dark:text-white mb-5">Mes informations</h2>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Nom complet</label>
                <input
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
                <input
                  value={user?.email ?? ''}
                  disabled
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">L'email ne peut pas être modifié.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Téléphone</label>
                <input
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                  type="tel"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Ville</label>
                <input
                  value={profileCity}
                  onChange={e => setProfileCity(e.target.value)}
                  placeholder="Casablanca"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {profileSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                {profileSaved && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                    <CheckCircle className="h-4 w-4" /> Enregistré !
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

      </main>

      {/* ── Onboarding wizard overlay ──────────────────────────────────── */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-slate-100 dark:bg-slate-800">
              <div
                className="h-1 bg-orange-500 transition-all duration-300"
                style={{ width: `${((onboardStep + 1) / 3) * 100}%` }}
              />
            </div>

            <div className="p-6 space-y-5">
              <button onClick={() => { setShowOnboarding(false); localStorage.setItem('client_onboarding_done','1'); window.history.replaceState({}, '', '/dashboard/client'); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <div className="text-4xl mb-2">{onboardStep === 0 ? '🌍' : onboardStep === 1 ? '🔧' : '⏰'}</div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">
                  {onboardStep === 0 && 'Dans quelle ville êtes-vous ?'}
                  {onboardStep === 1 && 'Quel service cherchez-vous ?'}
                  {onboardStep === 2 && 'Pour quand en avez-vous besoin ?'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Étape {onboardStep + 1} / 3</p>
              </div>

              {onboardStep === 0 && (
                <input
                  autoFocus
                  value={onboardCity}
                  onChange={e => setOnboardCity(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && onboardCity.trim()) setOnboardStep(1); }}
                  placeholder="Ex: Casablanca, Rabat, Marrakech..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              )}

              {onboardStep === 1 && (
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {onboardCategories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setOnboardCatId(String(c.id)); setOnboardCatSlug(c.slug ?? c.name.toLowerCase().replace(/\s+/g, '-')); setOnboardStep(2); }}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        onboardCatId === String(c.id)
                          ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-300'
                      }`}
                    >
                      <span>{c.icon}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {onboardStep === 2 && (
                <div className="space-y-2">
                  {[
                    { key: 'now',  label: '🚨 Maintenant — besoin urgent', },
                    { key: 'week', label: '📅 Cette semaine', },
                    { key: 'month',label: '🗓️ Ce mois-ci', },
                    { key: 'later',label: '💭 Je compare juste', },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => { setOnboardWhen(opt.key); finishOnboarding(); }}
                      className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      {opt.label}
                      <ArrowRight className="h-4 w-4 text-orange-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-1">
                {onboardStep > 0 && (
                  <button onClick={() => setOnboardStep(s => s - 1)}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    ← Retour
                  </button>
                )}
                {onboardStep < 2 && (
                  <button
                    onClick={() => setOnboardStep(s => s + 1)}
                    disabled={onboardStep === 0 && !onboardCity.trim()}
                    className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 text-sm transition-colors"
                  >
                    {onboardStep === 0 ? 'Continuer →' : 'Peu importe →'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
