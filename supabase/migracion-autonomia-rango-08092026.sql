-- ============================================================
-- migracion-autonomia-rango-08092026.sql
--
-- Cambia ficha_tecnica.autonomia_km de INT a TEXT para permitir
-- rangos como '40 - 50 km' (o 'Hasta 60 km').
-- Los valores integer existentes se convierten a texto.
-- ============================================================

ALTER TABLE public.ficha_tecnica
  ALTER COLUMN autonomia_km TYPE text
  USING (
    CASE
      WHEN autonomia_km IS NULL THEN NULL
      ELSE autonomia_km::text
    END
  );