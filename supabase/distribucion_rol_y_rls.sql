-- ============================================================
-- GreenLine - Rol DISTRIBUCION y RLS de distribuidores
-- ------------------------------------------------------------
-- Objetivo (máxima seguridad):
--   * El rol DISTRIBUCION solo puede MODIFICAR distribuidores.
--   * La tabla greenline_distributors estaba abierta a escritura
--     anónima (sin RLS). Aquí se habilita RLS.
--   * Lectura pública (anon) mantenida para el directorio de la web.
--   * Escritura (authenticated) restringida a usuarios cuyo email
--     de Supabase Auth coincide con un staff activo de users con rol
--     en (DISTRIBUCION, ADMIN, DESARROLLADOR_WEB) registrado en
--     panel_acceso.
--   * Consolida EDITOR_ARTICULOS -> EDITORA_BLOG (solo queda
--     EDITORA_BLOG para la gestión de blog).
--
-- Idempotente (re-ejecutable).
-- ============================================================

-- 1) panel_acceso: admitir el rol para el panel /admin ----------
insert into public.panel_acceso (rol) values ('DISTRIBUCION')
  on conflict (rol) do nothing;

-- 2) Función de autorización de distribución --------------------
-- Igual a es_admin_panel()/es_blog_admin(): el usuario autenticado
-- de Supabase debe corresponder a un staff activo cuyo rol esté
-- autorizado a gestionar distribuidores.
create or replace function public.es_distribucion()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.users u
    join public.panel_acceso pa on pa.rol = u.rol::text
    where u.email = (auth.jwt() ->> 'email')
      and u.activo
      and u.rol::text in ('ADMIN', 'DESARROLLADOR_WEB', 'DISTRIBUCION')
  );
$$;

grant execute on function public.es_distribucion() to anon, authenticated;

-- 3) Consolidar EDITOR_ARTICULOS -> EDITORA_BLOG ----------------
-- Solo queda EDITORA_BLOG. Se actualiza es_blog_admin y se migran
-- los usuarios existentes.
--
-- IMPORTANTE: el cast 'EDITORA_BLOG'::"Rol" falla si el valor aún no
-- existe en el enum (p. ej. si la migración backend aún no corrió en
-- esta base). Por eso la migración de datos queda protegida: solo se
-- ejecuta si AMBOS valores EDITOR_ARTICULOS y EDITORA_BLOG existen en
-- el enum y hay usuarios que consolidar. Si la migración backend ya
-- recreó el enum sin EDITOR_ARTICULOS, este bloque no hace nada.
do $$
declare
  has_editor_articulos boolean;
  has_editora boolean;
begin
  select exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'Rol' and e.enumlabel = 'EDITOR_ARTICULOS'
  ) into has_editor_articulos;

  select exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'Rol' and e.enumlabel = 'EDITORA_BLOG'
  ) into has_editora;

  if has_editor_articulos and has_editora then
    update public.users
    set rol = 'EDITORA_BLOG'::"Rol"
    where rol::text = 'EDITOR_ARTICULOS';
  end if;
end $$;

create or replace function public.es_blog_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.users u
    join public.panel_acceso pa on pa.rol = u.rol::text
    where u.email = (auth.jwt() ->> 'email')
      and u.activo
      and u.rol::text in ('ADMIN', 'DESARROLLADOR_WEB', 'EDITORA_BLOG')
  );
$$;

grant execute on function public.es_blog_admin() to anon, authenticated;

-- 4) RLS en greenline_distributors ---------------------------------
alter table public.greenline_distributors enable row level security;

-- Lectura pública (la web renderiza el directorio de distribuidores)
drop policy if exists "Lectura pública de distribuidores" on public.greenline_distributors;
create policy "Lectura pública de distribuidores" on public.greenline_distributors
  for select to anon, authenticated
  using (true);

-- Escritura restringida a es_distribucion()
drop policy if exists "Distribución gestiona distribuidores" on public.greenline_distributors;
create policy "Distribución gestiona distribuidores" on public.greenline_distributors
  for all to authenticated
  using (public.es_distribucion())
  with check (public.es_distribucion());

-- ============================================================
-- Nota sobre el enum "Rol":
-- La gestión por defecto del enum (eliminar EDITOR_ARTICULOS)
-- se hace en backend/prisma/migrations/.../migration.sql, porque
-- recrear el tipo de enum en PostgreSQL afecta a la columna users.rol.
-- Aquí solo se consolidan los valores de datos mientras existan.
-- ============================================================
