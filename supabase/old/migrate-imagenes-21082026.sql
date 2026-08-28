-- ============================================================
-- MIGRACION DE IMAGENES DE VEHICULOS A SUPABASE STORAGE
-- Bucket: Greenline_database (publico)
-- UPDATE sobre filas existentes (por id) + INSERT de las faltantes.
-- No borra nada. Cascos (productos 2, 3 y 4) no se tocan.
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

ALTER TABLE imagenes ALTER COLUMN url DROP NOT NULL;

DO $$
DECLARE
  base_url TEXT := 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos';
BEGIN

-- Producto 1
  UPDATE imagenes SET url = base_url || '/bicicletas_electricas/fl2/fl2_negro_costado.webp', color = 'Negro', es_principal = true, orden = 0 WHERE id = 1;
  UPDATE imagenes SET url = base_url || '/bicicletas_electricas/fl2/fl2_blanco_costado.webp', color = 'Blanco', es_principal = false, orden = 1 WHERE id = 2;
  UPDATE imagenes SET url = base_url || '/bicicletas_electricas/fl2/fl2_rojo_costado.webp', color = 'Rojo', es_principal = false, orden = 2 WHERE id = 3;
  UPDATE imagenes SET url = NULL, color = NULL, es_principal = false, orden = 3 WHERE id = 4;
  UPDATE imagenes SET url = NULL, color = NULL, es_principal = false, orden = 4 WHERE id = 5;

-- Producto 6 (M3 sin fotos en Supabase)
    INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, base_url || '/motos/m3pro/M3-PRO-CREMA.webp', 'Crema', true, 0);
    INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, base_url || '/motos/m3pro/M3-PRO-GRIS-CLARO.webp', 'Gris Claro', false, 1);
    INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, base_url || '/motos/m3pro/M3-PRO-GRIS-OSCURO.webp', 'Gris Oscuro', false, 2);
-- Producto 5
  UPDATE imagenes SET url = base_url || '/motos/t6/t6_negro_costado.webp', color = 'Negro', es_principal = true, orden = 0 WHERE id = 9;
  UPDATE imagenes SET url = base_url || '/motos/t6/t6_negro_frontal.webp', color = 'Negro', es_principal = false, orden = 1 WHERE id = 10;
  UPDATE imagenes SET url = base_url || '/motos/t6/t6_negro_perfil.webp', color = 'Negro', es_principal = false, orden = 2 WHERE id = 11;
  UPDATE imagenes SET url = base_url || '/motos/t6/t6_blanco_costado.webp', color = 'Blanco', es_principal = false, orden = 3 WHERE id = 12;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, base_url || '/motos/t6/t6_blanco_frontal.webp', 'Blanco', false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, base_url || '/motos/t6/t6_blanco_perfil.webp', 'Blanco', false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, base_url || '/motos/t6/t6_gris_costado.webp', 'Gris', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, base_url || '/motos/t6/t6_gris_frontal.webp', 'Gris', false, 7);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, base_url || '/motos/t6/t6_gris_perfil.webp', 'Gris', false, 8);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, base_url || '/motos/t6/t6_verde_costado.webp', 'Verde', false, 9);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, base_url || '/motos/t6/t6_verde_frontal.webp', 'Verde', false, 10);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, base_url || '/motos/t6/t6_verde_perfil.webp', 'Verde', false, 11);

-- Producto 7
  UPDATE imagenes SET url = base_url || '/motos/sr/sr_blanca_costado.webp', color = 'Blanca', es_principal = true, orden = 0 WHERE id = 17;
  UPDATE imagenes SET url = base_url || '/motos/sr/sr_blanca_frontal.webp', color = 'Blanca', es_principal = false, orden = 1 WHERE id = 18;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, base_url || '/motos/sr/sr_blanca_posterior.webp', 'Blanca', false, 2);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, base_url || '/motos/sr/sr_blanca_perfil.webp', 'Blanca', false, 3);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, base_url || '/motos/sr/sr_negro_costado.webp', 'Negra', false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, base_url || '/motos/sr/sr_negro_frontal.webp', 'Negra', false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, base_url || '/motos/sr/sr_negro_posterior.webp', 'Negra', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, base_url || '/motos/sr/sr_negro_perfil.webp', 'Negra', false, 7);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, base_url || '/motos/sr/sr_gris_costado.webp', 'Gris', false, 8);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, base_url || '/motos/sr/sr_gris_posterior.webp', 'Gris', false, 9);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, base_url || '/motos/sr/sr_gris_perfil.webp', 'Gris', false, 10);

