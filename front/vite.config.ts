import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; " +
        "img-src 'self' data: https://backend-0yid.onrender.com http://localhost:3001 http://backend:3001 https://m.media-amazon.com https://image.tmdb.org; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
        "connect-src 'self' https://backend-0yid.onrender.com http://localhost:3001 http://backend:3001 https://www.omdbapi.com https://api.themoviedb.org ws://localhost:3000; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "object-src 'none';"
    },
    
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://backend:3001', // URL du backend (service du Docker ou localhost)
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  css: {
    postcss: './postcss.config.cjs',
  },
  base: '/',
  publicDir: 'public',
  build: {
    assetsDir: 'assets',
    copyPublicDir: true,
  },
});
