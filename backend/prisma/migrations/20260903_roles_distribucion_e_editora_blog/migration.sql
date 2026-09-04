-- ============================================================
-- GreenLine - Roles backend: agregar DISTRIBUCION y EDITORA_BLOG,
-- consolidar EDITOR_ARTICULOS -> EDITORA_BLOG
-- ------------------------------------------------------------
-- Aplicado contra la BD de producción (public.users.rol, tipo "Rol",
-- propiedad de postgres). Estado final del enum "Rol":
--   ADMIN, LOGISTICA, EDITORA_BLOG, DISTRIBUCION, GERENTE_TIENDA,
--   COLABORADOR_TIENDA, GERENTE_ALMACEN, COLABORADOR_ALMACEN,
--   DESARROLLADOR_WEB, CLIENTE
-- (EDITOR_ARTICULOS eliminado; ya no existen usuarios con ese rol.)
--
-- NOTA: la migración se ejecutó mediante sentencias sueltas en
-- autocommit (el bloque DO con ADD VALUE en transacción no es
-- soportado por este controlador). Este archivo queda como registro
-- idempotente del cambio.
-- ============================================================

-- Reconstruir aparte cuando existan usuarios con EDITOR_ARTICULOS:
-- UPDATE public.users SET rol = 'EDITORA_BLOG'::"Rol_new"
--   WHERE rol::text = 'EDITOR_ARTICULOS';
-- (En producción no existía ninguno, por lo que no fue necesario.)

DROP TYPE IF EXISTS public."Rol_new";
CREATE TYPE public."Rol_new" AS ENUM (
  'ADMIN', 'LOGISTICA', 'EDITORA_BLOG', 'DISTRIBUCION',
  'GERENTE_TIENDA', 'COLABORADOR_TIENDA', 'GERENTE_ALMACEN',
  'COLABORADOR_ALMACEN', 'DESARROLLADOR_WEB', 'CLIENTE'
);

-- Cambiar el tipo de la columna (cast por texto). El UPDATE de
-- consolidación debe ejecutarse antes de esta línea.
ALTER TABLE public.users
  ALTER COLUMN rol TYPE public."Rol_new" USING rol::text::public."Rol_new";

DROP TYPE IF EXISTS public."Rol" CASCADE;
ALTER TYPE public."Rol_new" RENAME TO "Rol";
