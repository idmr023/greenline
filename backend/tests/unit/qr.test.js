import { describe, it, expect } from 'vitest';
import { generateBackupCodes, generateTOTPSecret, verifyTOTP } from '../../src/utils/qr.js';

describe('qr.js — backup codes CSPRNG y TOTP', () => {
  it('genera backup codes con formato XXX-XXX en hex', () => {
    const codes = generateBackupCodes(8);
    expect(codes).toHaveLength(8);
    for (const code of codes) {
      expect(code).toMatch(/^[0-9A-F]{3}-[0-9A-F]{3}$/);
    }
  });

  it('un sample grande no presenta colisiones (CSPRNG)', () => {
    const codes = generateBackupCodes(500);
    expect(new Set(codes).size).toBe(500);
  });

  it('el secret TOTP es base32 y verifica su propio token', async () => {
    const secret = generateTOTPSecret('a@b.c');
    expect(String(secret)).toMatch(/^[A-Z2-7]+$/);
    const { generateSync } = await import('otplib');
    const token = generateSync({ secret });
    const isValid = await verifyTOTP(secret, token);
    expect(isValid).toBe(true);
  });
});