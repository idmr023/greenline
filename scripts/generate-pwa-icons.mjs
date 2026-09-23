// Genera los iconos PWA (192/512 PNG) desde el logo existente.
// Uso: node scripts/generate-pwa-icons.mjs
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'assets', 'imagenes', 'logos', 'logo_final.webp');

for (const size of [192, 512]) {
  const out = path.join(ROOT, 'public', `pwa-${size}.png`);
  // eslint-disable-next-line no-await-in-loop
  await sharp(SRC, { animated: false })
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(out);
  console.log(`✅ public/pwa-${size}.png`);
}
