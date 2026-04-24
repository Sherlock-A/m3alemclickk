import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
  },
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      refresh: true,
    }),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':   ['react', 'react-dom', '@inertiajs/react'],
          'vendor-ui':      ['lucide-react', 'framer-motion'],
          'vendor-chart':   ['recharts'],
          'vendor-form':    ['react-hook-form', 'zod', '@hookform/resolvers'],
          'vendor-i18n':    ['i18next', 'react-i18next'],
          'vendor-axios':   ['axios'],
        },
      },
    },
    // Drop console/debugger statements in production
    minify: 'esbuild',
    ...(mode === 'production' && {
      esbuildOptions: {
        drop: ['console', 'debugger'],
      },
    }),
    // Warn if chunk > 500kb
    chunkSizeWarningLimit: 500,
  },
}));
