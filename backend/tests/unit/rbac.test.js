import { describe, it, expect, vi } from 'vitest';
import { requireOwnStore, scopeToOwnStore, requireApproval, requirePermission } from '../../src/middleware/rbac.js';

function ctx(user, { params = {}, query = {}, body = {} } = {}) {
  const req = { user, params, query, body };
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
  const next = vi.fn();
  return { req, res, next };
}

describe('rbac.js — tenant scoping (anti-IDOR)', () => {
  it('requireOwnStore deja pasar al gerente con su propia tienda', () => {
    const { req, res, next } = ctx({ rol: 'GERENTE_TIENDA', tiendaId: 2 }, { query: { tiendaId: 2 } });
    requireOwnStore(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.storeFilter).toBe(2);
  });

  it('requireOwnStore rechaza pedir una tienda ajena (IDOR → 403)', () => {
    const { req, res, next } = ctx({ rol: 'GERENTE_TIENDA', tiendaId: 2 }, { query: { tiendaId: 9 } });
    requireOwnStore(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('requireOwnStore rechaza el mismo bypass vía body (move)', () => {
    const { req, res, next } = ctx({ rol: 'COLABORADOR_TIENDA', tiendaId: 2 }, { body: { tiendaId: 99 } });
    requireOwnStore(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('requireOwnStore: ADMIN ve todo', () => {
    const { req, res, next } = ctx({ rol: 'ADMIN', tiendaId: 1 }, { query: { tiendaId: 50 } });
    requireOwnStore(req, res, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it('scopeToOwnStore fuerza query.tiendaId a la tienda del usuario', () => {
    const { req, res, next } = ctx({ rol: 'GERENTE_ALMACEN', tiendaId: 3 });
    scopeToOwnStore(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.query.tiendaId).toBe(3);
  });

  it('scopeToOwnStore rechaza tienda ajena explicitada', () => {
    const { req, res, next } = ctx({ rol: 'GERENTE_ALMACEN', tiendaId: 3 }, { query: { tiendaId: 4 } });
    scopeToOwnStore(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('scopeToOwnStore no toca la query de un ADMIN', () => {
    const { req, res, next } = ctx({ rol: 'DESARROLLADOR_WEB', tiendaId: 1 }, { query: { tiendaId: 7 } });
    scopeToOwnStore(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.query.tiendaId).toBe(7);
  });
});

describe('rbac.js — requireApproval y permisos', () => {
  it('marca requiresApproval para colaboradores', () => {
    const { req, res, next } = ctx({ rol: 'COLABORADOR_TIENDA', tiendaId: 1 });
    requireApproval(req, res, next);
    expect(req.requiresApproval).toBe(true);
    expect(next).toHaveBeenCalledOnce();
  });

  it('requirePermission niega a rol sin permiso', () => {
    const { req, res, next } = ctx({ rol: 'CLIENTE' });
    requirePermission('config:read')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('requirePermission otorga a roles autorizados', () => {
    const { req, res, next } = ctx({ rol: 'ADMIN' });
    requirePermission('config:read')(req, res, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it('requirePermission responde 401 sin usuario', () => {
    const { res, next } = ctx();
    requirePermission('config:read')({}, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});