-- Producto 8
  UPDATE imagenes SET url = base_url || '/motos/mx6/mx6_negra_costado.webp', color = 'Negra', es_principal = true, orden = 0 WHERE id = 19;
  UPDATE imagenes SET url = base_url || '/motos/mx6/mx6_negro_frontal.webp', color = 'Negra', es_principal = false, orden = 1 WHERE id = 20;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, base_url || '/motos/mx6/mx6_negro_posterior.webp', 'Negra', false, 2);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, base_url || '/motos/mx6/mx6_negro_perfil.webp', 'Negra', false, 3);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, base_url || '/motos/mx6/mx6_blanca_costado.webp', 'Blanca', false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, base_url || '/motos/mx6/mx6_blanca_frontal.webp', 'Blanca', false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, base_url || '/motos/mx6/mx6_blanca_posterior.webp', 'Blanca', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, base_url || '/motos/mx6/mx6_blanca_perfil.webp', 'Blanca', false, 7);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, base_url || '/motos/mx6/mx6_gris_costado.webp', 'Gris', false, 8);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, base_url || '/motos/mx6/mx6_gris_frontal.webp', 'Gris', false, 9);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, base_url || '/motos/mx6/mx6_gris_posterior.webp', 'Gris', false, 10);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, base_url || '/motos/mx6/mx6_gris_perfil.webp', 'Gris', false, 11);

-- Producto 9
  UPDATE imagenes SET url = base_url || '/trimotos/tm9/tm9_blanco_costado_der.webp', color = 'Blanco', es_principal = true, orden = 0 WHERE id = 21;
  UPDATE imagenes SET url = base_url || '/trimotos/tm9/tm9_blanco_costado_izq.webp', color = 'Blanco', es_principal = false, orden = 1 WHERE id = 22;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_blanco_frontal.webp', 'Blanco', false, 2);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_blanco_posterior.webp', 'Blanco', false, 3);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_blanco_posterior_der.webp', 'Blanco', false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_blanco_perfil.webp', 'Blanco', false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_crema_costado_der.webp', 'Crema', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_crema_costado_izq.webp', 'Crema', false, 7);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_crema_frontal.webp', 'Crema', false, 8);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_crema_posterior.webp', 'Crema', false, 9);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_crema_posterior_der.webp', 'Crema', false, 10);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_crema_perfil.webp', 'Crema', false, 11);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_morada_frontal.webp', 'Morada', false, 12);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_morado_costado_der.webp', 'Morada', false, 13);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_morado_costado_izq.webp', 'Morada', false, 14);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_morado_posterior.webp', 'Morada', false, 15);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_morado_posterior_der.webp', 'Morada', false, 16);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, base_url || '/trimotos/tm9/tm9_morado_perfil.webp', 'Morada', false, 17);

-- Producto 10
  UPDATE imagenes SET url = base_url || '/trimotos/tm7_2026/tmt7_gris_costado.webp', color = 'Gris', es_principal = true, orden = 0 WHERE id = 23;
  UPDATE imagenes SET url = base_url || '/trimotos/tm7_2026/tmt7_gris_frontal.webp', color = 'Gris', es_principal = false, orden = 1 WHERE id = 24;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, base_url || '/trimotos/tm7_2026/tmt7_gris_perfil.webp', 'Gris', false, 2);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, base_url || '/trimotos/tm7_2026/tmt7_crema_costado.webp', 'Crema', false, 3);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, base_url || '/trimotos/tm7_2026/tmt7_crema_frontal.webp', 'Crema', false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, base_url || '/trimotos/tm7_2026/tmt7_crema_perfil.webp', 'Crema', false, 5);

