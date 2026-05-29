import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JoblyLogo } from './JoblyLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ChatBot } from './ChatBot';
import { CookieBanner } from './CookieBanner';
import { ConsentScripts } from './ConsentScripts';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Moon, Sun, Menu, X, LogIn, Search, MapPin, Mail, Phone, LayoutDashboard, LogOut, ShieldCheck, User, Home, Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';

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
  footer_links: [],
  footer_social: { facebook: 'https://www.facebook.com/profile.php?id=61563166932840', instagram: 'https://www.instagram.com/jobly.ma' },
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
  const { rtl } = useLanguage();
  const { t } = useTranslation();
  const { resetConsent } = useCookieConsent();
  const { favorites } = useFavorites();
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('jobly_dark') === 'true'; } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [auth, setAuth] = useState<AuthState>(null);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('jobly_dark', String(dark)); } catch {}
  }, [dark]);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

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

  // Always use translated links — server links are hardcoded in French
  const footerLinks = [
    { label: t('nav_home'),                      url: '/' },
    { label: t('nav_professionals'),             url: '/professionals' },
    { label: t('cat_all_label'),                 url: '/categories' },
    { label: t('footer_top_plombiers'),          url: '/top-artisans/casablanca/plomberie' },
    { label: t('footer_top_electriciens'),       url: '/top-artisans/rabat/electricite' },
    { label: t('guides_title'),                  url: '/guides' },
    { label: t('footer_tarifs'),                 url: '/tarifs' },
    { label: t('nav_how_it_works'),              url: '/how-it-works' },
    { label: t('footer_pro_register'),           url: '/pro/register' },
    { label: t('nav_contact'),                   url: '/contact' },
  ];

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
            onClick={handleNav(auth.dashboardUrl, () => setMobileOpen(false))}
          >
            {roleIcon}
            {auth.role === 'admin' ? t('nav_admin') : auth.role === 'professional' ? t('nav_dashboard') : t('nav_client_space')}
          </a>
          <button
            onClick={() => logout(auth.role)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-red-500 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t('logout')}
          </button>
        </div>
      );
    }

    return (
      <div className={`flex ${mobile ? 'flex-col' : 'items-center'} gap-2`}>
        <a
          href="/login"
          className={`${mobile ? 'inline-flex' : 'hidden md:inline-flex'} items-center gap-2 rounded-lg border border-orange-300 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20 transition-colors`}
          onClick={handleNav('/login', () => setMobileOpen(false))}
        >
          <Search className="h-4 w-4" />
          {t('nav_search')}
        </a>
        <a
          href="/login"
          className={`${mobile ? 'inline-flex' : 'hidden md:inline-flex'} items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-sm`}
          onClick={handleNav('/login', () => setMobileOpen(false))}
        >
          <LogIn className="h-4 w-4" />
          {t('nav_login')}
        </a>
      </div>
    );
  };

  function handleNav(href: string, extra?: () => void) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      // Stop Inertia's document-level listener from intercepting — let native <a href> navigate
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      extra?.();
    };
  }

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <a href="/" className="hover:opacity-90 transition-opacity" onClick={handleNav('/')}>
            <JoblyLogo size="md" theme={dark ? 'dark' : 'light'} />
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="/" onClick={handleNav('/')} className="text-slate-600 hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              {t('nav_home')}
            </a>
            <a href="/professionals" onClick={handleNav('/professionals')} className="text-slate-600 hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              {t('nav_professionals')}
            </a>
            <a href="/guides" onClick={handleNav('/guides')} className="text-slate-600 hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              {t('guides_breadcrumb')}
            </a>
            <a href="/how-it-works" onClick={handleNav('/how-it-works')} className="text-slate-600 hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              {t('nav_how_it_works')}
            </a>
            <a href="/contact" onClick={handleNav('/contact')} className="text-slate-600 hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">
              {t('nav_contact')}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
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
            {/* Language selector — prominent on mobile */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <LanguageSwitcher compact />
            </div>
            <nav className="flex flex-col gap-3 text-sm font-medium">
              <a href="/" className="text-slate-700 hover:text-orange-500 dark:text-slate-300" onClick={handleNav('/', () => setMobileOpen(false))}>{t('nav_home')}</a>
              <a href="/professionals" className="text-slate-700 hover:text-orange-500 dark:text-slate-300" onClick={handleNav('/professionals', () => setMobileOpen(false))}>{t('nav_professionals')}</a>
              <a href="/guides" className="text-slate-700 hover:text-orange-500 dark:text-slate-300" onClick={handleNav('/guides', () => setMobileOpen(false))}>{t('guides_breadcrumb')}</a>
              <a href="/how-it-works" className="text-slate-700 hover:text-orange-500 dark:text-slate-300" onClick={handleNav('/how-it-works', () => setMobileOpen(false))}>{t('nav_how_it_works')}</a>
              <a href="/tarifs" className="text-slate-700 hover:text-orange-500 dark:text-slate-300" onClick={handleNav('/tarifs', () => setMobileOpen(false))}>Tarifs</a>
              <a href="/contact" className="text-slate-700 hover:text-orange-500 dark:text-slate-300" onClick={handleNav('/contact', () => setMobileOpen(false))}>{t('nav_contact')}</a>
              <AuthButtons mobile />
            </nav>
          </div>
        )}
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="pb-16 md:pb-0">{children}</main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-300 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">

            {/* Colonne 1 — À propos */}
            <div>
              <a href="/" onClick={handleNav('/')} className="hover:opacity-90 transition-opacity inline-block">
                <JoblyLogo size="md" theme="dark" />
              </a>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                {t('footer_about_desc')}
              </p>
              <div className="mt-4 flex gap-3">
                {settings.footer_social.facebook && (
                  <a href={settings.footer_social.facebook} target="_blank" rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] hover:bg-[#1464d0] transition-colors"
                    aria-label="Facebook Jobly">
                    <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                  </a>
                )}
                {settings.footer_social.instagram && (
                  <a href={settings.footer_social.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] hover:opacity-90 transition-opacity"
                    aria-label="Instagram Jobly">
                    <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                )}
              </div>
            </div>

            {/* Colonne 2 — Liens rapides */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                {t('footer_quick_links')}
              </h3>
              <ul className="space-y-2">
                {footerLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} onClick={handleNav(link.url)} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                      {rtl ? '←' : '→'} {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 — Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                {t('footer_contact')}
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-orange-400 shrink-0" />
                  <a href="mailto:contact@jobly.ma" dir="ltr" className="hover:text-orange-400 transition-colors">
                    contact@jobly.ma
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-orange-400 shrink-0" />
                  <a href="tel:+212617776729" dir="ltr" className="hover:text-orange-400 transition-colors">
                    +212 617-776729
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-orange-400 shrink-0" />
                  <span><span dir="ltr">Casablanca</span>, {t('footer_country')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>{t('footer_copyright')}</span>
              <button
                type="button"
                onClick={resetConsent}
                className="hover:text-orange-400 transition-colors underline-offset-2 hover:underline"
              >
                {t('cookie_manage')}
              </button>
            </div>
            <a
              href="https://sherlockdigital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-500 hover:text-orange-400 transition-colors"
            >
              <span>{t('footer_made_by')}</span>
              <span className="font-bold text-orange-400">SherlockDigital</span>
              <svg className="h-3 w-3 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* ── Mobile bottom nav ─────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="flex items-center justify-around h-16">
          {([
            { href: '/',             Icon: Home,                  label: t('nav_home') },
            { href: '/professionals', Icon: Search,               label: t('nav_professionals') },
            { href: auth?.role === 'client' ? '/dashboard/client' : '/professionals',
              Icon: Heart,
              label: 'Favoris',
              badge: favorites.length },
            { href: auth ? auth.dashboardUrl : '/login',
              Icon: auth ? (auth.role === 'admin' ? ShieldCheck : auth.role === 'professional' ? LayoutDashboard : User) : LogIn,
              label: auth ? (auth.name?.split(' ')[0] ?? 'Compte') : t('nav_login') },
          ] as { href: string; Icon: React.ElementType; label: string; badge?: number }[]).map(({ href, Icon, label, badge }) => (
            <a
              key={label}
              href={href}
              onClick={handleNav(href)}
              className="flex flex-col items-center gap-0.5 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors min-w-0"
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {badge != null && badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[1rem] px-0.5 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none truncate max-w-[56px] text-center">{label}</span>
            </a>
          ))}
        </div>
      </nav>

      <ConsentScripts />
      <ChatBot />
      <CookieBanner />

      {/* PWA install prompt — bottom bar on mobile */}
      {showInstall && (
        <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden">
          <div className="mx-3 mb-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl px-4 py-3 flex items-center gap-3">
            <img src="/icons/icon-192.png" alt="Jobly" className="h-10 w-10 rounded-xl shrink-0 object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white">Installer l'app Jobly</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Accès rapide depuis votre écran d'accueil</p>
            </div>
            <button
              onClick={() => {
                (installPrompt as any)?.prompt?.();
                setShowInstall(false);
              }}
              className="shrink-0 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 transition-colors"
            >
              Installer
            </button>
            <button
              onClick={() => { setShowInstall(false); localStorage.setItem('pwa_install_dismissed', '1'); }}
              className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
