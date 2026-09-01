-- ============================================================
-- Migración: Nueva categoría "Cuatrimotos"
--  - Crea la categoría 'Cuatrimotos'
--  - M-CAR 1          → Trimotos Eléctricas
--  - M-CAR 2, 3, 4, 5 → Cuatrimotos
-- Ejecutar en el SQL Editor de Supabase. Idempotente.
-- ============================================================
BEGIN;

-- 1. Crear la categoría Cuatrimotos (idempotente)
INSERT INTO categorias (nombre)
SELECT 'Cuatrimotos'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Cuatrimotos');

-- 2. M-CAR 1 → Trimotos Eléctricas
UPDATE productos p
SET categoria_id = c.id
FROM categorias c
WHERE c.nombre = 'Trimotos Eléctricas'
  AND p.slug IN ('greenline-m-car-1');

-- 3. M-CAR 2, 3, 4 y 5 → Cuatrimotos
UPDATE productos p
SET categoria_id = c.id
FROM categorias c
WHERE c.nombre = 'Cuatrimotos'
  AND p.slug IN (
    'greenline-m-car-2',
    'greenline-m-car-3',
    'greenline-m-car-4',
    'greenline-m-car-5'
  );

COMMIT;