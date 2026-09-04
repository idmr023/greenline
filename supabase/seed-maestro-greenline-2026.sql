-- ============================================================
-- SEED MAESTRO CONSOLIDADO GREENLINE - 2026
-- FUENTES: schema.sql + seed(1).sql + migrate-campos-vacios-20082026.sql + migrate-imagenes-21082026.sql
-- Sin datos inventados. Se conserva el ultimo valor efectivo de cada migracion.
-- ============================================================
BEGIN;

DO $$
DECLARE
    IMAGE_BASE_URL TEXT := 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/';
BEGIN

TRUNCATE TABLE prod_color_rel, imagenes, ficha_tecnica, info_adicional, productos RESTART IDENTITY CASCADE;

INSERT INTO categorias (id, nombre) VALUES (1, 'VMP'), (2, 'Motos Eléctricas'), (3, 'Trimotos Eléctricas'), (4, 'Cargueros'), (5, 'Accesorios');

INSERT INTO categorias (nombre)
SELECT 'Cuatrimotos'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Cuatrimotos');

INSERT INTO colores (id, nombre, hex_code) VALUES('Blanco', '#FFFFFF'),
  ('Negro', '#1a1a1a'),
  ('Gris', '#808080'),
  ('Gris Oscuro', '#404040'),
  ('Rojo', '#DC2626'),
  ('Verde', '#009000'),
  ('Verde ligero', '#4ade80'),
  ('Verde Esmeralda', '#059669'),
  ('Verde Metálico', '#047857'),
  ('Celeste', '#38bdf8'),
  ('Azul', '#2563eb'),
  ('Crema', '#fef3c7'),
  ('Rosado', '#f472b6'),
  ('Plateado', '#9ca3af'),
  ('Marrón', '#92400e'),
  ('Naranja', '#f97316');

