-- ============================================================
-- GreenLine — Acceso real al panel /admin (Supabase Auth)
-- ------------------------------------------------------------
-- La escritura sobre las tablas del catálogo queda restringida a
-- roles del backend (users.rol) marcados en public.panel_acceso.
-- El administrador (o DESARROLLADOR_WEB) concede/revoca esos roles
-- desde el panel. Solo cuentan usuarios con sesión en Supabase Auth
-- (la sesión se vinculan desde el login con la misma credencial).
--
-- Re-ajecutable (idempotente).
-- ============================================================

-- 1) Roles con acceso al panel /admin ----------------------------
create table if not exists public.panel_acceso (
  rol          text primary key,
  otorgado_por uuid,
  otorgado_el  timestamptz not null default now()
);

comment on table public.panel_acceso is
  'Roles del backend (users.rol) autorizados a escribir en el panel /admin vía Supabase Auth';

-- Sin políticas a propósito: RLS activo = nadie (anon/authenticated) puede
-- leer/escribir esta tabla via PostgREST. Solo el backend (rol postgres) la gestiona.
alter table public.panel_acceso enable row level security;

insert into public.panel_acceso (rol) values ('ADMIN'), ('DESARROLLADOR_WEB')
  on conflict (rol) do nothing;

-- 2) Función de autorización -------------------------------------
-- ¿El usuario autenticado de Supabase corresponde a un staff del backend
-- (misma email) activo y cuyo rol está en panel_acceso?
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
    join public.panel_acceso pa on pa.rol = u.rol::text
    where u.email = (auth.jwt() ->> 'email')
      and u.activo
  );
$$;

grant execute on function public.es_admin_panel() to anon, authenticated;

-- 3) Restringir la escritura a es_admin_panel() ------------------
-- Se aplica a la rol "authenticated"; las políticas públicas de lectura se mantienen.
-- (En pedidos se conserva el INSERT anónimo del checkout de la web.)

drop policy if exists "Admin puede gestionar productos" on public.productos;
create policy "Admin puede gestionar productos" on public.productos
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());

drop policy if exists "Admin puede gestionar categorías" on public.categorias;
create policy "Admin puede gestionar categorías" on public.categorias
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());

drop policy if exists "Admin puede gestionar colores" on public.colores;
create policy "Admin puede gestionar colores" on public.colores
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());

drop policy if exists "Admin puede gestionar relaciones producto-color" on public.prod_color_rel;
create policy "Admin puede gestionar relaciones producto-color" on public.prod_color_rel
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());

drop policy if exists "Admin puede gestionar imágenes" on public.imagenes;
create policy "Admin puede gestionar imágenes" on public.imagenes
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());

drop policy if exists "Admin puede gestionar ficha técnica" on public.ficha_tecnica;
create policy "Admin puede gestionar ficha técnica" on public.ficha_tecnica
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());

drop policy if exists "Admin puede gestionar info adicional" on public.info_adicional;
create policy "Admin puede gestionar info adicional" on public.info_adicional
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());

drop policy if exists "Admin puede gestionar modelos 3D" on public.modelos_3d;
create policy "Admin puede gestionar modelos 3D" on public.modelos_3d
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());

-- Testimonios: solo panel admin (se gestionan desde el /admin)
drop policy if exists "Admin puede gestionar testimonios" on public.testimonios;
create policy "Admin puede gestionar testimonios" on public.testimonios
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());

-- Pedidos: la web (anon) sigue creándolos; solo el panel admin los gestiona
drop policy if exists "Pedidos: gestionar" on public.pedidos;
create policy "Pedidos: gestionar" on public.pedidos
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());