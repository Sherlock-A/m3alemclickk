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
          // Exact package matching (both / and \ for Windows/Linux compatibility)
          const pkg = (name: string) => new RegExp(`[/\\\\]node_modules[/\\\\]${name}[/\\\\]`).test(id);
          if (pkg('recharts') || pkg('d3') || pkg('d3-[^/\\\\]+')) return 'vendor-chart';
          if (pkg('react') || pkg('react-dom') || pkg('@inertiajs')) return 'vendor-react';
          if (pkg('lucide-react') || pkg('framer-motion')) return 'vendor-ui';
          if (pkg('react-hook-form') || pkg('zod') || pkg('@hookform')) return 'vendor-form';
          if (pkg('axios')) return 'vendor-axios';
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
