import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { hashPassword, verifyPassword, needsRehash } from '../utils/argon2.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { generateTOTPSecret, generateTOTPUri, verifyTOTP, generateQRCode, generateBackupCodes } from '../utils/qr.js';
import { generateOTPEmail } from '../utils/email.js';
import { enqueueEmail } from '../queue/email.queue.js';
import { createAuditLog } from '../middleware/auditLog.js';

const MAX_INTENTOS = 5;
const BLOQUEO_MINUTOS = 15;
const OTP_EXPIRY_MINUTOS = 5;

// ============================================================
// LOGIN - Paso 1: Validar credenciales
// ============================================================
export async function login(email, password, ip, userAgent) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (!user) {
    return { success: false, error: 'Credenciales inválidas' };
  }

  if (!user.activo) {
    return { success: false, error: 'Cuenta desactivada. Contacta al administrador.' };
  }

  // Verificar bloqueo
  if (user.bloqueadoHasta && user.bloqueadoHasta > new Date()) {
    const minutosRestantes = Math.ceil((user.bloqueadoHasta - new Date()) / 60000);
    return {
      success: false,
      error: `Cuenta bloqueada. Intenta de nuevo en ${minutosRestantes} minutos`,
    };
  }

  // Verificar contraseña
  const valid = await verifyPassword(user.passwordHash, password);

  if (!valid) {
    const nuevosIntentos = user.intentosFallidos + 1;

    if (nuevosIntentos >= MAX_INTENTOS) {
      const bloqueadoHasta = new Date(Date.now() + BLOQUEO_MINUTOS * 60 * 1000);
      await prisma.user.update({
        where: { id: user.id },
        data: { intentosFallidos: nuevosIntentos, bloqueadoHasta },
      });
      return {
        success: false,
        error: `Cuenta bloqueada por ${BLOQUEO_MINUTOS} minutos tras ${MAX_INTENTOS} intentos fallidos`,
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { intentosFallidos: nuevosIntentos },
    });

    return {
      success: false,
      error: `Credenciales inválidas. ${MAX_INTENTOS - nuevosIntentos} intentos restantes`,
    };
  }

  // Login exitoso - reset intentos
  await prisma.user.update({
    where: { id: user.id },
    data: { intentosFallidos: 0, bloqueadoHasta: null },
  });

  await createAuditLog({
    userId: user.id,
    accion: 'LOGIN',
    tabla: 'users',
    registroId: user.id,
    ip,
    userAgent,
  });

  // Si es CLIENTE: generar y enviar OTP por email
  if (user.rol === 'CLIENTE') {
    return await generateAndSendOTP(user, ip);
  }

  // Si es STAFF con 2FA habilitado: pedir verificación TOTP
  if (user.twoFactorEnabled) {
    const tempToken = signAccessToken({ ...user, temp: true });
    return {
      success: true,
      requires2FA: true,
      tempToken,
      message: 'Ingresa el código de tu aplicación de autenticación',
    };
  }

  // STAFF sin 2FA configurado: login directo (debería configurar 2FA)
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await saveRefreshToken(user.id, refreshToken, ip, userAgent);

  return {
    success: true,
    requires2FA: false,
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
}

// ============================================================
// OTP para clientes
// ============================================================
async function generateAndSendOTP(user, ip) {
  const codigo = String(Math.floor(100000 + Math.random() * 900000));
  const expiraEn = new Date(Date.now() + OTP_EXPIRY_MINUTOS * 60 * 1000);

  // Limpiar OTPs anteriores
  await prisma.otpCode.deleteMany({
    where: { userId: user.id, tipo: 'email_login', usado: false },
  });

  // Crear nuevo OTP
  await prisma.otpCode.create({
    data: {
      userId: user.id,
      codigo,
      tipo: 'email_login',
      expiraEn,
    },
  });

  // Enviar email (encolado, no bloquea el request).
  await enqueueEmail({
    to: user.email,
    subject: 'GreenLine — Tu código de acceso',
    html: generateOTPEmail(codigo, user.nombre),
  });

  return {
    success: true,
    requiresOTP: true,
    message: `Código enviado a ${maskEmail(user.email)}`,
    emailMasked: maskEmail(user.email),
  };
}

