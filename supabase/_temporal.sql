-- ============================================================
-- _temporal.sql - DELTA COMBINADO para ejecutar en Supabase
--
-- Contenido:
--   1) productos.manual_pdf  (vincula el manual al producto; los que
--      no tienen manual quedan con id vacío/NULL)
--   2) greenline_manuales     (catálogo global de manuales para la
--      página /manuales-de-uso, con RLS y políticas)
--
-- NOTA: schema.sql y seed.sql YA incluyen estos cambios para
-- instalaciones nuevas. Este archivo es el delta acumulado.
-- Re-ejecutable e idempotente (IF NOT EXISTS / ON CONFLICT).
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1) Columna manual_pdf en productos (mismo patrón que video_id)
-- ------------------------------------------------------------
ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS manual_pdf TEXT;

UPDATE productos SET manual_pdf = 'Manual-de-uso-FL2-310124.pdf' WHERE slug = 'bicicleta-elctrica-plegable-fl2';
UPDATE productos SET manual_pdf = 'GreenLine-Manual-de-uso-H3-18-10-24.pdf' WHERE slug = 'greenline-h3-pro';
UPDATE productos SET manual_pdf = 'Manual-de-uso-M3-y-M3PRO.pdf' WHERE slug = 'greenline-m3-pro';
UPDATE productos SET manual_pdf = 'Manual-de-uso-MX6.pdf' WHERE slug = 'greenline-mx6';
UPDATE productos SET manual_pdf = 'Manual-de-uso-SR.pdf' WHERE slug = 'greenline-sr';
UPDATE productos SET manual_pdf = 'Manual-de-uso-T6.pdf' WHERE slug = 'greenline-t6';
UPDATE productos SET manual_pdf = 'Manual-TC2-180.pdf' WHERE slug = 'greenline-tc2-180a';
UPDATE productos SET manual_pdf = 'Manual-TC2-160.pdf' WHERE slug = 'greenline-tc2-160-con-techo';
UPDATE productos SET manual_pdf = 'Manual-de-uso-TC2-160-A.pdf' WHERE slug = 'greenline-tc2-160a';
UPDATE productos SET manual_pdf = 'Manual-de-uso-V9-PRO.pdf' WHERE slug = 'greenline-v9-pro';
UPDATE productos SET manual_pdf = 'Manual-de-uso-VMP-L3.pdf' WHERE slug = 'greenline-vmp-l3-pro';
UPDATE productos SET manual_pdf = 'Manual-de-uso-VMP-P01.pdf' WHERE slug = 'greenline-vmp-p01';
UPDATE productos SET manual_pdf = 'Manual-de-uso-VMP-S4-26-06-23-.pdf' WHERE slug = 'greenline-vmp-s4-pro';
UPDATE productos SET manual_pdf = 'Manual-S6-PRO.pdf' WHERE slug = 'greenline-vmp-s6-pro';
UPDATE productos SET manual_pdf = 'Manual-de-uso-VMP-S9 (1).pdf' WHERE slug = 'greenline-vmp-s9';
UPDATE productos SET manual_pdf = 'Manual-de-uso-VMPT4.pdf' WHERE slug = 'greenline-vmp-t4';
UPDATE productos SET manual_pdf = 'Manual-modelo-Y5-05-03-25_comp.pdf' WHERE slug = 'greenline-y5';
UPDATE productos SET manual_pdf = 'Manual-de-uso-TM6PRO1.pdf' WHERE slug = 'trimoto-greenline-tm6-pro';
UPDATE productos SET manual_pdf = 'Manual-de-uso-TM7V25.pdf' WHERE slug = 'trimoto-greenline-tm7-v2026';
UPDATE productos SET manual_pdf = 'Manual-de-uso-TM9.pdf' WHERE slug = 'trimoto-greenline-tm9';

