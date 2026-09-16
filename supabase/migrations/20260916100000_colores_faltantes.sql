-- ============================================================================
-- Colores faltantes en el catálogo
-- ----------------------------------------------------------------------------
-- Contexto: la tienda construye los "puntitos" de color a partir de
-- `imagenes.color` (nombre) y busca el `hex_code` en la tabla `colores`.
-- Los nombres usados en las imágenes que no existían en `colores` caían al
-- gris por defecto y se confundían entre sí.
--
-- Esta migración:
--   1) Agrega los colores que se usan en `imagenes` y faltaban en `colores`.
--   2) Rellena `hex_code` nulo/vacío de los colores ya existentes.
--   3) Red de seguridad: inserta cualquier otro `imagenes.color` sin catalogar
--      (con hex NULL, para que el admin lo complete desde el panel).
--
-- Es idempotente: puede ejecutarse varias veces sin duplicar filas.
-- ============================================================================

-- 1) Colores faltantes ---------------------------------------------------------
--    Nota: 'Verde Metálico' (con tilde) ya existe en seed.sql, no se repite aquí.
INSERT INTO colores (nombre, hex_code) VALUES
  ('Blanca',         '#FFFFFF'),
  ('Negra',          '#1A1A1A'),
  ('Plata',          '#C0C0C0'),
  ('Morada',         '#7C3AED'),
  ('Morado',         '#7C3AED'),
  ('Gris Claro',     '#D1D5DB'),
  ('Verde Metalico', '#047857'),
  ('Camaleón',       '#22C55E')
ON CONFLICT (nombre) DO UPDATE
  SET hex_code = COALESCE(NULLIF(colores.hex_code, ''), EXCLUDED.hex_code);

-- 2) Rellenar hex_code de colores existentes que lo tengan nulo/vacío ----------
UPDATE colores SET hex_code = v.hex
FROM (VALUES
  ('Blanco',          '#FFFFFF'),
  ('Negro',           '#1A1A1A'),
  ('Gris',            '#808080'),
  ('Gris Oscuro',     '#404040'),
  ('Rojo',            '#DC2626'),
  ('Verde',           '#009000'),
  ('Verde ligero',    '#4ADE80'),
  ('Verde Esmeralda', '#059669'),
  ('Celeste',         '#38BDF8'),
  ('Azul',            '#2563EB'),
  ('Crema',           '#FEF3C7'),
  ('Rosado',          '#F472B6'),
  ('Plateado',        '#9CA3AF'),
  ('Naranja',         '#F97316')
) AS v(nombre, hex)
WHERE colores.nombre = v.nombre
  AND (colores.hex_code IS NULL OR colores.hex_code = '');

-- 3) Red de seguridad: colores usados en imágenes aún sin catálogo -------------
--    Quedan con hex NULL y se completan desde el panel de administración.
INSERT INTO colores (nombre, hex_code)
SELECT DISTINCT TRIM(i.color), NULL
FROM imagenes i
WHERE i.color IS NOT NULL
  AND TRIM(i.color) <> ''
  AND NOT EXISTS (SELECT 1 FROM colores c WHERE c.nombre = TRIM(i.color))
ON CONFLICT (nombre) DO NOTHING;
