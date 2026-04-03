import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import serveStatic from 'serve-static';
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
const baseUrl = '/pmost/';

export default defineConfig({
  base: baseUrl,
  plugins: [
    react(),
    {
      name: 'static-assets',
      configureServer(server) {
        server.middlewares.use(
          '/audio',
          serveStatic(path.resolve(__dirname, '../audio'))
        );
      },
    },
    // visualizer({
    //   open: true,
    //   gzipSize: true,
    //   filename: 'dist/stats.html',
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/base-url" as * with ($base-url: "${baseUrl}");`,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return 'react';
          }
          if (/[\\/]node_modules[\\/](react-markdown|remark|rehype|unified|mdast|hast)/.test(id)) {
            return 'markdown';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return;
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
