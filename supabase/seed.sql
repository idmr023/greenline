-- ============================================================
-- SEED MAESTRO CONSOLIDADO GREENLINE - 2026
-- FUENTES: schema.sql + seed(1).sql + migrate-campos-vacios-20082026.sql + migrate-imagenes-21082026.sql
-- Sin datos inventados. Se conserva el ultimo valor efectivo de cada migracion.
-- ============================================================
BEGIN;

DO $$
DECLARE
    IMAGE_BASE_URL TEXT := '/assets/imagenes/productos/';
BEGIN

TRUNCATE TABLE prod_color_rel, imagenes, ficha_tecnica, info_adicional, productos RESTART IDENTITY CASCADE;

INSERT INTO categorias (id, nombre) VALUES (1, 'VMP'), (2, 'Motos ElÃ©ctricas'), (3, 'Trimotos ElÃ©ctricas'), (4, 'Cargueros'), (5, 'Accesorios');

INSERT INTO categorias (nombre)
SELECT 'Cuatrimotos'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Cuatrimotos');

INSERT INTO colores (nombre, hex_code) VALUES
  ('Blanco', '#FFFFFF'),
  ('Negro', '#1a1a1a'),
  ('Gris', '#808080'),
  ('Gris Oscuro', '#404040'),
  ('Rojo', '#DC2626'),
  ('Verde', '#009000'),
  ('Verde ligero', '#4ade80'),
  ('Verde Esmeralda', '#059669'),
  ('Verde MetÃ¡lico', '#047857'),
  ('Celeste', '#38bdf8'),
  ('Azul', '#2563eb'),
  ('Crema', '#fef3c7'),
  ('Rosado', '#f472b6'),
  ('Plateado', '#9ca3af'),
  ('MarrÃ³n', '#92400e'),
  ('Naranja', '#f97316');

