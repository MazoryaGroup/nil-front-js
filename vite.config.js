import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',

  publicDir: 'asset',

  server: {
  port: 3000,
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false
    }
  }
},

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});