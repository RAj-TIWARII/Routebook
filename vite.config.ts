import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Manual chunk splitting keeps the map/animation libraries out of the
    // critical path so the hero renders as fast as possible.
    rollupOptions: {
      output: {
        manualChunks: {
          maplibre: ['maplibre-gl'],
          motion: ['framer-motion', 'gsap', 'lenis'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