// ============================================================
// Verificar OTP (clientes)
// ============================================================
export async function verifyOTP(email, codigo, ip, userAgent) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return { success: false, error: 'Usuario no encontrado' };

  const otp = await prisma.otpCode.findFirst({
    where: {
      userId: user.id,
      codigo,
      tipo: 'email_login',
      usado: false,
      expiraEn: { gt: new Date() },
    },
  });

  if (!otp) {
    return { success: false, error: 'Código inválido o expirado' };
  }

  // Marcar OTP como usado
  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { usado: true },
  });

  // Actualizar último login
  await prisma.user.update({
    where: { id: user.id },
    data: { ultimoLogin: new Date(), ultimoLoginIp: ip, emailVerificado: true },
  });

  // Generar tokens
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await saveRefreshToken(user.id, refreshToken, ip, userAgent);

  await createAuditLog({
    userId: user.id,
    accion: 'LOGIN',
    tabla: 'users',
    registroId: user.id,
    ip,
    userAgent,
  });

  return {
    success: true,
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
}

// ============================================================
// 2FA Setup (staff)
// ============================================================
export async function setup2FA(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuario no encontrado');

  const secret = generateTOTPSecret(user.email);
  const uri = generateTOTPUri(secret, user.email);
  const qrDataUrl = await generateQRCode(uri);
  const backupCodes = generateBackupCodes();

  // Guardar secret temporal (se confirma al verificar)
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: secret,
      twoFactorBackup: JSON.stringify(backupCodes),
    },
  });

  return {
    secret,
    qrDataUrl,
    backupCodes,
    message: 'Escanea el código QR con tu aplicación de autenticación',
  };
}

// ============================================================
// Verificar y activar 2FA
// ============================================================
export async function confirm2FA(userId, token) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorSecret) {
    throw new Error('Configuración 2FA no encontrada');
  }

  const valid = verifyTOTP(user.twoFactorSecret, token);
  if (!valid) {
    return { success: false, error: 'Código inválido. Intenta de nuevo.' };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });

  return { success: true, message: '2FA activado correctamente' };
}

// ============================================================
// Verificar 2FA durante login (staff)
// ============================================================
export async function verify2FALogin(tempToken, totpCode, ip, userAgent) {
  try {
    const payload = verifyRefreshToken(tempToken);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || !user.twoFactorSecret) {
      return { success: false, error: 'Sesión inválida' };
    }

    const valid = verifyTOTP(user.twoFactorSecret, totpCode);
    if (!valid) {
      return { success: false, error: 'Código 2FA inválido' };
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await saveRefreshToken(user.id, refreshToken, ip, userAgent);

    await prisma.user.update({
      where: { id: user.id },
      data: { ultimoLogin: new Date(), ultimoLoginIp: ip },
    });

    return {
      success: true,
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
    };
  } catch {
    return { success: false, error: 'Token temporal inválido o expirado' };
  }
}

// ============================================================
// Refresh Token
// ============================================================
export async function refreshTokens(refreshToken, ip, userAgent) {
  try {
    const payload = verifyRefreshToken(refreshToken);

    const stored = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        revoked: false,
        expiraEn: { gt: new Date() },
      },
    });

    if (!stored) {
      return { success: false, error: 'Refresh token inválido o revocado' };
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.activo) {
      return { success: false, error: 'Usuario no encontrado o desactivado' };
    }

    // Revocar el token viejo
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    // Crear nuevos tokens
    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    await saveRefreshToken(user.id, newRefreshToken, ip, userAgent);

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    return { success: false, error: 'Refresh token inválido' };
  }
}

// ============================================================
// Logout
// ============================================================
export async function logout(userId, refreshToken) {
  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }

  await createAuditLog({
    userId,
    accion: 'LOGOUT',
    tabla: 'users',
    registroId: userId,
  });

  return { success: true };
}

// ============================================================
// Helpers
// ============================================================
async function saveRefreshToken(userId, token, ip, userAgent) {
  const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  await prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiraEn: new Date(decoded.exp * 1000),
      ip,
      userAgent,
    },
  });
}

function sanitizeUser(user) {
  const { passwordHash, twoFactorSecret, twoFactorBackup, intentosFallidos, bloqueadoHasta, ...safe } = user;
  return safe;
}

function maskEmail(email) {
  const [name, domain] = email.split('@');
  const masked = name.substring(0, 2) + '***' + name.substring(name.length - 1);
  return `${masked}@${domain}`;
}
