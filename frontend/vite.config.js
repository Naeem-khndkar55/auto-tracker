import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend port
        changeOrigin: true,
        secure: false,
      },
    },
    host: true,
    port: 5173,
    historyApiFallback: true,
  },
});