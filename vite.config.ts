import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import serveStatic from 'serve-static';

// https://vite.dev/config/
export default defineConfig({
  base: '/pmost/',
  plugins: [
    react(),
    {
      name: 'static-assets',
      configureServer(server) {
        server.middlewares.use(
          '/assets',
          serveStatic(path.resolve(__dirname, '../assets'))
        );
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
