import {
  generateSecret,
  generateURI,
  verify,
} from 'otplib';
import crypto from 'crypto';

import QRCode from 'qrcode';

export function generateTOTPSecret(email) {
  return generateSecret();
}

export function generateTOTPUri(secret, email) {
  return generateURI({
    issuer: process.env.TOTP_ISSUER || 'GreenLine',
    label: email,
    secret,
  });
}

export async function verifyTOTP(secret, token) {
  const result = await verify({
    secret,
    token,
  });

  return result.valid;
}

export async function generateQRCode(uri) {
  return QRCode.toDataURL(uri);
}

export function generateBackupCodes(count = 8) {
  const codes = [];

  for (let i = 0; i < count; i++) {
    // CSPRNG: 3 bytes aleatorios → 6 hex, formateados como XXX-XXX
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    codes.push(`${randomHex.slice(0, 3)}-${randomHex.slice(3)}`);
  }

  return codes;
}