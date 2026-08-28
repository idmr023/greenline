import prisma from '../config/prisma.js';
import { TipoMovimiento, EstadoStock } from '@prisma/client';

// ============================================================
// Registrar movimiento de stock
// ============================================================
export async function createStockMove({ tiendaId, productoId, colorId, cantidad, tipo, motivo, notas, userId, requiresApproval }) {
  // Validar que la tienda exista
  const tienda = await prisma.tienda.findUnique({ where: { id: tiendaId } });
  if (!tienda) throw new Error('Tienda no encontrada');

  // Los colaboradores generan movimientos pendientes
  const estado = requiresApproval ? EstadoStock.PENDIENTE : EstadoStock.APROBADO;

  const move = await prisma.stockMove.create({
    data: {
      tiendaId,
      productoId,
      colorId: colorId || null,
      cantidad,
      tipo,
      motivo: motivo || null,
      notas: notas || null,
      estado,
      userId,
    },
    include: {
      tienda: { select: { nombre: true } },
      user: { select: { nombre: true, apellido: true, rol: true } },
    },
  });

  // Si requiere aprobación, crear solicitud pendiente
  if (requiresApproval) {
    // Buscar el gerente de la tienda
    const gerente = await prisma.user.findFirst({
      where: {
        tiendaId,
        rol: tienda.tipo === 'almacen' ? 'GERENTE_ALMACEN' : 'GERENTE_TIENDA',
        activo: true,
      },
    });

    if (gerente) {
      await prisma.pendingApproval.create({
        data: {
          solicitanteId: userId,
          tipo: 'stock_move',
          datos: move,
          gerenteId: gerente.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        },
      });
    }
  }

  return move;
}

// ============================================================
// Aprobar movimiento pendiente
// ============================================================
export async function approveStockMove(approvalId, managerId, approved) {
  const approval = await prisma.pendingApproval.findUnique({
    where: { id: approvalId },
    include: { solicitante: true },
  });

  if (!approval) throw new Error('Solicitud no encontrada');
  if (approval.estado !== 'pendiente') throw new Error('Solicitud ya procesada');
  if (approval.gerenteId !== managerId) throw new Error('No autorizado para aprobar esta solicitud');
  if (approval.expiresAt < new Date()) throw new Error('Solicitud expirada');

  const nuevoEstado = approved ? EstadoStock.APROBADO : EstadoStock.RECHAZADO;

  // Actualizar la solicitud
  await prisma.pendingApproval.update({
    where: { id: approvalId },
    data: { estado: approved ? 'aprobado' : 'rechazado' },
  });

  // Actualizar el stock move
  await prisma.stockMove.update({
    where: { id: approval.datos.id },
    data: {
      estado: nuevoEstado,
      aprobadoPor: managerId,
      aprobadoEn: new Date(),
    },
  });

  return { message: approved ? 'Movimiento aprobado' : 'Movimiento rechazado' };
}

// ============================================================
// Consultar stock por tienda
// ============================================================
export async function getStockByTienda(tiendaId, filters = {}) {
  const where = { tiendaId };

  if (filters.productoId) where.productoId = filters.productoId;
  if (filters.colorId) where.colorId = filters.colorId;
  if (filters.estado) where.estado = filters.estado;

  const moves = await prisma.stockMove.findMany({
    where,
    include: {
      tienda: { select: { nombre: true, tipo: true } },
      user: { select: { nombre: true, apellido: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  // Calcular stock actual
  const stock = {};
  for (const move of moves) {
    if (move.estado !== 'APROBADO') continue;

    const key = `${move.productoId}-${move.colorId || 'sin-color'}`;
    if (!stock[key]) {
      stock[key] = {
        productoId: move.productoId,
        colorId: move.colorId,
        cantidad: 0,
      };
    }

    if (['INGRESO', 'AJUSTE'].includes(move.tipo)) {
      stock[key].cantidad += move.cantidad;
    } else if (move.tipo === 'EGRESO') {
      stock[key].cantidad -= move.cantidad;
    }
  }

  return {
    tienda: await prisma.tienda.findUnique({ where: { id: tiendaId } }),
    stock: Object.values(stock).filter((s) => s.cantidad > 0),
    movimientos: moves.slice(0, 50),
  };
}

// ============================================================
// Consultar stock general (todas las tiendas)
// ============================================================
export async function getStockGeneral(filters = {}) {
  const where = { estado: EstadoStock.APROBADO };

  if (filters.productoId) where.productoId = filters.productoId;
  if (filters.tiendaId) where.tiendaId = filters.tiendaId;

  const moves = await prisma.stockMove.findMany({
    where,
    select: {
      tiendaId: true,
      productoId: true,
      colorId: true,
      cantidad: true,
      tipo: true,
      tienda: { select: { nombre: true, tipo: true } },
    },
  });

  // Agrupar por tienda
  const stockByTienda = {};
  for (const move of moves) {
    if (!stockByTienda[move.tiendaId]) {
      stockByTienda[move.tiendaId] = {
        tienda: move.tienda,
        productos: {},
      };
    }

    const key = `${move.productoId}-${move.colorId || 'sin-color'}`;
    if (!stockByTienda[move.tiendaId].productos[key]) {
      stockByTienda[move.tiendaId].productos[key] = {
        productoId: move.productoId,
        colorId: move.colorId,
        cantidad: 0,
      };
    }

    const entry = stockByTienda[move.tiendaId].productos[key];
    if (['INGRESO', 'AJUSTE'].includes(move.tipo)) {
      entry.cantidad += move.cantidad;
    } else if (move.tipo === 'EGRESO') {
      entry.cantidad -= move.cantidad;
    }
  }

  // Calcular stock total por producto
  const stockTotal = {};
  for (const tienda of Object.values(stockByTienda)) {
    for (const prod of Object.values(tienda.productos)) {
      if (!stockTotal[prod.productoId]) {
        stockTotal[prod.productoId] = { productoId: prod.productoId, total: 0 };
      }
      stockTotal[prod.productoId].total += Math.max(0, prod.cantidad);
    }
  }

  return {
    porTienda: Object.values(stockByTienda).map((t) => ({
      ...t.tienda,
      stock: Object.values(t.productos).filter((p) => p.cantidad > 0),
    })),
    totalGeneral: Object.values(stockTotal),
  };
}

// ============================================================
// Listar solicitudes pendientes (para gerentes)
// ============================================================
export async function getPendingApprovals(managerId) {
  return prisma.pendingApproval.findMany({
    where: {
      gerenteId: managerId,
      estado: 'pendiente',
      expiresAt: { gt: new Date() },
    },
    include: {
      solicitante: {
        select: { nombre: true, apellido: true, email: true, rol: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
