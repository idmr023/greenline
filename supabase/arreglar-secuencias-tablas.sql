-- ============================================================
-- GreenLine — Re-sincronizar secuencias serial
-- ------------------------------------------------------------
-- Al sembrar datos con ids explícitos, las secuencias quedaron
-- detrás del máximo, por lo que crear productos/fichas/colores/
-- imágenes fallaba con "duplicate key ... _pkey" (23505).
-- Re-ejecutable (idempotente).
-- ============================================================

select setval(pg_get_serial_sequence('public.productos', 'id'),
              coalesce(max(id), 0) + 1, false)
  from public.productos;

select setval(pg_get_serial_sequence('public.ficha_tecnica', 'id'),
              coalesce(max(id), 0) + 1, false)
  from public.ficha_tecnica;

select setval(pg_get_serial_sequence('public.prod_color_rel', 'id'),
              coalesce(max(id), 0) + 1, false)
  from public.prod_color_rel;

select setval(pg_get_serial_sequence('public.imagenes', 'id'),
              coalesce(max(id), 0) + 1, false)
  from public.imagenes;