-- ------------------------------------------------------------
-- 2) Tabla greenline_manuales (catálogo global de manuales)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS greenline_manuales (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  archivo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  orden INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE greenline_manuales ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'greenline_manuales' AND policyname = 'Lectura pública de manuales') THEN
    CREATE POLICY "Lectura pública de manuales" ON greenline_manuales FOR SELECT USING (activo);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'greenline_manuales' AND policyname = 'Panel gestiona manuales') THEN
    CREATE POLICY "Panel gestiona manuales" ON greenline_manuales FOR ALL TO authenticated
      USING (es_admin_panel()) WITH CHECK (es_admin_panel());
  END IF;
END $$;

INSERT INTO greenline_manuales (titulo, categoria, archivo, slug, orden)
VALUES
  ('Ficha Técnica 2023 LION KING ', 'Fichas Técnicas', 'FICHA-TECNICA-2023-LION-KING-11-10-23.pdf', 'ficha-tecnica-2023-lion-king-11-10-23', 1),
  ('Manual A4', 'VMP', 'Manual-de-uso-A4.pdf', 'manual-de-uso-a4', 2),
  ('Manual E5', 'Motos Eléctricas', 'GreenLine-Manual-de-uso-E5-27-09-22.pdf', 'greenline-manual-de-uso-e5-27-09-22', 3),
  ('Manual E5 Mini', 'Motos Eléctricas', 'GreenLine-Manual-de-uso-E5-Mini-28-10-24.pdf', 'greenline-manual-de-uso-e5-mini-28-10-24', 4),
  ('Manual F4', 'Motos Eléctricas', 'GreenLine-Manual-de-uso-F4-2024.pdf', 'greenline-manual-de-uso-f4-2024', 5),
  ('Manual F6V', 'VMP', 'Manual-de-uso-F6V25.pdf', 'manual-de-uso-f6v25', 6),
  ('Manual FL2', 'VMP', 'Manual-de-uso-FL2-310124.pdf', 'manual-de-uso-fl2-310124', 7),
  ('Manual GL2', 'VMP', 'Manual-de-uso-GL2.pdf', 'manual-de-uso-gl2', 8),
  ('Manual H5', 'Motos Eléctricas', 'Manual-de-uso-H5.pdf', 'manual-de-uso-h5', 9),
  ('Manual H3', 'Motos Eléctricas', 'GreenLine-Manual-de-uso-H3-18-10-24.pdf', 'greenline-manual-de-uso-h3-18-10-24', 10),
  ('Manual H2 Mini', 'Motos Eléctricas', 'Manual-de-uso-H2-min.pdf', 'manual-de-uso-h2-min', 11),
  ('Manual H21', 'Motos Eléctricas', 'GreenLine-Manual-uso-H21-180-18-05-23.pdf', 'greenline-manual-uso-h21-180-18-05-23', 12),
  ('Manual J120', 'Trimotos Eléctricas', 'GreenLine-Manual-de-uso-J120-31-05-2022-1.pdf', 'greenline-manual-de-uso-j120-31-05-2022-1', 13),
  ('Manual Leopard', 'Trimotos Eléctricas', 'GreenLine-Manual-de-uso-LEOPARD-2024-15-01-24_.pdf', 'greenline-manual-de-uso-leopard-2024-15-01-24-', 14),
  ('Manual Lion King', 'Trimotos Eléctricas', 'GreenLine-Manual-de-uso-LION-KING-22-09-23.pdf', 'greenline-manual-de-uso-lion-king-22-09-23', 15),
  ('Manual Lion Lite', 'Trimotos Eléctricas', 'GreenLine-Manual-de-uso-LION-LITE-8-8-22_compressed.pdf', 'greenline-manual-de-uso-lion-lite-8-8-22-compressed', 16),
  ('Manual M6', 'Motos Eléctricas', 'GreenLine-Manual-de-uso-M6-24-09-22.pdf', 'greenline-manual-de-uso-m6-24-09-22', 17),
  ('Manual M2', 'VMP', 'GreenLine-Manual-de-uso-M2-8-08-22_compressed.pdf', 'greenline-manual-de-uso-m2-8-08-22-compressed', 18),
  ('Manual M3 y M3 Pro', 'Motos Eléctricas', 'Manual-de-uso-M3-y-M3PRO.pdf', 'manual-de-uso-m3-y-m3pro', 19),
  ('Manual M5 Max', 'Motos Eléctricas', 'GreenLine-Manual-de-uso-M5-MAX-25-05-22.pdf', 'greenline-manual-de-uso-m5-max-25-05-22', 20),
  ('Manual MX6', 'Motos Eléctricas', 'Manual-de-uso-MX6.pdf', 'manual-de-uso-mx6', 21),
  ('Manual Pionero', 'Cargueros', 'GreenLine-Manual-de-uso-pionero-23-11-22.pdf', 'greenline-manual-de-uso-pionero-23-11-22', 22),
  ('Manual Runner', 'VMP', 'GreenLine-Manual-de-uso-runner-24-11-22-2.pdf', 'greenline-manual-de-uso-runner-24-11-22-2', 23),
  ('Manual S6 Pro', 'VMP', 'Manual-S6-PRO.pdf', 'manual-s6-pro', 24),
  ('Manual SR', 'Motos Eléctricas', 'Manual-de-uso-SR.pdf', 'manual-de-uso-sr', 25),
  ('Manual T6', 'Motos Eléctricas', 'Manual-de-uso-T6.pdf', 'manual-de-uso-t6', 26),
  ('Manual TailG T8', 'Motos Eléctricas', 'GreenLine-Manual-de-Uso-Modelo-TAILG-T8.pdf', 'greenline-manual-de-uso-modelo-tailg-t8', 27),
  ('Manual TailG TM', 'Trimotos Eléctricas', 'GreenLine-Manual-de-uso-TAILG-TM7-14-10-22.pdf', 'greenline-manual-de-uso-tailg-tm7-14-10-22', 28),
  ('Manual TailG TM5 15', 'Trimotos Eléctricas', 'GreenLine_Manual_de_uso_TAILG_TM5-15-5-23.pdf', 'greenline-manual-de-uso-tailg-tm5-15-5-23', 29),
  ('Manual TailG Warrior', 'Motos Eléctricas', 'GreenLine-Manual-de-Uso-Modelo-TAILG-WARRIOR-2021.pdf', 'greenline-manual-de-uso-modelo-tailg-warrior-2021', 30),
  ('Manual TC1-110', 'Cargueros', 'Manual-de-uso-TC1-110.pdf', 'manual-de-uso-tc1-110', 31),
  ('Manual TC1', 'Cargueros', 'GreenLine-Manual-Uso-TC1-85-27-10-23.pdf', 'greenline-manual-uso-tc1-85-27-10-23', 32),
  ('Manual TC2', 'Cargueros', 'Manual-TC2-130.pdf', 'manual-tc2-130', 33),
  ('Manual TC2-160', 'Cargueros', 'Manual-TC2-160.pdf', 'manual-tc2-160', 34),
  ('Manual TC2-180', 'Cargueros', 'Manual-TC2-180.pdf', 'manual-tc2-180', 35),
  ('Manual TC2-160 A', 'Cargueros', 'Manual-de-uso-TC2-160-A.pdf', 'manual-de-uso-tc2-160-a', 36),
  ('Manual TC2 160 POWER Pro', 'Cargueros', 'Manual-de-uso-TC2-160-POWER-PRO.pdf', 'manual-de-uso-tc2-160-power-pro', 37),
  ('Manual TC2 160 Tolva y Cajón', 'Cargueros', 'Manual-TC2-160-TOLVA-y-CAJON.pdf', 'manual-tc2-160-tolva-y-cajon', 38),
  ('Manual TM9', 'Trimotos Eléctricas', 'Manual-de-uso-TM9.pdf', 'manual-de-uso-tm9', 39),
  ('Manual TM4', 'Trimotos Eléctricas', 'GreenLine-Manual-de-uso-TM4-25-10-2024.pdf', 'greenline-manual-de-uso-tm4-25-10-2024', 40),
  ('Manual TM3', 'Trimotos Eléctricas', 'GreenLine-Manual-de-uso-TM3-16-11-24_compressed.pdf', 'greenline-manual-de-uso-tm3-16-11-24-compressed', 41),
  ('Manual TM4 Pro', 'Trimotos Eléctricas', 'Manual-de-uso-TM4PRO.pdf', 'manual-de-uso-tm4pro', 42),
  ('Manual TM6L', 'Trimotos Eléctricas', 'Manual-de-uso-TM6L.pdf', 'manual-de-uso-tm6l', 43),
  ('Manual TM6PRO', 'Trimotos Eléctricas', 'Manual-de-uso-TM6PRO1.pdf', 'manual-de-uso-tm6pro1', 44),
  ('Manual TM6 2026', 'Trimotos Eléctricas', 'Manual-de-uso-TM6V26.pdf', 'manual-de-uso-tm6v26', 45),
  ('Manual TM6V 2024', 'Trimotos Eléctricas', 'GreenLine-Manual-de-uso-TM6V24-24-01-25.pdf', 'greenline-manual-de-uso-tm6v24-24-01-25', 46),
  ('Manual TM7 2025', 'Trimotos Eléctricas', 'Manual-de-uso-TM7V25.pdf', 'manual-de-uso-tm7v25', 47),
  ('Manual TM8 Pro', 'Trimotos Eléctricas', 'Manual-de-uso-TM8PRO.pdf', 'manual-de-uso-tm8pro', 48),
  ('Manual TM8V', 'Trimotos Eléctricas', 'Manual-de-uso-TM8V2025.pdf', 'manual-de-uso-tm8v2025', 49),
  ('Manual V8', 'Motos Eléctricas', 'Manual-de-uso-V8.pdf', 'manual-de-uso-v8', 50),
  ('Manual V9', 'Motos Eléctricas', 'Manual-V9.pdf', 'manual-v9', 51),
  ('Manual V9 Pro', 'Motos Eléctricas', 'Manual-de-uso-V9-PRO.pdf', 'manual-de-uso-v9-pro', 52),
  ('Manual VMP ', 'VMP', 'GreenLine-Manual-de-uso-VMP-19-09-23-1.pdf', 'greenline-manual-de-uso-vmp-19-09-23-1', 53),
  ('Manual VMP ', 'VMP', 'GreenLine-Manual-de-uso-VMP-19-09-23.pdf', 'greenline-manual-de-uso-vmp-19-09-23', 54),
  ('Manual VMP L3', 'VMP', 'Manual-de-uso-VMP-L3.pdf', 'manual-de-uso-vmp-l3', 55),
  ('Manual VMP L24', 'VMP', 'GreenLine-Manual-de-uso-VMP-L24-29-12-21.pdf', 'greenline-manual-de-uso-vmp-l24-29-12-21', 56),
  ('Manual VMP L1', 'VMP', 'GreenLine-Manual-de-uso-VMP-L1-21-11-23.pdf', 'greenline-manual-de-uso-vmp-l1-21-11-23', 57),
  ('Manual VMP L2', 'VMP', 'GreenLine-Manual-de-uso-VMP-L2-21-11-23.pdf', 'greenline-manual-de-uso-vmp-l2-21-11-23', 58),
  ('Manual VMP L24D', 'VMP', 'GreenLine-Manual-de-uso-VMP-L24D-29-12-22-02.pdf', 'greenline-manual-de-uso-vmp-l24d-29-12-22-02', 59),
  ('Manual VMP P', 'VMP', 'Manual-de-uso-VMP-P01.pdf', 'manual-de-uso-vmp-p01', 60),
  ('Manual VMP P12', 'VMP', 'GreenLine-Manual-de-uso-VMP-P12-11-10-24_compressed.pdf', 'greenline-manual-de-uso-vmp-p12-11-10-24-compressed', 61),
  ('Manual VMP P01', 'VMP', 'Manual-de-uso-VMP-P01 (1).pdf', 'manual-de-uso-vmp-p01-1-', 62),
  ('Manual VMP S7', 'VMP', 'Manual-de-uso-VMP-S7.pdf', 'manual-de-uso-vmp-s7', 63),
  ('Manual VMP S1', 'VMP', 'GreenLine-Manual-de-uso-VMP-S1-27-12-23.pdf', 'greenline-manual-de-uso-vmp-s1-27-12-23', 64),
  ('Manual VMP S3', 'VMP', 'GreenLine-Manual-de-uso-VMP-S3-19-10-23.pdf', 'greenline-manual-de-uso-vmp-s3-19-10-23', 65),
  ('Manual VMP S1', 'VMP', 'GreenLine-Manual-de-uso-VMP-S1-27-2-23-02.pdf', 'greenline-manual-de-uso-vmp-s1-27-2-23-02', 66),
  ('Manual VMP S1 Pro', 'VMP', 'GreenLine-Manual-de-uso-VMP-S1PRO-11-10-24_compressed.pdf', 'greenline-manual-de-uso-vmp-s1pro-11-10-24-compressed', 67),
  ('Manual VMP S2X', 'VMP', 'GreenLine-Manual-de-Uso-Modelo-VMP-S2X.pdf', 'greenline-manual-de-uso-modelo-vmp-s2x', 68),
  ('Manual VMP S2X 2026 ', 'VMP', 'GreenLine-Manual-de-uso-VMP-S2X-26-05-23-02-.pdf', 'greenline-manual-de-uso-vmp-s2x-26-05-23-02-', 69),
  ('Manual VMP S3 ', 'VMP', 'GreenLine-Manual-de-uso-VMP-S3-26-06-23-02.pdf', 'greenline-manual-de-uso-vmp-s3-26-06-23-02', 70),
  ('Manual VMP S4 ', 'VMP', 'Manual-de-uso-VMP-S4-26-06-23-.pdf', 'manual-de-uso-vmp-s4-26-06-23-', 71),
  ('Manual VMP S5', 'VMP', 'GreenLine-Manual-de-uso-VMP-S5-23.pdf', 'greenline-manual-de-uso-vmp-s5-23', 72),
  ('Manual VMP S9', 'VMP', 'Manual-de-uso-VMP-S9 (1).pdf', 'manual-de-uso-vmp-s9-1-', 73),
  ('Manual VMP T3', 'VMP', 'GreenLine-Manual-de-uso-VMP-T3.pdf', 'greenline-manual-de-uso-vmp-t3', 74),
  ('Manual VMP T4', 'VMP', 'Manual-de-uso-VMPT4.pdf', 'manual-de-uso-vmpt4', 75),
  ('Manual VMP T1', 'VMP', 'Manual-de-uso-VMPT1-25-10-2024.pdf', 'manual-de-uso-vmpt1-25-10-2024', 76),
  ('Manual X3', 'Motos Eléctricas', 'Manual-X3.pdf', 'manual-x3', 77),
  ('Manual X6', 'Motos Eléctricas', 'Manual-X6.pdf', 'manual-x6', 78),
  ('Manual X6 Pro', 'Motos Eléctricas', 'Manual-de-uso-X6-PRO.pdf', 'manual-de-uso-x6-pro', 79),
  ('Manual Y3', 'VMP', 'Manual-de-uso-Y3-14-02-25.pdf', 'manual-de-uso-y3-14-02-25', 80),
  ('Manual Y5', 'Motos Eléctricas', 'Manual-modelo-Y5-05-03-25_comp.pdf', 'manual-modelo-y5-05-03-25-comp', 81)
ON CONFLICT (slug) DO NOTHING;

COMMIT;