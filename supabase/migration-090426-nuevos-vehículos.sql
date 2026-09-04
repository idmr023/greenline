-- ============================================================
-- 1. INSERTAR PRODUCTOS PRINCIPALES
-- ============================================================
INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) 
VALUES 
(
    2, 
    'GreenLine GL4', 
    'greenline-gl4', 
    'El nuevo ingreso, Greenline GL4 es una motocicleta de transmisión automática diseñada para transportar cómodamente a dos pasajeros, equipada con una batería de plomo-ácido de 72V38AH y un potente motor de 3000W que le permite alcanzar una velocidad máxima de 75 km/h. Ideal para la movilidad urbana, este vehículo de dos ruedas cuenta con un peso neto de 148 kg, soporta una carga máxima de 150 kg e incluye características muy prácticas para el día a día, como sistema de diferencial y marcha en retroceso para facilitar cualquier tipo de maniobra.', 
    5500, 
    5200, 
    false, 
    ARRAY['Nuevo', 'MotoElectrica', 'promocion']::TEXT[]
),
(
    2, 
    'GreenLine M3 ECO', 
    'greenline-m3-eco', 
    'El nuevo Greenline M3 ECO es un vehículo de transmisión automática diseñado para la movilidad urbana eficiente. Está equipado con una batería de plomo-ácido de 72V38AH y un motor de 1500W, potencia que le permite alcanzar una velocidad máxima de 75 km/h. Pensado para transportar cómodamente a dos pasajeros, cuenta con un peso neto de 148 kg y soporta una carga de hasta 150 kg. Para garantizar un manejo práctico y seguro, incorpora marcha en retroceso, sistema de diferencial y llantas de 120/70-12 (delantera) y 120/70-10 (trasera), ofreciendo gran estabilidad en cada trayecto diario.', 
    NULL, 
    NULL, 
    false, 
    ARRAY['Nuevo', 'MotoElectrica']::TEXT[]
);

-- ============================================================
-- 2. INSERTAR FICHAS TÉCNICAS Y DATA ADICIONAL
-- ============================================================
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) 
VALUES 
(
    (SELECT id FROM productos WHERE slug = 'greenline-gl4'), '3000W', '72V/38AH', 'Plomo Ácido', 75, 150, 176, 75, 106
),
(
    (SELECT id FROM productos WHERE slug = 'greenline-m3-eco'), '1500W', '72V/38AH', 'Plomo Ácido', 75, 150, 176, 75, 106
);

INSERT INTO info_adicional (producto_id, data) 
VALUES 
(
    (SELECT id FROM productos WHERE slug = 'greenline-gl4'), 
    '{"Tipo de transmisión": "Automática", "Diferencial": "Sí", "Marcha en retroceso": "Sí", "Asientos / Pasajeros": "2 Asientos / 2 Pasajeros", "Tipo de moto": "Scooter", "Fórmula rodante": "2x1", "Llanta delantera/trasera": "120/70-12 / 120/70-10", "Largo*ancho*altura (cm)": "176 * 75 * 106", "Peso neto (kg)": "148 kg", "Peso bruto vehicular (kg)": "298 kg", "Peso soportado (kg)": "150 kg"}'::jsonb
),
(
    (SELECT id FROM productos WHERE slug = 'greenline-m3-eco'), 
    '{"Tipo de transmisión": "Automática", "Diferencial": "Sí", "Marcha en retroceso": "Sí", "Asientos / Pasajeros": "2 Asientos / 2 Pasajeros", "Tipo de moto": "Scooter", "Fórmula rodante": "2x1", "Llanta delantera/trasera": "120/70-12 / 120/70-10", "Largo*ancho*altura (cm)": "176 * 75 * 106", "Peso neto (kg)": "148 kg", "Peso bruto vehicular (kg)": "298 kg", "Peso soportado (kg)": "150 kg"}'::jsonb
);

-- ============================================================
-- 3. INSERCIÓN DE IMÁGENES (CON EL FIX DE "INT")
-- ============================================================
DO $$
DECLARE
    IMAGE_BASE_URL TEXT := 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/';
    gl4_id INT;
    m3eco_id INT;
BEGIN
    SELECT id INTO gl4_id FROM productos WHERE slug = 'greenline-gl4';
    SELECT id INTO m3eco_id FROM productos WHERE slug = 'greenline-m3-eco';

    IF gl4_id IS NULL THEN
        RAISE EXCEPTION 'Producto greenline-gl4 no encontrado. Revisa si se insertó correctamente.';
    END IF;
    IF m3eco_id IS NULL THEN
        RAISE EXCEPTION 'Producto greenline-m3-eco no encontrado. Revisa si se insertó correctamente.';
    END IF;

    -- GL4 — 3 colores × 4 vistas = 12 imágenes
    INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_gris_costado.webp',   'Gris',  'true',  0),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_gris_frontal.webp',   'Gris',  'false', 1),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_gris_perfil.webp',    'Gris',  'false', 2),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_gris_posterior.webp', 'Gris',  'false', 3),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_negro_costado.webp',   'Negro',  'false', 4),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_negro_frontal.webp',   'Negro',  'false', 5),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_negro_perfil.webp',    'Negro',  'false', 6),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_negro_posterior.webp', 'Negro',  'false', 7),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_verde_costado.webp',   'Verde',  'false', 8),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_verde_frontal.webp',   'Verde',  'false', 9),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_verde_perfil.webp',    'Verde',  'false', 10),
        (gl4_id, IMAGE_BASE_URL || 'motos/gl4/gl4_verde_posterior.webp', 'Verde',  'false', 11);

    -- M3 ECO — 1 color × 4 vistas = 4 imágenes
    INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES
        (m3eco_id, IMAGE_BASE_URL || 'motos/m3eco/m3eco_gris_costado.webp',   'Gris', 'true',  0),
        (m3eco_id, IMAGE_BASE_URL || 'motos/m3eco/m3eco_gris_frontal.webp',   'Gris', 'false', 1),
        (m3eco_id, IMAGE_BASE_URL || 'motos/m3eco/m3eco_gris_perfil.webp',    'Gris', 'false', 2),
        (m3eco_id, IMAGE_BASE_URL || 'motos/m3eco/m3eco_gris_posterior.webp', 'Gris', 'false', 3);
END $$;