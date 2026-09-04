-- ============================================================
-- GreenLine — Acotar es_admin_panel() al catálogo
-- ------------------------------------------------------------
-- ANTES: es_admin_panel() devolvía true para cualquier rol en
-- panel_acceso (incluida DISTRIBUCION y EDITORA_BLOG). Como lo
-- usan las políticas RLS del catálogo (productos, categorías,
-- colores, imágenes, ficha técnica, info adicional, modelos 3D,
-- testimonios), eso daba escritura del catálogo a roles que no
-- la necesitan.
-- AHORA: solo ADMIN y DESARROLLADOR_WEB pueden escribir el
-- catálogo. DISTRIBUCION queda restringido a distribuidores
-- (es_distribucion()); EDITORA_BLOG gestiona el blog
-- (es_blog_admin()). Idempotente (re-ejecutable).
-- ============================================================
create or replace function public.es_admin_panel()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.users u
    where u.email = (auth.jwt() ->> 'email')
      and u.activo
      and u.rol::text in ('ADMIN', 'DESARROLLADOR_WEB')
  );
$$;

grant execute on function public.es_admin_panel() to anon, authenticated;