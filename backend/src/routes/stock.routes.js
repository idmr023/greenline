import { Router } from 'express';
import { z } from 'zod';
import { createStockMove, approveStockMove, getStockByTienda, getStockGeneral, getPendingApprovals } from '../services/stock.service.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission, requireOwnStore, requireApproval } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { auditLog } from '../middleware/auditLog.js';
import prisma from '../config/prisma.js';

const router = Router();

router.use(authMiddleware);

const createMoveSchema = z.object({
  body: z.object({
    tiendaId: z.string().uuid(),
    productoId: z.number().int().positive(),
    colorId: z.number().int().positive().optional(),
    cantidad: z.number().int().positive(),
    tipo: z.enum(['INGRESO', 'EGRESO', 'TRANSFERENCIA', 'AJUSTE']),
    motivo: z.string().optional(),
    notas: z.string().optional(),
  }),
});

const approveSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    approved: z.boolean(),
    motivo: z.string().optional(),
  }),
});

// GET /stock/general — Stock general (admin, logística, gerentes)
router.get('/general', requirePermission('stock:almacen:read', 'stock:tienda:read'), async (req, res) => {
  try {
    const result = await getStockGeneral(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error consultando stock general:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET /stock/tienda/:tiendaId — Stock por tienda específica
router.get('/tienda/:tiendaId', requirePermission('stock:almacen:read', 'stock:tienda:read'), requireOwnStore, async (req, res) => {
  try {
    const result = await getStockByTienda(req.params.tiendaId, req.query);
    res.json(result);
  } catch (error) {
    console.error('Error consultando stock:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// POST /stock/move — Crear movimiento de stock
router.post('/move', requirePermission('stock:almacen:write', 'stock:tienda:write'), requireApproval, validate(createMoveSchema), auditLog('CREATE', 'stock_moves'), async (req, res) => {
  try {
    const move = await createStockMove({
      ...req.body,
      userId: req.user.id,
      requiresApproval: req.requiresApproval || false,
    });

    res.status(201).json(move);
  } catch (error) {
    console.error('Error creando movimiento:', error);
    res.status(400).json({ error: error.message });
  }
});

// POST /stock/approve/:id — Aprobar/rechazar movimiento
router.post('/approve/:id', requirePermission('stock:almacen:approve', 'stock:tienda:approve'), validate(approveSchema), auditLog('UPDATE', 'stock_moves'), async (req, res) => {
  try {
    const result = await approveStockMove(req.params.id, req.user.id, req.body.approved);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /stock/pending — Solicitudes pendientes (para gerentes)
router.get('/pending', requirePermission('stock:almacen:approve', 'stock:tienda:approve'), async (req, res) => {
  try {
    const approvals = await getPendingApprovals(req.user.id);
    res.json(approvals);
  } catch (error) {
    console.error('Error obteniendo pendientes:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET /stock/movements — Historial de movimientos
router.get('/movements', requirePermission('stock:almacen:read', 'stock:tienda:read'), async (req, res) => {
  try {
    const { tiendaId, productoId, tipo, page = 1, limit = 50 } = req.query;

    const where = {};
    if (tiendaId) where.tiendaId = tiendaId;
    if (productoId) where.productoId = Number(productoId);
    if (tipo) where.tipo = tipo;

    // Colaboradores solo ven su tienda
    if (['COLABORADOR_TIENDA', 'COLABORADOR_ALMACEN'].includes(req.user.rol)) {
      where.tiendaId = req.user.tiendaId;
    }

    const [moves, total] = await Promise.all([
      prisma.stockMove.findMany({
        where,
        include: {
          tienda: { select: { nombre: true } },
          user: { select: { nombre: true, apellido: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.stockMove.count({ where }),
    ]);

    res.json({
      moves,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error obteniendo movimientos:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
