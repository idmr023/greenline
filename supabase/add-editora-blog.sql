-- ============================================================
-- GreenLine - Rol EDITORA_BLOG (blog)
-- ------------------------------------------------------------
-- Infraestructura del rol que gestiona los artículos de
-- Novedades (greenline_posts / greenline_categories /
-- greenline_post_images).
--
-- Re-ejecutable (idempotente). Ejecutar en el SQL Editor de
-- Supabase DESPUÉS de desplegar el backend con el nuevo enum
-- Prisma (Rol.EDITORA_BLOG).
-- ============================================================

-- 1) Añadir el valor al enum Postgres (mismo nombre que el enum Prisma) --
--    Si el tipo difiere (p.ej. se llama "Rol" o "userRole") ajústalo abajo.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'Rol' AND e.enumlabel = 'EDITORA_BLOG'
  ) THEN
    ALTER TYPE "Rol" ADD VALUE IF NOT EXISTS 'EDITORA_BLOG';
  END IF;
END $$;

-- 2) Autorizar el rol en el panel /admin -----------------------
insert into public.panel_acceso (rol) values ('EDITORA_BLOG')
  on conflict (rol) do nothing;

-- 3) Función de autorización para blog --------------------------
-- Admite ADMIN / DESARROLLADOR_WEB / EDITOR_ARTICULOS / EDITORA_BLOG
-- (los roles que gestionan el blog). Se lee de panel_acceso.
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

-- 4) RLS en tablas del blog --------------------------------------
-- Lectura pública (anon) en base a las tablas nececesarias para el
-- render del contenido (la vista pública greenline_posts_public
-- sigue funcionando: las vistas con security_definer ignoran el RLS).
-- Escritura (authenticated) restringida a es_blog_admin().

alter table if exists public.greenline_posts enable row level security;
alter table if exists public.greenline_categories enable row level security;
alter table if exists public.greenline_post_images enable row level security;

-- greenline_posts
drop policy if exists "Lectura pública de posts" on public.greenline_posts;
create policy "Lectura pública de posts" on public.greenline_posts
  for select to anon, authenticated
  using (true);

drop policy if exists "Blog admin gestiona posts" on public.greenline_posts;
create policy "Blog admin gestiona posts" on public.greenline_posts
  for all to authenticated
  using (public.es_blog_admin())
  with check (public.es_blog_admin());

-- greenline_categories
drop policy if exists "Lectura pública de categorías blog" on public.greenline_categories;
create policy "Lectura pública de categorías blog" on public.greenline_categories
  for select to anon, authenticated
  using (true);

drop policy if exists "Blog admin gestiona categorías" on public.greenline_categories;
create policy "Blog admin gestiona categorías" on public.greenline_categories
  for all to authenticated
  using (public.es_blog_admin())
  with check (public.es_blog_admin());

-- greenline_post_images
drop policy if exists "Lectura pública de imágenes blog" on public.greenline_post_images;
create policy "Lectura pública de imágenes blog" on public.greenline_post_images
  for select to anon, authenticated
  using (true);

drop policy if exists "Blog admin gestiona imágenes blog" on public.greenline_post_images;
create policy "Blog admin gestiona imágenes blog" on public.greenline_post_images
  for all to authenticated
  using (public.es_blog_admin())
  with check (public.es_blog_admin());

-- ============================================================
-- Storage: políticas para imagenes del blog (carpeta articulos/)
-- ============================================================
-- ============================================================
-- Storage: políticas para imagenes del blog (carpeta articulos/)
-- ============================================================

-- Permitir lectura pública de imágenes en el bucket Greenline_database
drop policy if exists "Public read blog images" on storage.objects;
create policy "Public read blog images" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'Greenline_database' and (storage.foldername(name))[1] = 'articulos');

-- Permitir subida de imágenes del blog a authenticated
drop policy if exists "Blog editors upload images" on storage.objects;
create policy "Blog editors upload images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'Greenline_database' and (storage.foldername(name))[1] = 'articulos');

-- Permitir eliminación de imágenes del blog a authenticated
drop policy if exists "Blog editors delete images" on storage.objects;
create policy "Blog editors delete images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'Greenline_database' and (storage.foldername(name))[1] = 'articulos');
-- ============================================================
-- Crear el usuario de Almudena (EDITORA_BLOG)
-- ------------------------------------------------------------
-- La forma recomendada es crearlo desde el panel /admin (usuarios),
-- con la cuenta ADMIN/DESARROLLADOR_WEB ya logueada, eligiendo el
-- rol EDITORA_BLOG. Ese flujo ya:
--   1) crea la fila en public.users con rol = EDITORA_BLOG, y
--   2) sincroniza la sesión en Supabase Auth (mismo email).
--
-- El usuario DEBE iniciar sesión en la web con el mismo email que
-- el de Supabase Auth para que es_blog_admin() lo reconozca.
--
-- Si se prefiere una siembra directa por SQL, primero crea el
-- usuario en Supabase Auth (Dashboard → Authentication → Users)
-- y luego ejecuta:

  insert into public.users (id, email, nombre, apellido, rol, activo)
  select auth.uid(), 'editorablog@greenline.com', 'Almudena', 'Blog', 'EDITORA_BLOG'::"Rol", true
  where not exists (
    select 1 from public.users where email = 'editorablog@greenline.com'
  );
--
-- El auth.uid() solo aplica dentro de una función SECURITY DEFINER (como el
-- backend ya hace al sincronizar). Para una siembra manual en el SQL Editor,
-- sustituye auth.uid() por el UUID real del usuario creado en Auth, y asegúrate
-- de que public.users.id apunte a ese mismo UUID para que la sesión se vincule.
-- ============================================================
