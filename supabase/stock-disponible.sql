-- ============================================================
-- Stock como Disponible / No Disponible (boolean)
--
-- El stock por números (prod_color_stock + trigger sincronizador)
-- queda INACTIVO en el frontend/admin (código comentado para
-- reactivar a futuro). De momento el estado del catálogo se
-- maneja únicamente con la columna `disponible` de productos.
--
-- La lógica numérica de stock NO se borra: tabla prod_color_stock,
-- función fn_sync_stock_total y trigger trg_sync_stock_total
-- permanecen en la BD (inertes mientras nadie escriba allí).
--
-- Reversible con:  ALTER TABLE public.productos DROP COLUMN disponible;
-- ============================================================

alter table public.productos
  add column if not exists disponible boolean not null default true;

comment on column public.productos.disponible is
  'TEMPORAL: catálogo manejado por disponibilidad (true = En stock, false = Fuera de stock). Reemplaza el stock numérico mientras se reactiva la lógica de stocks.';