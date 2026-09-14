import { describe, it, expect, vi } from 'vitest';
import { originCheck } from '../../src/middleware/originCheck.js';

function run(method, origin) {
  const req = { method, headers: origin ? { origin } : {}, originalUrl: '/api/x' };
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
  const next = vi.fn();
  originCheck(req, res, next);
  return { res, next };
}

describe('originCheck.js — anti-CSRF', () => {
  it('permite métodos GET aunque vengan con Origin', () => {
    const { next, res } = run('GET', 'https://evil.example');
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('permite POST con origen de la propia app', () => {
    const { next, res } = run('POST', process.env.FRONTEND_URL || 'http://localhost:5173');
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('bloquea POST con origen desconocido (CSRF → 403)', () => {
    const { res, next } = run('POST', 'https://evil.example');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('permite POST sin cabecera Origin (curl / apps móviles / server-to-server)', () => {
    const { res, next } = run('POST', null);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });
});