import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://bored-api.appbrewery.com',
        changeOrigin: true, 
        secure: false, 
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
});

