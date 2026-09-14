import crypto from 'crypto';
import { env } from '../config/env.js';

// ============================================================
// Cifrado a nivel de campo (Defensa en profundidad - Fase A.2)
// ------------------------------------------------------------
// AES-256-GCM para datos sensibles en reposo (OTP, 2FA secret,
// backup codes) y SHA-256 para refresh tokens.
//
// Clave derivada con SHA-256 de FIELD_ENCRYPTION_KEY: cualquier
// valor largo estable sirve, se normaliza a 32 bytes.
// ============================================================

function getKey() {
  return crypto.createHash('sha256').update(env.FIELD_ENCRYPTION_KEY).digest();
}

/**
 * Cifra un texto plano → "v1:<iv_b64>:<tag_b64>:<data_b64>".
 * IV aleatorio por cifrado (GCM), nunca se reutiliza.
 */
export function encryptField(plaintext) {
  if (plaintext === null || plaintext === undefined) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

/**
 * Descifra un valor cifrado con encryptField. Devuelve el texto plano
 * o null si el formato/etiqueta no coincide o el valor no está cifrado.
 */
export function decryptField(ciphertext) {
  if (!ciphertext || typeof ciphertext !== 'string') return null;
  const parts = ciphertext.split(':');
  if (parts.length !== 4 || parts[0] !== 'v1') return null;

  try {
    const [iv, tag, data] = parts.slice(1).map((p) => Buffer.from(p, 'base64'));
    const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    // Tag inválido (dato corrupto o clave cambiada)
    return null;
  }
}

/** SHA-256 hex de un refresh token: a los tokens en reposo no se les puede
 *  revertir para reutilizarlos si la base de datos se filtra. */
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}