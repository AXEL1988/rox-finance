import { defineConfig } from 'vite';
import { resolve } from 'path';

const pages = ['index', 'planificacion', 'proteccion', 'inversiones', 'vipli', 'jubilacion', 'nosotros', 'contacto'];

export default defineConfig({
  base: '/rox-finance/',
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map(page => [page, resolve(__dirname, `${page}.html`)])),
    },
  },
});
