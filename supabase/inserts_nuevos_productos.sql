-- ============================================================================
-- Greenline Web ERP · Inserción de 2 productos nuevos
--   H5 (moto eléctrica) y TC2-160 Power PRO (carguero eléctrico)
--
-- Ejecutar en el SQL editor de Supabase (proyecto real). No usa TRUNCATE.
-- Los ids de categoría/color se resuelven por nombre (subselect), igual que seed.sql.
-- Re-ejecutable: borra primero por slug si ya existieran.
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0) BORRADO PREVIO (solo si hay que re-correr; orden inverso por FK)
-- ─────────────────────────────────────────────────────────────────────────────
DELETE FROM imagenes
WHERE producto_id IN (SELECT id FROM productos WHERE slug IN ('greenline-h5', 'carguero-greenline-tc2-160-power-pro'));

DELETE FROM prod_color_rel
WHERE producto_id IN (SELECT id FROM productos WHERE slug IN ('greenline-h5', 'carguero-greenline-tc2-160-power-pro'));

DELETE FROM info_adicional
WHERE producto_id IN (SELECT id FROM productos WHERE slug IN ('greenline-h5', 'carguero-greenline-tc2-160-power-pro'));

DELETE FROM ficha_tecnica
WHERE producto_id IN (SELECT id FROM productos WHERE slug IN ('greenline-h5', 'carguero-greenline-tc2-160-power-pro'));

DELETE FROM productos
WHERE slug IN ('greenline-h5', 'carguero-greenline-tc2-160-power-pro');

-- ⚠ Si tus categorías en la BD real tienen otro nombre (p.ej. acentos codificados),
--  reemplaza el texto aquí y en los subselects de ficha/color SOLO si falla el lookup.


-- ============================ 1) PRODUCTOS ===================================
INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, disponible, etiquetas)
SELECT
    c.id,
    'GreenLine H5',
    'greenline-h5',
    E'Moto eléctrica GreenLine H5. Motor de 1000W con potencia máxima de 1250W, batería 60V20AH de plomo ácido, torque de 18N.m y velocidad máxima de 45 km/h. Cuenta con posapié incorporado para copiloto, guantera bajo el asiento, puerto USB y bloqueo de timón y motor para máxima seguridad. Rinde una autonomía entre 45 y 55 km. Disponible en rojo, blanco y negro.',
    3800,
    3600,
    false,
    false,
    ARRAY['destacado', 'promocion']::TEXT[]
FROM categorias c
WHERE c.nombre = 'Motos Eléctricas'
ON CONFLICT (slug) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    precio_original = EXCLUDED.precio_original,
    precio_actual = EXCLUDED.precio_actual,
    destacado = EXCLUDED.destacado,
    disponible = EXCLUDED.disponible,
    etiquetas = EXCLUDED.etiquetas,
    updated_at = now();

INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, disponible, etiquetas)
SELECT
    c.id,
    'Carguero GreenLine TC2-160 Power PRO',
    'carguero-greenline-tc2-160-power-pro',
    E'Carguero eléctrico GreenLine TC2-160 Power PRO. Motor de 1800W con potencia máxima de 2250W y batería 60V52Ah. Capacidad de carga de 400 a 500 kg, velocidad máxima de 22 km/h y autonomía entre 40 y 50 km. Chasis reforzado, tolva de gran volumen, asiento amplio, faros LED y suspensión reforzada. Disponible en azul y gris.',
    8000,
    7500,
    false,
    false,
    ARRAY['carguero-promocion', 'destacado', 'promocion']::TEXT[]
FROM categorias c
WHERE c.nombre = 'Cargueros'
ON CONFLICT (slug) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    precio_original = EXCLUDED.precio_original,
    precio_actual = EXCLUDED.precio_actual,
    destacado = EXCLUDED.destacado,
    disponible = EXCLUDED.disponible,
    etiquetas = EXCLUDED.etiquetas,
    updated_at = now();


