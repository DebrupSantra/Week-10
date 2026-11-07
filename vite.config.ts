import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/logo.svg'],
      manifest: {
        name: 'Northstar Analytics',
        short_name: 'Northstar',
        description: 'Enterprise analytics dashboard',
        theme_color: '#172554',
        background_color: '#f5f7fb',
        display: 'standalone',
        icons: [{ src: '/icons/logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] }
    })
  ],
  build: { chunkSizeWarningLimit: 1200 }
});
