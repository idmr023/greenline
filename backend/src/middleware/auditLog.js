import prisma from '../config/prisma.js';

// Middleware que loguea cada escritura en audit_logs
// NOTA: Para auditoría WORM completa, también se crean triggers SQL en PostgreSQL
export function auditLog(accion, tabla) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async function (body) {
      // Solo loguear si la operación fue exitosa (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: req.user?.id || null,
              accion,
              tabla,
              registroId: req.params?.id || body?.id || null,
              datosDespues: body,
              ip: req.ip || req.connection?.remoteAddress,
              userAgent: req.headers['user-agent'],
            },
          });
        } catch (error) {
          console.error('Error en audit log:', error.message);
        }
      }
      return originalJson(body);
    };

    next();
  };
}

// Helper: crear audit log directamente (para uso en services)
export async function createAuditLog({ userId, accion, tabla, registroId, datosAntes, datosDespues, ip, userAgent }) {
  try {
    await prisma.auditLog.create({
      data: { userId, accion, tabla, registroId, datosAntes, datosDespues, ip, userAgent },
    });
  } catch (error) {
    console.error('Error en audit log:', error.message);
  }
}
