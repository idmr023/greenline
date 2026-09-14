import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import {
  signAccessToken, verifyAccessToken,
  signRefreshToken, verifyRefreshToken,
  signTempToken, verifyTempToken,
} from '../../src/utils/jwt.js';

const userStub = { id: crypto.randomUUID(), email: 'staff@greenline.com', rol: 'ADMIN', nivel: 1, tiendaId: 1 };

describe('jwt.js — separación de secretos y tokens temporales', () => {
  it('emite y verifica temp token con flag gate:false', () => {
    const t = signTempToken(userStub, { gate: false });
    const payload = verifyTempToken(t);
    expect(payload.sub).toBe(userStub.id);
    expect(payload.type).toBe('temp');
    expect(payload.gate).toBe(false);
  });

  it('temp token NO es aceptado por el verificador de access tokens (secretos separados)', () => {
    const temp = signTempToken(userStub);
    expect(() => verifyAccessToken(temp)).toThrow();
  });

  it('temp token NO es aceptado por el verificador de refresh tokens', () => {
    const temp = signTempToken(userStub);
    expect(() => verifyRefreshToken(temp)).toThrow();
  });

  it('access y refresh tokens usan secretos distintos', () => {
    const acc = signAccessToken(userStub);
    const ref = signRefreshToken(userStub);
    expect(verifyAccessToken(acc).sub).toBe(userStub.id);
    expect(() => verifyAccessToken(ref)).toThrow();
    expect(() => verifyRefreshToken(acc)).toThrow();
  });
});