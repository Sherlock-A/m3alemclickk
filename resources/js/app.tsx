import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { FavoritesProvider } from './contexts/FavoritesContext';
import './i18n';
import axios from 'axios';

// Send cookies (httpOnly JWT) on every request + always expect JSON
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx');
    return (await pages[`./pages/${name}.tsx` as keyof typeof pages]!()) as any;
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <FavoritesProvider>
        <App {...props} />
      </FavoritesProvider>
    );
  },
});
