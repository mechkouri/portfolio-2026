import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    // three.js only loads lazily on capable desktops, so its size never affects first paint.
    chunkSizeWarningLimit: 1000,
  },
});
