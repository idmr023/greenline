import prisma from '../config/prisma.js';

// ============================================================
// Acceso al panel /admin — roles del backend con permiso de escritura
// (tabla public.panel_acceso, gestionada solo por backend/SQL)
// ============================================================

export async function listPanelRoles() {
  const rows = await prisma.$queryRawUnsafe(
    'select rol, otorgado_el from public.panel_acceso order by rol',
  );
  return rows.map((r) => ({ rol: r.rol, otorgadoEl: r.otorgado_el }));
}

export async function setPanelRole({ rol, activo, userId }) {
  if (activo) {
    await prisma.$executeRawUnsafe(
      `insert into public.panel_acceso (rol, otorgado_por, otorgado_el)
       values ($1, $2, now())
       on conflict (rol) do nothing`,
      rol,
      userId,
    );
  } else {
    await prisma.$executeRawUnsafe(
      'delete from public.panel_acceso where rol = $1',
      rol,
    );
  }
  return { success: true };
}