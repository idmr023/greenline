import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';
import {
  procesarImagen,
  formatearTamano,
  subirStorage,
  BUCKET,
} from '../../scripts/image-utils.mjs';

function slugificar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../../../public');

const router = Router();

// ============================================================
// Supabase Admin client (solo para auth)
// ============================================================

const SUPABASE_URL = (env.SUPABASE_URL || '').replace(/\/+$/, '');
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.warn('⚠️  blog.routes: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados');
}

const { createClient } = await import('@supabase/supabase-js');
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

// ============================================================
// Multer: acepta un solo archivo "image" en el body
// ============================================================

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no soportado. Usa JPG, PNG o WebP.'));
    }
  },
});

// ============================================================
// Middleware: verificar Supabase Auth access token + rol de blog
// ============================================================

// Roles con permiso para crear/editar contenido del blog (blog:create)
const BLOG_ADMIN_ROLES = ['ADMIN', 'EDITORA_BLOG', 'DESARROLLADOR_WEB'];

async function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  const token = header.split(' ')[1];

  try {
    // Verificar el token contra GoTrue Admin API
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    const supabaseUser = await response.json();
    req.authUser = supabaseUser;

    // Autorización a nivel de aplicación: solo roles de blog activos
    // pueden subir (la sesión Supabase por sí sola no basta).
    const dbUser = await prisma.user.findUnique({
      where: { email: String(supabaseUser.email || '').toLowerCase() },
      select: { rol: true, activo: true },
    });

    if (!dbUser || !dbUser.activo || !BLOG_ADMIN_ROLES.includes(dbUser.rol)) {
      return res.status(403).json({ error: 'Sin permisos de editor de blog' });
    }

    next();
  } catch (error) {
    console.error('Error verificando autenticación:', error.message);
    return res.status(401).json({ error: 'Error verificando autenticación' });
  }
}

// ============================================================
// POST /api/blog/upload — Subir imagen de blog con conversión WebP
// Ubica la imagen en la carpeta del artículo (articulos/<slug>/)
// tanto en Supabase Storage (fuente viva, pública al instante)
// como en el espejo local de public/assets.
// ============================================================

router.post('/upload', requireAuth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Error de upload: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se envió ninguna imagen' });
  }

  const slug = slugificar(req.body?.slug);
  if (!slug) {
    return res.status(400).json({ error: 'El slug del artículo es obligatorio' });
  }

  try {
    const original = req.file;
    const originalSize = original.buffer.length;

    // Procesar con sharp: auto-orientación EXIF → flatten → webp
    const webpBuffer = await procesarImagen(original.buffer, {
      original: false,
    });

    const processedSize = webpBuffer.length;
    const ratio = ((1 - processedSize / originalSize) * 100).toFixed(1);

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
    const relativa = `articulos/${slug}/${filename}`;
    const destinoLocal = `/assets/imagenes/${relativa}`;

    // 1) Fuente viva: Supabase Storage bajo la carpeta del slug
    await subirStorage(supabaseAdmin, `assets/imagenes/${relativa}`, webpBuffer);

    // 2) Espejo local (queda disponible para el repo en dev)
    const absDestino = path.join(PUBLIC_DIR, destinoLocal);
    const dir = path.dirname(absDestino);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(absDestino, webpBuffer);

    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(`assets/imagenes/${relativa}`);
    const publicUrl = urlData?.publicUrl || `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/assets/imagenes/${relativa}`;

    res.json({
      ok: true,
      url: publicUrl,
      path: destinoLocal,
      original: formatearTamano(originalSize),
      processed: formatearTamano(processedSize),
      reduction: `${ratio > 0 ? '-' : '+'}${Math.abs(ratio)}%`,
    });
  } catch (error) {
    console.error('Error procesando imagen:', error);
    res.status(500).json({ error: 'Error procesando la imagen: ' + error.message });
  }
});

export default router;