-- PRODUCTOS
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (1, 1, 'Bicicleta ElÃ©ctrica Plegable FL2', 'bicicleta-elctrica-plegable-fl2', E'Bicicleta elÃ©ctrica plegable TAILG FL2 con baterÃ­a extraÃ­ble de litio y motor de alto rendimiento. Cuenta con velocidad asistida y diseÃ±o de marco de aluminio que cubre el sistema elÃ©ctrico. DiseÃ±o minimalista, plegable y fÃ¡cil de guardar.\nIncluye sistema de cambios SHIMANO, pantalla LCD, luz faro LED y asiento para copiloto.', 2150, 2300, false, ARRAY['vmpLitio']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (2, 5, 'Casco Greenline BK800 Negro Demonio', 'casco-greenline-bk800-negro-demonio', 'CaracterÃ­sticas :
Marca: Greenline
Modelo: BK800
Acabado: Brillante
Material: ABS
Tallas disponibles: S â€“ M â€“ L â€“ XL â€“ XXL', NULL, NULL, false, '{}'::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (3, 5, 'Casco Greenline infantil azul', 'casco-greenline-infantil-azul', 'CaracterÃ­sticas :
Marca: Greenline
Acabado: Brillante
Material: ABS
Talla: para niÃ±os', 80.00, 60.00, false, '{}'::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (4, 5, 'Casco Greenline infantil rosa', 'casco-greenline-infantil-rosa', 'CaracterÃ­sticas :
Marca: Greenline
Acabado: Brillante
Material: ABS
Talla: para niÃ±os', 80.00, 60.00, false, '{}'::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (5, 2, 'Greenline T6', 'greenline-t6', E'Moto ElÃ©ctrica T6: Redefine tu Viaje Urbano. SoluciÃ³n ideal para la movilidad moderna, combinando un diseÃ±o vanguardista y deportivo con cero emisiones. Chasis robusto y color vibrante.\nBaterÃ­a extraÃ­ble de litio de alto rendimiento para carga inteligente en casa u oficina.', 3700, 4100, false, ARRAY['destacado', 'MotoElectricaLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (7, 2, 'GreenLine SR', 'greenline-sr', E'Moto ElÃ©ctrica Greenline SR. Combina potencia y tecnologÃ­a para ofrecer una experiencia de conducciÃ³n mejorada y segura. Sistema de autobloqueo sin llave, pantalla digital con NFC, modo parking y retroceso. Incluye maletera tipo top case para mayor practicidad.', 5600, 5000, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (8, 2, 'GreenLine MX6', 'greenline-mx6', E'Moto ElÃ©ctrica Greenline MX6. DiseÃ±o moderno y futurista. Cuenta con sistema de autobloqueo sin llave, frenos de disco, modo parking, retroceso y un parlante integrado con conexiÃ³n Bluetooth para disfrutar de tu mÃºsica favorita durante el viaje.', 5900, 5500, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (9, 3, 'Trimoto GreenLine TM9', 'trimoto-greenline-tm9', E'Trimoto GreenLine TM9 con techo, diseÃ±ada para ofrecerte protecciÃ³n, comodidad y practicidad. Alarma antirrobo, bloqueo de motor, frenos con sistema antideslizante, pantalla de retroceso, puerto USB, limpiaparabrisas y techo protector para cualquier clima.', 6000, 6500, false, ARRAY['destacado', 'TrimotoLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (10, 3, 'Trimoto GreenLine TM7 v2026', 'trimoto-greenline-tm7-v2026', E'Trimoto GreenLine TM7 V2026. Alarma elÃ©ctrica antirrobo, freno de pie con funciÃ³n antideslizante, luces direccionales, controles inalÃ¡mbricos, porta celular con USB y amortiguadores para mayor confort en tus trayectos.', 5000, 4500, false, ARRAY['destacado', 'TrimotoLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (11, 2, 'GreenLine H3 Pro', 'greenline-h3-pro', E'Modelo GreenLine H3 Pro. Elegante diseÃ±o vintage moderno. Cuenta con posapiÃ© incorporado para copiloto, profunda guantera bajo el asiento, maletera adicional, luces intermitentes y bloqueo de timÃ³n y motor para mÃ¡xima seguridad.', 3800, 3600, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (12, 2, 'GreenLine V9 Pro', 'greenline-v9-pro', E'GreenLine V9 PRO. CombinaciÃ³n perfecta entre tecnologÃ­a, eficiencia y diseÃ±o moderno. BaterÃ­a de alto rendimiento con tecnologÃ­a de grafeno, motor elÃ©ctrico de respuesta Ã¡gil y diseÃ±o estilizado ideal para el ritmo urbano actual.', 4000, 3700, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (13, 2, 'GreenLine M3 Pro', 'greenline-m3-pro', E'Moto ElÃ©ctrica Greenline M3 Pro. Redefine tu experiencia de conducciÃ³n combinando potencia y diseÃ±o seguro. Sistema de autobloqueo sin llave, pantalla digital avanzada, modo parking, retroceso y maletera de alta resistencia.', 5500, 5200, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (14, 3, 'Trimoto GreenLine TM6 PRO', 'trimoto-greenline-tm6-pro', E'GreenLine TM6 Pro: Trimoto elÃ©ctrica de paseo con sistema de 3 asientos transformables. Techo integrado, amplia canasta, funciÃ³n de parking temporal, sistema de freno de mano antideslizante, alarma antirrobo e iluminaciÃ³n completa con direccionales.', 4600, 4200, false, ARRAY['destacado', 'TrimotoLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (15, 1, 'Greenline Vmp S9', 'greenline-vmp-s9', E'GreenLine VMP S9: VehÃ­culo de movilidad personal con diseÃ±o robusto inspirado en motocicletas. Faro LED dual, luces direccionales, asientos biplaza, canasta frontal de gran capacidad y sistema de seguridad avanzado con control inalÃ¡mbrico.', 2600, 2300, false, ARRAY['destacado', 'vmpGraphene', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (16, 4, 'GreenLine TC2-180A', 'greenline-tc2-180a', E'Carguero ElÃ©ctrico GreenLine TC2-180A para carga pesada. Tolva de gran volumen con sistema basculante, chasis reforzado, llantas todoterreno, parabrisas acrÃ­lico aerodinÃ¡mico, asiento acolchado ergonÃ³mico, faro principal LED y suspensiÃ³n reforzada.', 7300, 8000, false, ARRAY['carguero-promocion', 'destacado', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (17, 1, 'Greenline VMP L3 Pro', 'greenline-vmp-l3-pro', E'GreenLine VMP L3 Pro. Bicimoto elÃ©ctrica con faro delantero LED tipo halo, luz de freno integrada, posapiÃ© delantero, amplia canasta frontal, potente bocina y sistema de control inalÃ¡mbrico. Blindaje extra de baterÃ­a no extraÃ­ble contra robos.', 3400, 2900, false, ARRAY['destacado', 'vmpGraphene', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (18, 4, 'GreenLine TC-BUS', 'greenline-tc-bus', E'VehÃ­culo ElÃ©ctrico GreenLine TC-BUS para transporte urbano y comercial de pasajeros. Capacidad para 5 pasajeros en 3 filas de asientos, techo protector integral, limpiaparabrisas, faros dobles LED, funciÃ³n de retroceso y frenos de disco ventilado.', 7300, 6400, false, ARRAY['carguero-promocion', 'destacado', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (19, 4, 'Carguero GreenLine TC2-110A', 'carguero-greenline-tc2-110a', E'CARGUERO GREENLINE TC2-110A. Herramienta de trabajo robusta con sistema de transmisiÃ³n optimizado para alto torque. Incluye asientos amplios, moderno sistema de audio Bluetooth, funciÃ³n de retroceso y doble sistema de frenado.', 7600, 7200, false, ARRAY['carguero-promocion', 'destacado', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (20, 2, 'GreenLine F4 Pro', 'greenline-f4-pro', E'GreenLine F4 Pro. Elegancia retro y eficiencia. Asiento de espuma de alta calidad, guantera de 32 litros bajo el asiento, gancho utilitario, puerto USB, sistema de autobloqueo sin llave y luces intermitentes de diseÃ±o vanguardista.', 4000, 3700, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (21, 2, 'GreenLine GL3', 'greenline-gl3', E'Greenline GL3. Llantas deportivas, sistema de freno CBS, pantalla digital intuitiva, modo parking, retroceso, sistema de bloqueo en la chapa y un innovador color azul que realza su estilo.', 5500, 5200, false, ARRAY['destacado', 'MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos ( id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas ) SELECT 29, (SELECT id FROM categorias WHERE nombre = 'Trimotos ElÃ©ctricas'), 'GreenLine M-CAR 1', 'greenline-m-car-1', 'VehÃ­culo elÃ©ctrico GreenLine M-CAR 1, equipado con baterÃ­a de plomo Ã¡cido de 48V20AH y motor elÃ©ctrico de 500W. Alcanza una velocidad mÃ¡xima de 25 km/h y cuenta con transmisiÃ³n automÃ¡tica, diferencial y marcha en retroceso para brindar mayor estabilidad y practicidad durante el desplazamiento. Sus llantas de 3.0-10 ofrecen un desplazamiento estable, convirtiÃ©ndolo en una alternativa funcional para la movilidad urbana. Cuenta con configuraciÃ³n para 1 asiento y 1 pasajero, soporta una carga mÃ¡xima de 100 kg y registra un peso neto de 98 kg. Su autonomÃ­a estimada es de 28 a 38 km.', 5500, 5200, false, ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[] WHERE NOT EXISTS ( SELECT 1 FROM productos WHERE slug = 'greenline-m-car-1' );
INSERT INTO productos ( id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas ) SELECT 30, (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'), 'GreenLine M-CAR 2', 'greenline-m-car-2', 'El nuevo modelo de nuestro vehÃ­culo elÃ©ctrico M-CAR 2 estÃ¡ equipado con una baterÃ­a de plomo-Ã¡cido de 48V20AH y un motor de 500W, alcanzando una velocidad mÃ¡xima de 25 km/h. Pensado para brindar movilidad, estabilidad y seguridad, cuenta con transmisiÃ³n automÃ¡tica, diferencial y marcha en retroceso. Sus llantas de 3.0-10 ofrecen un desplazamiento estable y cÃ³modo, convirtiÃ©ndolo en una alternativa prÃ¡ctica para la movilidad urbana. Este modelo cuenta con configuraciÃ³n para 1 asiento y 1 pasajero, con una capacidad de carga mÃ¡xima de 100 kg. Su peso neto es de 138 kg y su peso bruto vehicular alcanza los 238 kg, ofreciendo una estructura diseÃ±ada para brindar comodidad y funcionalidad en cada trayecto. Su autonomÃ­a estimada es de 28 a 38 km.', 6600, 6250, false, ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[] WHERE NOT EXISTS ( SELECT 1 FROM productos WHERE slug = 'greenline-m-car-2' );
INSERT INTO productos ( id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas ) SELECT 31, (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'), 'GreenLine M-CAR 3', 'greenline-m-car-3', 'VehÃ­culo elÃ©ctrico GreenLine M-CAR 3 equipado con baterÃ­a de plomo Ã¡cido de 48V20AH y motor elÃ©ctrico de 500W. Alcanza una velocidad mÃ¡xima de 25 km/h y cuenta con transmisiÃ³n automÃ¡tica, diferencial y marcha en retroceso. Su configuraciÃ³n de 2 asientos y 2 pasajeros permite disfrutar de mayor capacidad para los desplazamientos urbanos. Cuenta con llantas delanteras 90-70-10 y traseras 300-10, una capacidad de carga mÃ¡xima de 100 kg, peso neto de 123 kg y peso bruto vehicular de 223 kg. Su autonomÃ­a es de 25 a 35 km.', 6450, 5900, false, ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[] WHERE NOT EXISTS ( SELECT 1 FROM productos WHERE slug = 'greenline-m-car-3' );
INSERT INTO productos ( id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas ) SELECT 32, (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'), 'GreenLine M-CAR 4', 'greenline-m-car-4', 'Cuatrimoto elÃ©ctrica de paseo GreenLine M-CAR 4, equipada con baterÃ­a de plomo Ã¡cido de 48V20AH y motor elÃ©ctrico de 500W. Cuenta con un asiento cÃ³modo para 1 pasajero, transmisiÃ³n automÃ¡tica, diferencial para mayor estabilidad, sistema de freno, luces y direccionales, ademÃ¡s de funciÃ³n de retroceso. Su diseÃ±o compacto y funcional la convierte en una alternativa prÃ¡ctica para la movilidad en ciudad. Alcanza una velocidad mÃ¡xima de 15 km/h, soporta una carga mÃ¡xima de 100 kg y registra un peso neto de 115 kg. Su autonomÃ­a es de 30 a 40 km.', 6700, 6250, false, ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[] WHERE NOT EXISTS ( SELECT 1 FROM productos WHERE slug = 'greenline-m-car-4' );
INSERT INTO productos ( id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas ) SELECT 33, (SELECT id FROM categorias WHERE nombre = 'Cuatrimotos'), 'GreenLine M-CAR 5', 'greenline-m-car-5', 'VehÃ­culo elÃ©ctrico GreenLine M-CAR 5 equipado con baterÃ­a de plomo Ã¡cido de 60V20AH y motor elÃ©ctrico de 1000W. Cuenta con transmisiÃ³n automÃ¡tica, diferencial y marcha en retroceso. Su configuraciÃ³n estÃ¡ diseÃ±ada para 1 asiento y 1 pasajero, con una capacidad de carga mÃ¡xima de 100 kg. Registra un peso neto de 140 kg y un peso bruto vehicular de 240 kg. Sus llantas de 16*8-7 brindan estabilidad durante el desplazamiento y alcanza una velocidad mÃ¡xima de 25 km/h. Su autonomÃ­a es de 30 a 40 km.', 9500, 9000, false, ARRAY['M-CAR', 'Cuatrimoto', 'Electrico']::TEXT[] WHERE NOT EXISTS ( SELECT 1 FROM productos WHERE slug = 'greenline-m-car-5' );
INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES ( 2, 'GreenLine GL4', 'greenline-gl4', 'El nuevo ingreso, Greenline GL4 es una motocicleta de transmisiÃ³n automÃ¡tica diseÃ±ada para transportar cÃ³modamente a dos pasajeros, equipada con una baterÃ­a de plomo-Ã¡cido de 72V38AH y un potente motor de 3000W que le permite alcanzar una velocidad mÃ¡xima de 75 km/h. Ideal para la movilidad urbana, este vehÃ­culo de dos ruedas cuenta con un peso neto de 148 kg, soporta una carga mÃ¡xima de 150 kg e incluye caracterÃ­sticas muy prÃ¡cticas para el dÃ­a a dÃ­a, como sistema de diferencial y marcha en retroceso para facilitar cualquier tipo de maniobra.', 5500, 5200, false, ARRAY['Nuevo', 'MotoElectrica', 'promocion']::TEXT[] ), ( 2, 'GreenLine M3 ECO', 'greenline-m3-eco', 'El nuevo Greenline M3 ECO es un vehÃ­culo de transmisiÃ³n automÃ¡tica diseÃ±ado para la movilidad urbana eficiente. EstÃ¡ equipado con una baterÃ­a de plomo-Ã¡cido de 72V38AH y un motor de 1500W, potencia que le permite alcanzar una velocidad mÃ¡xima de 75 km/h. Pensado para transportar cÃ³modamente a dos pasajeros, cuenta con un peso neto de 148 kg y soporta una carga de hasta 150 kg. Para garantizar un manejo prÃ¡ctico y seguro, incorpora marcha en retroceso, sistema de diferencial y llantas de 120/70-12 (delantera) y 120/70-10 (trasera), ofreciendo gran estabilidad en cada trayecto diario.', NULL, NULL, false, ARRAY['Nuevo', 'MotoElectrica']::TEXT[] );

-- M-CAR 1
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Tipo de transmisiÃ³n": "AutomÃ¡tica",
        "Diferencial": "SÃ­",
        "Marcha en retroceso": "SÃ­",
        "Asientos / Pasajeros": "1 Asiento / 1 Pasajero",
        "Tipo de uso": "De ciudad",
        "NÃºmero de ruedas": "4",
        "Llanta delantera/trasera": "3.0-10 / 3.0-10",
        "Largo*ancho*altura (cm)": "156 * 70 * 110",
        "Peso neto (kg)": "98 kg",
        "Peso soportado (kg)": "100 kg",
        "Velocidad mÃ¡xima": "25 km/h",
        "AutonomÃ­a": "28 - 38 km"
    }'::jsonb
FROM productos
WHERE slug = 'greenline-m-car-1';


-- M-CAR 2
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Tipo de transmisiÃ³n": "AutomÃ¡tica",
        "Diferencial": "SÃ­",
        "Marcha en retroceso": "SÃ­",
        "Asientos / Pasajeros": "1 Asiento / 1 Pasajero",
        "Tipo de uso": "De ciudad",
        "NÃºmero de ruedas": "4",
        "Llanta delantera/trasera": "3.0-10 / 3.0-10",
        "Largo*ancho*altura (cm)": "159 * 70 * 107",
        "Peso neto (kg)": "138 kg",
        "Peso bruto vehicular (kg)": "238 kg",
        "Peso soportado (kg)": "100 kg",
        "Velocidad mÃ¡xima": "25 km/h",
        "AutonomÃ­a": "28 - 38 km"
    }'::jsonb
FROM productos
WHERE slug = 'greenline-m-car-2';


-- M-CAR 3
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Tipo de transmisiÃ³n": "AutomÃ¡tica",
        "Diferencial": "SÃ­",
        "Marcha en retroceso": "SÃ­",
        "Asientos / Pasajeros": "2 Asientos / 2 Pasajeros",
        "Tipo de uso": "De ciudad",
        "NÃºmero de ruedas": "4",
        "Llanta delantera/trasera": "90-70-10 / 300-10",
        "Largo*ancho*altura (cm)": "165 * 73 * 110",
        "Peso neto (kg)": "123 kg",
        "Peso bruto vehicular (kg)": "223 kg",
        "Peso soportado (kg)": "100 kg",
        "Velocidad mÃ¡xima": "25 km/h",
        "AutonomÃ­a": "25 - 35 km"
    }'::jsonb
FROM productos
WHERE slug = 'greenline-m-car-3';


-- M-CAR 4
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Tipo de transmisiÃ³n": "AutomÃ¡tica",
        "Diferencial": "SÃ­",
        "Marcha en retroceso": "SÃ­",
        "Asientos / Pasajeros": "1 Asiento / 1 Pasajero",
        "Tipo de uso": "De ciudad",
        "NÃºmero de ruedas": "4",
        "Llanta delantera/trasera": "13*5-6 / 13*5-6",
        "Largo*ancho*altura (cm)": "130 * 68 * 100",
        "Peso neto (kg)": "115 kg",
        "Peso bruto vehicular (kg)": "215 kg",
        "Peso soportado (kg)": "100 kg",
        "Velocidad mÃ¡xima": "15 km/h",
        "AutonomÃ­a": "30 - 40 km",
        "Sistema de freno": "SÃ­",
        "Luces": "SÃ­",
        "Direccionales": "SÃ­"
    }'::jsonb
FROM productos
WHERE slug = 'greenline-m-car-4';


-- M-CAR 5
INSERT INTO info_adicional (producto_id, data)
SELECT
    id,
    '{
        "Tipo de transmisiÃ³n": "AutomÃ¡tica",
        "Diferencial": "SÃ­",
        "Marcha en retroceso": "SÃ­",
        "Asientos / Pasajeros": "1 Asiento / 1 Pasajero",
        "Tipo de uso": "De ciudad",
        "NÃºmero de ruedas": "4",
        "Llanta delantera/trasera": "16*8-7 / 16*8-7",
        "Largo*ancho*altura (cm)": "159 * 81 * 110",
        "Peso neto (kg)": "140 kg",
        "Peso bruto vehicular (kg)": "240 kg",
        "Peso soportado (kg)": "100 kg",
        "Velocidad mÃ¡xima": "25 km/h",
        "AutonomÃ­a": "30 - 40 km"
    }'::jsonb
FROM productos
WHERE slug = 'greenline-m-car-5';


INSERT INTO imagenes (producto_id, url, color, es_principal, orden) SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_negro_costado.webp', 'Negro', 'true', 0 FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_negro_frontal.webp', 'Negro', 'false', 1 FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_negro_perfil.webp', 'Negro', 'false', 2 FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_negro_posterior.webp', 'Negro', 'false', 3 FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_rojo_costado.webp', 'Rojo', 'false', 4 FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_rojo_frontal.webp', 'Rojo', 'false', 5 FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_rojo_perfil.webp', 'Rojo', 'false', 6 FROM productos WHERE slug = 'greenline-m-car-1';
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-1/m_car_1_rojo_posterior.webp', 'Rojo', 'false', 7 FROM productos WHERE slug = 'greenline-m-car-1';

-- M-CAR 2 (m-car-2/)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_negro_costado.webp', 'Negro', 'true', 0
FROM productos WHERE slug = 'greenline-m-car-2';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_negro_frontal.webp', 'Negro', 'false', 1
FROM productos WHERE slug = 'greenline-m-car-2';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_negro_perfil.webp', 'Negro', 'false', 2
FROM productos WHERE slug = 'greenline-m-car-2';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_rojo_costado.webp', 'Rojo', 'false', 3
FROM productos WHERE slug = 'greenline-m-car-2';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_rojo_frontal.webp', 'Rojo', 'false', 4
FROM productos WHERE slug = 'greenline-m-car-2';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-2/m_car_2_rojo_perfil.webp', 'Rojo', 'false', 5
FROM productos WHERE slug = 'greenline-m-car-2';

-- M-CAR 3 (m_car_3/)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_negro_frontal.webp', 'Negro', 'true', 0
FROM productos WHERE slug = 'greenline-m-car-3';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_negro_perfil.webp', 'Negro', 'false', 1
FROM productos WHERE slug = 'greenline-m-car-3';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_negro_posterior.webp', 'Negro', 'false', 2
FROM productos WHERE slug = 'greenline-m-car-3';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_rojo_frontal.webp', 'Rojo', 'false', 3
FROM productos WHERE slug = 'greenline-m-car-3';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_rojo_perfil.webp', 'Rojo', 'false', 4
FROM productos WHERE slug = 'greenline-m-car-3';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_3/m_car_3_rojo_posterior.webp', 'Rojo', 'false', 5
FROM productos WHERE slug = 'greenline-m-car-3';

-- M-CAR 4 (m-car-4/)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_azul_costado.webp', 'Azul', 'true', 0
FROM productos WHERE slug = 'greenline-m-car-4';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_azul_frontal.webp', 'Azul', 'false', 1
FROM productos WHERE slug = 'greenline-m-car-4';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_azul_lateral.webp', 'Azul', 'false', 2
FROM productos WHERE slug = 'greenline-m-car-4';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_negro_costado.webp', 'Negro', 'false', 3
FROM productos WHERE slug = 'greenline-m-car-4';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_negro_frontal.webp', 'Negro', 'false', 4
FROM productos WHERE slug = 'greenline-m-car-4';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_negro_lateral.webp', 'Negro', 'false', 5
FROM productos WHERE slug = 'greenline-m-car-4';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_rojo_costado.webp', 'Rojo', 'false', 6
FROM productos WHERE slug = 'greenline-m-car-4';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_rojo_frontal.webp', 'Rojo', 'false', 7
FROM productos WHERE slug = 'greenline-m-car-4';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m-car-4/mcar4_rojo_lateral.webp', 'Rojo', 'false', 8
FROM productos WHERE slug = 'greenline-m-car-4';

-- M-CAR 5 (m_car_5/)
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_5/mcar5_rojo_costado.webp', 'Rojo', 'true', 0
FROM productos WHERE slug = 'greenline-m-car-5';
SELECT id, IMAGE_BASE_URL || 'cuatrimotros/m_car_5/mcar5_rojo_perfil.webp', 'Rojo', 'false', 1
FROM productos WHERE slug = 'greenline-m-car-5';


-- ============================================================
-- 6. VALIDACIÃ“N FINAL
-- ============================================================

SELECT p.id, p.nombre, p.precio_original, p.precio_actual, ft.potencia_motor, ft.potencia_bateria, ft.tipo_bateria, ft.velocidad_max_kmh, ft.autonomia_km, ft.carga_maxima_kg, ft.largo_cm, ft.ancho_cm, ft.alto_cm FROM productos p LEFT JOIN ficha_tecnica ft ON ft.producto_id = p.id WHERE p.slug IN ( 'greenline-m-car-1', 'greenline-m-car-2', 'greenline-m-car-3', 'greenline-m-car-4', 'greenline-m-car-5' ) ORDER BY p.id;

--Productos faltantes

-- ============================================================
-- PRODUCTOS NUEVOS - GREENLINE 2026
-- ============================================================

INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (22, 1, 'GreenLine VMP P01', 'greenline-vmp-p01', E'El GreenLine VMP P01 es un vehÃ­culo de movilidad personal tipo bicimoto, equipado con baterÃ­a de plomo Ã¡cido de 48V20AH y motor de 500W. Alcanza una velocidad mÃ¡xima de 22Â±3 km/h y ofrece una autonomÃ­a de 30 a 40 km. Cuenta con faro LED tipo halo, luces direccionales, posapiÃ© delantero, canasta frontal, bocina, control inalÃ¡mbrico y dos llaves de seguridad.', 1900, 1849, false, ARRAY['vmpPlomo', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (23, 1, 'GreenLine VMP S6 Pro', 'greenline-vmp-s6-pro', E'VehÃ­culo de movilidad personal tipo bicimoto con baterÃ­a extraÃ­ble de Litio de 48V12AH y motor de 350W. Alcanza una velocidad mÃ¡xima de 22Â±3 km/h y ofrece una autonomÃ­a de 35 a 45 km. Incluye velocidad crucero, funciÃ³n de parking temporal, luces direccionales, faro LED tipo halo, canasta frontal, bocina y control inalÃ¡mbrico.', 2500, 2100, false, ARRAY['vmpLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (24, 1, 'GreenLine VMP S4 Pro', 'greenline-vmp-s4-pro', E'El GreenLine VMP S4 Pro combina diseÃ±o clÃ¡sico y movilidad urbana con motor de 500W y baterÃ­a de plomo Ã¡cido de 60V20AH. Alcanza una velocidad mÃ¡xima de 22Â±3 km/h y una autonomÃ­a de 40 a 50 km actualmente bajo revisiÃ³n. Cuenta con sistema NFC, faro LED, luces direccionales, configuraciÃ³n biplaza, canasta frontal y sistema de alarma.', 2600, 2300, false, ARRAY['vmpPlomo', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (25, 1, 'GreenLine VMP T4', 'greenline-vmp-t4', E'VehÃ­culo de movilidad personal tipo bicimoto equipado con baterÃ­a extraÃ­ble Litio de 48V24AH y motor de 650W. Alcanza una velocidad de 22Â±3 km/h y ofrece una autonomÃ­a de 60 a 70 km. Cuenta con alarma elÃ©ctrica, luces direccionales, luz de freno, funciÃ³n de estacionamiento temporal, puerto USB, guantera, doble asiento, maletera, bocina y control inalÃ¡mbrico.', 4100, 3600, false, ARRAY['vmpLitio', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (26, 2, 'GreenLine Y5', 'greenline-y5', E'Moto elÃ©ctrica GreenLine Y5 con motor de 1200W y baterÃ­a de plomo Ã¡cido con grafeno de 72V23AH. Alcanza una velocidad mÃ¡xima de 50 km/h y una autonomÃ­a de 55 a 65 km. Cuenta con frenos de disco, autobloqueo sin llave, pantalla digital, guantera de 30 litros, puerto USB y diseÃ±o retro disponible en varios colores.', 4200, 3700, false, ARRAY['MotoElectricaGrafeno', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (27, 4, 'GreenLine TC2-160A', 'greenline-tc2-160a', E'Carguero elÃ©ctrico GreenLine TC2-160A con baterÃ­a de plomo de 60V45AH y motor de 1500W. Cuenta con sistema de transmisiÃ³n para alto torque, chasis reforzado, funciÃ³n de retroceso, freno de pie y de mano, tres velocidades y capacidad de carga de 400 a 500 kg. Incluye luces direccionales y reproductor de mÃºsica.', 7300, 6400, false, ARRAY['carguero-promocion', 'promocion']::TEXT[]);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (28, 4, 'GreenLine TC2-160 con Techo', 'greenline-tc2-160-con-techo', E'Carguero elÃ©ctrico GreenLine TC2-160 con techo, equipado con baterÃ­a de plomo de 60V45AH y motor de 1200W. Cuenta con chasis reforzado, sistema de transmisiÃ³n para alto torque, funciÃ³n de retroceso, freno de pie y de mano, tres velocidades, techo protector y capacidad de carga de 500 a 800 kg.', 7600, 7200, false, ARRAY['carguero-promocion', 'promocion']::TEXT[]);

INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (22, IMAGE_BASE_URL || 'vmp/P01/p01_blanco_costado.webp', 'Blanco', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (22, IMAGE_BASE_URL || 'vmp/P01/p01_negro_costado.webp', 'Negro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (22, IMAGE_BASE_URL || 'vmp/P01/p01_verde_costado.webp', 'Verde', 'false', 2);

INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (23, IMAGE_BASE_URL || 'vmp/S6_Pro/s6pro_verde_costado.webp', 'Verde', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (23, IMAGE_BASE_URL || 'vmp/S6_Pro/s6pro_gris_costado.webp', 'Gris', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (23, IMAGE_BASE_URL || 'vmp/S6_Pro/s6pro_negro_costado.webp', 'Negro', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (23, IMAGE_BASE_URL || 'vmp/S6_Pro/s6pro_celeste_costado.webp', 'Celeste', 'false', 3);

-- Producto 25 - VMP T4 (fuente local: public/assets/imagenes/productos/vmp/T4, convertida a .webp en Storage)
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_crema_costado.webp', 'Crema', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_crema_perfil.webp', 'Crema', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_crema_posterior.webp', 'Crema', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_gris_costado.webp', 'Gris', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_gris_perfil.webp', 'Gris', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_gris_posterior.webp', 'Gris', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_marron_costado.webp', 'MarrÃ³n', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_marron_perfil.webp', 'MarrÃ³n', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (25, IMAGE_BASE_URL || 'vmp/T4/t4_marron_posterior.webp', 'MarrÃ³n', 'false', 8);
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
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (27, IMAGE_BASE_URL || 'cargueros/tc2_160a/tc2_160a_azul_perfil.webp', 'Azul', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (27, IMAGE_BASE_URL || 'cargueros/tc2_160a/tc2_160a_rojo_costado.webp', 'Rojo', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (27, IMAGE_BASE_URL || 'cargueros/tc2_160a/tc2_160a_rojo_perfil.webp', 'Rojo', 'false', 3);

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
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/l3_negro_costado.webp', 'Negro', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'cargueros/tc_bus/tc_bus_azul.webp', 'Azul', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_naranja_costado.webp', 'Naranja', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/S9/vmp_s9_gris.webp', 'Gris', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/l3_negro_frente.webp', 'Negro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/l3_negro_posterior.webp', 'Negro', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_negro_posterior.webp', 'Negra', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/l3_celeste_costado.webp', 'Celeste', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_negro_perfil.webp', 'Negra', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/l3_celeste_frente.webp', 'Celeste', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'motos/mx6/mx6_blanca_costado.webp', 'Blanca', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, IMAGE_BASE_URL || 'vmp/l3pro/l3_celeste_posterior.webp', 'Celeste', 'false', 5);
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
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_costado_izq.webp', 'Crema', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_costado_izq.webp', 'Crema', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_frontal.webp', 'Crema', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_posterior.webp', 'Crema', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_posterior_der.webp', 'Crema', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_crema_perfil.webp', 'Crema', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_morada_frontal.webp', 'Morada', 'false', 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, IMAGE_BASE_URL || 'trimotos/tm9/tm9_morado_costado_izq.webp', 'Morada', 'false', 13);
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
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_rosado_costado.webp', 'Rosado', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_rosado_frontal.webp', 'Rosado', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_rosado_poterior.webp', 'Rosado', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_rosado_perfil.webp', 'Rosado', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_negro_costado.webp', 'Negro', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_negro_frontal.webp', 'Negro', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_negro_posterior.webp', 'Negro', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_negro_perfil.webp', 'Negro', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_blanco_costado.webp', 'Blanco', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_blanco_frontal.webp', 'Blanco', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_blanco_posterior.webp', 'Blanco', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_blanco_perfil.webp', 'Blanco', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_verde_costado.webp', 'Verde', 'false', 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, IMAGE_BASE_URL || 'motos/h3 pro/h3_pro_verde_perfil.webp', 'Verde', 'false', 13);
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
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, IMAGE_BASE_URL || 'cargueros/tm6/TM6V24-GRIS.webp', 'Gris', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, IMAGE_BASE_URL || 'cargueros/tm6/TM6V24-NEGRO.webp', 'Negro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, IMAGE_BASE_URL || 'cargueros/tm6/TM6V24-ROJA.webp', 'Rojo', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (15, IMAGE_BASE_URL || 'vmp/S9/vmp_s9_rojo.webp', 'Rojo', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (16, IMAGE_BASE_URL || 'cargueros/tc2_180a/TC2-180-ROJO-INCLINADO.webp', 'Rojo', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (18, IMAGE_BASE_URL || 'cargueros/tc_bus/tc_bus_negro.webp', 'Negro', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (18, IMAGE_BASE_URL || 'cargueros/tc_bus/tc_bus_rojo.webp', 'Rojo', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_naranja_frontal.webp', 'Naranja', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_naranja_posterior.webp', 'Naranja', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_naranja_perfil.webp', 'Naranja', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_plata_costado.webp', 'Plata', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_plata_frontal.webp', 'Plata', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_plata_posterior.webp', 'Plata', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, IMAGE_BASE_URL || 'cargueros/tc2_110a/tc2_110a_plata_perfil.webp', 'Plata', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_azul_costado.webp', 'Azul', 'true', 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_azul_frontal.webp', 'Azul', 'false', 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_azul_posterior.webp', 'Azul', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_azul_perfil.webp', 'Azul', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_negro_costado.webp', 'Negro', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_negro__frontal.webp', 'Negro', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_negro_posterior.webp', 'Negro', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_negro_perfil.webp', 'Negro', 'false', 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_rojo_costado.webp', 'Rojo', 'false', 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_rojo_frontal.webp', 'Rojo', 'false', 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_rojo_posterior.webp', 'Rojo', 'false', 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_rojo_perfil.webp', 'Rojo', 'false', 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_gris_costado.webp', 'Gris', 'false', 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_gris_frontal.webp', 'Gris', 'false', 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_gris_posterior.webp', 'Gris', 'false', 14);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, IMAGE_BASE_URL || 'motos/f4 pro/f4pro_gris_perfil.webp', 'Gris', 'false', 15);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_negro_posterior.webp', 'Negro', 'false', 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_negro_perfil.webp', 'Negro', 'false', 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_azul_frontal.webp', 'Azul', 'false', 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_azul_frontal.webp', 'Azul', 'false', 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_azul_posterior.webp', 'Azul', 'false', 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, IMAGE_BASE_URL || 'motos/gl3/gl3_azul_perfil.webp', 'Azul', 'false', 7);
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

END $$

-- FICHAS TECNICAS CONSOLIDADAS
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (1, '240W', '36V/8AH', 'Litio', 20, 35, 88, 50, 70);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (5, '1000W', '48V24AH', 'Litio', 45, 45, 172, 71, 111);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (7, '1500W', '72V/38AH', 'Plomo Grafeno', 65, 80);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (8, '1500W', '72V/38AH', 'Plomo Grafeno', 55, 75);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (9, '800W', '60V/23AH', 'Plomo Grafeno', 40, 217, 95, 168);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (10, '800W', '60V/25AH', 'Plomo Ãcido', 22, 30, 220, 80, 109);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (11, '1200W', '60V/23AH', 'Plomo Grafeno', 50, 35, 171, 44, 110);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (12, '1200W', '72V/23AH', 'Plomo Grafeno', 55, 172, 71, 111);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (13, '1500W', '72V/38AH', 'Plomo Grafeno', 75, 70);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (14, '800W', '60V/23AH', 'Plomo Grafeno', 22, 35);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (15, '500W', '60V/20AH', 'Plomo Grafeno', 22, 40);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (16, '1800W', '60V/45Ah', 'Plomo Ãcido', 35, 45, 332, 130, 142);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (17, '500W', '48V/24AH', 'Litio', 22, 60, 158, 70, 103);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (18, '1800W', '72V/58AH', 'Plomo Ãcido', 40, 50, 350, 286, 102, 180);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (19, '800W', '60V/32AH', 'Plomo Ãcido', 25, 30, 250, 90, 113);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km) VALUES (20, '1000W', '72V/23AH', 'Plomo Grafeno', 45, 45);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, velocidad_max_kmh, autonomia_km, largo_cm, ancho_cm, alto_cm) VALUES (21, '1500W', '72V/38AH', 'Plomo Grafeno', 75, 60, 183, 74, 112);

-- Productos faltantes -- Solo falta terminar la capacidad de la baterÃ­a

INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (22, '500W', '48V/20AH', 'Plomo Ãcido', '6.68 N.m', FALSE, '0.96 kWh', '300 â€“ 500 ciclos', '220 V/60 Hz', 6, 22, 30, 120, 157, 72, 125);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (23, '350W', '48V12AH', 'Litio', '42 N.m', TRUE, '0.576 kWh', '1800 â€“ 2000 ciclos', '220 V/60 Hz', 4, 22, 35, 120, 138, 61, 75);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (24, '500W', '60V/20AH', 'Plomo Ãcido', '9.55 N.m', FALSE, '1.2 kWh', '300 â€“ 500 ciclos', '220 V/60 Hz', 6, 22, 40, 125, 128, 71, 105);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (25, '650W', '48V24AH', 'Litio', '14 N.m', TRUE, '1.152 kWh', '1800 â€“ 2000 ciclos', '220 V/60 Hz', 5, 22, 60, 120, 167, 75, 107);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (26, '1200W', '72V/23AH', 'Plomo Grafeno', '21.2 N.m', FALSE, '1.656 kWh', '500 â€“ 600 ciclos', '220 V/60 Hz', 6, 50, 55, 150, 179, 75, 124);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (27, '1500W', '60V/45Ah', 'Plomo Ãcido', '47.75 N.m', FALSE, '2.7 KWH', '400 â€“ 500 ciclos', '220 V/60 Hz', 6, 22, 40, 500, 310, 170, 171);
INSERT INTO ficha_tecnica (producto_id, potencia_motor, potencia_bateria, tipo_bateria, torque_maximo, bateria_extraible, capacidad_bateria, vida_util_bateria, tipo_toma_corriente, tiempo_carga_min, velocidad_max_kmh, autonomia_km, carga_maxima_kg, largo_cm, ancho_cm, alto_cm) VALUES (28, '1200W', '60V/45Ah', 'Plomo Ãcido', '157 N.m', FALSE, '2.7 KWH', '400 â€“ 500 ciclos', '220 V/60 Hz', 6, 22, 40, 800, 300, 110, 180);

-- INFO ADICIONAL
INSERT INTO info_adicional (producto_id, data) VALUES (21, '{ "NÃºmero modos de manejo": "4", "Altura del piso a la base (cm)": "12.5 (considerando un conductor de 65 kg sentado)", "Altura del asiento al piso (cm)": "74.0 (sin conductor sentado)", "Tablero de informaciÃ³n": "Digital, pantalla negativa contra rayos de sol", "Alarma/seguridad": "SÃ­, autobloqueo contra robos. Bloqueo de timÃ³n", "Cajuela/asiento": "SÃ­, amplia guantera abajo del asiento (45 litros)", "Puerto USB para carga de celular": "SÃ­, con guantera para celular", "Luces direccionales (delantero/posterior)": "SÃ­ / SÃ­", "Luces intermitentes": "SÃ­", "SuspensiÃ³n delantera/trasera": "TelescÃ³pica / Amortiguador", "Freno delantero/trasero": "Disco / Disco", "Llanta delantera/trasera": "110/70-12 - 120/70-10. Sin cÃ¡mara", "Largo*ancho*altura (cm)": "183 Ã— 74 Ã— 112", "Peso en seco (kg)": "151 kg", "Detalles": "Luz intermitente y faros con diseÃ±o, sistema de freno CBS en la manija delantera, parador central y lateral" }');

INSERT INTO info_adicional (producto_id, data) VALUES (1, '{"NÃºmero modos de manejo":"7 - Juego de cambios Shimano","Altura del piso a la base (cm)":"14.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"82 - 113 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital","Alarma/seguridad":"No","Canasta/asiento":"No. Asiento regulable y comodo.","Puerto USB para carga de celular":"No","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/no","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"20 x 1.75 - 20 x 1.75. Con cÃ¡mara","Largo*ancho*altura (cm)":"160 * 57 * 115","Peso en seco (kg)":"24 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (5, '{"NÃºmero modos de manejo":"3","Altura del piso a la base (cm)":"13.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"77 (sin conductor sentado)","Tablero de informaciÃ³n":"LCD","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos y bloqueo de timÃ³n","Asiento/maletera":"Asiento doble y cÃ³modo con guantera,Si.","Puerto USB para carga de celular":"SÃ­","Luces direccionales (delantero/posterior)":"Si / Si","Luces intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Disco/Tambor","Llanta delantera/trasera":"3.00-10 - 3.00-10. Sin cÃ¡mara","Largo*ancho*altura (cm)":"172 * 71 * 111","Peso en seco (kg)":"57 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (7, '{"NÃºmero modos de manejo":"4","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital, pantalla negativa contra rayos de sol y tecnologia NFC","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos. Bloqueo de timÃ³n","Cajuela/Maletera":"si, abajo del asiento (30L) y Maletera (45L) .","Puerto USB para carga de celular":"SÃ­ con guantera para celular","Luces direccionales (delantero/posterior)":"SÃ­ / Si","Luces intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"80/90-12 - 80/80-12. Sin cÃ¡mara","Largo*ancho*altura (cm)":"185 * 70 * 113","Peso en seco (kg)":"172 kg","DETALLES":"Luz intermitente y faros con diseÃ±o, autobloqueo, con maletera, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (8, '{"NÃºmero modos de manejo":"4","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital, pantalla negativa contra rayos de sol","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos. Bloqueo de timÃ³n","Cajuela/Maletera":"si abajo del asiento (30l)/ No.","Puerto USB para carga de celular":"SÃ­ con guantera para celular","Luces direccionales (delantero/posterior)":"SÃ­ / Si","Luces intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"80/90-12 - 80/90-12. Sin cÃ¡mara","Largo*ancho*altura (cm)":"185 * 70 * 113","Peso en seco (kg)":"172 kg","DETALLES":"Luz intermitente y faros con diseÃ±o, autobloqueo, parlante integrado con bluetooth, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (9, '{"NÃºmero modos de manejo":"4 (bajo, medio, alto y retroceso)","Altura del piso a la base (cm)":"9 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"65.5 *Sin conductor sentado","Tablero de informaciÃ³n":"LCD, Muestra velocidad referencial y pantalla de retroceso","Alarma elÃ©ctrica antirrobo":"SÃ­","Canasta/Asiento":"Dos canastas/ asiento grande de 80 cm de ancho","Puerto USB para carga de celular":"Si","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/ amortiguadores","Freno delantero/trasero)":"Disco/tambor","Llanta delantera/trasera":"3.00-10 / 3.00-10, sin cÃ¡mara","Largo*ancho*altura (cm)":"217 * 95 * 168","Peso en seco (kg)":"144.5 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (10, '{"NÃºmero modos de manejo":"4 (bajo, medio, alto y retroceso)","Altura del piso a la base (cm)":"9 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"65.5 *Sin conductor sentado","Tablero de informaciÃ³n":"LCD, Muestra velocidad referencial","Alarma elÃ©ctrica antirrobo":"SÃ­","Canasta/Asiento":"Dos canastas/ asiento grande de 80 cm de ancho","Puerto USB para carga de celular":"SÃ­, con porta celular regulable","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/ amortiguadores","Freno delantero/trasera":"Disco/tambor","Llanta delantera/trasera":"3.00-10 / 3.00-10, sin cÃ¡mara","Largo*ancho*altura (cm)":"220 * 80 * 109","Peso en seco (kg)":"140 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (11, '{"NÃºmero modos de manejo":"4","Altura del piso a la base (cm)":"12 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"67 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital, pantalla negativa de baja reflexiÃ³n","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos. Bloqueo de timÃ³n","Cajuela/Maletera":"Si abajo del asiento, tambiÃ©n con maletera posterior.","Puerto USB para carga de celular":"SÃ­","Luces direccionales (delantero/posterior)":"Si / Si","Luces intermitentes":"SÃ­","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Disco/Tambor","Llanta delantera/trasera":"3.00-10 - 3.00-10 . Sin cÃ¡mara","Largo*ancho*altura (cm)":"171 * 44 * 110","Peso en seco (kg)":"95 kg","DETALLES":"Luces direccionales, gancho movible, posapiÃ© para copiloto en diseÃ±o, parador lateral y central"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (12, '{"NÃºmero modos de manejo":"4","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital, pantalla negativa contra rayos de sol","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos. Bloqueo de timÃ³n","Cajuela/asiento":"No, pero amplia guantera abajo del asiento (18 litros).","Puerto USB para carga de celular":"SÃ­ con guantera para celular","Luces direccionales (delantero/posterior)":"SÃ­ / Si","Luces intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Disco/Tambor","Llanta delantera/trasera":"3.0-10 - 3.0-10. Sin cÃ¡mara","Largo*ancho*altura (cm)":"172 * 71 * 111","Peso en seco (kg)":"100 kg","DETALLES":"Luz intermitente y faros con diseÃ±o, autobloqueo, llave oculta dentro del control inalÃ¡mbrico, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (13, '{"NÃºmero modos de manejo":"4","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital","Alarma/seguridad":"SÃ­, autobloqueo contra robos. Bloqueo de timÃ³n","Cajuela/Maletera":"si / bajo del asiento (40L) / Maletera (45L).","Puerto USB para carga de celular":"SÃ­ con guantera para celular","Luces direccionales (delantero/posterior)":"SÃ­ / Si","Luces intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"90/90-12 - 90/90-10. Sin cÃ¡mara","Largo*ancho*altura (cm)":"192 * 97 * 126","Peso en seco (kg)":"89 kg","DETALLES":"Luz intermitente y faros con diseÃ±o, autobloqueo con alarma, barra parachoques completo con posapiÃ©s integrados, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (14, '{"NÃºmero modos de manejo":"4 (bajo, medio, alto y retroceso)","Altura del piso a la base (cm)":"11 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"69 *Sin conductor sentado","Tablero de informaciÃ³n":"Pantalla digital LCD","Alarma elÃ©ctrica antirrobo":"SÃ­","Canasta/Asiento":"Dos canastas / tres asientos regulables","Puerto USB para carga de celular":"SÃ­, con porta celular regulable","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica / amortiguadores","Freno delantero/trasero)":"Disco / tambor","Llanta delantera/trasera":"3.00-10 / 3.00-10 , sin cÃ¡mara","Largo*ancho*altura (cm)":"171 * 75 * 169","Peso en seco (kg)":"145 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (15, '{"NÃºmero modos de manejo":"1","Altura del piso a la base (cm)":"12.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"72.0 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital, nivel de bateria","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos","Canasta/asiento":"Si, amplia canasta. asiento fijo.","Puerto USB para carga de celular":"No","Luces direccionales (delantero/posterior)":"Si / Si","Luces intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/ amortiguador","Freno delantero/trasero)":"Disco/tambor","Llanta delantera/trasera":"3.00-10 - 3.00-10. Sin cÃ¡mara","Largo*ancho*altura (cm)":"128 * 71 * 105","Peso en seco (kg)":"82 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (16, '{"NÃºmero modos de manejo":"4 (bajo, neutro, alto y retroceso)","Altura del piso a la base (cm)":"20 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"65 *Sin conductor sentado","Tablero de informaciÃ³n":"LCD","Alarma elÃ©ctrica antirrobo":"Si","Asiento":"Un asiento amplio 32*74","Tolva (largo * ancho * alto) (cm)":"SÃ­, 170 * 110 * 47","Puerto USB para carga de celular":"No","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/muelle","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"4.50-12 / 4.50-12, tubular","Largo*ancho*altura (cm)":"332 * 130 * 142","Peso en seco (kg)":"440 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (17, '{"NÃºmero modos de manejo":"1","Altura del piso a la base (cm)":"12 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"72 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital, pantalla negativa de baja reflexiÃ³n","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos","Canasta/asiento":"Si, amplia canasta. asiento fijo.","Luces direcciones adelante y posterior":"Si / Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"2.75-10 - 2.75-10. Sin cÃ¡mara","Largo*ancho*altura (cm)":"158 * 70 * 103","Peso en seco (kg)":"55 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (18, '{"NÃºmero modos de manejo":"4 (bajo, neutro, alto y retroceso)","Altura del piso a la base (cm)":"20 *Conductor de 70 kg sentado","Altura del asiento al piso (cm)":"65 *Sin conductor sentado","Tablero de informaciÃ³n":"LCD","Alarma elÃ©ctrica antirrobo":"Si","Asiento":"3, piloto 77x35cm*, 1er copiloto 88x28cm* y 2do copiloto 82x43cm*","Puerto USB para carga de celular":"Si, capacidad baja","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/muelle","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"4.00-12 / 4.00-12, tubular","Largo*ancho*altura (cm)":"286 * 102 * 180","Peso en seco (kg)":"240 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (19, '{"NÃºmero modos de manejo":"4 (bajo, medio, alto y retroceso)","Altura del piso a la base (cm)":"11 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"66 *Sin conductor sentado","Tablero de informaciÃ³n":"LCD","Alarma elÃ©ctrica antirrobo":"Si","Asiento":"Un asiento de 64 cm y asiento mÃ³vil para copiloto","Tolva (largo * ancho * alto) (cm)":"SÃ­, 110 * 85 * 26","Puerto USB para carga de celular":"No","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/Doble amortiguador","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"3.00-12 / 3.00-12, sin cÃ¡mara","Largo*ancho*altura (cm)":"250 * 90 * 113","Peso en seco (kg)":"110 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (20, '{"NÃºmero modos de manejo":"3","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital, pantalla negativa contra rayos de sol","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos. Bloqueo de timÃ³n","Cajuela/asiento":"No, pero amplia guantera abajo del asiento (32 litros).","Puerto USB para carga de celular":"SÃ­ con guantera para celular","Luces direccionales (delantero/posterior)":"SÃ­ / Si","Luces intermitentes":"No","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/Amortiguador","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"3.00-10 - 3.00-10. Sin cÃ¡mara","Largo*ancho*altura (cm)":"176 * 75 * 106","Peso en seco (kg)":"89 kg","DETALLES":"Luz intermitente y faros con diseÃ±o, autobloqueo, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (22, '{"NÃºmero modos de manejo":"1","Altura del piso a la base (cm)":"11.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"72.0 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital, pantalla negativa de baja reflexiÃ³n","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos","Canasta/asiento":"Si, amplia canasta. asiento fijo.","Puerto USB para carga de celular":"No","Luces direccionales (delantero/posterior)":"si / si","Luces intermitentes":"No","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"2.5-10 - 2.5-10. Sin cÃ¡mara","Largo*ancho*altura (cm)":"157 * 72 * 125","Peso en seco (kg)":"63 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (23, '{"NÃºmero modos de manejo":"1","Altura del piso a la base (cm)":"13.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"71.0 - 79.0 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital, pantalla negativa de baja reflexiÃ³n","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos","Canasta/asiento":"Si, amplia canasta, Asiento de espuma","Puerto USB para carga de celular":"No","Luces direccionales (delantero/posterior)":"Si / Si","Luces intermitentes":"No","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"2.5-10 - 2.5-10. Sin cÃ¡mara","Largo*ancho*altura (cm)":"138 * 61 * 75","Peso en seco (kg)":"42 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (24, '{ "Canasta/asiento": "2 asientos", "Llanta delantera/trasera": "14*3.00-10", "Largo*ancho*altura (cm)": "128 * 71 * 105", "Peso en seco (kg)": "68.65 kg" }'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (25, '{"NÃºmero modos de manejo":"1","Altura del piso a la base (cm)":"13.0 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"77 (sin conductor sentado)","Tablero de informaciÃ³n":"LCD","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos y bloqueo de timÃ³n","Canasta/asiento":"No, Asiento doble y cÃ³modo con guantera.","Puerto USB para carga de celular":"SÃ­","Luces direccionales (delantero/posterior)":"Si / Si","Luces intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Disco/Tambor","Llanta delantera/trasera":"3.00-10 - 3.00-10. Sin cÃ¡mara","Largo*ancho*altura (cm)":"167 * 75 * 107","Peso en seco (kg)":"60 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (26, '{"NÃºmero modos de manejo":"4","Altura del piso a la base (cm)":"12.5 (considerando un conductor de 65 kg sentado)","Altura del asiento al piso (cm)":"74.0 (sin conductor sentado)","Tablero de informaciÃ³n":"Digital, pantalla negativa contra rayos de sol","Alarma/seguridad":"SÃ­, alarma elÃ©ctrica contra robos. Bloqueo de timÃ³n","Cajuela/asiento":"No, pero amplia guantera abajo del asiento (30 litros).","Puerto USB para carga de celular":"SÃ­ con guantera para celular","Luces direccionales (delantero/posterior)":"SÃ­ / Si","Luces intermitentes":"Si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/doble amortiguador","Freno delantero/trasero)":"Disco/Disco","Llanta delantera/trasera":"3.0-10 - 3.0-10. Sin cÃ¡mara","Largo*ancho*altura (cm)":"179 * 75 * 124","Peso en seco (kg)":"60 kg","DETALLES":"Luz intermitente y faros con diseÃ±o, autobloqueo, llave oculta dentro del control inalÃ¡mbrico, parador central y lateral"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (27, '{"NÃºmero modos de manejo":"4 (bajo, neutro, alto y retroceso)","Altura del piso a la base (cm)":"20 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"65 *Sin conductor sentado","Tablero de informaciÃ³n":"LCD","Alarma elÃ©ctrica antirrobo":"Si","Asiento":"Un asiento amplio 32*74","Tolva (largo * ancho * alto) (cm)":"SÃ­, 154 * 103 * 47","Puerto USB para carga de celular":"No","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/muelle","Freno delantero/trasero)":"Tambor/tambor","Llanta delantera/trasera":"4.00-12 / 4.00-12, tubular","Largo*ancho*altura (cm)":"310 * 170 * 171","Peso en seco (kg)":"199 kg"}'::jsonb);

INSERT INTO info_adicional (producto_id, data) VALUES (28, '{"NÃºmero modos de manejo":"3 (bajo, medio, alto y retroceso)","Altura del piso a la base (cm)":"20 *Conductor de 65 kg sentado","Altura del asiento al piso (cm)":"65 *Sin conductor sentado","Tablero de informaciÃ³n":"LCD","Alarma elÃ©ctrica antirrobo":"Si","Asiento":"Un asiento amplio 32*74","Tolva (largo * ancho * alto) (cm)":"SÃ­, 160 * 110 * 120","Puerto USB para carga de celular":"No","Luces Direccionales (delantera/posterior)":"Si / Si","Luces Intermitentes":"si","SuspensiÃ³n delantera/trasera":"TelescÃ³pica/muelle","Freno delantero/trasero)":"Sin freno/tambor","Llanta delantera/trasera":"4.00-12 / 4.50-12, tubular","Largo*ancho*altura (cm)":"300 * 110 * 180","Peso en seco (kg)":"250 kg"}'::jsonb);


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

-- ============================================================
-- Datos consolidados de ubicaciones, blog, testimonios y videos
-- ============================================================

-- TIENDAS
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'Lince', 'Lince', 'Av. JosÃ© Leal 507', -12.085146567066403, -77.03900011936942, 'Lun-SÃ¡b: 9am-7pm', '(51)960 773 053', '51960773053', 'https://api.whatsapp.com/send?phone=51960773053', 'https://maps.app.goo.gl/6cg4VfqtiS9krXqN8', TRUE, '(51)960 123 827', '51960123827', 'https://api.whatsapp.com/send?phone=51960123827', TRUE, 1);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'Surco', 'Surco', 'Av. Surco 790', -12.13808834009009, -76.99365814803508, 'Lun-SÃ¡b: 9am-7pm', '(51)977 814 692', '51977814692', 'https://api.whatsapp.com/send?phone=51977814692', 'https://maps.app.goo.gl/PwHPbwoTmcS9TZ6CA', TRUE, '(51)960 696 097', '51960696097', 'https://api.whatsapp.com/send?phone=51960696097', TRUE, 2);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'San Miguel', 'San Miguel', 'Av. de la Marina 1465', -12.078932027540436, -77.07759297208621, 'Lun-SÃ¡b: 9am-7pm', '(51)960 789 915', '51960789915', 'https://api.whatsapp.com/send?phone=51960789915', 'https://maps.app.goo.gl/BWouoxjVrWEF6y9w7', TRUE, '(51)960 685 280', '51960685280', 'https://api.whatsapp.com/send?phone=51960685280', TRUE, 3);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'Miraflores', 'Miraflores', 'Ca. Enrique Palacios 762', -12.116596161177519, -77.0364691616974, 'Lun-SÃ¡b: 9am-7pm', '(51)960 263 301', '51960263301', 'https://api.whatsapp.com/send?phone=51960263301', NULL, FALSE, NULL, NULL, NULL, TRUE, 4);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'La Molina', 'La Molina', 'Av. Javier Prado Este 5393', -12.074346110017737, -76.96315207658266, 'Lun-SÃ¡b: 9am-7pm', '(51)960 138 010', '51960138010', 'https://api.whatsapp.com/send?phone=51960138010', 'https://maps.app.goo.gl/Fn8CDxb55v62MbGG9', TRUE, '(51)981 382 163', '51981382163', 'https://api.whatsapp.com/send?phone=51981382163', TRUE, 5);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'Comas', 'Comas', 'Av. Tupac Amaru 3999', -11.932495139254188, -77.04623190402846, 'Lun-SÃ¡b: 9am-7pm', '(51)992 179 133', '51992179133', 'https://api.whatsapp.com/send?phone=51992179133', NULL, FALSE, NULL, NULL, NULL, TRUE, 6);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'Salamanca', 'Salamanca', 'Jr Inca Garcilazo de la Vega NÂ°218, 1er piso, Salamanca de Monterrico', -12.07548387997236, -76.98728711532839, NULL, '(51)991 196 895', '51991196895', 'https://wa.link/kb8ur1', 'https://maps.app.goo.gl/SE1kDkKQZo3uiuHK7', FALSE, NULL, NULL, NULL, TRUE, 7);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('PerÃº', 'JunÃ­n', 'Huancayo', 'Huancayo', 'Huancayo', 'Av. Huancavelica 290', -12.065580600861884, -75.2174621040265, 'Lun-SÃ¡b: 9am-6pm', '(51)944 030 267', '51944030267', 'https://api.whatsapp.com/send?phone=51944030267', 'https://maps.app.goo.gl/Ugc4XWjwPGqt3CYP7', TRUE, '(51)944 030 267', '51944030267', 'https://api.whatsapp.com/send?phone=51944030267', TRUE, 8);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('Chile', 'RegiÃ³n Metropolitana', 'Santiago', 'Santiago', 'Santiago', 'San Diego 1202, Santiago, RegiÃ³n Metropolitana', -33.4565, -70.6483, NULL, '9 8662 0355', '986620355', 'https://wa.link/5b95ba', 'https://goo.gl/maps/CPQMviL766DPDgN96', FALSE, NULL, NULL, NULL, TRUE, 9);

-- DISTRIBUIDORES
-- priority: 1=verde/compran siempre, 2=amarillo/compran, 3=rojo/ocasional.
-- coordinate_precision='city' indica que, al no existir un enlace de Maps
-- en la fuente, la coordenada corresponde a la localidad y no a una puerta
-- exacta. No se inventan coordenadas de establecimiento.
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Barranca', 'Barranca', 'Barranca', 'Aguila Motos', '10455505998', 'Aguila Osorio Johan YaÃ¯d', 'Jr. RamÃ³n Castilla 677', -10.7522, -77.7667, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Ram%C3%B3n+Castilla+677%2C+Barranca%2C+Barranca%2C+Barranca%2C+Per%C3%BA', '+51 997 699 085', '51997699085', 'https://api.whatsapp.com/send?phone=51997699085', 1, TRUE, TRUE, 1);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Huaral', 'Huaral', 'Distribuidora Luis Alberto', '20408124400', 'Rufino Caracciolo Maza', 'Calle circunvalaciÃ³n este s/n, tienda 29, mercado Mora Parra', -11.495, -77.207, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+circunvalaci%C3%B3n+este+s%2Fn%2C+tienda+29%2C+mercado+Mora+Parra%2C+Huaral%2C+Huaral%2C+Lima%2C+Per%C3%BA', '+51 922 434 518', '51922434518', 'https://api.whatsapp.com/send?phone=51922434518', 1, TRUE, TRUE, 2);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Huaral', 'Huaral', 'Comercial Joan', '10408069845', 'Merlyn Cruz Damaso', 'Av. Cahuas 417, Huaral', -11.495, -77.207, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Cahuas+417%2C+Huaral%2C+Huaral%2C+Huaral%2C+Lima%2C+Per%C3%BA', '+51 920 707 776', '51920707776', 'https://api.whatsapp.com/send?phone=51920707776', 2, TRUE, TRUE, 3);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Huaral', 'Huaral', 'Saja Import', '20611349352', 'Jamir Omar Naupari Pastrana', 'Calle Bolognesi 126, Huaral', -11.495, -77.207, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Bolognesi+126%2C+Huaral%2C+Huaral%2C+Huaral%2C+Lima%2C+Per%C3%BA', '+51 941 386 549', '51941386549', 'https://api.whatsapp.com/send?phone=51941386549', 2, TRUE, TRUE, 4);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Huaura', 'Huacho', 'Distribuidora Luis Alberto', '20408124400', 'Rufino Caracciolo Maza', 'Av. TÃºpac Amaru 174, Huacho', -11.1067, -77.605, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+T%C3%BApac+Amaru+174%2C+Huacho%2C+Huacho%2C+Huaura%2C+Lima%2C+Per%C3%BA', '+51 993 703 549', '51993703549', 'https://api.whatsapp.com/send?phone=51993703549', 1, TRUE, TRUE, 5);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Ancash', 'Huarmey', 'Huarmey', 'Richy Motors', '20606765038', 'Paul Alexis CÃ¡ceres Reyes', 'Calle Casma 295, Huarmey', -10.0681, -78.1522, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Casma+295%2C+Huarmey%2C+Huarmey%2C+Huarmey%2C+Ancash%2C+Per%C3%BA', '+51 949 494 430', '51949494430', 'https://api.whatsapp.com/send?phone=51949494430', 1, TRUE, TRUE, 6);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Cajamarca', 'Cajamarca', 'Cajamarca', 'Global Newtech', '20605214186', 'Stiven Mijail DÃ¡vila FernÃ¡ndez', 'Jr. Juan Beato MasÃ­as 569, Cajamarca', -7.1638, -78.5003, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Juan+Beato+Mas%C3%ADas+569%2C+Cajamarca%2C+Cajamarca%2C+Cajamarca%2C+Cajamarca%2C+Per%C3%BA', '+51 998 885 364', '51998885364', 'https://api.whatsapp.com/send?phone=51998885364', 1, TRUE, TRUE, 7);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Cajamarca', 'JaÃ©n', 'JaÃ©n', 'R&C Soluciones', '20613083791', 'Yonil Isidro Ruiz Bustamante', 'Calle Orellana 210, JaÃ©n', -5.7073, -78.8078, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Orellana+210%2C+Ja%C3%A9n%2C+Ja%C3%A9n%2C+Ja%C3%A9n%2C+Cajamarca%2C+Per%C3%BA', '+51 976 646 029', '51976646029', 'https://api.whatsapp.com/send?phone=51976646029', 1, TRUE, TRUE, 8);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Cajamarca', 'JaÃ©n', 'JaÃ©n', 'Motos Ferdi', '10431291415', 'Aracely del Pilar TantaleÃ¡n DÃ­az', 'Calle MarÃ­a Parado de Bellido 1026, JaÃ©n', -5.7073, -78.8078, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Mar%C3%ADa+Parado+de+Bellido+1026%2C+Ja%C3%A9n%2C+Ja%C3%A9n%2C+Ja%C3%A9n%2C+Cajamarca%2C+Per%C3%BA', '+51 942 189 058', '51942189058', 'https://api.whatsapp.com/send?phone=51942189058', 2, TRUE, TRUE, 9);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lambayeque', 'Chiclayo', 'Chiclayo', 'Korea Motors', '20479779598', 'Belizario GÃ¡lvez Bustamante', 'Av. A.B. LeguÃ­a 420, Chiclayo', -6.7714, -79.8409, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+A.B.+Legu%C3%ADa+420%2C+Chiclayo%2C+Chiclayo%2C+Chiclayo%2C+Lambayeque%2C+Per%C3%BA', '+51 933 618 828', '51933618828', 'https://api.whatsapp.com/send?phone=51933618828', 1, TRUE, TRUE, 10);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lambayeque', 'Chiclayo', 'Chiclayo', 'MecaElectric', '20606942312', 'Harold Jaime Cachay', 'Calle Teresa Gonzales de Fanning 429, Chiclayo', -6.7714, -79.8409, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Teresa+Gonzales+de+Fanning+429%2C+Chiclayo%2C+Chiclayo%2C+Chiclayo%2C+Lambayeque%2C+Per%C3%BA', '+51 912 902 546', '51912902546', 'https://api.whatsapp.com/send?phone=51912902546', 2, TRUE, TRUE, 11);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'La Libertad', 'Trujillo', 'Trujillo', 'JSV Motos ElÃ©ctricas', '10405845038', 'Jacinto Antonio SÃ¡nchez VÃ¡squez', 'Calle Cayetano Heredia 163, Urb. Los Granados', -8.1116, -79.0287, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Cayetano+Heredia+163%2C+Urb.+Los+Granados%2C+Trujillo%2C+Trujillo%2C+La+Libertad%2C+Per%C3%BA', '+51 935 405 452', '51935405452', 'https://api.whatsapp.com/send?phone=51935405452', 1, TRUE, TRUE, 12);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'La Libertad', 'Trujillo', 'Trujillo', 'Cel Movil', '20609189534', 'CÃ©sar Antonio Rojas Ruiz', 'Av. AmÃ©rica Sur 397, Urb. Aranjuez, Trujillo', -8.1116, -79.0287, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Am%C3%A9rica+Sur+397%2C+Urb.+Aranjuez%2C+Trujillo%2C+Trujillo%2C+Trujillo%2C+La+Libertad%2C+Per%C3%BA', '+51 910 325 038', '51910325038', 'https://api.whatsapp.com/send?phone=51910325038', 1, TRUE, TRUE, 13);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'La Libertad', 'Trujillo', 'Trujillo', 'RG MÃ³viles', '10719849135', 'RaÃºl Antony GÃ¡lvez Miranda', 'Mz. 26 Lt. 26, La Esperanza, Trujillo', -8.1116, -79.0287, 'city', 'https://www.google.com/maps/search/?api=1&query=Mz.+26+Lt.+26%2C+La+Esperanza%2C+Trujillo%2C+Trujillo%2C+Trujillo%2C+La+Libertad%2C+Per%C3%BA', '+51 994 620 079', '51994620079', 'https://api.whatsapp.com/send?phone=51994620079', 2, TRUE, TRUE, 14);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Ancash', 'Santa', 'Chimbote', 'Oveja Negra', '20606507870', 'Jorge Alberto Puente SarrÃ­n', 'Av. PacÃ­fico 580, Nuevo Chimbote', -9.0745, -78.5936, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Pac%C3%ADfico+580%2C+Nuevo+Chimbote%2C+Chimbote%2C+Santa%2C+Ancash%2C+Per%C3%BA', '+51 949 741 274', '51949741274', 'https://api.whatsapp.com/send?phone=51961448299', 1, TRUE, TRUE, 15);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Piura', 'Piura', 'Piura', 'GreenLine Piura', '10026833677', 'VÃ­ctor AndrÃ©s GarcÃ­a Escobar', 'Las Dalias Mz. Q lote 26, Urb. Miraflores Country, Piura', -5.1945, -80.6328, 'city', 'https://www.google.com/maps/search/?api=1&query=Las+Dalias+Mz.+Q+lote+26%2C+Urb.+Miraflores+Country%2C+Piura%2C+Piura%2C+Piura%2C+Piura%2C+Per%C3%BA', '+51 983 459 213', '51983459213', 'https://api.whatsapp.com/send?phone=51983459213', 1, TRUE, TRUE, 16);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Piura', 'Piura', 'Piura', 'Laban Import', '20493915445', 'Amado Laban PeÃ±a', 'Av. AndrÃ©s Avelino CÃ¡ceres 794, Piura', -5.1945, -80.6328, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Andr%C3%A9s+Avelino+C%C3%A1ceres+794%2C+Piura%2C+Piura%2C+Piura%2C+Piura%2C+Per%C3%BA', '+51 904 445 569', '51904445569', 'https://api.whatsapp.com/send?phone=51904445569', 3, TRUE, TRUE, 17);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Ancash', 'Huaylas', 'Huallanca', 'Multicentro Marben', '10444485456', 'Gladys Marlyn Ãvila Aquino', 'JirÃ³n Leoncio Prado 207, Huallanca', -9.9, -76.983, 'city', 'https://www.google.com/maps/search/?api=1&query=Jir%C3%B3n+Leoncio+Prado+207%2C+Huallanca%2C+Huallanca%2C+Huaylas%2C+Ancash%2C+Per%C3%BA', '+51 948 489 188', '51948489188', 'https://api.whatsapp.com/send?phone=51948489188', 2, TRUE, TRUE, 18);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'JunÃ­n', 'Jauja', 'Jauja', 'Hotel Casa', '10207211180', 'Raymundo Villarreal Adriana', 'Av. HÃ©roes de la BreÃ±a 389, Jauja', -11.7758, -75.4966, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+H%C3%A9roes+de+la+Bre%C3%B1a+389%2C+Jauja%2C+Jauja%2C+Jauja%2C+Jun%C3%ADn%2C+Per%C3%BA', '+51 900 805 307', '51900805307', 'https://api.whatsapp.com/send?phone=51900805307', 1, TRUE, TRUE, 19);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'JunÃ­n', 'Huancayo', 'Huancayo', 'K y L Motos', '10427688491', 'Edith Cely Campos Lucas', 'Av. Huancavelica 439, El Tambo, Huancayo', -12.0651, -75.2049, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Huancavelica+439%2C+El+Tambo%2C+Huancayo%2C+Huancayo%2C+Huancayo%2C+Jun%C3%ADn%2C+Per%C3%BA', '+51 953 212 102', '51953212102', 'https://api.whatsapp.com/send?phone=51953212102', 1, TRUE, TRUE, 20);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'JunÃ­n', 'Huancayo', 'Huancayo', 'Mas Motos', '20613011235', 'DarÃ­o Cabezas Zorrilla', 'Av. Huancavelica 540, El Tambo', -12.0651, -75.2049, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Huancavelica+540%2C+El+Tambo%2C+Huancayo%2C+Huancayo%2C+Jun%C3%ADn%2C+Per%C3%BA', '+51 975 999 977', '51975999977', 'https://api.whatsapp.com/send?phone=51975999977', 2, TRUE, TRUE, 21);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'JunÃ­n', 'Huancayo', 'Huancayo', 'Grupo Mototienda', '20606117281', 'Luis Ernesto DÃ­az GarcÃ­a', 'JirÃ³n Santa Rosa 466, El Tambo, Huancayo', -12.0651, -75.2049, 'city', 'https://www.google.com/maps/search/?api=1&query=Jir%C3%B3n+Santa+Rosa+466%2C+El+Tambo%2C+Huancayo%2C+Huancayo%2C+Huancayo%2C+Jun%C3%ADn%2C+Per%C3%BA', '+51 964 523 752 / +51 947 585 888', '51964523752', 'https://api.whatsapp.com/send?phone=51964523752', 2, TRUE, TRUE, 22);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Pasco', 'Pasco', 'Pasco', 'Multiproductos Nvision E&T', '10719225531', 'Diana Yanina DÃ­az DÃ¡vila', 'Av. Los PrÃ³ceres, Cerro de Pasco 19001', -10.6864, -76.2625, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Los+Pr%C3%B3ceres%2C+Cerro+de+Pasco+19001%2C+Pasco%2C+Pasco%2C+Pasco%2C+Per%C3%BA', '+51 957 790 239', '51957790239', 'https://api.whatsapp.com/send?phone=51957790239', 1, TRUE, TRUE, 23);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Pasco', 'Oxapampa', 'Oxapampa', 'Home Electronic', '20600217861', 'JosÃ© Manuel Lozano PalacÃ­n de Quispe', 'Jr. Grau 403, Oxapampa', -10.5775, -75.4028, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Grau+403%2C+Oxapampa%2C+Oxapampa%2C+Oxapampa%2C+Pasco%2C+Per%C3%BA', '+51 963 936 400', '51963936400', 'https://api.whatsapp.com/send?phone=51963936400', 3, TRUE, TRUE, 24);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Ucayali', 'Coronel Portillo', 'Pucallpa', 'Amazon GreenLine', '20393347041', 'SaÃºl Duarte Galarza Granados', 'Jr. TarapacÃ¡ 295, distrito CallerÃ­a, Coronel Portillo', -8.3791, -74.5539, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Tarapac%C3%A1+295%2C+distrito+Caller%C3%ADa%2C+Coronel+Portillo%2C+Pucallpa%2C+Coronel+Portillo%2C+Ucayali%2C+Per%C3%BA', '+51 920 716 945', '51920716945', 'https://api.whatsapp.com/send?phone=51920716945', 1, TRUE, TRUE, 25);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Puno', 'San RomÃ¡n', 'Juliaca', 'Global Ecotech', '20613416642', 'Roosvelth JuÃ¡rez Condori', 'Jr. Mariano NÃºÃ±ez 1310, Juliaca', -15.4899, -70.1277, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Mariano+N%C3%BA%C3%B1ez+1310%2C+Juliaca%2C+Juliaca%2C+San+Rom%C3%A1n%2C+Puno%2C+Per%C3%BA', '+51 974 545 598', '51974545598', 'https://api.whatsapp.com/send?phone=51974545598', 2, TRUE, TRUE, 26);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Ica', 'Nasca', 'Marcona', 'Hepageza', '20452748291', 'Elder Egerio Pajta Apaza', 'Av. Los Incas Nro. s/n, Marcona, Ica - Nasca', -15.3639, -75.1628, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Los+Incas+Nro.+s%2Fn%2C+Marcona%2C+Ica+-+Nasca%2C+Marcona%2C+Nasca%2C+Ica%2C+Per%C3%BA', '+51 956 955 718', '51956955718', 'https://api.whatsapp.com/send?phone=51956955718', 1, TRUE, TRUE, 27);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'CaÃ±ete', 'CaÃ±ete', 'Export Motors', '20491409089', 'Teodoro PelÃ¡ez PÃ©rez', 'Av. 28 de Julio 973, Imperial, 15701', -13.077, -76.39, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+28+de+Julio+973%2C+Imperial%2C+15701%2C+Ca%C3%B1ete%2C+Ca%C3%B1ete%2C+Lima%2C+Per%C3%BA', '+51 951 521 664', '51951521664', 'https://api.whatsapp.com/send?phone=51951521664', 3, TRUE, TRUE, 28);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Ica', 'Chincha', 'Chincha', 'Pequiva', '20602103405', 'Jeyson IvÃ¡n Echajalla Espinoza', 'Panamericana Sur Km 199 #351, Chincha Alta', -13.4099, -76.1326, 'city', 'https://www.google.com/maps/search/?api=1&query=Panamericana+Sur+Km+199+%23351%2C+Chincha+Alta%2C+Chincha%2C+Chincha%2C+Ica%2C+Per%C3%BA', '+51 927 803 061', '51927803061', 'https://api.whatsapp.com/send?phone=51927803061', 1, TRUE, TRUE, 29);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Tacna', 'Tacna', 'Tacna', 'Lupol Motos', '20608240871', 'Lucio Callata Copari', 'A.H. Alfonso Ugarte I Etapa Mz. G3 Lt. 41, Tacna', -18.0147, -70.2536, 'city', 'https://www.google.com/maps/search/?api=1&query=A.H.+Alfonso+Ugarte+I+Etapa+Mz.+G3+Lt.+41%2C+Tacna%2C+Tacna%2C+Tacna%2C+Tacna%2C+Per%C3%BA', '+51 956 018 820', '51956018820', 'https://api.whatsapp.com/send?phone=51956018820', 1, TRUE, TRUE, 30);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Ayacucho', 'Huamanga', 'Ayacucho', 'Sonia Ayme', '10744604279', 'Julieta PlÃ¡cida Godoy Ayme', 'Jr. AmÃ©rico Ore 125, Ayacucho', -13.1631, -74.2236, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Am%C3%A9rico+Ore+125%2C+Ayacucho%2C+Ayacucho%2C+Huamanga%2C+Ayacucho%2C+Per%C3%BA', '+51 920 264 834', '51920264834', 'https://api.whatsapp.com/send?phone=51920264834', 2, TRUE, TRUE, 31);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Puno', 'Chucuito', 'Desaguadero', 'Nayoga Group', '20601662672', 'Huber Huacca Ramos', 'Jr. Grau Nro. 524, Puno - Desaguadero', -16.5656, -69.0417, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Grau+Nro.+524%2C+Puno+-+Desaguadero%2C+Desaguadero%2C+Chucuito%2C+Puno%2C+Per%C3%BA', '+51 925 791 681', '51925791681', 'https://api.whatsapp.com/send?phone=51925791681', 2, TRUE, TRUE, 32);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Puno', 'Puno', 'Puno', 'Tienda OLA', '20601969310', 'Ronald Ernesto Castro Hancco', 'Jr. Arequipa Nro. 796, Puno', -15.8402, -70.0219, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Arequipa+Nro.+796%2C+Puno%2C+Puno%2C+Puno%2C+Puno%2C+Per%C3%BA', '+51 916 712 150', '51916712150', 'https://api.whatsapp.com/send?phone=51916712150', 2, TRUE, TRUE, 33);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Puno', 'AzÃ¡ngaro', 'AzÃ¡ngaro', 'Provisur Technologies', '10015449263', 'Elvira Tite Calcina', 'Jr. E. JimÃ©nez 113, AzÃ¡ngaro', -14.9087, -70.1968, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+E.+Jim%C3%A9nez+113%2C+Az%C3%A1ngaro%2C+Az%C3%A1ngaro%2C+Az%C3%A1ngaro%2C+Puno%2C+Per%C3%BA', '+51 910 098 882', '51910098882', 'https://api.whatsapp.com/send?phone=51910098882', 2, TRUE, TRUE, 34);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Cusco', 'Espinar', 'Espinar', 'B Store', '20612589268', 'Jean Carlos Kana Choquenaira', 'Calle Pumacahua 205, Espinar', -14.7934, -71.4127, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Pumacahua+205%2C+Espinar%2C+Espinar%2C+Espinar%2C+Cusco%2C+Per%C3%BA', '+51 992 123 031', '51992123031', 'https://api.whatsapp.com/send?phone=51992123031', 1, TRUE, TRUE, 35);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Arequipa', 'Caylloma', 'Majes', 'Motos ElÃ©ctricas Aventure', '20615841634', 'Jhon Fernando Chinchercoma Ochoa', 'Av. Arequipa Mz. B lote 01, Majes', -16.3547, -72.1897, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Arequipa+Mz.+B+lote+01%2C+Majes%2C+Majes%2C+Caylloma%2C+Arequipa%2C+Per%C3%BA', '+51 901 055 897', '51901055897', 'https://api.whatsapp.com/send?phone=51901055897', 1, TRUE, TRUE, 36);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Arequipa', 'Arequipa', 'Arequipa', 'Electro Sami Import', '20616195990', 'Gualberto CristÃ³bal Cahuana Palacios', 'Av. Porongoche NÂ°710, JosÃ© Luis Bustamante y Rivero', -16.409, -71.5375, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Porongoche+N%C2%B0710%2C+Jos%C3%A9+Luis+Bustamante+y+Rivero%2C+Arequipa%2C+Arequipa%2C+Arequipa%2C+Per%C3%BA', '+51 943 540 373', '51943540373', 'https://api.whatsapp.com/send?phone=51943540373', 1, TRUE, TRUE, 37);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Arequipa', 'Arequipa', 'Arequipa', 'Energreen VehÃ­culos ElÃ©ctricos', '10296176155', 'Amador Vega Quispe', 'Av. EspaÃ±a 406, Alto Selva Alegre, Arequipa', -16.409, -71.5375, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Espa%C3%B1a+406%2C+Alto+Selva+Alegre%2C+Arequipa%2C+Arequipa%2C+Arequipa%2C+Arequipa%2C+Per%C3%BA', '+51 986 625 685', '51986625685', 'https://api.whatsapp.com/send?phone=51986625685', 1, TRUE, TRUE, 38);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Arequipa', 'Arequipa', 'Arequipa', 'Elektro Energy', '20607270521', 'Kiara Llerena Medina', 'JosÃ© Luis Bustamante y Rivero 04000, Arequipa', -16.409, -71.5375, 'city', 'https://www.google.com/maps/search/?api=1&query=Jos%C3%A9+Luis+Bustamante+y+Rivero+04000%2C+Arequipa%2C+Arequipa%2C+Arequipa%2C+Arequipa%2C+Per%C3%BA', '+51 943 352 538', '51943352538', 'https://api.whatsapp.com/send?phone=51943352538', 1, TRUE, TRUE, 39);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Arequipa', 'CamanÃ¡', 'CamanÃ¡', 'Carmen AragÃ³n', '10428108006', 'Carmen Milagros AragÃ³n Saire', 'Jr. San MartÃ­n 129, CamanÃ¡', -16.6238, -72.7111, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+San+Mart%C3%ADn+129%2C+Caman%C3%A1%2C+Caman%C3%A1%2C+Caman%C3%A1%2C+Arequipa%2C+Per%C3%BA', '+51 950 548 007', '51950548007', 'https://api.whatsapp.com/send?phone=51950548007', 1, TRUE, TRUE, 40);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'San MartÃ­n', 'Tocache', 'Tocache', 'O''Lan', '20601579759', 'Oriol Edmundo Lavado NoreÃ±a', 'Av. Fernando Belaunde Terry s/n, Nuevo Bambamarca, Tocache', -8.1889, -76.513, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Fernando+Belaunde+Terry+s%2Fn%2C+Nuevo+Bambamarca%2C+Tocache%2C+Tocache%2C+Tocache%2C+San+Mart%C3%ADn%2C+Per%C3%BA', '+51 944 779 635', '51944779635', 'https://api.whatsapp.com/send?phone=51944779635', 2, TRUE, TRUE, 41);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'San Bartolo', 'Electron Motos', '10468200169', 'Carmen Daniela Urbina Malaspina', 'San Bartolo, Lima', -12.3896, -76.78, 'city', 'https://www.google.com/maps/search/?api=1&query=San+Bartolo%2C+Lima%2C+San+Bartolo%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 915 179 744', '51915179744', 'https://api.whatsapp.com/send?phone=51915179744', 1, TRUE, TRUE, 42);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'San Juan de Lurigancho', 'San Lucas', '20550806232', 'Pedro Marcas Mirabal', 'Av. PrÃ³ceres de la Independencia NÂ° 2142, San Juan de Lurigancho', -11.984, -77.004, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Pr%C3%B3ceres+de+la+Independencia+N%C2%B0+2142%2C+San+Juan+de+Lurigancho%2C+San+Juan+de+Lurigancho%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 932 682 911', '51932682911', 'https://api.whatsapp.com/send?phone=51932682911', 1, TRUE, TRUE, 43);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'San Juan de Lurigancho', 'Jehova Jireh', '10806115741', 'Ledy Maritza Gonzales Mucha', 'Avenida Grau 320, San Juan de Lurigancho', -11.984, -77.004, 'city', 'https://www.google.com/maps/search/?api=1&query=Avenida+Grau+320%2C+San+Juan+de+Lurigancho%2C+San+Juan+de+Lurigancho%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 972 463 141', '51972463141', 'https://api.whatsapp.com/send?phone=51972463141', 2, TRUE, TRUE, 44);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'Puente Piedra', 'AP Motos', '20392652566', 'Manuel Eugenio Paredez Cruzado', 'Av. Panamericana Norte Urb. Huarangal Mz. I Lt. 15, Puente Piedra', -11.865, -77.075, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Panamericana+Norte+Urb.+Huarangal+Mz.+I+Lt.+15%2C+Puente+Piedra%2C+Puente+Piedra%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 992 445 077', '51992445077', 'https://api.whatsapp.com/send?phone=51992445077', 1, TRUE, TRUE, 45);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'Chaclacayo', 'LKP', '20547808429', 'Fidel Luis Arias Cas', 'Cooperativa La Floresta Mz. B lote 18, calle Las Tunas, Chaclacayo', -11.982, -76.767, 'city', 'https://www.google.com/maps/search/?api=1&query=Cooperativa+La+Floresta+Mz.+B+lote+18%2C+calle+Las+Tunas%2C+Chaclacayo%2C+Chaclacayo%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 928 398 831', '51928398831', 'https://api.whatsapp.com/send?phone=51928398831', 1, TRUE, TRUE, 46);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'Ate', 'Motoclass', '20613823086', 'Luis Eduardo Trujillo Saira', 'Mza. Y Lote 2, Asc. Parque Industrial El Asesor, Ate', -12.026, -76.918, 'city', 'https://www.google.com/maps/search/?api=1&query=Mza.+Y+Lote+2%2C+Asc.+Parque+Industrial+El+Asesor%2C+Ate%2C+Ate%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 941 636 941 / +51 921 313 740 / +51 921 636 941', '51941636941', 'https://api.whatsapp.com/send?phone=51941636941', 2, TRUE, TRUE, 47);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'La Victoria', 'Jaames Bike', '20608811347', 'Jaime Alcedo Ureta', 'Jr. Misti 160, La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Misti+160%2C+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 991 907 515', '51991907515', 'https://api.whatsapp.com/send?phone=51991907515', 1, TRUE, TRUE, 48);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'La Victoria', 'HM Bike Shop', '10761940843', 'Juan Martin Honor Montano', 'Jr. Luna Pizarro 129, La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Luna+Pizarro+129%2C+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 933 529 728', '51933529728', 'https://api.whatsapp.com/send?phone=51933529728', 2, TRUE, TRUE, 49);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'La Victoria', 'Bike Ride', '10422127661', 'John Ignacio Alcedo Quiquia', 'Jr. HuascarÃ¡n 200, La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Huascar%C3%A1n+200%2C+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 987 396 470', '51987396470', 'https://api.whatsapp.com/send?phone=51987396470', 2, TRUE, TRUE, 50);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'La Victoria', 'Rolys Import', '20609490048', 'Elizabeth Marisol Sano Vallejos', 'Jr. Misti Nro. 166, Lima - La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Misti+Nro.+166%2C+Lima+-+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 956 913 784', '51956913784', 'https://api.whatsapp.com/send?phone=51956913784', 2, TRUE, TRUE, 51);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'La Victoria', 'Villegas', '10477371073', 'Isabel Mery Villegas Pari', 'Av. Almirante Miguel Grau 510, La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Almirante+Miguel+Grau+510%2C+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 906 252 707', '51906252707', 'https://api.whatsapp.com/send?phone=51906252707', 2, TRUE, TRUE, 52);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'La Victoria', 'Black Line', '20615993647', 'Angela Sara Pari Cueva', 'Av. Manco CÃ¡pac 182-186-190, La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Manco+C%C3%A1pac+182-186-190%2C+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 923 823 957', '51923823957', 'https://api.whatsapp.com/send?phone=51923823957', 2, TRUE, TRUE, 53);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'La Victoria', 'F14 Bike', '20612777200', 'Jorge Luis Mamani Gonzales', 'Jr. Misti Nro. 240 Int. 10, Lima - La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Misti+Nro.+240+Int.+10%2C+Lima+-+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 934 360 322', '51934360322', 'https://api.whatsapp.com/send?phone=51934360322', 2, TRUE, TRUE, 54);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('PerÃº', 'Lima', 'Lima', 'La Victoria', 'Goldus Motor', '20566000866', 'Lucia Ayquipa', 'Av. Luna Pizarro Nro. 174 Int. 10, Lima', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Luna+Pizarro+Nro.+174+Int.+10%2C+Lima%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 978 219 237', '51978219237', 'https://api.whatsapp.com/send?phone=51978219237', 2, TRUE, TRUE, 55);

-- VENTAS PROVINCIAS
INSERT INTO greenline_province_sales
(country, name, phone, whatsapp_number, whatsapp_url)
VALUES
('PerÃº', 'Ventas provincias', '(51)992 109 852', '51992109852',
 'https://api.whatsapp.com/send?phone=51992109852');

INSERT INTO testimonios (nombre, rol, texto, vehiculo, rating, orden, activo) VALUES
  ('Carlos Mendoza', 'Cliente desde 2022', 'ComprÃ© una VMP P01 para mis trayectos diarios al trabajo. Ahorro mÃ¡s de S/ 400 al mes en combustible. El servicio postventa de Green Line es excelente.', 'VMP P01', 5, 1, true),
  ('MarÃ­a LÃ³pez', 'Cliente desde 2023', 'La trimoto elÃ©ctrica cambiÃ³ mi negocio de delivery. Es silenciosa, eficiente y mis clientes notan la diferencia. 100% recomendada.', 'Trimoto T-15', 5, 2, true),
  ('Roberto Silva', 'Cliente desde 2021', 'Tengo la Sunra E8 y es una maravilla. La baterÃ­a dura toda la semana con mi uso diario. El equipo de Green Line me asesorÃ³ perfecto.', 'Sunra E8', 5, 3, true),
  ('Ana Torres', 'Cliente desde 2024', 'Me encanta mi carguero elÃ©ctrico. Lo uso para repartir en mi panaderÃ­a y es sÃºper prÃ¡ctico. Carga en cualquier enchufe normal.', 'Carguero C-20', 5, 4, true),
  ('Diego RamÃ­rez', 'Cliente desde 2023', 'Excelente relaciÃ³n calidad-precio. El seguro es muy accesible y la matrÃ­cula gratuita fue un gran plus. Solo le doy 4 estrellas porque querÃ­a mÃ¡s colores disponibles.', 'VMP P01', 4, 5, true),
  ('Luciana Vega', 'Cliente desde 2024', 'Como parte de la comunidad universitaria, obtuve un descuento increÃ­ble. La moto es perfecta para ir a la universidad y de paseo los fines de semana.', 'Sunra E5', 5, 6, true);
-- ============================================================
-- MigraciÃ³n 2026-09-10: videos de YouTube por modelo (videosYT)
-- Fuente: frontend/lib/videosYT.js (modelo_vehÃ­culo â†’ url)
-- Validado contra la tabla real productos (33 filas, 2026-09-10).
-- Asigna a cada producto el video de su modelo segÃºn el nombre,
-- con lÃ­mite de palabra (evita mezclar p. ej. GL3 con L3).
-- Cuando un modelo tiene 2 videos se guarda el primero en video_id;
-- el resto se muestra en la vista vÃ­a videosForProduct.
-- ============================================================

UPDATE productos
SET video_id = 'Zxkomo2Ccs0'
WHERE nombre ~* '(^|[^a-z0-9])S4 Pro([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

UPDATE productos
SET video_id = 'XMHwoozejJI'
WHERE nombre ~* '(^|[^a-z0-9])Y5([^a-z0-9]|$)' AND (video_id IS NULL OR video_id = '');

-- Video GL3: la URL original tiene typo "hhttps://youtu.be/-FC6WVJvIoo"
-- por eso aquÃ­ se almacena el ID limpio (misma soluciÃ³n para todos).
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
-- por eso este patrÃ³n admite X6 seguido de PRO sin separador.
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
--   H5 Â· TM4 Pro Â· TC2-160 Power Pro
-- Los posibles candidatos de TC2-160 (TC2-160A y TC2-160 con
-- Techo) tienen NOMBRE distinto y NO se asocian a ese video.
-- ------------------------------------------------------------
-- 2) Colores corregidos en la data
--    FL2 (id 1): solo se comercializa en Rojo.
--    TM7 v2026 (id 10): solo se comercializa en Blanco.
--    ANTES: el frontend forzaba estos colores por cÃ³digo.
-- ============================================================

-- FL2: quitar colores Blanco/Negro y sus fotos (queda Rojo)
DELETE FROM prod_color_rel
WHERE producto_id = 1
  AND color_id IN (SELECT id FROM colores WHERE nombre IN ('Blanco', 'Negro'));

DELETE FROM imagenes
WHERE producto_id = 1
  AND color IN ('Negro', 'Blanco');

-- TM7: quitar el color Gris de la relaciÃ³n (Blanco se mantiene)
DELETE FROM prod_color_rel
WHERE producto_id = 10
  AND color_id IN (SELECT id FROM colores WHERE nombre = 'Gris');

-- TM7: etiquetar las fotos existentes como Blanco (color Ãºnico comercializado)
UPDATE imagenes
SET color = 'Blanco'
WHERE producto_id = 10;

-- Roles habilitados para el panel y el directorio.
INSERT INTO panel_acceso (rol) VALUES
  ('ADMIN'), ('DESARROLLADOR_WEB'), ('DISTRIBUCION'), ('EDITORA_BLOG')
ON CONFLICT (rol) DO NOTHING;

-- El stock numérico por sucursal comienza en cero; las relaciones de catálogo se conservan.
UPDATE prod_color_rel SET stock = 0 WHERE stock <> 0;

-- ============================================================
-- Manuales de uso por producto (manual_pdf)
-- Fuente: frontend/lib/manuales.js (slug del producto â†' archivo pdf)
-- Los PDFs viven en /assets/manuales_uso/ (almacenamiento estático local).
-- Solo cuando el producto NO tiene manual_pdf se usa el mapa local como fallback.
-- ============================================================

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

-- ============================================================
-- Catálogo global de manuales (greenline_manuales)
-- Fuente: frontend/data/manuales_db.json (generado por generate-manuales.mjs)
-- Los PDFs viven en /assets/manuales_uso/ (almacenamiento estático local).
-- Alimenta la página /manuales-de-uso. Los productos se vinculan vía
-- productos.manual_pdf (los que no tienen manual quedan con id vacío/NULL).
-- ============================================================

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

-- 4.1 Tiendas
INSERT INTO tiendas (id, nombre, direccion, ciudad, tipo, activa)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'GreenLine Almacén Central',  'Av. Industrial 123',      'Lima',     'almacen', true),
  ('00000000-0000-0000-0000-000000000002', 'GreenLine Tienda Lince',     'Av. José Leal 507',      'Lima',     'tienda',  true),
  ('00000000-0000-0000-0000-000000000003', 'GreenLine Tienda Surco',     'Av. Surco 790',          'Lima',     'tienda',  true),
  ('00000000-0000-0000-0000-000000000004', 'GreenLine Tienda Huancayo',  'Av. Huancavelica 290',   'Huancayo', 'tienda',  true)
ON CONFLICT (id) DO NOTHING;

-- 4.2 Usuarios (contraseñas hasheadas con argon2id)
-- admin@greenline.com / GreenLine@2026
INSERT INTO users (id, email, password_hash, nombre, apellido, rol, nivel_acceso, email_verificado, activo)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'admin@greenline.com',
  '$argon2id$v=19$m=65536,t=4,p=4$d2hhdGV2ZXI$placeholder',
  'Admin', 'GreenLine',
  'ADMIN', 'SUPER',
  true, true
)
ON CONFLICT (email) DO NOTHING;

-- gerente.lince@greenline.com / Gerente@2026
INSERT INTO users (id, email, password_hash, nombre, apellido, rol, nivel_acceso, tienda_id, email_verificado, activo)
VALUES (
  '10000000-0000-0000-0000-000000000002',
  'gerente.lince@greenline.com',
  '$argon2id$v=19$m=65536,t=4,p=4$d2hhdGV2ZXI$placeholder',
  'Carlos', 'Mendoza',
  'GERENTE_TIENDA', 'TIENDA',
  '00000000-0000-0000-0000-000000000002',
  true, true
)
ON CONFLICT (email) DO NOTHING;

-- colaborador.lince@greenline.com / Colab@2026
INSERT INTO users (id, email, password_hash, nombre, apellido, rol, nivel_acceso, tienda_id, gerente_id, email_verificado, activo)
VALUES (
  '10000000-0000-0000-0000-000000000003',
  'colaborador.lince@greenline.com',
  '$argon2id$v=19$m=65536,t=4,p=4$d2hhdGV2ZXI$placeholder',
  'María', 'García',
  'COLABORADOR_TIENDA', 'TIENDA',
  '00000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000002',
  true, true
)
ON CONFLICT (email) DO NOTHING;

-- cliente@test.com / Cliente@2026
INSERT INTO users (id, email, password_hash, nombre, apellido, rol, nivel_acceso, email_verificado, activo)
VALUES (
  '10000000-0000-0000-0000-000000000004',
  'cliente@test.com',
  '$argon2id$v=19$m=65536,t=4,p=4$d2hhdGV2ZXI$placeholder',
  'Juan', 'Pérez',
  'CLIENTE', 'CLIENTE_N',
  true, true
)
ON CONFLICT (email) DO NOTHING;

-- ivan.manrique@greenline.com / greenlinwerb34$
INSERT INTO users (id, email, password_hash, nombre, apellido, rol, nivel_acceso, email_verificado, activo)
VALUES (
  '10000000-0000-0000-0000-000000000005',
  'ivan.manrique@greenline.com',
  '$argon2id$v=19$m=65536,t=4,p=4$d2hhdGV2ZXI$placeholder',
  'Ivan Daniel', 'Manrique Roa',
  'DESARROLLADOR_WEB', 'SUPER',
  true, true
)
ON CONFLICT (email) DO NOTHING;

-- 4.3 Perfil del cliente de prueba
INSERT INTO cliente_profiles (user_id, documento, direccion, ciudad, departamento)
VALUES (
  '10000000-0000-0000-0000-000000000004',
  '12345678',
  'Av. Primavera 123',
  'Lima', 'Lima'
)
ON CONFLICT (user_id) DO NOTHING;

COMMIT;
