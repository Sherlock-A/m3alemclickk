import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import './i18n';
import axios from 'axios';

// Send cookies (httpOnly JWT) on every request + always expect JSON
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';

// Register Service Worker (PWA offline support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Activate any SW already waiting (e.g. from a previous update detection)
      if (reg.waiting) {
        reg.waiting.postMessage('SKIP_WAITING');
      }
      // Notify user when a new version is waiting
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage('SKIP_WAITING');
          }
        });
      });
    }).catch(() => {});
  });
}

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx');
    return (await pages[`./pages/${name}.tsx` as keyof typeof pages]!()) as any;
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <CookieConsentProvider>
        <LanguageProvider>
          <FavoritesProvider>
            <App {...props} />
          </FavoritesProvider>
        </LanguageProvider>
      </CookieConsentProvider>
    );
  },
});
