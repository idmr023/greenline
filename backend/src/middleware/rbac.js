import { Rol } from '@prisma/client';

// Mapa de permisos: qué roles pueden acceder a qué recursos con qué métodos
const PERMISSIONS = {
  // Productos
  'productos:read': [Rol.ADMIN, Rol.GERENTE_TIENDA, Rol.GERENTE_ALMACEN,
    Rol.COLABORADOR_TIENDA, Rol.COLABORADOR_ALMACEN, Rol.DESARROLLADOR_WEB],
  'productos:create': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],
  'productos:update': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],
  'productos:delete': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],

  // Blog
  'blog:read': [Rol.ADMIN, Rol.EDITORA_BLOG, Rol.DESARROLLADOR_WEB, Rol.CLIENTE],
  'blog:create': [Rol.ADMIN, Rol.EDITORA_BLOG, Rol.DESARROLLADOR_WEB],
  'blog:update': [Rol.ADMIN, Rol.EDITORA_BLOG, Rol.DESARROLLADOR_WEB],
  'blog:delete': [Rol.ADMIN, Rol.EDITORA_BLOG, Rol.DESARROLLADOR_WEB],

  // Stock (almacén)
  'stock:almacen:read': [Rol.ADMIN, Rol.GERENTE_ALMACEN,
    Rol.COLABORADOR_ALMACEN, Rol.DESARROLLADOR_WEB],
  'stock:almacen:write': [Rol.ADMIN, Rol.GERENTE_ALMACEN, Rol.DESARROLLADOR_WEB],
  'stock:almacen:approve': [Rol.ADMIN, Rol.GERENTE_ALMACEN, Rol.DESARROLLADOR_WEB],

  // Stock (tienda)
  'stock:tienda:read': [Rol.ADMIN, Rol.GERENTE_TIENDA,
    Rol.COLABORADOR_TIENDA, Rol.DESARROLLADOR_WEB],
  'stock:tienda:write': [Rol.ADMIN, Rol.GERENTE_TIENDA, Rol.DESARROLLADOR_WEB],
  'stock:tienda:approve': [Rol.ADMIN, Rol.GERENTE_TIENDA, Rol.DESARROLLADOR_WEB],

  // Usuarios
  'usuarios:read': [Rol.ADMIN, Rol.DESARROLLADOR_WEB, Rol.DISTRIBUCION],
  'usuarios:create': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],
  'usuarios:update': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],
  'usuarios:delete': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],
  'usuarios:manage-roles': [Rol.ADMIN],

  // Acceso al panel /admin (Supabase Auth)
  'panel:acceso': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],

  // Auditoría
  'audit:read': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],

  // Configuración
  'config:read': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],
  'config:update': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],

  // Tiendas
  'tiendas:read': [Rol.ADMIN, Rol.GERENTE_TIENDA,
    Rol.GERENTE_ALMACEN, Rol.DESARROLLADOR_WEB, Rol.CLIENTE],
  'tiendas:write': [Rol.ADMIN, Rol.DESARROLLADOR_WEB],

  // Distribuidores
  'distribuidores:read': [Rol.ADMIN, Rol.DISTRIBUCION, Rol.DESARROLLADOR_WEB],
  'distribuidores:write': [Rol.ADMIN, Rol.DISTRIBUCION, Rol.DESARROLLADOR_WEB],
  'distribuidores:delete': [Rol.ADMIN, Rol.DISTRIBUCION, Rol.DESARROLLADOR_WEB],
};

// Middleware factory: requiere uno o más permisos
export function requirePermission(...permissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const hasPermission = permissions.some((perm) => {
      const allowedRoles = PERMISSIONS[perm];
      if (!allowedRoles) return false;
      return allowedRoles.includes(req.user.rol);
    });

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Sin permisos',
        required: permissions,
        yourRole: req.user.rol,
      });
    }

    next();
  };
}

// Middleware: el usuario solo puede acceder a datos de su tienda.
// Rechaza (403) si pide una tienda distinta a la suya (previene IDOR).
export function requireOwnStore(req, res, next) {
  const user = req.user;

  // Admin y desarrolladores ven todo
  if (['ADMIN', 'DESARROLLADOR_WEB'].includes(user.rol)) {
    return next();
  }

  // Gerentes y colaboradores solo ven su tienda
  if (!user.tiendaId) {
    return res.status(403).json({ error: 'Sin tienda asignada' });
  }

  const tiendaSolicitada = req.params?.tiendaId || req.query?.tiendaId || req.body?.tiendaId;
  if (tiendaSolicitada && tiendaSolicitada !== user.tiendaId) {
    return res.status(403).json({ error: 'Sin permisos para esta tienda' });
  }

  req.storeFilter = user.tiendaId;
  next();
}

// Middleware: fuerza el alcance (scope) a la tienda del usuario en consultas
// que aceptan tiendaId por query (ej. /stock/general, /stock/movements).
// Admin y desarrolladores conservan visión global.
export function scopeToOwnStore(req, res, next) {
  const user = req.user;

  if (['ADMIN', 'DESARROLLADOR_WEB'].includes(user.rol)) {
    return next();
  }

  if (!user.tiendaId) {
    return res.status(403).json({ error: 'Sin tienda asignada' });
  }

  if (req.query?.tiendaId && req.query.tiendaId !== user.tiendaId) {
    return res.status(403).json({ error: 'Sin permisos para esta tienda' });
  }

  req.query.tiendaId = user.tiendaId;
  next();
}

// Middleware: los colaboradores necesitan aprobación
export function requireApproval(req, res, next) {
  const user = req.user;

  // Roles que aprueban directamente
  if (['ADMIN', 'DESARROLLADOR_WEB',
    'GERENTE_TIENDA', 'GERENTE_ALMACEN'].includes(user.rol)) {
    return next();
  }

  // Colaboradores: crear como pendiente
  if (['COLABORADOR_TIENDA', 'COLABORADOR_ALMACEN'].includes(user.rol)) {
    req.requiresApproval = true;
    return next();
  }

  return res.status(403).json({ error: 'Sin permisos para esta operación' });
}

export { PERMISSIONS };