-- PRODUCTOS
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (1, 1, 'Bicicleta Eléctrica Plegable FL2', 'bicicleta-elctrica-plegable-fl2', E'Bicicleta eléctrica plegable TAILG FL2 con batería extraíble de litio y motor de alto rendimiento. Cuenta con velocidad asistida y diseño de marco de aluminio que cubre el sistema eléctrico. Diseño minimalista, plegable y fácil de guardar.\nIncluye sistema de cambios SHIMANO, pantalla LCD, luz faro LED y asiento para copiloto.', 2150, 2300, false, ARRAY['vmpLitio']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (2, 5, 'Casco Greenline BK800 Negro Demonio', 'casco-greenline-bk800-negro-demonio', 'Características :
Marca: Greenline
Modelo: BK800
Acabado: Brillante
Material: ABS
Tallas disponibles: S – M – L – XL – XXL', NULL, NULL, false, '{}'::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (3, 5, 'Casco Greenline infantil azul', 'casco-greenline-infantil-azul', 'Características :
Marca: Greenline
Acabado: Brillante
Material: ABS
Talla: para niños', 80.00, 60.00, false, '{}'::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (4, 5, 'Casco Greenline infantil rosa', 'casco-greenline-infantil-rosa', 'Características :
Marca: Greenline
Acabado: Brillante
Material: ABS
Talla: para niños', 80.00, 60.00, false, '{}'::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (5, 2, 'Greenline T6', 'greenline-t6', E'Moto Eléctrica T6: Redefine tu Viaje Urbano. Solución ideal para la movilidad moderna, combinando un diseño vanguardista y deportivo con cero emisiones. Chasis robusto y color vibrante.\nBatería extraíble de litio de alto rendimiento para carga inteligente en casa u oficina.', 3700, 4100, false, ARRAY['destacado', 'MotoElectricaLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (7, 2, 'GreenLine SR', 'greenline-sr', E'Moto Eléctrica Greenline SR. Combina potencia y tecnología para ofrecer una experiencia de conducción mejorada y segura. Sistema de autobloqueo sin llave, pantalla digital con NFC, modo parking y retroceso. Incluye maletera tipo top case para mayor practicidad.', 5600, 5000, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (8, 2, 'GreenLine MX6', 'greenline-mx6', E'Moto Eléctrica Greenline MX6. Diseño moderno y futurista. Cuenta con sistema de autobloqueo sin llave, frenos de disco, modo parking, retroceso y un parlante integrado con conexión Bluetooth para disfrutar de tu música favorita durante el viaje.', 5900, 5500, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (9, 3, 'Trimoto GreenLine TM9', 'trimoto-greenline-tm9', E'Trimoto GreenLine TM9 con techo, diseñada para ofrecerte protección, comodidad y practicidad. Alarma antirrobo, bloqueo de motor, frenos con sistema antideslizante, pantalla de retroceso, puerto USB, limpiaparabrisas y techo protector para cualquier clima.', 6000, 6500, false, ARRAY['destacado', 'TrimotoLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (10, 3, 'Trimoto GreenLine TM7 v2026', 'trimoto-greenline-tm7-v2026', E'Trimoto GreenLine TM7 V2026. Alarma eléctrica antirrobo, freno de pie con función antideslizante, luces direccionales, controles inalámbricos, porta celular con USB y amortiguadores para mayor confort en tus trayectos.', 5000, 4500, false, ARRAY['destacado', 'TrimotoLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (11, 2, 'GreenLine H3 Pro', 'greenline-h3-pro', E'Modelo GreenLine H3 Pro. Elegante diseño vintage moderno. Cuenta con posapié incorporado para copiloto, profunda guantera bajo el asiento, maletera adicional, luces intermitentes y bloqueo de timón y motor para máxima seguridad.', 3800, 3600, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (12, 2, 'GreenLine V9 Pro', 'greenline-v9-pro', E'GreenLine V9 PRO. Combinación perfecta entre tecnología, eficiencia y diseño moderno. Batería de alto rendimiento con tecnología de grafeno, motor eléctrico de respuesta ágil y diseño estilizado ideal para el ritmo urbano actual.', 4000, 3700, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (13, 2, 'GreenLine M3 Pro', 'greenline-m3-pro', E'Moto Eléctrica Greenline M3 Pro. Redefine tu experiencia de conducción combinando potencia y diseño seguro. Sistema de autobloqueo sin llave, pantalla digital avanzada, modo parking, retroceso y maletera de alta resistencia.', 5500, 5200, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (14, 3, 'Trimoto GreenLine TM6 PRO', 'trimoto-greenline-tm6-pro', E'GreenLine TM6 Pro: Trimoto eléctrica de paseo con sistema de 3 asientos transformables. Techo integrado, amplia canasta, función de parking temporal, sistema de freno de mano antideslizante, alarma antirrobo e iluminación completa con direccionales.', 4600, 4200, false, ARRAY['destacado', 'TrimotoLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (15, 1, 'Greenline Vmp S9', 'greenline-vmp-s9', E'GreenLine VMP S9: Vehículo de movilidad personal con diseño robusto inspirado en motocicletas. Faro LED dual, luces direccionales, asientos biplaza, canasta frontal de gran capacidad y sistema de seguridad avanzado con control inalámbrico.', 2600, 2300, false, ARRAY['destacado', 'vmpGraphene', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (16, 4, 'GreenLine TC2-180A', 'greenline-tc2-180a', E'Carguero Eléctrico GreenLine TC2-180A para carga pesada. Tolva de gran volumen con sistema basculante, chasis reforzado, llantas todoterreno, parabrisas acrílico aerodinámico, asiento acolchado ergonómico, faro principal LED y suspensión reforzada.', 7300, 8000, false, ARRAY['carguero-promocion', 'destacado', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (17, 1, 'Greenline VMP L3 Pro', 'greenline-vmp-l3-pro', E'GreenLine VMP L3 Pro. Bicimoto eléctrica con faro delantero LED tipo halo, luz de freno integrada, posapié delantero, amplia canasta frontal, potente bocina y sistema de control inalámbrico. Blindaje extra de batería no extraíble contra robos.', 3400, 2900, false, ARRAY['destacado', 'vmpGraphene', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (18, 4, 'GreenLine TC-BUS', 'greenline-tc-bus', E'Vehículo Eléctrico GreenLine TC-BUS para transporte urbano y comercial de pasajeros. Capacidad para 5 pasajeros en 3 filas de asientos, techo protector integral, limpiaparabrisas, faros dobles LED, función de retroceso y frenos de disco ventilado.', 7300, 6400, false, ARRAY['carguero-promocion', 'destacado', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (19, 4, 'Carguero GreenLine TC2-110A', 'carguero-greenline-tc2-110a', E'CARGUERO GREENLINE TC2-110A. Herramienta de trabajo robusta con sistema de transmisión optimizado para alto torque. Incluye asientos amplios, moderno sistema de audio Bluetooth, función de retroceso y doble sistema de frenado.', 7600, 7200, false, ARRAY['carguero-promocion', 'destacado', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (20, 2, 'GreenLine F4 Pro', 'greenline-f4-pro', E'GreenLine F4 Pro. Elegancia retro y eficiencia. Asiento de espuma de alta calidad, guantera de 32 litros bajo el asiento, gancho utilitario, puerto USB, sistema de autobloqueo sin llave y luces intermitentes de diseño vanguardista.', 4000, 3700, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (21, 2, 'GreenLine GL3', 'greenline-gl3', E'Greenline GL3. Llantas deportivas, sistema de freno CBS, pantalla digital intuitiva, modo parking, retroceso, sistema de bloqueo en la chapa y un innovador color azul que realza su estilo.', 5500, 5200, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
BEGIN;

-- M-CAR 1
INSERT INTO productos (
    id,
    categoria_id,
    nombre,
    slug,
    descripcion,
    precio_original,
    precio_actual,
    destacado,
    etiquetas
)
SELECT
    29,
    (SELECT id FROM categorias WHERE nombre = 'Trimotos Eléctricas'),
    'GreenLine M-CAR 1',
    'greenline-m-car-1',
    'Vehículo eléctrico GreenLine M-CAR 1, equipado con batería de plomo ácido de 48V20AH y motor eléctrico de 500W. Alcanza una velocidad máxima de 25 km/h y cuenta con transmisión automática, diferencial y marcha en retroceso para brindar mayor estabilidad y practicidad durante el desplazamiento. Sus llantas de 3.0-10 ofrecen un desplazamiento estable, convirtiéndolo en una alternativa funcional para la movilidad urbana. Cuenta con configuración para 1 asiento y 1 pasajero, soporta una carga máxima de 100 kg y registra un peso neto de 98 kg. Su autonomía estimada es de 28 a 38 km.',
    5500,
    5200,
    false,
    ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[]
WHERE NOT EXISTS (
    SELECT 1 FROM productos WHERE slug = 'greenline-m-car-1'
);


-- M-CAR 2
INSERT INTO productos (
    id,
    categoria_id,
    nombre,
    slug,
    descripcion,
    precio_original,
    precio_actual,
    destacado,
    etiquetas
)
SELECT
    30,
    (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'),
    'GreenLine M-CAR 2',
    'greenline-m-car-2',
    'El nuevo modelo de nuestro vehículo eléctrico M-CAR 2 está equipado con una batería de plomo-ácido de 48V20AH y un motor de 500W, alcanzando una velocidad máxima de 25 km/h. Pensado para brindar movilidad, estabilidad y seguridad, cuenta con transmisión automática, diferencial y marcha en retroceso. Sus llantas de 3.0-10 ofrecen un desplazamiento estable y cómodo, convirtiéndolo en una alternativa práctica para la movilidad urbana. Este modelo cuenta con configuración para 1 asiento y 1 pasajero, con una capacidad de carga máxima de 100 kg. Su peso neto es de 138 kg y su peso bruto vehicular alcanza los 238 kg, ofreciendo una estructura diseñada para brindar comodidad y funcionalidad en cada trayecto. Su autonomía estimada es de 28 a 38 km.',
    6600,
    6250,
    false,
    ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[]
WHERE NOT EXISTS (
    SELECT 1 FROM productos WHERE slug = 'greenline-m-car-2'
);


-- M-CAR 3
INSERT INTO productos (
    id,
    categoria_id,
    nombre,
    slug,
    descripcion,
    precio_original,
    precio_actual,
    destacado,
    etiquetas
)
SELECT
    31,
    (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'),
    'GreenLine M-CAR 3',
    'greenline-m-car-3',
    'Vehículo eléctrico GreenLine M-CAR 3 equipado con batería de plomo ácido de 48V20AH y motor eléctrico de 500W. Alcanza una velocidad máxima de 25 km/h y cuenta con transmisión automática, diferencial y marcha en retroceso. Su configuración de 2 asientos y 2 pasajeros permite disfrutar de mayor capacidad para los desplazamientos urbanos. Cuenta con llantas delanteras 90-70-10 y traseras 300-10, una capacidad de carga máxima de 100 kg, peso neto de 123 kg y peso bruto vehicular de 223 kg. Su autonomía es de 25 a 35 km.',
    6450,
    5900,
    false,
    ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[]
WHERE NOT EXISTS (
    SELECT 1 FROM productos WHERE slug = 'greenline-m-car-3'
);


-- M-CAR 4
INSERT INTO productos (
    id,
    categoria_id,
    nombre,
    slug,
    descripcion,
    precio_original,
    precio_actual,
    destacado,
    etiquetas
)
SELECT
    32,
    (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'),
    'GreenLine M-CAR 4',
    'greenline-m-car-4',
    'Cuatrimoto eléctrica de paseo GreenLine M-CAR 4, equipada con batería de plomo ácido de 48V20AH y motor eléctrico de 500W. Cuenta con un asiento cómodo para 1 pasajero, transmisión automática, diferencial para mayor estabilidad, sistema de freno, luces y direccionales, además de función de retroceso. Su diseño compacto y funcional la convierte en una alternativa práctica para la movilidad en ciudad. Alcanza una velocidad máxima de 15 km/h, soporta una carga máxima de 100 kg y registra un peso neto de 115 kg. Su autonomía es de 30 a 40 km.',
    6700,
    6250,
    false,
    ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[]
WHERE NOT EXISTS (
    SELECT 1 FROM productos WHERE slug = 'greenline-m-car-4'
);


-- M-CAR 5
INSERT INTO productos (
    id,
    categoria_id,
    nombre,
    slug,
    descripcion,
    precio_original,
    precio_actual,
    destacado,
    etiquetas
)
SELECT
    33,
    (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'),
    'GreenLine M-CAR 5',
    'greenline-m-car-5',
    'Vehículo eléctrico GreenLine M-CAR 5 equipado con batería de plomo ácido de 60V20AH y motor eléctrico de 1000W. Cuenta con transmisión automática, diferencial y marcha en retroceso. Su configuración está diseñada para 1 asiento y 1 pasajero, con una capacidad de carga máxima de 100 kg. Registra un peso neto de 140 kg y un peso bruto vehicular de 240 kg. Sus llantas de 16*8-7 brindan estabilidad durante el desplazamiento y alcanza una velocidad máxima de 25 km/h. Su autonomía es de 30 a 40 km.',
    9500,
    9000,
    false,
    ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[]
WHERE NOT EXISTS (
    SELECT 1 FROM productos WHERE slug = 'greenline-m-car-5'
);


-- ============================================================
-- 2. ACTUALIZAR PRODUCTOS EXISTENTES
--    Esto garantiza que si ya estaban creados,
--    queden exactamente con los datos actuales.
-- ============================================================

UPDATE productos
SET
    nombre = 'GreenLine M-CAR 1',
    categoria_id = (SELECT id FROM categorias WHERE nombre = 'Trimotos Eléctricas'),
    descripcion = 'Vehículo eléctrico GreenLine M-CAR 1, equipado con batería de plomo ácido de 48V20AH y motor eléctrico de 500W. Alcanza una velocidad máxima de 25 km/h y cuenta con transmisión automática, diferencial y marcha en retroceso para brindar mayor estabilidad y practicidad durante el desplazamiento. Sus llantas de 3.0-10 ofrecen un desplazamiento estable, convirtiéndolo en una alternativa funcional para la movilidad urbana. Cuenta con configuración para 1 asiento y 1 pasajero, soporta una carga máxima de 100 kg y registra un peso neto de 98 kg. Su autonomía estimada es de 28 a 38 km.',
    precio_original = 5500,
    precio_actual = 5200,
    etiquetas = ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[]
WHERE slug = 'greenline-m-car-1';


UPDATE productos
SET
    nombre = 'GreenLine M-CAR 2',
    categoria_id = (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'),
    descripcion = 'El nuevo modelo de nuestro vehículo eléctrico M-CAR 2 está equipado con una batería de plomo-ácido de 48V20AH y un motor de 500W, alcanzando una velocidad máxima de 25 km/h. Pensado para brindar movilidad, estabilidad y seguridad, cuenta con transmisión automática, diferencial y marcha en retroceso. Sus llantas de 3.0-10 ofrecen un desplazamiento estable y cómodo, convirtiéndolo en una alternativa práctica para la movilidad urbana. Este modelo cuenta con configuración para 1 asiento y 1 pasajero, con una capacidad de carga máxima de 100 kg. Su peso neto es de 138 kg y su peso bruto vehicular alcanza los 238 kg, ofreciendo una estructura diseñada para brindar comodidad y funcionalidad en cada trayecto. Su autonomía estimada es de 28 a 38 km.',
    precio_original = 6600,
    precio_actual = 6250,
    etiquetas = ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[]
WHERE slug = 'greenline-m-car-2';


UPDATE productos
SET
    nombre = 'GreenLine M-CAR 3',
    categoria_id = (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'),
    descripcion = 'Vehículo eléctrico GreenLine M-CAR 3 equipado con batería de plomo ácido de 48V20AH y motor eléctrico de 500W. Alcanza una velocidad máxima de 25 km/h y cuenta con transmisión automática, diferencial y marcha en retroceso. Su configuración de 2 asientos y 2 pasajeros permite disfrutar de mayor capacidad para los desplazamientos urbanos. Cuenta con llantas delanteras 90-70-10 y traseras 300-10, una capacidad de carga máxima de 100 kg, peso neto de 123 kg y peso bruto vehicular de 223 kg. Su autonomía es de 25 a 35 km.',
    precio_original = 6450,
    precio_actual = 5900,
    etiquetas = ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[]
WHERE slug = 'greenline-m-car-3';


UPDATE productos
SET
    nombre = 'GreenLine M-CAR 4',
    categoria_id = (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'),
    descripcion = 'Cuatrimoto eléctrica de paseo GreenLine M-CAR 4, equipada con batería de plomo ácido de 48V20AH y motor eléctrico de 500W. Cuenta con un asiento cómodo para 1 pasajero, transmisión automática, diferencial para mayor estabilidad, sistema de freno, luces y direccionales, además de función de retroceso. Su diseño compacto y funcional la convierte en una alternativa práctica para la movilidad en ciudad. Alcanza una velocidad máxima de 15 km/h, soporta una carga máxima de 100 kg y registra un peso neto de 115 kg. Su autonomía es de 30 a 40 km.',
    precio_original = 6700,
    precio_actual = 6250,
    etiquetas = ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[]
WHERE slug = 'greenline-m-car-4';


UPDATE productos
SET
    nombre = 'GreenLine M-CAR 5',
    categoria_id = (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'),
    descripcion = 'Vehículo eléctrico GreenLine M-CAR 5 equipado con batería de plomo ácido de 60V20AH y motor eléctrico de 1000W. Cuenta con transmisión automática, diferencial y marcha en retroceso. Su configuración está diseñada para 1 asiento y 1 pasajero, con una capacidad de carga máxima de 100 kg. Registra un peso neto de 140 kg y un peso bruto vehicular de 240 kg. Sus llantas de 16*8-7 brindan estabilidad durante el desplazamiento y alcanza una velocidad máxima de 25 km/h. Su autonomía es de 30 a 40 km.',
    precio_original = 9500,
    precio_actual = 9000,
    etiquetas = ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[]
WHERE slug = 'greenline-m-car-5';


-- ============================================================
-- 3. FICHAS TÉCNICAS
-- ============================================================
-- Eliminamos las fichas anteriores de estos modelos para
-- evitar duplicados y luego las reconstruimos.
-- ============================================================

DELETE FROM ficha_tecnica
WHERE producto_id IN (
    SELECT id
    FROM productos
    WHERE slug IN (
        'greenline-m-car-1',
        'greenline-m-car-2',
        'greenline-m-car-3',
        'greenline-m-car-4',
        'greenline-m-car-5'
    )
);


-- M-CAR 1
INSERT INTO ficha_tecnica (
    producto_id,
    potencia_motor,
    potencia_bateria,
    tipo_bateria,
    velocidad_max_kmh,
    autonomia_km,
    carga_maxima_kg,
    largo_cm,
    ancho_cm,
    alto_cm
)
SELECT
    id,
    '500W',
    '48V20AH',
    'Plomo Ácido',
    25,
    33,
    100,
    156,
    70,
    110
FROM productos
WHERE slug = 'greenline-m-car-1';


-- M-CAR 2
INSERT INTO ficha_tecnica (
    producto_id,
    potencia_motor,
    potencia_bateria,
    tipo_bateria,
    velocidad_max_kmh,
    autonomia_km,
    carga_maxima_kg,
    largo_cm,
    ancho_cm,
    alto_cm
)
SELECT
    id,
    '500W',
    '48V20AH',
    'Plomo Ácido',
    25,
    33,
    100,
    159,
    70,
    107
FROM productos
WHERE slug = 'greenline-m-car-2';


-- M-CAR 3
INSERT INTO ficha_tecnica (
    producto_id,
    potencia_motor,
    potencia_bateria,
    tipo_bateria,
    velocidad_max_kmh,
    autonomia_km,
    carga_maxima_kg,
    largo_cm,
    ancho_cm,
    alto_cm
)
SELECT
    id,
    '500W',
    '48V20AH',
    'Plomo Ácido',
    25,
    30,
    100,
    165,
    73,
    110
FROM productos
WHERE slug = 'greenline-m-car-3';


-- M-CAR 4
INSERT INTO ficha_tecnica (
    producto_id,
    potencia_motor,
    potencia_bateria,
    tipo_bateria,
    velocidad_max_kmh,
    autonomia_km,
    carga_maxima_kg,
    largo_cm,
    ancho_cm,
    alto_cm
)
SELECT
    id,
    '500W',
    '48V20AH',
    'Plomo Ácido',
    15,
    35,
    100,
    130,
    68,
    100
FROM productos
WHERE slug = 'greenline-m-car-4';


-- M-CAR 5
INSERT INTO ficha_tecnica (
    producto_id,
    potencia_motor,
    potencia_bateria,
    tipo_bateria,
    velocidad_max_kmh,
    autonomia_km,
    carga_maxima_kg,
    largo_cm,
    ancho_cm,
    alto_cm
)
SELECT
    id,
    '1000W',
    '60V20AH',
    'Plomo Ácido',
    25,
    35,
    100,
    159,
    81,
    110
FROM productos
WHERE slug = 'greenline-m-car-5';


-- ============================================================
-- 4. INFORMACIÓN ADICIONAL
-- ============================================================

DELETE FROM info_adicional
WHERE producto_id IN (
    SELECT id
    FROM productos
    WHERE slug IN (
        'greenline-m-car-1',
        'greenline-m-car-2',
        'greenline-m-car-3',
        'greenline-m-car-4',
        'greenline-m-car-5'
    )
);


-- M-CAR 1
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Tipo de transmisión": "Automática",
        "Diferencial": "Sí",
        "Marcha en retroceso": "Sí",
        "Asientos / Pasajeros": "1 Asiento / 1 Pasajero",
        "Tipo de uso": "De ciudad",
        "Número de ruedas": "4",
        "Llanta delantera/trasera": "3.0-10 / 3.0-10",
        "Largo*ancho*altura (cm)": "156 * 70 * 110",
        "Peso neto (kg)": "98 kg",
        "Peso soportado (kg)": "100 kg",
        "Velocidad máxima": "25 km/h",
        "Autonomía": "28 - 38 km"
    }'::jsonb
FROM productos
WHERE slug = 'greenline-m-car-1';


-- M-CAR 2
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Tipo de transmisión": "Automática",
        "Diferencial": "Sí",
        "Marcha en retroceso": "Sí",
        "Asientos / Pasajeros": "1 Asiento / 1 Pasajero",
        "Tipo de uso": "De ciudad",
        "Número de ruedas": "4",
        "Llanta delantera/trasera": "3.0-10 / 3.0-10",
        "Largo*ancho*altura (cm)": "159 * 70 * 107",
        "Peso neto (kg)": "138 kg",
        "Peso bruto vehicular (kg)": "238 kg",
        "Peso soportado (kg)": "100 kg",
        "Velocidad máxima": "25 km/h",
        "Autonomía": "28 - 38 km"
    }'::jsonb
FROM productos
WHERE slug = 'greenline-m-car-2';


-- M-CAR 3
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Tipo de transmisión": "Automática",
        "Diferencial": "Sí",
        "Marcha en retroceso": "Sí",
        "Asientos / Pasajeros": "2 Asientos / 2 Pasajeros",
        "Tipo de uso": "De ciudad",
        "Número de ruedas": "4",
        "Llanta delantera/trasera": "90-70-10 / 300-10",
        "Largo*ancho*altura (cm)": "165 * 73 * 110",
        "Peso neto (kg)": "123 kg",
        "Peso bruto vehicular (kg)": "223 kg",
        "Peso soportado (kg)": "100 kg",
        "Velocidad máxima": "25 km/h",
        "Autonomía": "25 - 35 km"
    }'::jsonb
FROM productos
WHERE slug = 'greenline-m-car-3';


-- M-CAR 4
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Tipo de transmisión": "Automática",
        "Diferencial": "Sí",
        "Marcha en retroceso": "Sí",
        "Asientos / Pasajeros": "1 Asiento / 1 Pasajero",
        "Tipo de uso": "De ciudad",
        "Número de ruedas": "4",
        "Llanta delantera/trasera": "13*5-6 / 13*5-6",
        "Largo*ancho*altura (cm)": "130 * 68 * 100",
        "Peso neto (kg)": "115 kg",
        "Peso bruto vehicular (kg)": "215 kg",
        "Peso soportado (kg)": "100 kg",
        "Velocidad máxima": "15 km/h",
        "Autonomía": "30 - 40 km",
        "Sistema de freno": "Sí",
        "Luces": "Sí",
        "Direccionales": "Sí"
    }'::jsonb
FROM productos
WHERE slug = 'greenline-m-car-4';


-- M-CAR 5
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Tipo de transmisión": "Automática",
        "Diferencial": "Sí",
        "Marcha en retroceso": "Sí",
        "Asientos / Pasajeros": "1 Asiento / 1 Pasajero",
        "Tipo de uso": "De ciudad",
        "Número de ruedas": "4",
        "Llanta delantera/trasera": "16*8-7 / 16*8-7",
        "Largo*ancho*altura (cm)": "159 * 81 * 110",
        "Peso neto (kg)": "140 kg",
        "Peso bruto vehicular (kg)": "240 kg",
        "Peso soportado (kg)": "100 kg",
        "Velocidad máxima": "25 km/h",
        "Autonomía": "30 - 40 km"
    }'::jsonb
FROM productos
WHERE slug = 'greenline-m-car-5';


-- ============================================================
-- 5. IMÁGENES M-CAR
--    Fuente local: public/assets/imagenes/productos/cuatrimotros/
--    El script sincronizar-imagenes-greenline.mjs sube cada archivo
--    a Storage como .webp, por lo que las URLs apuntan a .webp.
--    Se referencian por slug para no depender del id asignado.
-- ============================================================

-- M-CAR 1 (m-car-1/)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_negro_costado.webp', 'Negro', 'true', 0
FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_negro_frontal.webp', 'Negro', 'false', 1
FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_negro_perfil.webp', 'Negro', 'false', 2
FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_negro_posterior.webp', 'Negro', 'false', 3
FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_rojo_costado.webp', 'Rojo', 'false', 4
FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_rojo_frontal.webp', 'Rojo', 'false', 5
FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_rojo_perfil.webp', 'Rojo', 'false', 6
FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_rojo_posterior.webp', 'Rojo', 'false', 7
FROM productos WHERE slug = 'greenline-m-car-1';

-- M-CAR 2 (m-car-2/)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_negro_costado.webp', 'Negro', 'true', 0
FROM productos WHERE slug = 'greenline-m-car-2';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_negro_frontal.webp', 'Negro', 'false', 1
FROM productos WHERE slug = 'greenline-m-car-2';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_negro_perfil.webp', 'Negro', 'false', 2
FROM productos WHERE slug = 'greenline-m-car-2';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_rojo_costado.webp', 'Rojo', 'false', 3
FROM productos WHERE slug = 'greenline-m-car-2';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_rojo_frontal.webp', 'Rojo', 'false', 4
FROM productos WHERE slug = 'greenline-m-car-2';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_rojo_perfil.webp', 'Rojo', 'false', 5
FROM productos WHERE slug = 'greenline-m-car-2';

-- M-CAR 3 (m_car_3/)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_negro_frontal.webp', 'Negro', 'true', 0
FROM productos WHERE slug = 'greenline-m-car-3';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_negro_perfil.webp', 'Negro', 'false', 1
FROM productos WHERE slug = 'greenline-m-car-3';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_negro_posterior.webp', 'Negro', 'false', 2
FROM productos WHERE slug = 'greenline-m-car-3';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_rojo_frontal.webp', 'Rojo', 'false', 3
FROM productos WHERE slug = 'greenline-m-car-3';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_rojo_perfil.webp', 'Rojo', 'false', 4
FROM productos WHERE slug = 'greenline-m-car-3';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_rojo_posterior.webp', 'Rojo', 'false', 5
FROM productos WHERE slug = 'greenline-m-car-3';

-- M-CAR 4 (m-car-4/)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_azul_costado.webp', 'Azul', 'true', 0
FROM productos WHERE slug = 'greenline-m-car-4';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_azul_frontal.webp', 'Azul', 'false', 1
FROM productos WHERE slug = 'greenline-m-car-4';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_azul_lateral.webp', 'Azul', 'false', 2
FROM productos WHERE slug = 'greenline-m-car-4';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_negro_costado.webp', 'Negro', 'false', 3
FROM productos WHERE slug = 'greenline-m-car-4';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_negro_frontal.webp', 'Negro', 'false', 4
FROM productos WHERE slug = 'greenline-m-car-4';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_negro_lateral.webp', 'Negro', 'false', 5
FROM productos WHERE slug = 'greenline-m-car-4';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_rojo_costado.webp', 'Rojo', 'false', 6
FROM productos WHERE slug = 'greenline-m-car-4';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_rojo_frontal.webp', 'Rojo', 'false', 7
FROM productos WHERE slug = 'greenline-m-car-4';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_rojo_lateral.webp', 'Rojo', 'false', 8
FROM productos WHERE slug = 'greenline-m-car-4';

-- M-CAR 5 (m_car_5/)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_5/mcar5_rojo_costado.webp', 'Rojo', 'true', 0
FROM productos WHERE slug = 'greenline-m-car-5';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_5/mcar5_rojo_perfil.webp', 'Rojo', 'false', 1
FROM productos WHERE slug = 'greenline-m-car-5';


-- ============================================================
-- 6. VALIDACIÓN FINAL
-- ============================================================

SELECT
    p.id,
    p.nombre,
    p.precio_original,
    p.precio_actual,
    ft.potencia_motor,
    ft.potencia_bateria,
    ft.tipo_bateria,
    ft.velocidad_max_kmh,
    ft.autonomia_km,
    ft.carga_maxima_kg,
    ft.largo_cm,
    ft.ancho_cm,
    ft.alto_cm
FROM productos p
LEFT JOIN ficha_tecnica ft
    ON ft.producto_id = p.id
WHERE p.slug IN (
    'greenline-m-car-1',
    'greenline-m-car-2',
    'greenline-m-car-3',
    'greenline-m-car-4',
    'greenline-m-car-5'
)
ORDER BY p.id;


COMMIT;


--Productos faltantes

-- ============================================================
-- PRODUCTOS NUEVOS - GREENLINE 2026
-- ============================================================

INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (22, 1, 'GreenLine VMP P01', 'greenline-vmp-p01', E'El GreenLine VMP P01 es un vehículo de movilidad personal tipo bicimoto, equipado con batería de plomo ácido de 48V20AH y motor de 500W. Alcanza una velocidad máxima de 22±3 km/h y ofrece una autonomía de 30 a 40 km. Cuenta con faro LED tipo halo, luces direccionales, posapié delantero, canasta frontal, bocina, control inalámbrico y dos llaves de seguridad.', 1900, 1849, false, ARRAY['vmpPlomo', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (23, 1, 'GreenLine VMP S6 Pro', 'greenline-vmp-s6-pro', E'Vehículo de movilidad personal tipo bicimoto con batería extraíble de Litio de 48V12AH y motor de 350W. Alcanza una velocidad máxima de 22±3 km/h y ofrece una autonomía de 35 a 45 km. Incluye velocidad crucero, función de parking temporal, luces direccionales, faro LED tipo halo, canasta frontal, bocina y control inalámbrico.', 2500, 2100, false, ARRAY['vmpLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (24, 1, 'GreenLine VMP S4 Pro', 'greenline-vmp-s4-pro', E'El GreenLine VMP S4 Pro combina diseño clásico y movilidad urbana con motor de 500W y batería de plomo ácido de 60V20AH. Alcanza una velocidad máxima de 22±3 km/h y una autonomía de 40 a 50 km actualmente bajo revisión. Cuenta con sistema NFC, faro LED, luces direccionales, configuración biplaza, canasta frontal y sistema de alarma.', 2600, 2300, false, ARRAY['vmpPlomo', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (25, 1, 'GreenLine VMP T4', 'greenline-vmp-t4', E'Vehículo de movilidad personal tipo bicimoto equipado con batería extraíble Litio de 48V24AH y motor de 650W. Alcanza una velocidad de 22±3 km/h y ofrece una autonomía de 60 a 70 km. Cuenta con alarma eléctrica, luces direccionales, luz de freno, función de estacionamiento temporal, puerto USB, guantera, doble asiento, maletera, bocina y control inalámbrico.', 4100, 3600, false, ARRAY['vmpLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (26, 2, 'GreenLine Y5', 'greenline-y5', E'Moto eléctrica GreenLine Y5 con motor de 1200W y batería de plomo ácido con grafeno de 72V23AH. Alcanza una velocidad máxima de 50 km/h y una autonomía de 55 a 65 km. Cuenta con frenos de disco, autobloqueo sin llave, pantalla digital, guantera de 30 litros, puerto USB y diseño retro disponible en varios colores.', 4200, 3700, false, ARRAY['MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (27, 4, 'GreenLine TC2-160A', 'greenline-tc2-160a', E'Carguero eléctrico GreenLine TC2-160A con batería de plomo de 60V45AH y motor de 1500W. Cuenta con sistema de transmisión para alto torque, chasis reforzado, función de retroceso, freno de pie y de mano, tres velocidades y capacidad de carga de 400 a 500 kg. Incluye luces direccionales y reproductor de música.', 7300, 6400, false, ARRAY['carguero-promocion', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (28, 4, 'GreenLine TC2-160 con Techo', 'greenline-tc2-160-con-techo', E'Carguero eléctrico GreenLine TC2-160 con techo, equipado con batería de plomo de 60V45AH y motor de 1200W. Cuenta con chasis reforzado, sistema de transmisión para alto torque, función de retroceso, freno de pie y de mano, tres velocidades, techo protector y capacidad de carga de 500 a 800 kg.', 7600, 7200, false, ARRAY['carguero-promocion', 'promocion']::TEXT[]);

INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (22, IMAGE_BASE_URL || 'vmp/P01/p01_blanco.webp', 'Blanco', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (22, IMAGE_BASE_URL || 'vmp/P01/p01_negro.webp', 'Negro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (22, IMAGE_BASE_URL || 'vmp/P01/p01_verde.webp', 'Verde', 'false', 2);

INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (23, IMAGE_BASE_URL || 'vmp/S6_Pro/s6-pro-verde.webp', 'Verde', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (23, IMAGE_BASE_URL || 'vmp/S6_Pro/s6-pro-gris.webp', 'Gris', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (23, IMAGE_BASE_URL || 'vmp/S6_Pro/s6-pro-negro.webp', 'Negro', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (23, IMAGE_BASE_URL || 'vmp/S6_Pro/s6-pro-celeste.webp', 'Celeste', 'false', 3);

-- Producto 25 - VMP T4 (fuente local: public/assets/imagenes/productos/vmp/T4, convertida a .webp en Storage)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_crema_costado.webp', 'Crema', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_crema_perfil.webp', 'Crema', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_crema_posterior.webp', 'Crema', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_gris_costado.webp', 'Gris', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_gris_perfil.webp', 'Gris', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_gris_posterior.webp', 'Gris', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_marron_costado.webp', 'Marrón', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_marron_perfil.webp', 'Marrón', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_marron_posterior.webp', 'Marrón', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_negro_costado.webp', 'Negro', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_negro_perfil.webp', 'Negro', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_negro_posterior.webp', 'Negro', 'false', 11);

-- Producto 26 - GreenLine Y5 (fuente local: public/assets/imagenes/productos/motos/Y5)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_gris_costado.webp', 'Gris', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_gris_frontal.webp', 'Gris', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_gris_perfil.webp', 'Gris', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_gris_posterior.webp', 'Gris', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_negro_costado.webp', 'Negro', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_negro_frontal.webp', 'Negro', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_negro_perfil.webp', 'Negro', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_negro_posterior.webp', 'Negro', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_rojo_costado.webp', 'Rojo', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_rojo_frontal.webp', 'Rojo', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_rojo_perfil.webp', 'Rojo', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/y5_rojo_posterior.webp', 'Rojo', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (26, IMAGE_BASE_URL || 'motos/Y5/Y5-PLATEADO.webp', 'Plateado', 'false', 12);

-- Producto 27 - TC2-160A (fuente local: public/assets/imagenes/productos/cargueros/tc2_160a)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (27, IMAGE_BASE_URL || 'cargueros/tc2_160a/tc2_160a_azul_costado.webp', 'Azul', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (27, IMAGE_BASE_URL || 'cargueros/tc2_160a/tc2_160a_azul_perfil.jpg', 'Azul', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (27, IMAGE_BASE_URL || 'cargueros/tc2_160a/tc2_160a_rojo_costado.webp', 'Rojo', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (27, IMAGE_BASE_URL || 'cargueros/tc2_160a/tc2_160a_rojo_perfil.jpg', 'Rojo', 'false', 3);

-- Producto 28 - TC2-160 con Techo (fuente local: public/assets/imagenes/productos/cargueros/tc2_160_techo)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (28, IMAGE_BASE_URL || 'cargueros/tc2_160_techo/tc2160_azul_costado.webp', 'Azul', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (28, IMAGE_BASE_URL || 'cargueros/tc2_160_techo/tc2160_azul_frontal.webp', 'Azul', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (28, IMAGE_BASE_URL || 'cargueros/tc2_160_techo/tc2160_azul_perfil.webp', 'Azul', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (28, IMAGE_BASE_URL || 'cargueros/tc2_160_techo/tc2160_azul_posterior.webp', 'Azul', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (28, IMAGE_BASE_URL || 'cargueros/tc2_160_techo/tc2160_rojo_costado.webp', 'Rojo', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (28, IMAGE_BASE_URL || 'cargueros/tc2_160_techo/tc2160_rojo_frontal.webp', 'Rojo', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (28, IMAGE_BASE_URL || 'cargueros/tc2_160_techo/tc2160_rojo_perfil.webp', 'Rojo', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (28, IMAGE_BASE_URL || 'cargueros/tc2_160_techo/tc2160_rojo_posterior.webp', 'Rojo', 'false', 7);


-- IMAGENES CONSOLIDADAS
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (1, IMAGE_BASE_URL || 'bicicletas_electricas/fl2/fl2_negro_costado.webp', 'Negro', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (1, IMAGE_BASE_URL || 'bicicletas_electricas/fl2/fl2_blanco_costado.webp', 'Blanco', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (1, IMAGE_BASE_URL || 'bicicletas_electricas/fl2/fl2_rojo_costado.webp', 'Rojo', 'false', 2);
-- INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (2, 'https://glperu.com/wp-content/uploads/2023/07/CASCO-BK800-1-GREENLINE.png', NULL, 'true', 0);
-- INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (3, 'https://glperu.com/wp-content/uploads/2023/07/CASCO-GREENLINE-NINOS-AZUL.png', NULL, 'true', 0);
-- INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (4, 'https://glperu.com/wp-content/uploads/2023/07/CASCO-GREENLINE-NINOS-ROSA.png', NULL, 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_negro_costado.webp', 'Negro', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/sr/sr_blanca_costado.webp', 'Blanca', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/mx6/mx6_negra_costado.webp', 'Negra', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_negro_frontal.webp', 'Negro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/sr/sr_blanca_frontal.webp', 'Blanca', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/mx6/mx6_negro_frontal.webp', 'Negra', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_negro_perfil.webp', 'Negro', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_blanco_costado.webp', 'Blanco', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_blanco_frontal.webp', 'Blanco', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_blanco_perfil.webp', 'Blanco', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_gris_costado.webp', 'Gris', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_gris_frontal.webp', 'Gris', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_gris_perfil.webp', 'Gris', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_verde_costado.webp', 'Verde', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_verde_frontal.webp', 'Verde', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, IMAGE_BASE_URL || 'motos/t6/t6_verde_perfil.webp', 'Verde', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_rosado_costado.webp', 'Rosado', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_negro_costado.webp', 'Negro', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/m3pro/M3-PRO-CREMA.webp', 'Crema', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'cargueros/tm6_pro/tm6_pro_crema_costado.webp', 'Crema', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_rosado_frontal.webp', 'Rosado', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_negro_frontal.webp', 'Negro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/m3pro/M3-PRO-GRIS-CLARO.webp', 'Gris Claro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_rosado_poterior.webp', 'Rosado', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_negro_posterior.webp', 'Negro', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/sr/sr_blanca_posterior.webp', 'Blanca', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_rosado_perfil.webp', 'Rosado', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/sr/sr_blanca_perfil.webp', 'Blanca', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_negro_costado.webp', 'Negro', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/sr/sr_negro_costado.webp', 'Negra', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/sr/sr_negro_frontal.webp', 'Negra', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/sr/sr_negro_posterior.webp', 'Negra', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/sr/sr_negro_perfil.webp', 'Negra', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/sr/sr_gris_costado.webp', 'Gris', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/sr/sr_gris_posterior.webp', 'Gris', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, IMAGE_BASE_URL || 'motos/sr/sr_gris_perfil.webp', 'Gris', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/S9/vmp_s9_blanco.webp', 'Blanco', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'cargueros/tc2_180a/TC2-180-AZUL-INCLINADO.webp', 'Azul', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/L3-NEGRO.webp', 'Negro', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'cargueros/tc_bus/tc_bus_azul.webp', 'Azul', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_naranja_costado.webp', 'Naranja', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'cargueros/tm6_pro/tm6_pro_crema_frontal.webp', 'Crema', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/S9/vmp_s9_gris.webp', 'Gris', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/L3-FRENTE-NEGRO.webp', 'Negro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/L3-POSTERIOR-NEGRO.webp', 'Negro', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_negro_posterior.webp', 'Negra', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/L3-CELESTE.webp', 'Celeste', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_negro_perfil.webp', 'Negra', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/L3-FRENTE-CELESTE-scaled.webp', 'Celeste', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_blanca_costado.webp', 'Blanca', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/L3-POSTERIOR-CELESTE.webp', 'Celeste', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_blanca_frontal.webp', 'Blanca', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_blanca_posterior.webp', 'Blanca', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_blanca_perfil.webp', 'Blanca', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_gris_costado.webp', 'Gris', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_gris_frontal.webp', 'Gris', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_gris_posterior.webp', 'Gris', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_gris_perfil.webp', 'Gris', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_azul_costado.webp', 'Azul', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'motos/gl3/gl3_negro_costado.webp', 'Negro', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_azul_frontal.webp', 'Azul', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'motos/gl3/gl3_negro_frontal.webp', 'Negro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_azul_posterior.webp', 'Azul', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_blanco_frontal.webp', 'Blanco', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_azul_perfil.webp', 'Azul', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_blanco_posterior.webp', 'Blanco', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_blanco_posterior_der.webp', 'Blanco', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_blanco_perfil.webp', 'Blanco', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_costado_der.webp', 'Crema', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_costado_izq.webp', 'Crema', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_frontal.webp', 'Crema', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_posterior.webp', 'Crema', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_posterior_der.webp', 'Crema', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_perfil.webp', 'Crema', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_morada_frontal.webp', 'Morada', 'false', 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_morado_costado_der.webp', 'Morada', 'false', 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_morado_costado_izq.webp', 'Morada', 'false', 14);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_morado_posterior.webp', 'Morada', 'false', 15);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_morado_posterior_der.webp', 'Morada', 'false', 16);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_morado_perfil.webp', 'Morada', 'false', 17);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, IMAGE_BASE_URL || 'trimotos/tm7_2026/tmt7_gris_costado.webp', 'Gris', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, IMAGE_BASE_URL || 'trimotos/tm7_2026/tmt7_gris_frontal.webp', 'Gris', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, IMAGE_BASE_URL || 'trimotos/tm7_2026/tmt7_gris_perfil.webp', 'Gris', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, IMAGE_BASE_URL || 'trimotos/tm7_2026/tmt7_crema_costado.webp', 'Crema', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, IMAGE_BASE_URL || 'trimotos/tm7_2026/tmt7_crema_frontal.webp', 'Crema', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, IMAGE_BASE_URL || 'trimotos/tm7_2026/tmt7_crema_perfil.webp', 'Crema', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_rosado_costado.webp', 'Rosado', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_rosado_frontal.webp', 'Rosado', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_rosado_poterior.webp', 'Rosado', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_rosado_perfil.webp', 'Rosado', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_negro_costado.webp', 'Negro', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_negro_frontal.webp', 'Negro', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_negro_frontal.webp', 'Negro', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_negro_posterior.webp', 'Negro', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_negro_posterior.webp', 'Negro', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_negro_perfil.webp', 'Negro', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_negro_perfil.webp', 'Negro', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_blanco_costado.webp', 'Blanco', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_blanco_costado.webp', 'Blanco', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_blanco_frontal.webp', 'Blanco', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_blanco_frontal.webp', 'Blanco', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_blanco_posterior.webp', 'Blanco', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_blanco_posterior.webp', 'Blanco', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_blanco_perfil.webp', 'Blanco', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_blanco_perfil.webp', 'Blanco', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_verde_costado.webp', 'Verde', 'false', 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_verde_costado.webp', 'Verde', 'false', 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_verde_perfil.webp', 'Verde', 'false', 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_verde_perfil.webp', 'Verde', 'false', 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3%20pro/h3_pro_verde_posterior.webp', 'Verde', 'false', 14);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_verde_posterior.webp', 'Verde', 'false', 14);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_negro_perfil.webp', 'Negro', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_blanco_costado.webp', 'Blanco', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_blanco_frontal.webp', 'Blanco', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_blanco_posterior.webp', 'Blanco', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_blanco_perfil.webp', 'Blanco', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_gris_costado.webp', 'Gris', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_gris_frontal.webp', 'Gris', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_gris_posterior.webp', 'Gris', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_gris_perfil.webp', 'Gris', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_verde_costado.webp', 'Verde', 'false', 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_verde_frontal.webp', 'Verde', 'false', 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_verde_posterior.webp', 'Verde', 'false', 14);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, IMAGE_BASE_URL || 'motos/v9_pro/v9_pro_verde_perfil.webp', 'Verde', 'false', 15);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, IMAGE_BASE_URL || 'motos/m3pro/M3-PRO-GRIS-OSCURO.webp', 'Gris Oscuro', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, IMAGE_BASE_URL || 'motos/m3pro/M3-PRO-FRONTAL.webp', 'Crema', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, IMAGE_BASE_URL || 'motos/m3pro/M3-PRO-POSTERIOR.webp', 'Crema', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, IMAGE_BASE_URL || 'motos/m3pro/M3-PRO-PERFIL-DERECHO.webp', 'Crema', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, IMAGE_BASE_URL || 'motos/m3pro/M3-PRO-PERFIL-IZQUIERDO.webp', 'Crema', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, IMAGE_BASE_URL || 'cargueros/tm6_pro/tm6_pro_crema_posterior.webp', 'Crema', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, IMAGE_BASE_URL || 'cargueros/tm6_pro/tm6_pro_crema_perfil.webp', 'Crema', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, IMAGE_BASE_URL || 'cargueros/tm6_pro/tm6_pro_rojo_costado.webp', 'Rojo', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, IMAGE_BASE_URL || 'cargueros/tm6_pro/tm6_pro_rojo_frontal.webp', 'Rojo', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, IMAGE_BASE_URL || 'cargueros/tm6_pro/tm6_pro_rojo_posterior.webp', 'Rojo', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, IMAGE_BASE_URL || 'cargueros/tm6_pro/tm6_pro_rojo_perfil.webp', 'Rojo', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (15, IMAGE_BASE_URL || 'vmp/S9/vmp_s9_rojo.webp', 'Rojo', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (16, IMAGE_BASE_URL || 'cargueros/tc2_180a/TC2-180-ROJO-INCLINADO.webp', 'Rojo', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, IMAGE_BASE_URL || 'vmp/l3pro/L3-CREMA.webp', 'Crema', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, IMAGE_BASE_URL || 'vmp/l3pro/L3-CREMA-2.webp', 'Crema', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, IMAGE_BASE_URL || 'vmp/l3pro/L3-FRENTE-CREMA-scaled.webp', 'Crema', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, IMAGE_BASE_URL || 'vmp/l3pro/L3-POSTERIOR.webp', NULL, 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (18, IMAGE_BASE_URL || 'cargueros/tc_bus/tc_bus_negro.webp', 'Negro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (18, IMAGE_BASE_URL || 'cargueros/tc_bus/tc_bus_rojo.webp', 'Rojo', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_naranja_frontal.webp', 'Naranja', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_naranja_posterior.webp', 'Naranja', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_naranja_perfil.webp', 'Naranja', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_plata_costado.webp', 'Plata', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_plata_frontal.webp', 'Plata', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_plata_posterior.webp', 'Plata', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_plata_perfil.webp', 'Plata', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_azul_costado.webp', 'Azul', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_azul_frontal.webp', 'Azul', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_azul_posterior.webp', 'Azul', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_azul_perfil.webp', 'Azul', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_negro_costado.webp', 'Negro', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_negro_costado.webp', 'Negro', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_negro__frontal.webp', 'Negro', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_negro__frontal.webp', 'Negro', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_negro_posterior.webp', 'Negro', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_negro_posterior.webp', 'Negro', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_negro_perfil.webp', 'Negro', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_negro_perfil.webp', 'Negro', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_rojo_costado.webp', 'Rojo', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_rojo_costado.webp', 'Rojo', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_rojo_frontal.webp', 'Rojo', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_rojo_frontal.webp', 'Rojo', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_rojo_posterior.webp', 'Rojo', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_rojo_posterior.webp', 'Rojo', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_rojo_perfil.webp', 'Rojo', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_rojo_perfil.webp', 'Rojo', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_gris_costado.webp', 'Gris', 'false', 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_gris_costado.webp', 'Gris', 'false', 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_gris_frontal.webp', 'Gris', 'false', 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_gris_frontal.webp', 'Gris', 'false', 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_gris_posterior.webp', 'Gris', 'false', 14);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_gris_posterior.webp', 'Gris', 'false', 14);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4%20pro/f4pro_gris_perfil.webp', 'Gris', 'false', 15);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_gris_perfil.webp', 'Gris', 'false', 15);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_negro_posterior.webp', 'Negro', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_negro_perfil.webp', 'Negro', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_camaleon_frente.webp', 'Azul', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_camaleon_frontal.webp', 'Azul', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_camaleon_posterior.webp', 'Azul', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_camaleon_perfil.webp', 'Azul', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_verde_metalico_costado.webp', 'Verde Metalico', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_verde_metalico_frontal.webp', 'Verde Metalico', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_verde_metalico_posterior.webp', 'Verde Metalico', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_verde_metalico_perfil.webp', 'Verde Metalico', 'false', 11);

INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (24, IMAGE_BASE_URL || '/vmp/S4_Pro/s4pro_verde_costado.webp',  'Verde', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (24, IMAGE_BASE_URL || '/vmp/S4_Pro/s4pro_verde_frontal.webp', 'Verde', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (24, IMAGE_BASE_URL || '/vmp/S4_Pro/s4pro_verde_perfil.webp',  'Verde', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (24, IMAGE_BASE_URL || '/vmp/S4_Pro/s4pro_blanco_costado.webp', 'Blanco', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (24, IMAGE_BASE_URL || '/vmp/S4_Pro/s4pro_blanco_frontal.webp', 'Blanco', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (24, IMAGE_BASE_URL || '/vmp/S4_Pro/s4pro_blanco_perfil.webp',  'Blanco', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (24, IMAGE_BASE_URL || '/vmp/S4_Pro/s4pro_azul_costado.webp',  'Azul', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (24, IMAGE_BASE_URL || '/vmp/S4_Pro/s4pro_azul_frontal.webp', 'Azul', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (24, IMAGE_BASE_URL || '/vmp/S4_Pro/s4pro_azul_perfil.webp',  'Azul', 'false', 8);

INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
VALUES (32, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cuatrimotros/m_car_3/m_car_3_negro_costado.webp', 'Negro', false, 6);

INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
VALUES (32, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cuatrimotros/m_car_3/m_car_3_rojo_costado.webp', 'Rojo', false, 7);

END $$

-- FICHAS TECNICAS CONSOLIDADAS
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (1, '240W', '36V/8AH', 'Litio', 20, 35, 88, 50, 70);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (5, '1000W', '48V24AH', 'Litio', 45, 45, 172, 71, 111);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (7, '1500W', '72V/38AH', 'Plomo Grafeno', 65, 80);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (8, '1500W', '72V/38AH', 'Plomo Grafeno', 55, 75);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (9, '800W', '60V/23AH', 'Plomo Grafeno', 40, 217, 95, 168);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (10, '800W', '60V/25AH', 'Plomo Ácido', 22, 30, 220, 80, 109);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (11, '1200W', '60V/23AH', 'Plomo Grafeno', 50, 35, 171, 44, 110);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (12, '1200W', '72V/23AH', 'Plomo Grafeno', 55, 172, 71, 111);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (13, '1500W', '72V/38AH', 'Plomo Grafeno', 75, 70);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (14, '800W', '60V/23AH', 'Plomo Grafeno', 22, 35);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (15, '500W', '60V/20AH', 'Plomo Grafeno', 22, 40);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (16, '1800W', '60V/45Ah', 'Plomo Ácido', 35, 45, 332, 130, 142);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (17, '500W', '48V/24AH', 'Litio', 22, 60, 158, 70, 103);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (18, '1800W', '72V/58AH', 'Plomo Ácido', 40, 50, 350, 286, 102, 180);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (19, '800W', '60V/32AH', 'Plomo Ácido', 25, 30, 250, 90, 113);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (20, '1000W', '72V/23AH', 'Plomo Grafeno', 45, 45);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (21, '1500W', '72V/38AH', 'Plomo Grafeno', 75, 60, 183, 74, 112);

-- Productos faltantes -- Solo falta terminar la capacidad de la batería

INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (22, '500W', '48V/20AH', 'Plomo Ácido', '6.68 N.m', FALSE, '0.96 kWh', '300 – 500 ciclos', '220 V/60 Hz', 6, 22, 30, 120, 157, 72, 125);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (23, '350W', '48V12AH', 'Litio', '42 N.m', TRUE, '0.576 kWh', '1800 – 2000 ciclos', '220 V/60 Hz', 4, 22, 35, 120, 138, 61, 75);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (24, '500W', '60V/20AH', 'Plomo Ácido', '9.55 N.m', FALSE, '1.2 kWh', '300 – 500 ciclos', '220 V/60 Hz', 6, 22, 40, 125, 128, 71, 105);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (25, '650W', '48V24AH', 'Litio', '14 N.m', TRUE, '1.152 kWh', '1800 – 2000 ciclos', '220 V/60 Hz', 5, 22, 60, 120, 167, 75, 107);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (26, '1200W', '72V/23AH', 'Plomo Grafeno', '21.2 N.m', FALSE, '1.656 kWh', '500 – 600 ciclos', '220 V/60 Hz', 6, 50, 55, 150, 179, 75, 124);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (27, '1500W', '60V/45Ah', 'Plomo Ácido', '47.75 N.m', FALSE, '2.7 KWH', '400 – 500 ciclos', '220 V/60 Hz', 6, 22, 40, 500, 310, 170, 171);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (28, '1200W', '60V/45Ah', 'Plomo Ácido', '157 N.m', FALSE, '2.7 KWH', '400 – 500 ciclos', '220 V/60 Hz', 6, 22, 40, 800, 300, 110, 180);

-- INFO ADICIONAL
INSERT INTO info_adicional (producto_id, data) VALUES (21, '{
  "Número modos de manejo": "4",
  "Altura del piso a la base (cm)": "12.5 (considerando un conductor de 65 kg sentado)",
  "Altura del asiento al piso (cm)": "74.0 (sin conductor sentado)",
  "Tablero de información": "Digital, pantalla negativa contra rayos de sol",
  "Alarma/seguridad": "Sí, autobloqueo contra robos. Bloqueo de timón",
  "Cajuela/asiento": "Sí, amplia guantera abajo del asiento (45 litros)",
  "Puerto USB para carga de celular": "Sí, con guantera para celular",
  "Luces direccionales (delantero/posterior)": "Sí / Sí",
  "Luces intermitentes": "Sí",
  "Suspensión delantera/trasera": "Telescópica / Amortiguador",
  "Freno delantero/trasero": "Disco / Disco",
  "Llanta delantera/trasera": "110/70-12 - 120/70-10. Sin cámara",
  "Largo*ancho*altura (cm)": "183 × 74 × 112",
  "Peso en seco (kg)": "151 kg",
  "Detalles": "Luz intermitente y faros con diseño, sistema de freno CBS en la manija delantera, parador central y lateral"
}');

INSERT INTO info_adicional (producto_id, data) VALUES (1, '{"Número modos de manejo":"7 - Juego de cambios Shimano","Altura del piso a la base (cm)":"14.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"82 - 113 (sin conductor sentado)","Tablero de información":"Digital","Alarma/seguridad":"No","Canasta/asiento":"No. Asiento regulable y comodo.","Puerto USB para carga de celular":"No","Suspensión delantera/trasera":"Telescópica/no","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"20 x 1.75 - 20 x 1.75. Con cámara","Largo*ancho*altura (cm)":"160 * 57 * 115","Peso en seco (kg)":"24 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (5, '{"Número modos de manejo":"3","Altura del piso a la base (cm)":"13.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"77 (sin conductor sentado)","Tablero de información":"LCD","Alarma/seguridad":"Sí, alarma eléctrica contra robos y bloqueo de timón","Asiento/maletera":"Asiento doble y cómodo con guantera,Si.","Puerto USB para carga de celular":"Sí","Luces direccionales (delantero/posterior)":"Si / Si","Luces intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Disco/Tambor","Llanta delantera/trasera":"3.00-10 - 3.00-10. Sin cámara","Largo*ancho*altura (cm)":"172 * 71 * 111","Peso en seco (kg)":"57 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (7, '{"Número modos de manejo":"4","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de información":"Digital, pantalla negativa contra rayos de sol y tecnologia NFC","Alarma/seguridad":"Sí, alarma eléctrica contra robos. Bloqueo de timón","Cajuela/Maletera":"si, abajo del asiento (30L) y Maletera (45L) .","Puerto USB para carga de celular":"Sí con guantera para celular","Luces direccionales (delantero/posterior)":"Sí / Si","Luces intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"80/90-12 - 80/80-12. Sin cámara","Largo*ancho*altura (cm)":"185 * 70 * 113","Peso en seco (kg)":"172 kg","DETALLES":"Luz intermitente y faros con diseño, autobloqueo, con maletera, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (8, '{"Número modos de manejo":"4","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de información":"Digital, pantalla negativa contra rayos de sol","Alarma/seguridad":"Sí, alarma eléctrica contra robos. Bloqueo de timón","Cajuela/Maletera":"si abajo del asiento (30l)/ No.","Puerto USB para carga de celular":"Sí con guantera para celular","Luces direccionales (delantero/posterior)":"Sí / Si","Luces intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"80/90-12 - 80/90-12. Sin cámara","Largo*ancho*altura (cm)":"185 * 70 * 113","Peso en seco (kg)":"172 kg","DETALLES":"Luz intermitente y faros con diseño, autobloqueo, parlante integrado con bluetooth, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (9, '{"Número modos de manejo":"4 (bajo, medio, alto y retroceso)","Altura del piso a la base (cm)":"9 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"65.5 *Sin conductor sentado","Tablero de información":"LCD, Muestra velocidad referencial y pantalla de retroceso","Alarma eléctrica antirrobo":"Sí","Canasta/Asiento":"Dos canastas/ asiento grande de 80 cm de ancho","Puerto USB para carga de celular":"Si","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/ amortiguadores","Freno delantero/trasero)":"Disco/tambor","Llanta delantera/trasera":"3.00-10 / 3.00-10, sin cámara","Largo*ancho*altura (cm)":"217 * 95 * 168","Peso en seco (kg)":"144.5 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (10, '{"Número modos de manejo":"4 (bajo, medio, alto y retroceso)","Altura del piso a la base (cm)":"9 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"65.5 *Sin conductor sentado","Tablero de información":"LCD, Muestra velocidad referencial","Alarma eléctrica antirrobo":"Sí","Canasta/Asiento":"Dos canastas/ asiento grande de 80 cm de ancho","Puerto USB para carga de celular":"Sí, con porta celular regulable","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/ amortiguadores","Freno delantero/trasera":"Disco/tambor","Llanta delantera/trasera":"3.00-10 / 3.00-10, sin cámara","Largo*ancho*altura (cm)":"220 * 80 * 109","Peso en seco (kg)":"140 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (11, '{"Número modos de manejo":"4","Altura del piso a la base (cm)":"12 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"67 (sin conductor sentado)","Tablero de información":"Digital, pantalla negativa de baja reflexión","Alarma/seguridad":"Sí, alarma eléctrica contra robos. Bloqueo de timón","Cajuela/Maletera":"Si abajo del asiento, también con maletera posterior.","Puerto USB para carga de celular":"Sí","Luces direccionales (delantero/posterior)":"Si / Si","Luces intermitentes":"Sí","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Disco/Tambor","Llanta delantera/trasera":"3.00-10 - 3.00-10 . Sin cámara","Largo*ancho*altura (cm)":"171 * 44 * 110","Peso en seco (kg)":"95 kg","DETALLES":"Luces direccionales, gancho movible, posapié para copiloto en diseño, parador lateral y central"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (12, '{"Número modos de manejo":"4","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de información":"Digital, pantalla negativa contra rayos de sol","Alarma/seguridad":"Sí, alarma eléctrica contra robos. Bloqueo de timón","Cajuela/asiento":"No, pero amplia guantera abajo del asiento (18 litros).","Puerto USB para carga de celular":"Sí con guantera para celular","Luces direccionales (delantero/posterior)":"Sí / Si","Luces intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Disco/Tambor","Llanta delantera/trasera":"3.0-10 - 3.0-10. Sin cámara","Largo*ancho*altura (cm)":"172 * 71 * 111","Peso en seco (kg)":"100 kg","DETALLES":"Luz intermitente y faros con diseño, autobloqueo, llave oculta dentro del control inalámbrico, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (13, '{"Número modos de manejo":"4","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de información":"Digital","Alarma/seguridad":"Sí, autobloqueo contra robos. Bloqueo de timón","Cajuela/Maletera":"si / bajo del asiento (40L) / Maletera (45L).","Puerto USB para carga de celular":"Sí con guantera para celular","Luces direccionales (delantero/posterior)":"Sí / Si","Luces intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"90/90-12 - 90/90-10. Sin cámara","Largo*ancho*altura (cm)":"192 * 97 * 126","Peso en seco (kg)":"89 kg","DETALLES":"Luz intermitente y faros con diseño, autobloqueo con alarma, barra parachoques completo con posapiés integrados, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (14, '{"Número modos de manejo":"4 (bajo, medio, alto y retroceso)","Altura del piso a la base (cm)":"11 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"69 *Sin conductor sentado","Tablero de información":"Pantalla digital LCD","Alarma eléctrica antirrobo":"Sí","Canasta/Asiento":"Dos canastas / tres asientos regulables","Puerto USB para carga de celular":"Sí, con porta celular regulable","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"Si","Suspensión delantera/trasera":"Telescópica / amortiguadores","Freno delantero/trasero)":"Disco / tambor","Llanta delantera/trasera":"3.00-10 / 3.00-10 , sin cámara","Largo*ancho*altura (cm)":"171 * 75 * 169","Peso en seco (kg)":"145 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (15, '{"Número modos de manejo":"1","Altura del piso a la base (cm)":"12.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"72.0 (sin conductor sentado)","Tablero de información":"Digital, nivel de bateria","Alarma/seguridad":"Sí, alarma eléctrica contra robos","Canasta/asiento":"Si, amplia canasta. asiento fijo.","Puerto USB para carga de celular":"No","Luces direccionales (delantero/posterior)":"Si / Si","Luces intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/ amortiguador","Freno delantero/trasero)":"Disco/tambor","Llanta delantera/trasera":"3.00-10 - 3.00-10. Sin cámara","Largo*ancho*altura (cm)":"128 * 71 * 105","Peso en seco (kg)":"82 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (16, '{"Número modos de manejo":"4 (bajo, neutro, alto y retroceso)","Altura del piso a la base (cm)":"20 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"65 *Sin conductor sentado","Tablero de información":"LCD","Alarma eléctrica antirrobo":"Si","Asiento":"Un asiento amplio 32*74","Tolva (largo * ancho * alto) (cm)":"Sí, 170 * 110 * 47","Puerto USB para carga de celular":"No","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"si","Suspensión delantera/trasera":"Telescópica/muelle","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"4.50-12 / 4.50-12, tubular","Largo*ancho*altura (cm)":"332 * 130 * 142","Peso en seco (kg)":"440 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (17, '{"Número modos de manejo":"1","Altura del piso a la base (cm)":"12 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"72 (sin conductor sentado)","Tablero de información":"Digital, pantalla negativa de baja reflexión","Alarma/seguridad":"Sí, alarma eléctrica contra robos","Canasta/asiento":"Si, amplia canasta. asiento fijo.","Luces direcciones adelante y posterior":"Si / Si","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"2.75-10 - 2.75-10. Sin cámara","Largo*ancho*altura (cm)":"158 * 70 * 103","Peso en seco (kg)":"55 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (18, '{"Número modos de manejo":"4 (bajo, neutro, alto y retroceso)","Altura del piso a la base (cm)":"20 *Conductor de 70 kg sentado","Altura del asiento al piso (cm)":"65 *Sin conductor sentado","Tablero de información":"LCD","Alarma eléctrica antirrobo":"Si","Asiento":"3, piloto 77x35cm*, 1er copiloto 88x28cm* y 2do copiloto 82x43cm*","Puerto USB para carga de celular":"Si, capacidad baja","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"si","Suspensión delantera/trasera":"Telescópica/muelle","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"4.00-12 / 4.00-12, tubular","Largo*ancho*altura (cm)":"286 * 102 * 180","Peso en seco (kg)":"240 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (19, '{"Número modos de manejo":"4 (bajo, medio, alto y retroceso)","Altura del piso a la base (cm)":"11 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"66 *Sin conductor sentado","Tablero de información":"LCD","Alarma eléctrica antirrobo":"Si","Asiento":"Un asiento de 64 cm y asiento móvil para copiloto","Tolva (largo * ancho * alto) (cm)":"Sí, 110 * 85 * 26","Puerto USB para carga de celular":"No","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/Doble amortiguador","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"3.00-12 / 3.00-12, sin cámara","Largo*ancho*altura (cm)":"250 * 90 * 113","Peso en seco (kg)":"110 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (20, '{"Número modos de manejo":"3","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de información":"Digital, pantalla negativa contra rayos de sol","Alarma/seguridad":"Sí, alarma eléctrica contra robos. Bloqueo de timón","Cajuela/asiento":"No, pero amplia guantera abajo del asiento (32 litros).","Puerto USB para carga de celular":"Sí con guantera para celular","Luces direccionales (delantero/posterior)":"Sí / Si","Luces intermitentes":"No","Suspensión delantera/trasera":"Telescópica/Amortiguador","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"3.00-10 - 3.00-10. Sin cámara","Largo*ancho*altura (cm)":"176 * 75 * 106","Peso en seco (kg)":"89 kg","DETALLES":"Luz intermitente y faros con diseño, autobloqueo, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (22, '{"Número modos de manejo":"1","Altura del piso a la base (cm)":"11.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"72.0 (sin conductor sentado)","Tablero de información":"Digital, pantalla negativa de baja reflexión","Alarma/seguridad":"Sí, alarma eléctrica contra robos","Canasta/asiento":"Si, amplia canasta. asiento fijo.","Puerto USB para carga de celular":"No","Luces direccionales (delantero/posterior)":"si / si","Luces intermitentes":"No","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"2.5-10 - 2.5-10. Sin cámara","Largo*ancho*altura (cm)":"157 * 72 * 125","Peso en seco (kg)":"63 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (23, '{"Número modos de manejo":"1","Altura del piso a la base (cm)":"13.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"71.0 - 79.0 (sin conductor sentado)","Tablero de información":"Digital, pantalla negativa de baja reflexión","Alarma/seguridad":"Sí, alarma eléctrica contra robos","Canasta/asiento":"Si, amplia canasta, Asiento de espuma","Puerto USB para carga de celular":"No","Luces direccionales (delantero/posterior)":"Si / Si","Luces intermitentes":"No","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"2.5-10 - 2.5-10. Sin cámara","Largo*ancho*altura (cm)":"138 * 61 * 75","Peso en seco (kg)":"42 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data)
VALUES (24, '{
  "Canasta/asiento": "2 asientos",
  "Llanta delantera/trasera": "14*3.00-10",
  "Largo*ancho*altura (cm)": "128 * 71 * 105",
  "Peso en seco (kg)": "68.65 kg"
}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (25, '{"Número modos de manejo":"1","Altura del piso a la base (cm)":"13.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"77 (sin conductor sentado)","Tablero de información":"LCD","Alarma/seguridad":"Sí, alarma eléctrica contra robos y bloqueo de timón","Canasta/asiento":"No, Asiento doble y cómodo con guantera.","Puerto USB para carga de celular":"Sí","Luces direccionales (delantero/posterior)":"Si / Si","Luces intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Disco/Tambor","Llanta delantera/trasera":"3.00-10 - 3.00-10. Sin cámara","Largo*ancho*altura (cm)":"167 * 75 * 107","Peso en seco (kg)":"60 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (26, '{"Número modos de manejo":"4","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de información":"Digital, pantalla negativa contra rayos de sol","Alarma/seguridad":"Sí, alarma eléctrica contra robos. Bloqueo de timón","Cajuela/asiento":"No, pero amplia guantera abajo del asiento (30 litros).","Puerto USB para carga de celular":"Sí con guantera para celular","Luces direccionales (delantero/posterior)":"Sí / Si","Luces intermitentes":"Si","Suspensión delantera/trasera":"Telescópica/doble amortiguador","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"3.0-10 - 3.0-10. Sin cámara","Largo*ancho*altura (cm)":"179 * 75 * 124","Peso en seco (kg)":"60 kg","DETALLES":"Luz intermitente y faros con diseño, autobloqueo, llave oculta dentro del control inalámbrico, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (27, '{"Número modos de manejo":"4 (bajo, neutro, alto y retroceso)","Altura del piso a la base (cm)":"20 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"65 *Sin conductor sentado","Tablero de información":"LCD","Alarma eléctrica antirrobo":"Si","Asiento":"Un asiento amplio 32*74","Tolva (largo * ancho * alto) (cm)":"Sí, 154 * 103 * 47","Puerto USB para carga de celular":"No","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"si","Suspensión delantera/trasera":"Telescópica/muelle","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"4.00-12 / 4.00-12, tubular","Largo*ancho*altura (cm)":"310 * 170 * 171","Peso en seco (kg)":"199 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (28, '{"Número modos de manejo":"3 (bajo, medio, alto y retroceso)","Altura del piso a la base (cm)":"20 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"65 *Sin conductor sentado","Tablero de información":"LCD","Alarma eléctrica antirrobo":"Si","Asiento":"Un asiento amplio 32*74","Tolva (largo * ancho * alto) (cm)":"Sí, 160 * 110 * 120","Puerto USB para carga de celular":"No","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"si","Suspensión delantera/trasera":"Telescópica/muelle","Freno delantero/trasero)":"Sin freno/tambor","Llanta delantera/trasera":"4.00-12 / 4.50-12, tubular","Largo*ancho*altura (cm)":"300 * 110 * 180","Peso en seco (kg)":"250 kg"}'::jsonb);


-- RELACIONES PRODUCTO-COLOR
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (1, 5, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (1, 2, 0);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (1, 1, 0);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (2, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (5, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (5, 3, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (5, 8, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (5, 1, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (7, 1, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (7, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (8, 5, 0);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (8, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (9, 5, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (9, 1, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (10, 3, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (10, 1, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (11, 13, 0);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (11, 14, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (11, 1, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (11, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (11, 11, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (12, 1, 0);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (12, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (12, 3, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (13, 14, 0);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (13, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (14, 6, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (14, 3, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (15, 11, 0);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (15, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (16, 5, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 14, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 3, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 5, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 11, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 1, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (18, 11, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (19, 5, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (20, 11, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (20, 1, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (20, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (20, 5, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (21, 1, 0);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (21, 2, 1);

-- PRODUCTOS NUEVOS 2026 - COLORES SEGUN IMAGENES MAPEADAS (stock editable desde /admin)
-- Producto 22 - VMP P01 (imagenes: Blanco, Negro, Verde)
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (22, 1, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (22, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (22, 6, 1);
-- Producto 23 - VMP S6 Pro (imagenes: Verde, Gris, Negro, Celeste)
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (23, 6, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (23, 3, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (23, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (23, 10, 1);
-- Producto 24 - VMP S4 Pro (sin imagenes mapeadas todavia; ajustar colores reales en /admin)
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (24, 2, 1);
-- Producto 25 - VMP T4 (imagenes: Crema, Gris, Marron, Negro)
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (25, 12, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (25, 3, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (25, 15, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (25, 2, 1);
-- Producto 26 - GreenLine Y5 (imagenes: Gris, Negro, Rojo, Plateado)
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (26, 3, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (26, 2, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (26, 5, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (26, 14, 1);
-- Producto 27 - TC2-160A (sin carpeta de imagenes; ajustar colores reales en /admin)
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (27, 2, 1);
-- Producto 28 - TC2-160 con Techo (imagenes: Azul, Rojo)
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (28, 11, 1);
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (28, 5, 1);

-- SINCRONIZAR SECUENCIAS
SELECT setval(pg_get_serial_sequence('categorias', 'id'), COALESCE((SELECT MAX(id) FROM categorias), 1), true);
SELECT setval(pg_get_serial_sequence('colores', 'id'), COALESCE((SELECT MAX(id) FROM colores), 1), true);
SELECT setval(pg_get_serial_sequence('productos', 'id'), COALESCE((SELECT MAX(id) FROM productos), 1), true);
SELECT setval(pg_get_serial_sequence('imagenes', 'id'), COALESCE((SELECT MAX(id) FROM imagenes), 1), true);
SELECT setval(pg_get_serial_sequence('ficha_tecnica', 'id'), COALESCE((SELECT MAX(id) FROM ficha_tecnica), 1), true);
SELECT setval(pg_get_serial_sequence('info_adicional', 'id'), COALESCE((SELECT MAX(id) FROM info_adicional), 1), true);
SELECT setval(pg_get_serial_sequence('prod_color_rel', 'id'), COALESCE((SELECT MAX(id) FROM prod_color_rel), 1), true);

COMMIT;