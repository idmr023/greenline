import { Router } from 'express';
import { z } from 'zod';
import { createUser, listUsers, getUserById, updateUser, deactivateUser, changePassword } from '../services/user.service.js';
import { syncSupabaseAuthUser } from '../services/supabase-admin.service.js';
import prisma from '../config/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { auditLog } from '../middleware/auditLog.js';

const router = Router();

// Todas las rutas requieren auth + permisos de usuario
router.use(authMiddleware);
router.use(requirePermission('usuarios:read'));

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    nombre: z.string().min(1),
    apellido: z.string().min(1),
    telefono: z.string().optional(),
    rol: z.enum(['ADMIN', 'LOGISTICA', 'EDITORA_BLOG', 'DISTRIBUCION', 'GERENTE_TIENDA',
      'COLABORADOR_TIENDA', 'GERENTE_ALMACEN', 'COLABORADOR_ALMACEN', 'DESARROLLADOR_WEB', 'CLIENTE']),
    tiendaId: z.string().uuid().optional(),
    gerenteId: z.string().uuid().optional(),
  }),
});

const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    nombre: z.string().min(1).optional(),
    apellido: z.string().min(1).optional(),
    telefono: z.string().optional(),
    rol: z.enum(['ADMIN', 'LOGISTICA', 'EDITORA_BLOG', 'DISTRIBUCION', 'GERENTE_TIENDA',
      'COLABORADOR_TIENDA', 'GERENTE_ALMACEN', 'COLABORADOR_ALMACEN', 'DESARROLLADOR_WEB', 'CLIENTE']).optional(),
    tiendaId: z.string().uuid().nullable().optional(),
    gerenteId: z.string().uuid().nullable().optional(),
    activo: z.boolean().optional(),
    password: z.string().min(8).optional(),
  }),
});

// GET /users — Listar usuarios
router.get('/', async (req, res) => {
  try {
    const { page, limit, rol, activo, search, tiendaId } = req.query;
    const result = await listUsers({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      rol,
      activo: activo !== undefined ? activo === 'true' : undefined,
      search,
      tiendaId,
    });
    res.json(result);
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET /users/:id — Obtener usuario
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// POST /users — Crear usuario (solo admin)
router.post('/', requirePermission('usuarios:create'), validate(createUserSchema), auditLog('CREATE', 'users'), async (req, res) => {
  try {
    const { email, password, rol } = req.body;
    const user = await createUser(req.body);

    // Los staff también quedan listos en Supabase Auth (misma credencial)
    if (rol !== 'CLIENTE') {
      await syncSupabaseAuthUser({ email, password }).catch((err) => {
        console.error('Supabase sync (crear usuario):', err);
      });
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /users/:id — Actualizar usuario
router.put('/:id', requirePermission('usuarios:update'), validate(updateUserSchema), auditLog('UPDATE', 'users'), async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /users/:id — Desactivar usuario
router.delete('/:id', requirePermission('usuarios:delete'), auditLog('DELETE', 'users'), async (req, res) => {
  try {
    const result = await deactivateUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /users/:id/change-password — Cambiar contraseña
router.post('/:id/change-password', async (req, res) => {
  try {
    // Solo admin o el propio usuario
    if (req.user.rol !== 'ADMIN' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Sin permisos' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseña actual y nueva requeridas' });
    }

    const result = await changePassword(req.params.id, currentPassword, newPassword);

    // Mantener la misma credencial en Supabase Auth para staff
    try {
      const target = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: { email: true, rol: true },
      });
      if (target && target.rol !== 'CLIENTE') {
        await syncSupabaseAuthUser({ email: target.email, password: newPassword });
      }
    } catch (err) {
      console.error('Supabase sync (cambiar contraseña):', err);
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
