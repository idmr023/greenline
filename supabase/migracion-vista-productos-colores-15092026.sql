-- ============================================================
-- migracion-vista-productos-colores-15092026.sql
--
-- 1) Vista maestra de productos para el frontend público
--    (todas las uniones/agregaciones en el servidor).
-- 2) Colores de FL2 y TM7 corregidos EN LA DATA (se eliminan los
--    parches que forzaba el frontend).
-- ============================================================

-- ------------------------------------------------------------
-- 1) Vista maestra
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW vista_productos_web
WITH (security_invoker = true) AS
SELECT
  p.id,
  p.nombre,
  p.slug,
  p.descripcion,
  p.precio_original,
  p.precio_actual,
  p.destacado,
  p.video_id,
  p.etiquetas,
  p.created_at,
  p.updated_at,
  CASE WHEN p.disponible = false THEN 'Fuera de stock' ELSE 'En stock' END AS disponibilidad,
  c.id AS categoria_id,
  c.nombre AS categoria,
  COALESCE(
    (SELECT json_agg(
       json_build_object('id', i.id, 'src', i.url, 'color', i.color, 'es_principal', i.es_principal)
       ORDER BY i.orden, i.id)
     FROM imagenes i
     WHERE i.producto_id = p.id),
    '[]'::json
  ) AS imagenes,
  COALESCE(
    (SELECT json_agg(
       json_build_object('id', col.id, 'nombre', col.nombre, 'hex_code', col.hex_code, 'stock', pcr.stock)
       ORDER BY col.nombre)
     FROM prod_color_rel pcr
     JOIN colores col ON col.id = pcr.color_id
     WHERE pcr.producto_id = p.id),
    '[]'::json
  ) AS colores_detalle,
  row_to_json(ft.*) AS ficha_tecnica,
  COALESCE(ia.data, '{}'::jsonb) AS info_adicional
FROM productos p
LEFT JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN ficha_tecnica ft ON ft.producto_id = p.id
LEFT JOIN info_adicional ia ON ia.producto_id = p.id;

GRANT SELECT ON vista_productos_web TO anon, authenticated;

-- ------------------------------------------------------------
-- 2) Colores corregidos en la data
--    FL2 (id 1): solo se comercializa en Rojo.
--    TM7 v2026 (id 10): solo se comercializa en Blanco.
--    ANTES: el frontend forzaba estos colores por código.
-- ============================================================

-- FL2: quitar colores Blanco/Negro y sus fotos (queda Rojo)
DELETE FROM prod_color_rel
WHERE producto_id = 1
  AND color_id IN (SELECT id FROM colores WHERE nombre IN ('Blanco', 'Negro'));

DELETE FROM imagenes
WHERE producto_id = 1
  AND color IN ('Negro', 'Blanco');

-- TM7: quitar el color Gris de la relación (Blanco se mantiene)
DELETE FROM prod_color_rel
WHERE producto_id = 10
  AND color_id IN (SELECT id FROM colores WHERE nombre = 'Gris');

-- TM7: etiquetar las fotos existentes como Blanco (color único comercializado)
UPDATE imagenes
SET color = 'Blanco'
WHERE producto_id = 10;