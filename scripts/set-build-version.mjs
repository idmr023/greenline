/**
 * Genera frontend... (raíz Vite = repo): escribe `.env.build` con un
 * `VITE_IMAGE_VERSION` único por build.
 *
 * `imagenVersionada.js` lo usa como `?v=` para TODA URL pública de Storage:
 * cada deploy produce URLs de imagen distintas, forzando al navegador/CDN a
 * descargar los bytes nuevos (cache-busting automático).
 *
 * Se ejecuta antes de `vite build --mode build` (ver package.json).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const destino = path.join(root, '.env.build');

const ahora = new Date();
const pad = (n) => String(n).padStart(2, '0');
const stamp = `${ahora.getFullYear()}${pad(ahora.getMonth() + 1)}${pad(ahora.getDate())}-${pad(ahora.getHours())}${pad(ahora.getMinutes())}${pad(ahora.getSeconds())}`;

fs.writeFileSync(
  destino,
  `# Generado automáticamente por scripts/set-build-version.mjs (no editar)\nVITE_IMAGE_VERSION=${stamp}\n`,
  'utf8',
);

console.log(`[set-build-version] VITE_IMAGE_VERSION=${stamp} -> ${destino}`);