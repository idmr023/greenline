import prisma from '../config/prisma.js';
import { hashPassword } from '../utils/argon2.js';
import { Rol, NivelAcceso } from '@prisma/client';

// Mapa de roles a nivel de acceso
const ROL_TO_NIVEL = {
  ADMIN: NivelAcceso.SUPER,
  DESARROLLADOR_WEB: NivelAcceso.SUPER,
  LOGISTICA: NivelAcceso.LOGISTICA_N,
  DISTRIBUCION: NivelAcceso.CONTENIDO,
  GERENTE_TIENDA: NivelAcceso.TIENDA,
  COLABORADOR_TIENDA: NivelAcceso.TIENDA,
  GERENTE_ALMACEN: NivelAcceso.ALMACEN,
  COLABORADOR_ALMACEN: NivelAcceso.ALMACEN,
  CLIENTE: NivelAcceso.CLIENTE_N,
};

// ============================================================
// Crear usuario (admin)
// ============================================================
export async function createUser({ email, password, nombre, apellido, telefono, rol, tiendaId, gerenteId }) {
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) throw new Error('El email ya está registrado');

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      nombre,
      apellido,
      telefono,
      rol,
      nivelAcceso: ROL_TO_NIVEL[rol],
      tiendaId: tiendaId || null,
      gerenteId: gerenteId || null,
      emailVerificado: true, // Admin crea verificado
    },
  });

  return sanitizeUser(user);
}

// ============================================================
// Listar usuarios (admin)
// ============================================================
export async function listUsers({ page = 1, limit = 20, rol, activo, search, tiendaId }) {
  const where = {};

  if (rol) where.rol = rol;
  if (activo !== undefined) where.activo = activo;
  if (tiendaId) where.tiendaId = tiendaId;
  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: 'insensitive' } },
      { apellido: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, nombre: true, apellido: true,
        telefono: true, rol: true, nivelAcceso: true, activo: true,
        emailVerificado: true, twoFactorEnabled: true, tiendaId: true,
        ultimoLogin: true, createdAt: true,
        tienda: { select: { id: true, nombre: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ============================================================
// Obtener usuario por ID
// ============================================================
export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, nombre: true, apellido: true,
      telefono: true, rol: true, nivelAcceso: true, activo: true,
      emailVerificado: true, twoFactorEnabled: true, tiendaId: true,
      gerenteId: true, ultimoLogin: true, createdAt: true,
      tienda: { select: { id: true, nombre: true, ciudad: true } },
      gerente: { select: { id: true, nombre: true, apellido: true, email: true } },
    },
  });
  if (!user) throw new Error('Usuario no encontrado');
  return user;
}

// ============================================================
// Actualizar usuario
// ============================================================
export async function updateUser(id, data) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('Usuario no encontrado');

  const updateData = {};

  if (data.nombre) updateData.nombre = data.nombre;
  if (data.apellido) updateData.apellido = data.apellido;
  if (data.telefono !== undefined) updateData.telefono = data.telefono;
  if (data.rol) {
    updateData.rol = data.rol;
    updateData.nivelAcceso = ROL_TO_NIVEL[data.rol];
  }
  if (data.tiendaId !== undefined) updateData.tiendaId = data.tiendaId;
  if (data.gerenteId !== undefined) updateData.gerenteId = data.gerenteId;
  if (data.activo !== undefined) updateData.activo = data.activo;

  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return sanitizeUser(updated);
}

// ============================================================
// Desactivar usuario (soft delete)
// ============================================================
export async function deactivateUser(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('Usuario no encontrado');
  if (user.rol === 'ADMIN') throw new Error('No se puede desactivar un administrador');

  await prisma.user.update({
    where: { id },
    data: { activo: false },
  });

  // Revocar todos sus refresh tokens
  await prisma.refreshToken.updateMany({
    where: { userId: id },
    data: { revoked: true },
  });

  return { message: 'Usuario desactivado' };
}

// ============================================================
// Cambiar contraseña
// ============================================================
export async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuario no encontrado');

  const { verifyPassword: verify } = await import('../utils/argon2.js');
  const valid = await verify(user.passwordHash, currentPassword);
  if (!valid) throw new Error('Contraseña actual incorrecta');

  const newHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  // Revocar todos los refresh tokens (forzar re-login)
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });

  return { message: 'Contraseña actualizada. Debes iniciar sesión nuevamente.' };
}

function sanitizeUser(user) {
  const { passwordHash, twoFactorSecret, twoFactorBackup, intentosFallidos, bloqueadoHasta, ...safe } = user;
  return safe;
}