-- Producto 11
  UPDATE imagenes SET url = base_url || '/motos/h3 pro/h3_pro_rosado_costado.webp', color = 'Rosado', es_principal = true, orden = 0 WHERE id = 25;
  UPDATE imagenes SET url = base_url || '/motos/h3 pro/h3_pro_rosado_frontal.webp', color = 'Rosado', es_principal = false, orden = 1 WHERE id = 26;
  UPDATE imagenes SET url = base_url || '/motos/h3 pro/h3_pro_rosado_poterior.webp', color = 'Rosado', es_principal = false, orden = 2 WHERE id = 27;
  UPDATE imagenes SET url = base_url || '/motos/h3 pro/h3_pro_rosado_perfil.webp', color = 'Rosado', es_principal = false, orden = 3 WHERE id = 28;
  UPDATE imagenes SET url = base_url || '/motos/h3 pro/h3_pro_negro_costado.webp', color = 'Negro', es_principal = false, orden = 4 WHERE id = 29;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, base_url || '/motos/h3 pro/h3_pro_negro_frontal.webp', 'Negro', false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, base_url || '/motos/h3 pro/h3_pro_negro_posterior.webp', 'Negro', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, base_url || '/motos/h3 pro/h3_pro_negro_perfil.webp', 'Negro', false, 7);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, base_url || '/motos/h3 pro/h3_pro_blanco_costado.webp', 'Blanco', false, 8);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, base_url || '/motos/h3 pro/h3_pro_blanco_frontal.webp', 'Blanco', false, 9);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, base_url || '/motos/h3 pro/h3_pro_blanco_posterior.webp', 'Blanco', false, 10);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, base_url || '/motos/h3 pro/h3_pro_blanco_perfil.webp', 'Blanco', false, 11);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, base_url || '/motos/h3 pro/h3_pro_verde_costado.webp', 'Verde', false, 12);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, base_url || '/motos/h3 pro/h3_pro_verde_perfil.webp', 'Verde', false, 13);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, base_url || '/motos/h3 pro/h3_pro_verde_posterior.webp', 'Verde', false, 14);

-- Producto 12
  UPDATE imagenes SET url = base_url || '/motos/v9_pro/v9_pro_negro_costado.webp', color = 'Negro', es_principal = true, orden = 0 WHERE id = 30;
  UPDATE imagenes SET url = base_url || '/motos/v9_pro/v9_pro_negro_frontal.webp', color = 'Negro', es_principal = false, orden = 1 WHERE id = 31;
  UPDATE imagenes SET url = base_url || '/motos/v9_pro/v9_pro_negro_posterior.webp', color = 'Negro', es_principal = false, orden = 2 WHERE id = 32;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_negro_perfil.webp', 'Negro', false, 3);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_blanco_costado.webp', 'Blanco', false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_blanco_frontal.webp', 'Blanco', false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_blanco_posterior.webp', 'Blanco', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_blanco_perfil.webp', 'Blanco', false, 7);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_gris_costado.webp', 'Gris', false, 8);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_gris_frontal.webp', 'Gris', false, 9);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_gris_posterior.webp', 'Gris', false, 10);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_gris_perfil.webp', 'Gris', false, 11);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_verde_costado.webp', 'Verde', false, 12);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_verde_frontal.webp', 'Verde', false, 13);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_verde_posterior.webp', 'Verde', false, 14);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, base_url || '/motos/v9_pro/v9_pro_verde_perfil.webp', 'Verde', false, 15);

-- Producto 13
  UPDATE imagenes SET url = base_url || '/motos/m3pro/M3-PRO-CREMA.webp', color = 'Crema', es_principal = true, orden = 0 WHERE id = 33;
  UPDATE imagenes SET url = base_url || '/motos/m3pro/M3-PRO-GRIS-CLARO.webp', color = 'Gris Claro', es_principal = false, orden = 1 WHERE id = 34;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, base_url || '/motos/m3pro/M3-PRO-GRIS-OSCURO.webp', 'Gris Oscuro', false, 2);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, base_url || '/motos/m3pro/M3-PRO-FRONTAL.webp', NULL, false, 3);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, base_url || '/motos/m3pro/M3-PRO-POSTERIOR.webp', NULL, false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, base_url || '/motos/m3pro/M3-PRO-PERFIL-DERECHO.webp', NULL, false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, base_url || '/motos/m3pro/M3-PRO-PERFIL-IZQUIERDO.webp', NULL, false, 6);

