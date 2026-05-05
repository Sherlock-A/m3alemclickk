import { ReactNode, useEffect, useState } from 'react';
import { JoblyLogo } from './JoblyLogo';
import { Moon, Sun, Menu, X, LogIn, Search, MapPin, Mail, Phone, LayoutDashboard, LogOut, ShieldCheck, User } from 'lucide-react';

type FooterLink = { label: string; url: string };
type Settings = {
  platform_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  footer_about: string;
  footer_links: FooterLink[];
  footer_social: { facebook: string; instagram: string };
  footer_copyright: string;
};

const defaultSettings: Settings = {
  platform_name: 'Jobly',
  contact_email: 'contact@m3allemclick.ma',
  contact_phone: '+212 6XX XXX XXX',
  address: 'Casablanca, Maroc',
  footer_about: 'La plateforme de mise en relation entre clients et artisans au Maroc.',
  footer_links: [
    { label: 'Accueil', url: '/' },
    { label: 'Professionnels', url: '/professionals' },
    { label: 'Comment ça marche', url: '/how-it-works' },
    { label: 'Inscription pro', url: '/pro/register' },
    { label: 'Contact', url: '/contact' },
  ],
  footer_social: { facebook: '', instagram: '' },
  footer_copyright: '© 2026 Jobly. Tous droits réservés.',
};

type AuthState = {
  role: 'admin' | 'professional' | 'client';
  dashboardUrl: string;
  label: string;
  name?: string;
} | null;

// Quick local hint (no token — just the role flag) for instant render before server responds
function localAuthHint(): AuthState {
  try {
    if (localStorage.getItem('auth_role') === 'admin')        return { role: 'admin',        dashboardUrl: '/dashboard/admin',        label: 'Dashboard Admin' };
    if (localStorage.getItem('auth_role') === 'professional') return { role: 'professional',  dashboardUrl: '/dashboard/professional', label: 'Mon Dashboard' };
    if (localStorage.getItem('auth_role') === 'client')       return { role: 'client',        dashboardUrl: '/dashboard/client',       label: 'Mon Espace' };
  } catch {}
  return null;
}

async function fetchAuthStatus(): Promise<AuthState> {
  try {
    const res = await fetch('/api/auth/status', { credentials: 'include', headers: { Accept: 'application/json' } });
    const data = await res.json();
    if (data.authenticated) {
      try { localStorage.setItem('auth_role', data.role); } catch {}
      return { role: data.role, dashboardUrl: data.dashboard, label: data.label, name: data.name };
    }
  } catch {}
  try { localStorage.removeItem('auth_role'); } catch {}
  return null;
}

function logout(role: 'admin' | 'professional' | 'client') {
  try { localStorage.removeItem('auth_role'); } catch {}

  const logoutUrl = role === 'admin' ? '/api/admin/logout'
    : role === 'professional' ? '/api/pro/logout'
    : '/api/client/logout';

  fetch(logoutUrl, { method: 'POST', credentials: 'include' })
    .catch(() => {})
    .finally(() => { window.location.href = '/'; });
}

