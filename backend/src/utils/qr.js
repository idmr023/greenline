import {
  generateSecret,
  generateURI,
  verify,
} from 'otplib';

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
    const randomPart = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    codes.push(
      `${randomPart.slice(0, 3)}-${randomPart.slice(3)}`
    );
  }

  return codes;
}