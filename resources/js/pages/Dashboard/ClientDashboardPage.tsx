import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
  Heart, LogOut, MapPin, Search, Star, User2,
  Trash2, ExternalLink, ChevronRight,
} from 'lucide-react';

type ClientUser = { name: string; email: string };
type FavPro = {
  id: number; name: string; profession: string; main_city: string;
  photo?: string; rating: number; is_available: boolean; slug: string;
};

function Avatar({ name, photo, size = 'md' }: { name: string; photo?: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'sm' ? 'h-9 w-9 text-sm' : size === 'lg' ? 'h-16 w-16 text-2xl' : 'h-12 w-12 text-lg';
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
  const [token] = useState<string | null>(() => localStorage.getItem('client_token'));
  const [user, setUser] = useState<ClientUser | null>(null);
  const [favPros, setFavPros] = useState<FavPro[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites'>('overview');

  useEffect(() => {
    if (!token) { window.location.href = '/client/login'; return; }
    const controller = new AbortController();
    fetch('/api/client/me', {
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
        setUser(d.user ?? null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        // Network error — don't clear token, just keep showing the page
      });
    return () => controller.abort();
  }, [token]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.get('/professionals', { profession: search.trim() });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          <a href="/" className="text-lg font-black text-orange-500">
            M3allem<span className="text-slate-800 dark:text-white">Click</span>
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
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {[
            { id: 'overview', label: 'Accès rapide', icon: User2 },
            { id: 'favorites', label: `Favoris (${favPros.length})`, icon: Heart },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
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
        {activeTab === 'overview' && (
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
        )}

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
      </main>
    </div>
  );
}
