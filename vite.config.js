import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/rox-finance/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        servicios: resolve(__dirname, 'servicios.html'),
        nosotros: resolve(__dirname, 'nosotros.html'),
        contacto: resolve(__dirname, 'contacto.html'),
      },
    },
  },
});
