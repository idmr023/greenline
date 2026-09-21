import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';
import { hashPassword, verifyPassword, needsRehash } from '../utils/argon2.js';
import { signAccessToken, signRefreshToken, signTempToken, verifyRefreshToken, verifyTempToken } from '../utils/jwt.js';
import { generateTOTPSecret, generateTOTPUri, verifyTOTP, generateQRCode, generateBackupCodes } from '../utils/qr.js';
import { generateOTPEmail } from '../utils/email.js';
import { enqueueEmail } from '../queue/email.queue.js';
import { createAuditLog } from '../middleware/auditLog.js';
import { encryptField, decryptField, hashToken } from '../utils/cipher.js';

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
    await createAuditLog({
      userId: user.id,
      accion: 'LOGIN_FAILED',
      tabla: 'users',
      registroId: user.id,
      ip,
      userAgent,
    });

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

  // Rehash automático de Argon2 si los parámetros del hash cambiaron
  // (mejora continua de costes sin pedir nada al usuario).
  if (needsRehash(user.passwordHash)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(password) },
    });
  }

  await createAuditLog({
    userId: user.id,
    accion: 'LOGIN',
    tabla: 'users',
    registroId: user.id,
    ip,
    userAgent,
  });

  // Emitir sesión completa directamente (sin gate, sin OTP por ahora).
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
}

// ============================================================
// Puerta de acceso staff (verificación server-side del código compartido)
// ============================================================
export async function verifyStaffGate(tempToken, gate, ip, userAgent) {
  let payload;
  try {
    payload = verifyTempToken(tempToken);
  } catch {
    return { success: false, error: 'Sesión temporal inválida o expirada' };
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.activo) {
    return { success: false, error: 'Cuenta no encontrada o desactivada' };
  }

  if (!verifyGateCode(gate)) {
    await createAuditLog({
      userId: user.id,
      accion: 'GATE_FAILED',
      tabla: 'users',
      registroId: user.id,
      ip,
      userAgent,
    });
    return { success: false, error: 'Código de acceso incorrecto' };
  }

  // Staff con 2FA: avanzar al siguiente factor con un nuevo token temporal
  if (user.twoFactorEnabled) {
    const temp2FA = signTempToken(user, { gate: true });
    return {
      success: true,
      requires2FA: true,
      tempToken: temp2FA,
      message: 'Ingresa el código de tu aplicación de autenticación',
    };
  }

  // Staff sin 2FA configurado: emitir sesión completa
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
}