-- Producto 14
  UPDATE imagenes SET url = base_url || '/cargueros/tm6_pro/tm6_pro_crema_costado.webp', color = 'Crema', es_principal = true, orden = 0 WHERE id = 35;
  UPDATE imagenes SET url = base_url || '/cargueros/tm6_pro/tm6_pro_crema_frontal.webp', color = 'Crema', es_principal = false, orden = 1 WHERE id = 36;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, base_url || '/cargueros/tm6_pro/tm6_pro_crema_posterior.webp', 'Crema', false, 2);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, base_url || '/cargueros/tm6_pro/tm6_pro_crema_perfil.webp', 'Crema', false, 3);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, base_url || '/cargueros/tm6_pro/tm6_pro_rojo_costado.webp', 'Rojo', false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, base_url || '/cargueros/tm6_pro/tm6_pro_rojo_frontal.webp', 'Rojo', false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, base_url || '/cargueros/tm6_pro/tm6_pro_rojo_posterior.webp', 'Rojo', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, base_url || '/cargueros/tm6_pro/tm6_pro_rojo_perfil.webp', 'Rojo', false, 7);

-- Producto 15
  UPDATE imagenes SET url = base_url || '/vmp/S9/vmp_s9_blanco.webp', color = 'Blanco', es_principal = true, orden = 0 WHERE id = 37;
  UPDATE imagenes SET url = base_url || '/vmp/S9/vmp_s9_gris.webp', color = 'Gris', es_principal = false, orden = 1 WHERE id = 38;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (15, base_url || '/vmp/S9/vmp_s9_rojo.webp', 'Rojo', false, 2);

-- Producto 16
  UPDATE imagenes SET url = base_url || '/cargueros/tc2_180a/TC2-180-AZUL-INCLINADO.webp', color = 'Azul', es_principal = true, orden = 0 WHERE id = 39;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (16, base_url || '/cargueros/tc2_180a/TC2-180-ROJO-INCLINADO.webp', 'Rojo', false, 1);

-- Producto 17
  UPDATE imagenes SET url = base_url || '/vmp/l3pro/L3-NEGRO.webp', color = 'Negro', es_principal = true, orden = 0 WHERE id = 40;
  UPDATE imagenes SET url = base_url || '/vmp/l3pro/L3-FRENTE-NEGRO.webp', color = 'Negro', es_principal = false, orden = 1 WHERE id = 41;
  UPDATE imagenes SET url = base_url || '/vmp/l3pro/L3-POSTERIOR-NEGRO.webp', color = 'Negro', es_principal = false, orden = 2 WHERE id = 42;
  UPDATE imagenes SET url = base_url || '/vmp/l3pro/L3-CELESTE.webp', color = 'Celeste', es_principal = false, orden = 3 WHERE id = 43;
  UPDATE imagenes SET url = base_url || '/vmp/l3pro/L3-FRENTE-CELESTE-scaled.webp', color = 'Celeste', es_principal = false, orden = 4 WHERE id = 44;
  UPDATE imagenes SET url = base_url || '/vmp/l3pro/L3-POSTERIOR-CELESTE.webp', color = 'Celeste', es_principal = false, orden = 5 WHERE id = 45;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, base_url || '/vmp/l3pro/L3-CREMA.webp', 'Crema', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, base_url || '/vmp/l3pro/L3-CREMA-2.webp', 'Crema', false, 7);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, base_url || '/vmp/l3pro/L3-FRENTE-CREMA-scaled.webp', 'Crema', false, 8);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, base_url || '/vmp/l3pro/L3-POSTERIOR.webp', NULL, false, 9);

-- Producto 18
  UPDATE imagenes SET url = base_url || '/cargueros/tc_bus/tc_bus_azul.webp', color = 'Azul', es_principal = true, orden = 0 WHERE id = 46;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (18, base_url || '/cargueros/tc_bus/tc_bus_negro.webp', 'Negro', false, 1);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (18, base_url || '/cargueros/tc_bus/tc_bus_rojo.webp', 'Rojo', false, 2);

