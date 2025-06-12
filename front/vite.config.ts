import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
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
