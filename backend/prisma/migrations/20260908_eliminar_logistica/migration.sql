-- ============================================================
-- GreenLine - Eliminar el rol LOGISTICA del enum "Rol" y el
-- nivel de acceso LOGISTICA_N del enum "NivelAcceso"
-- ------------------------------------------------------------
-- Estado final del enum "Rol":
--   ADMIN, EDITORA_BLOG, DISTRIBUCION, GERENTE_TIENDA,
--   COLABORADOR_TIENDA, GERENTE_ALMACEN, COLABORADOR_ALMACEN,
--   DESARROLLADOR_WEB, CLIENTE
-- (LOGISTICA eliminado; no quedan usuarios con ese rol.)
--
-- NOTA: recrear el tipo de enum en PostgreSQL afecta a la columna
-- public.users.rol. La migración reconstruye el enum aparte y hace
-- el cast por texto; se ejecuta en autocommit (como la migración
-- previa 20260903_roles_distribucion_e_editora_blog).
-- ============================================================

-- 0) Pre-migración: ningún usuario puede conservar el rol/nivel que se
--    elimina. Consolida a DISTRIBUCION / CONTENIDO si existieran.
UPDATE public.users SET rol = 'DISTRIBUCION'
  WHERE rol::text = 'LOGISTICA';
UPDATE public.users SET nivel_acceso = 'CONTENIDO'
  WHERE nivel_acceso::text = 'LOGISTICA_N';

-- 1) Reconstruir el enum "Rol" sin LOGISTICA --------------------
DROP TYPE IF EXISTS public."Rol_new";
CREATE TYPE public."Rol_new" AS ENUM (
  'ADMIN', 'EDITORA_BLOG', 'DISTRIBUCION',
  'GERENTE_TIENDA', 'COLABORADOR_TIENDA', 'GERENTE_ALMACEN',
  'COLABORADOR_ALMACEN', 'DESARROLLADOR_WEB', 'CLIENTE'
);

ALTER TABLE public.users
  ALTER COLUMN rol TYPE public."Rol_new" USING rol::text::public."Rol_new";

DROP TYPE IF EXISTS public."Rol" CASCADE;
ALTER TYPE public."Rol_new" RENAME TO "Rol";

-- 2) Reconstruir el enum "NivelAcceso" sin LOGISTICA_N ----------
-- La columna public.users.nivel_acceso es de tipo TEXT (no usa el
-- enum), por lo que el enum es huérfano y solo se reconstruye por
-- consistencia con el schema. No se altera ninguna columna.
DROP TYPE IF EXISTS public."NivelAcceso_new";
CREATE TYPE public."NivelAcceso_new" AS ENUM (
  'SUPER', 'ALMACEN', 'TIENDA', 'CONTENIDO', 'CLIENTE_N'
);

DROP TYPE IF EXISTS public."NivelAcceso";
ALTER TYPE public."NivelAcceso_new" RENAME TO "NivelAcceso";

-- 3) Panel de acceso: quitar LOGISTICA si existe -----------------
DELETE FROM public.panel_acceso WHERE rol = 'LOGISTICA';