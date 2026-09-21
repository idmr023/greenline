-- Regla de negocio: no puede existir ninguna imagen "Sin color / General".
-- Toda imagen debe pertenecer a un color registrado del catálogo.
-- (Datos legacy ya fueron saneados: 0 imágenes con color NULL.)

-- Respaldo defensivo por si apareciera algún NULL nuevo antes de aplicar:
-- asigna un color vacío sería inválido; mejor fallar explícitamente.
DO $$
DECLARE n INT;
BEGIN
  SELECT COUNT(*) INTO n FROM imagenes WHERE color IS NULL OR color = '';
  IF n > 0 THEN
    RAISE EXCEPTION 'Hay % imagen(es) sin color. Asigna color antes de aplicar esta migración.', n;
  END IF;
END $$;

ALTER TABLE imagenes ALTER COLUMN color SET NOT NULL;
ALTER TABLE imagenes DROP CONSTRAINT IF EXISTS imagenes_color_no_vacio;
ALTER TABLE imagenes ADD CONSTRAINT imagenes_color_no_vacio CHECK (btrim(color) <> '');
