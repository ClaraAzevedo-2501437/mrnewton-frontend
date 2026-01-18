import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/activity-api': {
        target: 'https://mrnewton-activity.onrender.com',
        //target: 'http://localhost:5000', // Local development server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/activity-api/, '/api/v1')
      },
      '/analytics-api': {
        target: 'https://mrnewton-analytics.onrender.com',
        // target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/analytics-api/, '/api/v1/analytics')
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
});
