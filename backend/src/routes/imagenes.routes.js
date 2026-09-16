import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');
const IMAGES_BASE = path.join(REPO_ROOT, 'public', 'assets', 'imagenes');

const ALLOWED_EXT = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.avif',
  '.svg',
  '.bmp',
  '.tif',
  '.tiff',
]);

const router = Router();

router.use(authMiddleware);
router.use(requirePermission('productos:read'));

router.get('/listar', async (req, res) => {
  try {
    const ruta = String(req.query.ruta || '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');

    if (ruta.split('/').includes('..')) {
      return res.status(400).json({ error: 'Ruta no válida' });
    }

    const dir = path.join(IMAGES_BASE, ruta);
    const resolved = path.resolve(dir);
    if (!resolved.startsWith(IMAGES_BASE)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    let entries;
    try {
      entries = await fs.readdir(resolved, { withFileTypes: true });
    } catch {
      return res.json({ ruta, carpetas: [], archivos: [] });
    }

    const carpetas = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, 'es'));

    const archivos = entries
      .filter((e) => e.isFile() && ALLOWED_EXT.has(path.extname(e.name).toLowerCase()))
      .map((e) => ({
        nombre: e.name,
        url: `/assets/imagenes/${ruta ? `${ruta}/` : ''}${e.name}`,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

    res.json({ ruta, carpetas, archivos });
  } catch (error) {
    console.error('Error listando imágenes:', error);
    res.status(500).json({ error: 'Error listando imágenes' });
  }
});

export default router;