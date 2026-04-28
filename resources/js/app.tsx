import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { FavoritesProvider } from './contexts/FavoritesContext';
import './i18n';

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
