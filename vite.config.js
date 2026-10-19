import { defineConfig } from 'vite';
import { resolve } from 'path';

const pages = ['index', 'planificacion', 'proteccion', 'inversiones', 'vipli', 'jubilacion', 'nosotros', 'contacto'];
// privacidad.html queda fuera del build hasta que el asesor legal del cliente la apruebe

export default defineConfig({
  // En el dominio propio va en la raíz; GitHub Pages usa VITE_BASE=/rox-finance/
  base: process.env.VITE_BASE ?? '/',
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map(page => [page, resolve(__dirname, `${page}.html`)])),
    },
  },
});
