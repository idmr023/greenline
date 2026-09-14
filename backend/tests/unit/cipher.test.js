import { describe, it, expect } from 'vitest';
import { encryptField, decryptField, hashToken } from '../../src/utils/cipher.js';

describe('cipher.js — cifrado de campos sensibles (AES-256-GCM)', () => {
  it('hace roundtrip encrypt/decrypt', () => {
    const plain = '123456';
    expect(decryptField(encryptField(plain))).toBe(plain);
  });

  it('nunca devuelve el texto plano cifrado', () => {
    const enc = encryptField('secreto');
    expect(enc).not.toBe('secreto');
    expect(String(enc).startsWith('v1:')).toBe(true);
  });

  it('usa IV aleatorio (dos cifrados del mismo valor son distintos)', () => {
    expect(encryptField('abc')).not.toBe(encryptField('abc'));
  });

  it('rechaza cifrados corruptos o sin prefijo v1:', () => {
    expect(decryptField('v1:basura:no:valida')).toBeNull();
    expect(decryptField(null)).toBeNull();
    expect(decryptField(undefined)).toBeNull();
  });

  it('hashToken es determinista y de 64 hex', () => {
    const tok = 'aa.bb.cc';
    const h = hashToken(tok);
    expect(h).toBe(hashToken(tok));
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(h).not.toBe(tok);
  });
});