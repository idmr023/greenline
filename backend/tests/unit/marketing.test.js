import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const userId = 'user-marketing-1';
let userRow = null;
let findUniqueImpl = null;
let updateImpl = null;

vi.mock('../../src/config/prisma.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(async (...args) => {
        if (findUniqueImpl) return findUniqueImpl(...args);
        return userRow;
      }),
      update: vi.fn(async (...args) => {
        if (updateImpl) return updateImpl(...args);
        const { data } = args[0];
        userRow = { ...userRow, ...data };
        return userRow;
      }),
    },
    auditLog: { create: vi.fn(async () => ({ id: '1' })) },
  },
}));

const { default: app } = await import('../../src/app.js');
const { unsubscribeSchema } = await import('../../src/routes/marketing.routes.js');

beforeEach(() => {
  userRow = {
    id: userId,
    email: 'cliente@greenline.pe',
    emailsAllowed: true,
    emailsUnsubscribedAt: null,
  };
  findUniqueImpl = null;
  updateImpl = null;
});

describe('POST /api/marketing/unsubscribe', () => {
  it('baja exitosa de usuario existente → 200 y emailsAllowed=false', async () => {
    const res = await request(app)
      .post('/api/marketing/unsubscribe')
      .send({ email: 'Cliente@Greenline.PE ' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.emails_allowed).toBe(false);
    expect(res.body.message).toBeTruthy();
    expect(userRow.emailsAllowed).toBe(false);
    expect(userRow.emailsUnsubscribedAt).toBeInstanceOf(Date);
  });

  it('usuario inexistente → 200 ok:true (no revela existencia)', async () => {
    userRow = null;

    const res = await request(app)
      .post('/api/marketing/unsubscribe')
      .send({ email: 'nadie@greenline.pe' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.emails_allowed).toBe(false);
  });

  it('email inválido → 400 validación zod', async () => {
    const res = await request(app)
      .post('/api/marketing/unsubscribe')
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validación fallida');
  });

  it('email vacío → 400 validación zod', async () => {
    const res = await request(app)
      .post('/api/marketing/unsubscribe')
      .send({ email: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validación fallida');
  });

  it('email demasiado largo → 400 (>254)', async () => {
    const long = `${'a'.repeat(250)}@x.pe`;
    const res = await request(app)
      .post('/api/marketing/unsubscribe')
      .send({ email: long });

    expect(res.status).toBe(400);
  });

  it('body ausente → 400', async () => {
    const res = await request(app)
      .post('/api/marketing/unsubscribe')
      .send({});

    expect(res.status).toBe(400);
  });

  it('error de prisma en findUnique → 500 sin stack', async () => {
    findUniqueImpl = () => {
      throw new Error('db down');
    };

    const res = await request(app)
      .post('/api/marketing/unsubscribe')
      .send({ email: 'cliente@greenline.pe' });

    expect(res.status).toBe(500);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toBeTruthy();
  });

  it('error de prisma en update → 500 (usuario existe pero update falla)', async () => {
    updateImpl = () => {
      throw new Error('update failed');
    };

    const res = await request(app)
      .post('/api/marketing/unsubscribe')
      .send({ email: 'cliente@greenline.pe' });

    expect(res.status).toBe(500);
    expect(res.body.ok).toBe(false);
  });

  it('no llama update cuando el usuario no existe', async () => {
    const prisma = (await import('../../src/config/prisma.js')).default;
    userRow = null;

    await request(app)
      .post('/api/marketing/unsubscribe')
      .send({ email: 'fantasma@greenline.pe' });

    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});

describe('unsubscribeSchema', () => {
  it('acepta email válido con espacios y mayúsculas', () => {
    const result = unsubscribeSchema.safeParse({
      body: { email: '  User@Example.COM  ' },
      query: {},
      params: {},
    });
    expect(result.success).toBe(true);
    expect(result.data.body.email).toBe('User@Example.COM');
  });

  it('rechaza email sin @', () => {
    const result = unsubscribeSchema.safeParse({
      body: { email: 'no-at-sign' },
      query: {},
      params: {},
    });
    expect(result.success).toBe(false);
  });

  it('rechaza campos extra peligrosos en body (strict zod default strip)', () => {
    const result = unsubscribeSchema.safeParse({
      body: { email: 'a@b.pe', emailsAllowed: true },
      query: {},
      params: {},
    });
    expect(result.success).toBe(true);
    expect(result.data.body).not.toHaveProperty('emailsAllowed');
  });
});
