import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import prisma from '../config/prisma.js';

const router = Router();

router.use(authMiddleware);
router.use(requirePermission('audit:read'));

// GET /audit — Listar logs de auditoría
router.get('/', async (req, res) => {
  try {
    const { tabla, accion, userId, page = 1, limit = 50, desde, hasta } = req.query;

    const where = {};
    if (tabla) where.tabla = tabla;
    if (accion) where.accion = accion;
    if (userId) where.userId = userId;
    if (desde || hasta) {
      where.createdAt = {};
      if (desde) where.createdAt.gte = new Date(desde);
      if (hasta) where.createdAt.lte = new Date(hasta);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: { select: { nombre: true, apellido: true, email: true, rol: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error obteniendo auditoría:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET /audit/stats — Estadísticas de auditoría
router.get('/stats', async (req, res) => {
  try {
    const stats = await prisma.auditLog.groupBy({
      by: ['accion', 'tabla'],
      _count: true,
      orderBy: { _count: { accion: 'desc' } },
    });

    const recentActivity = await prisma.auditLog.findMany({
      take: 10,
      include: {
        user: { select: { nombre: true, apellido: true, rol: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ stats, recentActivity });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET /audit/:id — Detalle de un log específico
router.get('/:id', async (req, res) => {
  try {
    const log = await prisma.auditLog.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { nombre: true, apellido: true, email: true, rol: true } },
      },
    });

    if (!log) return res.status(404).json({ error: 'Log no encontrado' });
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
