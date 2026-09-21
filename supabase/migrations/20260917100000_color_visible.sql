-- Visibilidad de colores por producto: permite ocultar colores agotados
-- sin eliminar la relación ni sus imágenes.
ALTER TABLE prod_color_rel
  ADD COLUMN IF NOT EXISTS visible BOOLEAN NOT NULL DEFAULT TRUE;

-- Recrear la vista web para exponer `visible` en colores_detalle
CREATE OR REPLACE VIEW vista_productos_web
WITH (security_invoker = true) AS
SELECT p.id, p.nombre, p.slug, p.descripcion, p.precio_original, p.precio_actual,
  p.destacado, p.video_id, p.etiquetas, p.created_at, p.updated_at,
  CASE WHEN p.disponible = false THEN 'Fuera de stock' ELSE 'En stock' END AS disponibilidad,
  c.id AS categoria_id, c.nombre AS categoria,
  COALESCE((SELECT json_agg(json_build_object(
    'id', i.id, 'src', i.url, 'color', i.color, 'es_principal', i.es_principal
  ) ORDER BY i.orden, i.id) FROM imagenes i WHERE i.producto_id = p.id), '[]'::json) AS imagenes,
  COALESCE((SELECT json_agg(json_build_object(
    'id', col.id, 'nombre', col.nombre, 'hex_code', col.hex_code,
    'stock', pcr.stock, 'visible', pcr.visible
  ) ORDER BY col.nombre)
  FROM prod_color_rel pcr JOIN colores col ON col.id = pcr.color_id
  WHERE pcr.producto_id = p.id), '[]'::json) AS colores_detalle,
  row_to_json(ft.*) AS ficha_tecnica,
  COALESCE(ia.data, '{}'::jsonb) AS info_adicional
FROM productos p
LEFT JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN ficha_tecnica ft ON ft.producto_id = p.id
LEFT JOIN info_adicional ia ON ia.producto_id = p.id;
