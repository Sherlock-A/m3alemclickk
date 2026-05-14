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
        manualChunks: (id) => {
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3') || id.includes('node_modules/victory')) {
            return 'vendor-chart';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/@inertiajs')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/framer-motion')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod') || id.includes('node_modules/@hookform')) {
            return 'vendor-form';
          }
          if (id.includes('node_modules/axios')) {
            return 'vendor-axios';
          }
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
