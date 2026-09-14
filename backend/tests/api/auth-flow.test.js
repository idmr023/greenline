import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'node:crypto';
import request from 'supertest';

// ------------------------------------------------------------
// 1. Estado del "DB" falso
// ------------------------------------------------------------
const staffId = crypto.randomUUID();
const clienteId = crypto.randomUUID();

let otpSentEmail = null;
let otpSentCodigo = null;
let otpRows = [];           // filas de otp_codes
let refreshRows = [];       // filas de refresh_tokens
let staffUser = null;       // usuario staff del "DB" falso
let clienteUser = null;     // usuario cliente del "DB" falso

const baseStaff = {
  id: staffId,
  email: 'staff@greenline.pe',
  nombre: 'Staff',
  apellido: 'Green',
  rol: 'ADMIN',
  nivelAcceso: 1,
  tiendaId: null,
  activo: true,
  passwordHash: null, // se completa en beforeAll con argon2 real
  intentosFallidos: 0,
  bloqueadoHasta: null,
  twoFactorEnabled: true,
  twoFactorSecret: null, // se completa con secret real
  ultimoLogin: null,
  ultimoLoginIp: null,
  emailVerificado: true,
};

const baseCliente = {
  id: clienteId,
  email: 'cliente@greenline.pe',
  nombre: 'Cliente',
  apellido: 'Green',
  rol: 'CLIENTE',
  nivelAcceso: 0,
  tiendaId: null,
  activo: true,
  passwordHash: null,
  intentosFallidos: 0,
  bloqueadoHasta: null,
  twoFactorEnabled: false,
  ultimoLogin: null,
  ultimoLoginIp: null,
  emailVerificado: true,
};

const usersDb = () => ({
  [staffId]: staffUser,
  [clienteId]: clienteUser,
});

const findUser = ({ where }) => {
  if (where.id) {
    if (where.id === staffId) return staffUser;
    if (where.id === clienteId) return clienteUser;
    return null;
  }
  if (where.email) {
    if (where.email === staffUser?.email) return staffUser;
    if (where.email === clienteUser?.email) return clienteUser;
    return null;
  }
  return null;
};

const updateUser = ({ where, data }) => {
  const current = findUser({ where });
  if (!current) throw new Error('user not found');
  Object.assign(current, data);
  return current;
};

// ------------------------------------------------------------
// 2. Mocks de módulos con efectos externos (envío de emails / audit)
// ------------------------------------------------------------
vi.mock('../../src/queue/email.queue.js', () => ({
  enqueueEmail: vi.fn(async (job) => {
    otpSentEmail = job.to;
    otpSentCodigo = String((job.html.match(/class="code">(\d{6})</) || [])[1] || '');
  }),
  closeEmailQueue: vi.fn(async () => {}),
  initEmailWorker: vi.fn(),
}));

vi.mock('../../src/middleware/auditLog.js', () => ({
  auditLog: vi.fn(() => (req, res, next) => next()),
  createAuditLog: vi.fn(async () => ({ id: 'audit-1' })),
}));

vi.mock('../../src/config/prisma.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(async (args) => findUser(args)),
      update: vi.fn(async (args) => updateUser(args)),
    },
    otpCode: {
      create: vi.fn(async ({ data }) => {
        const row = { id: crypto.randomUUID(), usado: false, ...data };
        otpRows.push(row);
        return row;
      }),
      findMany: vi.fn(async ({ where }) => otpRows.filter(
        (o) => o.userId === where.userId
          && o.tipo === where.tipo
          && o.usado === where.usado
          && new Date(o.expiraEn) > new Date()
      )),
      update: vi.fn(async ({ where, data }) => {
        const row = otpRows.find((o) => o.id === where.id);
        Object.assign(row, data);
        return row;
      }),
      deleteMany: vi.fn(async ({ where }) => {
        otpRows = otpRows.filter((o) => !(o.userId === where.userId && o.tipo === where.tipo && o.usado === false));
        return { count: 0 };
      }),
    },
    refreshToken: {
      create: vi.fn(async ({ data }) => {
        const row = { id: crypto.randomUUID(), ...data };
        refreshRows.push(row);
        return row;
      }),
      findFirst: vi.fn(async ({ where }) => refreshRows.find(
        (r) => r.token === where.token && r.revoked === where.revoked
      ) || null),
      updateMany: vi.fn(async ({ where, data }) => {
        for (const r of refreshRows) {
          if (where.userId ? r.userId === where.userId : where.token.in.includes(r.token)) {
            Object.assign(r, data);
          }
        }
        return { count: 1 };
      }),
      update: vi.fn(async ({ where, data }) => {
        const row = refreshRows.find((r) => r.id === where.id);
        Object.assign(row, data);
        return row;
      }),
    },
    auditLog: { create: vi.fn(async () => ({ id: '1' })) },
  },
}));

