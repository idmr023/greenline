import { Router } from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import {
  BUCKET,
  procesarImagen,
  subirStorage,
  formatearTamano,
} from '../../../scripts/image-utils.mjs';

const router = Router();

// ============================================================
// Supabase Admin client (service role)
// ============================================================

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.warn('⚠️  blog.routes: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados');
}

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
// Middleware: verificar Supabase Auth access token
// ============================================================

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

    const user = await response.json();
    req.authUser = user;
    next();
  } catch (error) {
    console.error('Error verificando token:', error.message);
    return res.status(401).json({ error: 'Error verificando autenticación' });
  }
}

// ============================================================
// POST /api/blog/upload — Subir imagen de blog con conversión WebP
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

  try {
    const original = req.file;
    const originalSize = original.buffer.length;

    // Procesar con sharp: flatten → trim → resize 800x800 → webp
    const webpBuffer = await procesarImagen(original.buffer, {
      original: false,
    });

    const processedSize = webpBuffer.length;
    const ratio = ((1 - processedSize / originalSize) * 100).toFixed(1);

    // Generar ruta destino
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
    const destino = `assets/imagenes/articulos/${filename}`;

    // Subir a Supabase Storage
    await subirStorage(supabaseAdmin, destino, webpBuffer);

    // Obtener URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(destino);

    res.json({
      ok: true,
      url: urlData.publicUrl,
      path: destino,
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