export function Layout({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('jobly_dark') === 'true'; } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [auth, setAuth] = useState<AuthState>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('jobly_dark', String(dark)); } catch {}
  }, [dark]);

  useEffect(() => {
    setAuth(localAuthHint());
    fetchAuthStatus().then(setAuth);
  }, []);

  useEffect(() => {
    fetch('/api/settings', { headers: { Accept: 'application/json' } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setSettings({ ...defaultSettings, ...data }); })
      .catch(() => {});
  }, []);

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => {
    if (auth) {
      const roleIcon = auth.role === 'admin'
        ? <ShieldCheck className="h-4 w-4" />
        : auth.role === 'professional'
        ? <LayoutDashboard className="h-4 w-4" />
        : <User className="h-4 w-4" />;

      const roleColor = auth.role === 'admin'
        ? 'bg-purple-600 hover:bg-purple-700'
        : auth.role === 'professional'
        ? 'bg-orange-500 hover:bg-orange-600'
        : 'bg-blue-600 hover:bg-blue-700';

      return (
        <div className={`flex ${mobile ? 'flex-col' : 'items-center'} gap-2`}>
          <a
            href={auth.dashboardUrl}
            className={`inline-flex items-center gap-2 rounded-lg ${roleColor} px-4 py-2 text-sm font-semibold text-white transition-colors shadow-sm`}
            onClick={() => setMobileOpen(false)}
          >
            {roleIcon}
            {auth.label}
          </a>
          <button
            onClick={() => logout(auth.role)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-red-500 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Déconnexion
          </button>
        </div>
      );
    }

    return (
      <div className={`flex ${mobile ? 'flex-col' : 'items-center'} gap-2`}>
        <a
          href="/login"
          className={`${mobile ? 'inline-flex' : 'hidden md:inline-flex'} items-center gap-2 rounded-lg border border-orange-300 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20 transition-colors`}
          onClick={() => setMobileOpen(false)}
        >
          <Search className="h-4 w-4" />
          Chercher un artisan
        </a>
        <a
          href="/login"
          className={`${mobile ? 'inline-flex' : 'hidden md:inline-flex'} items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-sm`}
          onClick={() => setMobileOpen(false)}
        >
          <LogIn className="h-4 w-4" />
          Connexion
        </a>
      </div>
    );
  };

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <a href="/" className="hover:opacity-90 transition-opacity">
            <JoblyLogo size="md" theme={dark ? 'dark' : 'light'} />
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="/" className="text-slate-600 hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              Accueil
            </a>
            <a href="/professionals" className="text-slate-600 hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              Professionnels
            </a>
            <a href="/how-it-works" className="text-slate-600 hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              Comment ça marche
            </a>
            <a href="/contact" className="text-slate-600 hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark((v) => !v)}
              className="rounded-full border border-slate-200 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors"
              aria-label="Basculer thème"
            >
              {dark ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
            </button>

            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center gap-2">
              <AuthButtons />
            </div>

            <button
              className="md:hidden rounded-full border border-slate-200 p-2 dark:border-slate-700"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium">
              <a href="/" className="text-slate-700 hover:text-orange-500 dark:text-slate-300" onClick={() => setMobileOpen(false)}>Accueil</a>
              <a href="/professionals" className="text-slate-700 hover:text-orange-500 dark:text-slate-300" onClick={() => setMobileOpen(false)}>Professionnels</a>
              <a href="/how-it-works" className="text-slate-700 hover:text-orange-500 dark:text-slate-300" onClick={() => setMobileOpen(false)}>Comment ça marche</a>
              <a href="/contact" className="text-slate-700 hover:text-orange-500 dark:text-slate-300" onClick={() => setMobileOpen(false)}>Contact</a>
              <AuthButtons mobile />
            </nav>
          </div>
        )}
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main>{children}</main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-300 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">

            {/* Colonne 1 — À propos */}
            <div>
              <a href="/" className="hover:opacity-90 transition-opacity inline-block">
                <JoblyLogo size="md" theme="dark" />
              </a>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                {settings.footer_about}
              </p>
              <div className="mt-4 flex gap-3">
                {settings.footer_social.facebook && (
                  <a href={settings.footer_social.facebook} target="_blank" rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-orange-500 transition-colors text-xs font-bold">
                    f
                  </a>
                )}
                {settings.footer_social.instagram && (
                  <a href={settings.footer_social.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-orange-500 transition-colors text-xs font-bold">
                    ig
                  </a>
                )}
              </div>
            </div>

            {/* Colonne 2 — Liens rapides */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Liens rapides
              </h3>
              <ul className="space-y-2">
                {settings.footer_links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                      → {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 — Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Contact
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                {settings.contact_email && (
                  <li className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-orange-400 shrink-0" />
                    <a href={`mailto:${settings.contact_email}`} className="hover:text-orange-400 transition-colors">
                      {settings.contact_email}
                    </a>
                  </li>
                )}
                {settings.contact_phone && (
                  <li className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-orange-400 shrink-0" />
                    <a href={`tel:${settings.contact_phone}`} className="hover:text-orange-400 transition-colors">
                      {settings.contact_phone}
                    </a>
                  </li>
                )}
                {settings.address && (
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-orange-400 shrink-0" />
                    <span>{settings.address}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>{settings.footer_copyright}</span>
            <span>Fait avec ❤️ au Maroc</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
