import { verifyAccessToken } from '../utils/jwt.js';
import prisma from '../config/prisma.js';

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        nivelAcceso: true,
        tiendaId: true,
        activo: true,
        twoFactorEnabled: true,
      },
    });

    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Usuario no encontrado o desactivado' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function require2FA(req, res, next) {
  if (req.user.rol === 'CLIENTE') return next();
  if (!req.user.twoFactorEnabled) {
    return res.status(403).json({
      error: '2FA no configurado',
      code: '2FA_REQUIRED',
      message: 'Debes configurar autenticación de dos factores',
    });
  }
  next();
}
