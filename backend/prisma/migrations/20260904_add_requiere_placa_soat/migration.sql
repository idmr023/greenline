-- ============================================================
-- GreenLine — ficha_tecnica.requiere_placa_soat
-- ------------------------------------------------------------
-- Indica si el vehículo requiere placa o SOAT en el Perú.
-- Se llena por categoría como default sensato (editable luego
-- desde el panel /admin):
--   Motos Eléctricas / Trimotos / Cuatrimotos -> true
--   VMP / Cargueros / Accesorios               -> false
-- ============================================================

alter table public.ficha_tecnica
  add column if not exists requiere_placa_soat boolean;

update public.ficha_tecnica ft
set requiere_placa_soat = true
where ft.requiere_placa_soat is null
  and ft.producto_id in (
    select p.id
    from public.productos p
    join public.categorias c on c.id = p.categoria_id
    where c.nombre in ('Motos Eléctricas', 'Trimotos Eléctricas', 'Cuatrimotos')
  );

update public.ficha_tecnica ft
set requiere_placa_soat = false
where ft.requiere_placa_soat is null
  and ft.producto_id in (
    select p.id
    from public.productos p
    join public.categorias c on c.id = p.categoria_id
    where c.nombre in ('VMP', 'Cargueros', 'Accesorios')
  );