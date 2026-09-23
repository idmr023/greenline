import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { unsubscribeLimiter } from '../middleware/rateLimiter.js';
import prisma from '../config/prisma.js';

const router = Router();

// ============================================================
// POST /api/marketing/unsubscribe — Baja de emails de marketing
// El cliente introduce su correo en /cancelar-suscripcion.
// Cambia users.emails_allowed de true a false.
// Respuesta siempre ok=true para no revelar si el correo existe.
// ============================================================

export const unsubscribeSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(254),
  }),
});

router.post('/unsubscribe', unsubscribeLimiter, validate(unsubscribeSchema), async (req, res) => {
  try {
    const email = req.validated.body.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailsAllowed: true },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailsAllowed: false,
          emailsUnsubscribedAt: new Date(),
        },
      });
    }

    res.json({
      ok: true,
      emails_allowed: false,
      message: 'Listo. Este correo no recibirá más correos de promociones y novedades.',
    });
  } catch (err) {
    console.error('Error en unsubscribe:', err);
    res.status(500).json({
      ok: false,
      error: 'No se pudo procesar la baja. Intenta de nuevo en unos minutos.',
    });
  }
});

export default router;
