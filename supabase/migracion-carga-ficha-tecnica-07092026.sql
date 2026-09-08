-- ============================================================
-- Migración 2026-09-07: Capacidad de carga en ficha_tecnica
-- Fuente: reunión 07/09/2026 (valores oficiales por modelo).
-- El campo carga_maxima_kg es único; se agrega carga_minima_kg
-- solo para los modelos cuyo fabricante indica un RANGO.
-- ============================================================

-- 1) Columna para soportar rangos de carga (ej: 400 a 500 kg)
ALTER TABLE ficha_tecnica
    ADD COLUMN IF NOT EXISTS carga_minima_kg INT;

COMMENT ON COLUMN ficha_tecnica.carga_minima_kg IS
    'Carga mínima soportada (kg). Solo se usa cuando el fabricante indica un rango (ej. 400 a 500 kg).';

-- 2) GreenLine TC2-180A → 400 a 500 kg (antes solo 400)
UPDATE ficha_tecnica ft
SET carga_minima_kg = 400,
    carga_maxima_kg = 500
WHERE ft.producto_id = (SELECT id FROM productos WHERE slug = 'greenline-tc2-180a');

-- 3) GreenLine TC2-160 con Techo → 500 a 800 kg (máximo ya estaba en 800)
UPDATE ficha_tecnica ft
SET carga_minima_kg = 500
WHERE ft.producto_id = (SELECT id FROM productos WHERE slug = 'greenline-tc2-160-con-techo');

-- 4) GreenLine TC-BUS → 800 kg (estaba en 350, desactualizado)
UPDATE ficha_tecnica ft
SET carga_maxima_kg = 800
WHERE ft.producto_id = (SELECT id FROM productos WHERE slug = 'greenline-tc-bus');

-- Confirmados SIN cambio (ya estaban correctos):
--   TC2-110A (200 kg) · TC2-160A (500 kg) · TM7 v2026 (180 kg) · TM6 PRO (170 kg)
-- Nota: "TM6 130 kg" no se aplica: no existe un producto con slug/referencia TM6
-- en el catálogo actual (solo TM6 PRO). Queda registrado para validar con el equipo.