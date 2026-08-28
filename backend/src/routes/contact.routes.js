import { Router } from 'express';
import { z } from 'zod';
import { sendEmail } from '../utils/email.js';
import { validate } from '../middleware/validate.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { env } from '../config/env.js';

const router = Router();

// ============================================================
// POST /api/contact — Formulario de contacto (público)
// Envía el mensaje por email a MAIL_TO (o EMAIL_FROM si no está definido)
// ============================================================

const contactSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2).max(120),
    email: z.string().email(),
    asunto: z.string().trim().min(2).max(200),
    mensaje: z.string().trim().min(10).max(5000),
    /** Honeypot: los bots llenan este campo oculto */
    empresa: z.string().optional(),
  }),
});

router.post('/', contactLimiter, validate(contactSchema), async (req, res) => {
  try {
    const { nombre, email, asunto, mensaje, empresa } = req.validated.body;

    // Honeypot: responder 200 sin enviar para no alertar al bot
    if (empresa) {
      return res.status(200).json({ ok: true });
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #009000; padding: 24px 30px; }
          .header h1 { color: white; margin: 0; font-size: 20px; }
          .body { padding: 30px; }
          h2 { margin: 0 0 16px; font-size: 16px; color: #111; }
          .campo { margin-bottom: 16px; }
          .campo .etiqueta { font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .campo .valor { margin-top: 4px; font-size: 14px; color: #111; background: #f9f9f9; padding: 10px 12px; border-radius: 8px; white-space: pre-wrap; }
          .footer { padding: 16px 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Nuevo mensaje — Formulario de contacto</h1></div>
          <div class="body">
            <div class="campo">
              <div class="etiqueta">Nombre</div>
              <div class="valor">${escapeHtml(nombre)}</div>
            </div>
            <div class="campo">
              <div class="etiqueta">Correo de respuesta</div>
              <div class="valor">${escapeHtml(email)}</div>
            </div>
            <div class="campo">
              <div class="etiqueta">Asunto</div>
              <div class="valor">${escapeHtml(asunto)}</div>
            </div>
            <div class="campo">
              <div class="etiqueta">Mensaje</div>
              <div class="valor">${escapeHtml(mensaje)}</div>
            </div>
          </div>
          <div class="footer">GreenLine © ${new Date().getFullYear()} — Movilidad Eléctrica</div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: env.MAIL_TO || env.EMAIL_FROM,
      subject: `[Web] ${asunto}`,
      html,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error enviando mensaje de contacto:', error);
    res.status(500).json({ error: 'No se pudo enviar el mensaje. Intenta más tarde.' });
  }
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default router;