// Importar DESPUÉS de los mocks
const { default: app } = await import('../../src/app.js');
const { hashPassword } = await import('../../src/utils/argon2.js');
const { generateTOTPSecret } = await import('../../src/utils/qr.js');
const { generateSync } = await import('otplib');
const { env } = await import('../../src/config/env.js');

beforeEach(async () => {
  otpRows = [];
  refreshRows = [];
  otpSentEmail = null;
  otpSentCodigo = null;
  if (!baseStaff.passwordHash) {
    baseStaff.passwordHash = await hashPassword('StaffPass#2026');
    baseCliente.passwordHash = await hashPassword('ClientePass#2026');
  }
  staffUser = { ...baseStaff };
  clienteUser = { ...baseCliente };
});

describe('Flujo de autenticación unificado (staff + clientes)', () => {
  it('staff: login → gate incorrecto rechazado → gate correcto → 2FA → sesión completa', async () => {
    staffUser.twoFactorSecret = generateTOTPSecret(baseStaff.email);

    // Paso 1: login con credenciales
    const r1 = await request(app).post('/api/auth/login').send({
      email: 'staff@greenline.pe',
      password: 'StaffPass#2026',
    });
    expect(r1.status).toBe(200);
    expect(r1.body.requiresStaffGate).toBe(true);
    expect(r1.body.tempToken).toBeDefined();
    const temp1 = r1.body.tempToken;

    // Paso 2: gate incorrecto → 401
    const r2 = await request(app).post('/api/auth/verify-gate').send({ tempToken: temp1, gate: '0000' });
    expect(r2.status).toBe(401);
    expect(r2.body.error).toBe('Código de acceso incorrecto');

    // Paso 3: gate correcto → requiere 2FA
    const r3 = await request(app).post('/api/auth/verify-gate').send({ tempToken: temp1, gate: env.STAFF_GATE_CODE });
    expect(r3.status).toBe(200);
    expect(r3.body.requires2FA).toBe(true);
    const temp2 = r3.body.tempToken;

    // Paso 4: 2FA con TOTP válido → sesión completa
    const totp = generateSync({ secret: staffUser.twoFactorSecret });
    const r4 = await request(app).post('/api/auth/verify-2fa').send({ tempToken: temp2, totpCode: totp });
    expect(r4.status).toBe(200);
    expect(r4.body.success).toBe(true);
    expect(r4.body.accessToken).toBeDefined();
    expect(r4.body.refreshToken).toBeDefined();
    expect(r4.body.user).not.toHaveProperty('passwordHash');
    expect(r4.body.user).not.toHaveProperty('twoFactorSecret');
    expect(r4.body.user).not.toHaveProperty('twoFactorBackup');
  });

  it('staff: no puede saltar el 2FA con el token gate:false (defensa en profundidad)', async () => {
    staffUser.twoFactorSecret = generateTOTPSecret(baseStaff.email);

    const r1 = await request(app).post('/api/auth/login').send({
      email: 'staff@greenline.pe',
      password: 'StaffPass#2026',
    });
    const temp1 = r1.body.tempToken;

    // Intento de usar el tempToken gate:false directamente en /verify-2fa
    const totp = generateSync({ secret: staffUser.twoFactorSecret });
    const r2 = await request(app).post('/api/auth/verify-2fa').send({ tempToken: temp1, totpCode: totp });
    expect(r2.status).toBe(401);
expect(r2.body.success).toBe(false);
  });

  it('cliente: login emite OTP por email → verify-otp entrega sesión', async () => {
    const r1 = await request(app).post('/api/auth/login').send({
      email: 'cliente@greenline.pe',
      password: 'ClientePass#2026',
    });
    expect(r1.status).toBe(200);
    expect(r1.body.requiresOTP).toBe(true);
    expect(r1.body.emailMasked).toContain('***');

    // El código llega por la cola de emails (mock) — no se devuelve en la respuesta
    expect(otpSentCodigo).toMatch(/^\d{6}$/);

    const r2 = await request(app).post('/api/auth/verify-otp').send({
      email: 'cliente@greenline.pe',
      codigo: otpSentCodigo,
    });
    expect(r2.status).toBe(200);
    expect(r2.body.accessToken).toBeDefined();
    expect(r2.body.refreshToken).toBeDefined();
    expect(r2.body.user.rol).toBe('CLIENTE');
  });

  it('cliente: OTP incorrecto rechazado (401)', async () => {
    await request(app).post('/api/auth/login').send({
      email: 'cliente@greenline.pe',
      password: 'ClientePass#2026',
    });

    const r2 = await request(app).post('/api/auth/verify-otp').send({
      email: 'cliente@greenline.pe',
      codigo: '999999',
    });
    expect(r2.status).toBe(401);
expect(r2.body.error).toBe('Código inválido o expirado');
  });

  it('password reset: request → OTP por email → reset revoca sesiones y cambia hash', async () => {
    // Sesión previa del staff para comprobar revocación posterior
    staffUser.twoFactorSecret = generateTOTPSecret(baseStaff.email);
    const r1 = await request(app).post('/api/auth/login').send({ email: 'staff@greenline.pe', password: 'StaffPass#2026' });
    const rGate = await request(app).post('/api/auth/verify-gate').send({ tempToken: r1.body.tempToken, gate: env.STAFF_GATE_CODE });
    const r2fa = await request(app).post('/api/auth/verify-2fa').send({
      tempToken: rGate.body.tempToken,
      totpCode: generateSync({ secret: staffUser.twoFactorSecret }),
    });
    const prevRefresh = r2fa.body.refreshToken;
    expect(prevRefresh).toBeDefined();

    // Request de reset
    const rReq = await request(app).post('/api/auth/request-reset').send({ email: 'staff@greenline.pe' });
    expect(rReq.status).toBe(200);
    expect(rReq.body.success).toBe(true);

    // OTP emitido a su correo
    expect(otpSentEmail).toBe('staff@greenline.pe');
    expect(otpSentCodigo).toMatch(/^\d{6}$/);

    // Reset con contraseña nueva
    const rReset = await request(app).post('/api/auth/reset-password').send({
      email: 'staff@greenline.pe',
      codigo: otpSentCodigo,
      newPassword: 'NuevaPass#2026',
    });
    expect(rReset.status).toBe(200);
    expect(rReset.body.success).toBe(true);

    // Sesiones previas revocadas
    const rRefresh = await request(app).post('/api/auth/refresh').send({ refreshToken: prevRefresh });
    expect(rRefresh.status).toBe(401);

    // Login con la nueva contraseña funciona
    const rNew = await request(app).post('/api/auth/login').send({ email: 'staff@greenline.pe', password: 'NuevaPass#2026' });
    expect(rNew.status).toBe(200);
    expect(rNew.body.requiresStaffGate).toBe(true);
  });

  it('password reset: respuesta genérica ante email inexistente (no revela cuentas)', async () => {
    const r = await request(app).post('/api/auth/request-reset').send({ email: 'fantasma@greenline.pe' });
    expect(r.status).toBe(200);
    expect(r.body.success).toBe(true);
    expect(otpSentEmail).toBeNull();
  });

  it('password reset: contraseña corta rechazada (400)', async () => {
    await request(app).post('/api/auth/request-reset').send({ email: 'staff@greenline.pe' });

    const r = await request(app).post('/api/auth/reset-password').send({
      email: 'staff@greenline.pe',
      codigo: otpSentCodigo,
      newPassword: 'corta',
    });
    expect(r.status).toBe(400);
  });

  it('credenciales inválidas: mensaje genérico e intentos contados', async () => {
    const r = await request(app).post('/api/auth/login').send({
      email: 'staff@greenline.pe',
      password: 'Incorrecta#1',
    });
    expect(r.status).toBe(401);
    expect(r.body.error).toContain('intentos restantes');
    expect(usersDb()[staffId].intentosFallidos).toBe(1);
  });

  it('bloqueo de cuenta tras 5 intentos fallidos', async () => {
    staffUser.intentosFallidos = 4;
    const r = await request(app).post('/api/auth/login').send({
      email: 'staff@greenline.pe',
      password: 'Incorrecta#1',
    });
    expect(r.status).toBe(401);
    expect(r.body.error).toContain('bloqueada');
    expect(usersDb()[staffId].bloqueadoHasta).toBeTruthy();
  });
});