// Comparación en tiempo constante del código de puerta (evita timing attacks).
function verifyGateCode(gate) {
  if (!env.STAFF_GATE_CODE) return false;
  const a = Buffer.from(String(gate).trim());
  const b = Buffer.from(String(env.STAFF_GATE_CODE).trim());
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ============================================================
// OTP para clientes
// ============================================================
async function generateAndSendOTP(user, ip) {
  // CSPRNG: crypto.randomInt (nunca Math.random, no apto para credenciales)
  const codigo = String(crypto.randomInt(100000, 1000000));
  const expiraEn = new Date(Date.now() + OTP_EXPIRY_MINUTOS * 60 * 1000);

  // Limpiar OTPs anteriores
  await prisma.otpCode.deleteMany({
    where: { userId: user.id, tipo: 'email_login', usado: false },
  });

  // Crear nuevo OTP (el código se cifra en reposo; nunca en texto plano)
  await prisma.otpCode.create({
    data: {
      userId: user.id,
      codigo: encryptField(codigo),
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

  // Una cuenta desactivada no debe poder completar login aunque tenga un OTP vivo
  if (!user.activo) return { success: false, error: 'Cuenta desactivada' };

  const otps = await prisma.otpCode.findMany({
    where: {
      userId: user.id,
      tipo: 'email_login',
      usado: false,
      expiraEn: { gt: new Date() },
    },
  });

  const otp = matchOtp(otps, codigo);

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
// Password reset (OTP por email, tokenizado y con expiración)
// ============================================================
// Respuesta genérica intencional en ambos caminos: evita la enumeración de cuentas.
export async function requestPasswordReset(email, ip) { // NOSONAR S3516
  const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });

  // Respuesta genérica: no revelamos si la cuenta existe.
  const generic = {
    success: true,
    message: 'Si el correo está registrado, recibirás un código para restablecer tu contraseña',
  };

  if (!user || !user.activo) return generic;

  const codigo = String(crypto.randomInt(100000, 1000000));
  const expiraEn = new Date(Date.now() + 10 * 60 * 1000);

  // Invalidar OTPs de reset pendientes (evita acumulación y rejuegos)
  await prisma.otpCode.deleteMany({
    where: { userId: user.id, tipo: 'password_reset', usado: false },
  });

  await prisma.otpCode.create({
    data: {
      userId: user.id,
      codigo: encryptField(codigo),
      tipo: 'password_reset',
      expiraEn,
    },
  });

  await enqueueEmail({
    to: user.email,
    subject: 'GreenLine — Restablece tu contraseña',
    html: generateOTPEmail(codigo, user.nombre),
  });

  await createAuditLog({
    userId: user.id,
    accion: 'PASSWORD_RESET_REQUESTED',
    tabla: 'users',
    registroId: user.id,
    ip,
  });

  return generic;
}

export async function resetPassword(email, codigo, newPassword, ip) {
  const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!user || !user.activo) {
    return { success: false, error: 'Usuario no encontrado o desactivado' };
  }

  const otps = await prisma.otpCode.findMany({
    where: {
      userId: user.id,
      tipo: 'password_reset',
      usado: false,
      expiraEn: { gt: new Date() },
    },
  });
  const otp = matchOtp(otps, codigo);
  if (!otp) {
    return { success: false, error: 'Código inválido o expirado' };
  }

  if (String(newPassword).length < 8) {
    return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
  }

  await prisma.otpCode.update({ where: { id: otp.id }, data: { usado: true } });
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  // Revocar todas las sesiones tras el reset (prevención de sesión fija)
  await prisma.refreshToken.updateMany({ where: { userId: user.id }, data: { revoked: true } });

  await createAuditLog({
    userId: user.id,
    accion: 'PASSWORD_RESET',
    tabla: 'users',
    registroId: user.id,
    ip,
  });

  return { success: true, message: 'Contraseña actualizada. Inicia sesión con tu nueva contraseña.' };
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

  // Guardar secret temporal (se confirma al verificar) — cifrado en reposo
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: encryptField(secret),
      twoFactorBackup: encryptField(JSON.stringify(backupCodes)),
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

  const valid = await verifyTOTP(readSensitiveField(user.twoFactorSecret), token);
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
    const payload = verifyTempToken(tempToken);

    // Defensa en profundidad: el token temporal solo habilita 2FA si la puerta
    // staff ya se superó (gate:true). Un token gate:false no puede saltar el factor.
    if (payload.gate !== true) {
      return { success: false, error: 'Sesión temporal inválida o expirada' };
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || !user.twoFactorSecret) {
      return { success: false, error: 'Sesión inválida' };
    }

    const valid = await verifyTOTP(readSensitiveField(user.twoFactorSecret), totpCode);
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

    // Tokens nuevos: lookup por hash. Legado (pre-cifrado): lookup por valor crudo.
    let stored = await prisma.refreshToken.findFirst({
      where: {
        token: hashToken(refreshToken),
        revoked: false,
        expiraEn: { gt: new Date() },
      },
    });

    if (!stored) {
      stored = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          revoked: false,
          expiraEn: { gt: new Date() },
        },
      });
    }

    if (!stored) {
      return { success: false, error: 'Refresh token inválido o revocado' };
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.activo) {
      return { success: false, error: 'Usuario no encontrado o desactivado' };
    }

    // Bind de sesión (dispositivo): si el token se emitió con un fingerprint
    // y ahora el User-Agent no coincide, revocamos la sesión (posible robo).
    if (stored.fingerprint && userAgent) {
      const current = deviceFingerprint(userAgent);
      if (current && stored.fingerprint !== current) {
        await prisma.refreshToken.update({
          where: { id: stored.id },
          data: { revoked: true },
        });
        await createAuditLog({
          userId: user.id,
          accion: 'SESSION_DEVICE_MISMATCH',
          tabla: 'refresh_tokens',
          registroId: stored.id,
          ip,
          userAgent,
        });
        return { success: false, error: 'Sesión inválida' };
      }
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
      where: { token: { in: [hashToken(refreshToken), refreshToken] } },
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
      // En reposo solo se guarda el SHA-256 del token: una fuga de la DB
      // no permite reutilizar sesiones.
      token: hashToken(token),
      expiraEn: new Date(decoded.exp * 1000),
      ip,
      userAgent,
      // Fingerprint del dispositivo para bind de sesión en el refresh.
      fingerprint: deviceFingerprint(userAgent),
    },
  });
}

// Hash del "device fingerprint" (User-Agent normalizado). Se usa para
// detectar reutilización de tokens desde otro navegador/dispositivo.
function deviceFingerprint(userAgent) {
  if (!userAgent) return null;
  const normalized = String(userAgent).toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 256);
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function sanitizeUser(user) {
  const { passwordHash, twoFactorSecret, twoFactorBackup, intentosFallidos, bloqueadoHasta, ...safe } = user;
  return safe;
}

// Helper: leer un campo sensible que puede estar cifrado (v1:) o en texto
// plano (legado pre-cifrado). Garantiza migración suave sin romper sesiones.
function readSensitiveField(value) {
  if (value && value.startsWith('v1:')) return decryptField(value);
  return value || null;
}

// Compara el código recibido contra los OTPs pendientes. El código se guarda
// cifrado; desciframos y comparamos sin filtrar por valor, y sin interrumpir
// a los OTPs legado aún en texto plano.
function matchOtp(otps, codigo) {
  return otps.find((o) => {
    const plain = o.codigo?.startsWith('v1:') ? decryptField(o.codigo) : o.codigo;
    if (plain === null || plain.length !== String(codigo).length) return false;
    return crypto.timingSafeEqual(Buffer.from(plain), Buffer.from(String(codigo)));
  });
}

function maskEmail(email) {
  const [name, domain] = email.split('@');
  const masked = name.substring(0, 2) + '***' + name.substring(name.length - 1);
  return `${masked}@${domain}`;
}
