-- ============================================================
-- Migración 2026-09-10: videos de YouTube por modelo (videosYT)
-- Fuente: frontend/lib/videosYT.js (modelo_vehículo → url)
-- Validado contra la tabla real productos (33 filas, 2026-09-10).
-- Asigna a cada producto el video de su modelo según el nombre,
-- con límite de palabra (evita mezclar p. ej. GL3 con L3).
-- Cuando un modelo tiene 2 videos se guarda el primero en video_id;
-- el resto se muestra en la vista vía videosForProduct.
-- ============================================================

UPDATE productos
SET video_id = 'Zxkomo2Ccs0'
WHERE nombre ~* '(^|[^a-z0-9])S4 Pro([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'XMHwoozejJI'
WHERE nombre ~* '(^|[^a-z0-9])Y5([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

-- Video GL3: la URL original tiene typo "hhttps://youtu.be/-FC6WVJvIoo"
-- por eso aquí se almacena el ID limpio (misma solución para todos).
UPDATE productos
SET video_id = '-FC6WVJvIoo'
WHERE nombre ~* '(^|[^a-z0-9])GL3([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'cmziN_moID4'
WHERE nombre ~* '(^|[^a-z0-9])F4 Pro([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'jp4NPas8CxM'
WHERE nombre ~* '(^|[^a-z0-9])T6([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'Ee9OlmOcT-k'
WHERE nombre ~* '(^|[^a-z0-9])X3([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = '05xPjX7tIXg'
WHERE nombre ~* '(^|[^a-z0-9])TM9([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'KbuotZGWoqI'
WHERE nombre ~* '(^|[^a-z0-9])M3 Pro([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

-- X6 Pro: el producto en BD se llama "Greenline X6PRO" (sin espacio),
-- por eso este patrón admite X6 seguido de PRO sin separador.
UPDATE productos
SET video_id = 'hJoX-2OJ0Tk'
WHERE nombre ~* '(^|[^a-z0-9])X6[^a-z0-9]*PRO([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'LAVJnJN8owI'
WHERE nombre ~* '(^|[^a-z0-9])V9 Pro([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'h4rjpqrdOjQ'
WHERE nombre ~* '(^|[^a-z0-9])H3 Pro([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'DBxKiVRcNAo'
WHERE nombre ~* '(^|[^a-z0-9])SR([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'piPS6IW-ZtA'
WHERE nombre ~* '(^|[^a-z0-9])MX6([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'WgK3f1vUh6k'
WHERE nombre ~* '(^|[^a-z0-9])T4([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'kBFLDTALpug'
WHERE nombre ~* '(^|[^a-z0-9])L3([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'ATY4C2O_r2c'
WHERE nombre ~* '(^|[^a-z0-9])P01([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'd85qr7hZcdM'
WHERE nombre ~* '(^|[^a-z0-9])S6 Pro([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

-- ------------------------------------------------------------
-- Modelos en videosYT.js SIN producto en la BD actual (no se
-- cambia nada; quedan registrados para validar con el equipo):
--   H5 · TM4 Pro · TC2-160 Power Pro
-- Los posibles candidatos de TC2-160 (TC2-160A y TC2-160 con
-- Techo) tienen NOMBRE distinto y NO se asocian a ese video.
-- ------------------------------------------------------------