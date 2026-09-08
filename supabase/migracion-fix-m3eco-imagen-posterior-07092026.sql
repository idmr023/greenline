-- ============================================================
-- Fix imágenes M3 ECO: el archivo m3eco_gris_posterior.webp
-- nunca se subió a Supabase Storage (solo existen costado,
-- frontal y perfil). Eliminamos la fila para evitar la imagen
-- rota (404) en la ficha del producto GreenLine M3 ECO.
-- ============================================================

DELETE FROM imagenes
WHERE url LIKE '%/motos/m3eco/m3eco_gris_posterior.webp';