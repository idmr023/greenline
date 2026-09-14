import { describe, it, expect, vi } from 'vitest';
import crypto from 'node:crypto';
import request from 'supertest';

const adminId = crypto.randomUUID();
const clienteId = crypto.randomUUID();

const usersDb = {
  [adminId]: {
    id: adminId,
    email: 'admin@greenline.pe',
    nombre: 'Admin',
    apellido: 'Test',
    rol: 'ADMIN',
    nivelAcceso: 1,
    tiendaId: null,
    activo: true,
    twoFactorEnabled: true,
  },
  [clienteId]: {
    id: clienteId,
    email: 'cliente@greenline.pe',
    nombre: 'Cliente',
    apellido: 'Test',
    rol: 'CLIENTE',
    nivelAcceso: 0,
    tiendaId: null,
    activo: true,
    twoFactorEnabled: false,
  },
};

vi.mock('../../src/config/prisma.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(async ({ where }) => {
        if (where.id) return usersDb[where.id] || null;
        if (where.email) {
          return Object.values(usersDb).find((u) => u.email === where.email) || null;
        }
        return null;
      }),
    },
    auditLog: {
      create: vi.fn(async () => ({ id: '1' })),
    },
  },
}));

// Importar app y jwt DESPUÉS del mock
const { default: app } = await import('../../src/app.js');
const { signAccessToken } = await import('../../src/utils/jwt.js');

describe('API Security Headers & Endpoints (ISO 27001 / OWASP)', () => {
  it('GET /health devuelve 200 y headers de seguridad OWASP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');

    // Headers OWASP establecidos por Helmet
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(res.headers['content-security-policy']).toContain("object-src 'none'");

    // Request ID asignado y devuelto
    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('GET /api/metrics rechaza acceso no autenticado (401)', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.status).toBe(401);
  });

  it('GET /api/metrics rechaza rol CLIENTE sin permisos (403)', async () => {
    const token = signAccessToken({ id: clienteId, rol: 'CLIENTE', nivelAcceso: 0 });
    const res = await request(app)
      .get('/api/metrics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('GET /api/metrics permite rol ADMIN (200 JSON)', async () => {
    const token = signAccessToken({ id: adminId, rol: 'ADMIN', nivelAcceso: 1 });
    const res = await request(app)
      .get('/api/metrics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('requests');
    expect(res.body).toHaveProperty('memory');
  });

  it('GET /api/metrics/prometheus entrega formato texto Prometheus para ADMIN', async () => {
    const token = signAccessToken({ id: adminId, rol: 'ADMIN', nivelAcceso: 1 });
    const res = await request(app)
      .get('/api/metrics/prometheus')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('greenline_requests_total');
    expect(res.text).toContain('process_uptime_seconds');
  });

  it('404 estructurado ante rutas inexistentes', async () => {
    const res = await request(app).get('/ruta-que-no-existe-12345');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Endpoint no encontrado' });
  });
});