-- Producto 19
  UPDATE imagenes SET url = base_url || '/cargueros/tc2_110a/tc2_110a_naranja_costado.webp', color = 'Naranja', es_principal = true, orden = 0 WHERE id = 47;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, base_url || '/cargueros/tc2_110a/tc2_110a_naranja_frontal.webp', 'Naranja', false, 1);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, base_url || '/cargueros/tc2_110a/tc2_110a_naranja_posterior.webp', 'Naranja', false, 2);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, base_url || '/cargueros/tc2_110a/tc2_110a_naranja_perfil.webp', 'Naranja', false, 3);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, base_url || '/cargueros/tc2_110a/tc2_110a_plata_costado.webp', 'Plata', false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, base_url || '/cargueros/tc2_110a/tc2_110a_plata_frontal.webp', 'Plata', false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, base_url || '/cargueros/tc2_110a/tc2_110a_plata_posterior.webp', 'Plata', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, base_url || '/cargueros/tc2_110a/tc2_110a_plata_perfil.webp', 'Plata', false, 7);

-- Producto 20
  UPDATE imagenes SET url = base_url || '/motos/f4 pro/f4pro_azul_costado.webp', color = 'Azul', es_principal = true, orden = 0 WHERE id = 48;
  UPDATE imagenes SET url = base_url || '/motos/f4 pro/f4pro_azul_frontal.webp', color = 'Azul', es_principal = false, orden = 1 WHERE id = 49;
  UPDATE imagenes SET url = base_url || '/motos/f4 pro/f4pro_azul_posterior.webp', color = 'Azul', es_principal = false, orden = 2 WHERE id = 50;
  UPDATE imagenes SET url = base_url || '/motos/f4 pro/f4pro_azul_perfil.webp', color = 'Azul', es_principal = false, orden = 3 WHERE id = 51;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_negro_costado.webp', 'Negro', false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_negro__frontal.webp', 'Negro', false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_negro_posterior.webp', 'Negro', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_negro_perfil.webp', 'Negro', false, 7);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_rojo_costado.webp', 'Rojo', false, 8);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_rojo_frontal.webp', 'Rojo', false, 9);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_rojo_posterior.webp', 'Rojo', false, 10);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_rojo_perfil.webp', 'Rojo', false, 11);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_gris_costado.webp', 'Gris', false, 12);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_gris_frontal.webp', 'Gris', false, 13);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_gris_posterior.webp', 'Gris', false, 14);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, base_url || '/motos/f4 pro/f4pro_gris_perfil.webp', 'Gris', false, 15);

-- Producto 21
  UPDATE imagenes SET url = base_url || '/motos/gl3/gl3_negro_costado.webp', color = 'Negro', es_principal = true, orden = 0 WHERE id = 52;
  UPDATE imagenes SET url = base_url || '/motos/gl3/gl3_negro_frontal.webp', color = 'Negro', es_principal = false, orden = 1 WHERE id = 53;
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, base_url || '/motos/gl3/gl3_negro_posterior.webp', 'Negro', false, 2);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, base_url || '/motos/gl3/gl3_negro_perfil.webp', 'Negro', false, 3);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, base_url || '/motos/gl3/gl3_camaleon_frente.webp', 'Camaleon', false, 4);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, base_url || '/motos/gl3/gl3_camaleon_frontal.webp', 'Camaleon', false, 5);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, base_url || '/motos/gl3/gl3_camaleon_posterior.webp', 'Camaleon', false, 6);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, base_url || '/motos/gl3/gl3_camaleon_perfil.webp', 'Camaleon', false, 7);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, base_url || '/motos/gl3/gl3_verde_metalico_costado.webp', 'Verde Metalico', false, 8);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, base_url || '/motos/gl3/gl3_verde_metalico_frontal.webp', 'Verde Metalico', false, 9);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, base_url || '/motos/gl3/gl3_verde_metalico_posterior.webp', 'Verde Metalico', false, 10);
  INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, base_url || '/motos/gl3/gl3_verde_metalico_perfil.webp', 'Verde Metalico', false, 11);

END
$$;