-- ============================ 2) FICHA TECNICA ===============================
-- Columnas reales utilizadas por FichaTecnicaTab / SpecsCard / CapacidadCargaTab
INSERT INTO ficha_tecnica (
    producto_id, potencia_motor, tipo_bateria, autonomia_km, velocidad_max_kmh,
    capacidad_bateria, vida_util_bateria, bateria_extraible, requiere_placa_soat,
    tipo_toma_corriente, torque_maximo, potencia_bateria, carga_maxima_kg,
    largo_cm, ancho_cm, alto_cm
)
SELECT
    id,
    '1000W',                      -- potencia_motor
    'Plomo Ácido',                -- tipo_bateria
    '45 - 55',                    -- autonomia_km
    45,                           -- velocidad_max_kmh
    '1.2 kWh',                    -- capacidad_bateria
    '500 – 600 ciclos',           -- vida_util_bateria
    FALSE,                        -- bateria_extraible
    TRUE,                         -- requiere_placa_soat
    '220 V/60 Hz',                -- tipo_toma_corriente
    '18N.m',                      -- torque_maximo
    '60V/20AH',                   -- potencia_bateria
    150,                          -- carga_maxima_kg
    175, 70, 113                  -- largo_cm, ancho_cm, alto_cm
FROM productos WHERE slug = 'greenline-h5';

INSERT INTO ficha_tecnica (
    producto_id, potencia_motor, tipo_bateria, autonomia_km, velocidad_max_kmh,
    capacidad_bateria, vida_util_bateria, bateria_extraible, requiere_placa_soat,
    tipo_toma_corriente, torque_maximo, potencia_bateria, carga_minima_kg,
    carga_maxima_kg, largo_cm, ancho_cm, alto_cm
)
SELECT
    id,
    '1800W',                      -- potencia_motor
    'Plomo Ácido',                -- tipo_bateria
    '40 - 50',                    -- autonomia_km
    22,                           -- velocidad_max_kmh
    '3.12 kWh',                   -- capacidad_bateria
    '400 – 500 ciclos',           -- vida_util_bateria
    FALSE,                        -- bateria_extraible
    TRUE,                         -- requiere_placa_soat
    '220 V/60 Hz',                -- tipo_toma_corriente
    '5.20 N.m',                   -- torque_maximo
    '60V/52Ah',                   -- potencia_bateria
    400,                          -- carga_minima_kg
    500,                          -- carga_maxima_kg
    310, 117, 135                 -- largo_cm, ancho_cm, alto_cm
FROM productos WHERE slug = 'carguero-greenline-tc2-160-power-pro';


-- ============================ 3) INFO ADICIONAL ==============================
-- data (jsonb): filas extra de la FICHA (potencia máxima, condiciones) +
-- tabla INFORMACIÓN ADICIONAL. Edita los valores que no apliquen a tu copia.
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Número modos de manejo": "3 (bajo, medio, alto)",
        "Potencia máxima": "1250W",
        "Tablero de información": "Digital, pantalla negativa de baja reflexión",
        "Alarma/seguridad": "Sí, alarma eléctrica contra robos. Bloqueo de timón y motor",
        "Cajuela/asiento": "Sí, guantera bajo el asiento. Maletera posterior",
        "Puerto USB para carga de celular": "Sí",
        "Luces direccionales (delantero/posterior)": "Sí / Sí",
        "Luces intermitentes": "Sí",
        "Suspensión delantera/trasera": "Telescópica / doble amortiguador",
        "Freno delantero/trasero": "Disco / Tambor",
        "Llanta delantera/trasera": "90/90-12 / 90/90-12. Sin cámara",
        "Largo*ancho*altura (cm)": "175 * 70 * 113",
        "Peso en seco (kg)": "89 kg",
        "Peso soportado (kg)": "150 kg",
        "Tiempo de carga": "6 - 8 horas",
        "Capacidad de escalada": "Moderada (rampas urbanas)",
        "Condiciones de uso": "De ciudad, uso mixto. Lluvia: revisar sellado de conectores",
        "Detalles": "Posapié para copiloto, manija central y lateral, faros LED"
    }'::jsonb
FROM productos WHERE slug = 'greenline-h5';

INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Número modos de manejo": "4 (bajo, neutro, alto y retroceso)",
        "Potencia máxima": "2250W",
        "Tablero de información": "LCD",
        "Alarma eléctrica antirrobo": "Sí",
        "Asiento": "Un asiento amplio",
        "Tolva (largo * ancho * alto) (cm)": "Sí, ver ficha del modelo",
        "Puerto USB para carga de celular": "No",
        "Luces direccionales (delantera/posterior)": "Sí / Sí",
        "Luces intermitentes": "Sí",
        "Suspensión delantera/trasera": "Telescópica / muelle reforzado",
        "Freno delantero/trasero": "Tambor / Tambor",
        "Llanta delantera/trasera": "4.00-12 / 4.00-12, tubular",
        "Largo*ancho*altura (cm)": "310 * 117 * 135",
        "Peso en seco (kg)": "210 kg",
        "Peso soportado (kg)": "400 - 500 kg",
        "Tiempo de carga": "8 - 10 horas",
        "Capacidad de escalada": "Fuerte (pendientes pronunciadas)",
        "Condiciones de uso": "Carga pesada, uso comercial y agrícola. Lluvia: revisar sellado de conectores",
        "Detalles": "Chasis reforzado, faros LED, función de retroceso, doble sistema de frenado"
    }'::jsonb
FROM productos WHERE slug = 'carguero-greenline-tc2-160-power-pro';


-- ============================ 4) COLORES =====================================
-- stock = 1 (mismo criterio que seed.sql)
INSERT INTO prod_color_rel (producto_id, color_id, stock)
SELECT p.id, c.id, 1
FROM productos p, colores c
WHERE p.slug = 'greenline-h5' AND c.nombre IN ('Negro', 'Blanco', 'Rojo');

INSERT INTO prod_color_rel (producto_id, color_id, stock)
SELECT p.id, c.id, 1
FROM productos p, colores c
WHERE p.slug = 'carguero-greenline-tc2-160-power-pro' AND c.nombre IN ('Azul', 'Gris');


-- ============================ 5) IMAGENES ====================================
-- Carpeta local: public/assets/imagenes/productos/…
-- (se sirve como '/assets/imagenes/productos/…')
-- H5 — carpeta motos/h5
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_rojo_frontal.jpg', 'Rojo', 'true', 0 FROM productos WHERE slug = 'greenline-h5';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_rojo_costado.webp', 'Rojo', 'false', 1 FROM productos WHERE slug = 'greenline-h5';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_roja_perfil.jpg', 'Rojo', 'false', 2 FROM productos WHERE slug = 'greenline-h5';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_roja_posterior.jpg', 'Rojo', 'false', 3 FROM productos WHERE slug = 'greenline-h5';

INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_negro_frontal.webp', 'Negro', 'false', 4 FROM productos WHERE slug = 'greenline-h5';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_negro_costado.webp', 'Negro', 'false', 5 FROM productos WHERE slug = 'greenline-h5';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_negro_perfil.jpg', 'Negro', 'false', 6 FROM productos WHERE slug = 'greenline-h5';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_negro_posterior.webp', 'Negro', 'false', 7 FROM productos WHERE slug = 'greenline-h5';

INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_blanca_frontal.webp', 'Blanco', 'false', 8 FROM productos WHERE slug = 'greenline-h5';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_blanca_costado.webp', 'Blanco', 'false', 9 FROM productos WHERE slug = 'greenline-h5';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_blanca_perfil.webp', 'Blanco', 'false', 10 FROM productos WHERE slug = 'greenline-h5';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/motos/h5/h5_blanca_posterior.webp', 'Blanco', 'false', 11 FROM productos WHERE slug = 'greenline-h5';

-- TC2-160 Power PRO — carpeta cargueros/tc2_160_power_pro (solo Azul tiene fotos; Gris va sin imágenes)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/cargueros/tc2_160_power_pro/tc2_160_pp_azul_frente.webp', 'Azul', 'true', 0 FROM productos WHERE slug = 'carguero-greenline-tc2-160-power-pro';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/cargueros/tc2_160_power_pro/tc2_160_pp_azul_costado.webp', 'Azul', 'false', 1 FROM productos WHERE slug = 'carguero-greenline-tc2-160-power-pro';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/cargueros/tc2_160_power_pro/tc2_160_pp_azul_perfil.webp', 'Azul', 'false', 2 FROM productos WHERE slug = 'carguero-greenline-tc2-160-power-pro';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, '/assets/imagenes/productos/cargueros/tc2_160_power_pro/tc2_160_pp_azul_posterior.webp', 'Azul', 'false', 3 FROM productos WHERE slug = 'carguero-greenline-tc2-160-power-pro';