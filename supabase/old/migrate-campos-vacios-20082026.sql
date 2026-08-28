-- ============================================================
-- MIGRACIÓN: Precios + Info Adicional GL3 + Limpieza HTML
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

DELETE FROM productos WHERE id = '6';

-- 1. PRECIOS desde JSON local
-- Mapeo: nombre_en_supabase → precio_actual, precio_original

UPDATE productos SET precio_actual = 2300, precio_original = 2600 WHERE id = 15;
UPDATE productos SET precio_actual = 4100, precio_original = 3700 WHERE id = 5;
UPDATE productos SET precio_actual = 2900, precio_original = 3400 WHERE id = 17;
UPDATE productos SET precio_actual = 3700, precio_original = 4000 WHERE id = 20;
UPDATE productos SET precio_actual = 4200, precio_original = 4600 WHERE id = 14;
UPDATE productos SET precio_actual = 5200, precio_original = 5500 WHERE id = 21;
UPDATE productos SET precio_actual = 6400, precio_original = 7300 WHERE id = 18;
UPDATE productos SET precio_actual = 7200, precio_original = 7600 WHERE id = 19;
UPDATE productos SET precio_actual = 2300, precio_original = 2150 WHERE id = 1;
UPDATE productos SET precio_actual = 4100, precio_original = 3700 WHERE id = 5;
UPDATE productos SET precio_actual = 5500, precio_original = 5200 WHERE id = 6;
UPDATE productos SET precio_actual = 6500, precio_original = 6000 WHERE id = 9;
UPDATE productos SET precio_actual = 8000, precio_original = 7300 WHERE id = 16;
UPDATE productos SET precio_actual = 5000, precio_original = 5600 WHERE id = 7;
UPDATE productos SET precio_actual = 5500, precio_original = 5900 WHERE id = 8;
UPDATE productos SET precio_actual = 4500, precio_original = 5000 WHERE id = 10;
UPDATE productos SET precio_actual = 3600, precio_original = 3800 WHERE id = 11;
UPDATE productos SET precio_actual = 3700, precio_original = 4000 WHERE id = 12;
UPDATE productos SET precio_actual = 5200, precio_original = 5500 WHERE id = 13;

-- 2. INFO ADICIONAL DEL GL3 (id 21)
INSERT INTO info_adicional (producto_id, data)
VALUES (21, '{
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
}')
ON CONFLICT (producto_id) DO UPDATE SET data = EXCLUDED.data;

-- ============================================================
-- 3. EXTRACCIÓN DE DATOS LIMPIOS A FICHA_TECNICA
-- ============================================================
UPDATE ficha_tecnica SET potencia_motor = '240W', potencia_bateria = '36V/8AH', tipo_bateria = 'Litio', velocidad_max_kmh = 20, autonomia_km = 35, largo_cm = 88, ancho_cm = 50, alto_cm = 70 WHERE producto_id = 1;

UPDATE ficha_tecnica SET tipo_bateria = 'Litio', largo_cm = 172, ancho_cm = 71, alto_cm = 111 WHERE producto_id = 5;
UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/38AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 80, autonomia_km = 80 WHERE producto_id = 6;
UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/38AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 65, autonomia_km = 90 WHERE producto_id = 7;
UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/38AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 55, autonomia_km = 85 WHERE producto_id = 8;
UPDATE ficha_tecnica SET potencia_motor = '800W', potencia_bateria = '60V/23AH', tipo_bateria = 'Plomo Grafeno', autonomia_km = 50, largo_cm = 217, ancho_cm = 95, alto_cm = 168 WHERE producto_id = 9;
UPDATE ficha_tecnica SET potencia_motor = '800W', potencia_bateria = '60V/25AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 22, largo_cm = 220, ancho_cm = 80, alto_cm = 109 WHERE producto_id = 10;
UPDATE ficha_tecnica SET potencia_motor = '1200W', potencia_bateria = '60V/23AH', tipo_bateria = 'Plomo Grafeno', largo_cm = 171, ancho_cm = 44, alto_cm = 110 WHERE producto_id = 11;
UPDATE ficha_tecnica SET potencia_motor = '1200W', potencia_bateria = '72V/23AH', tipo_bateria = 'Plomo Grafeno', autonomia_km = 55, largo_cm = 172, ancho_cm = 71, alto_cm = 111 WHERE producto_id = 12;
UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/38AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 75, autonomia_km = 70 WHERE producto_id = 13;
UPDATE ficha_tecnica SET potencia_motor = '800W', potencia_bateria = '60V/23AH', autonomia_km = 35 WHERE producto_id = 14;
UPDATE ficha_tecnica SET potencia_motor = '500W', potencia_bateria = '60V/20AH', velocidad_max_kmh = 22, autonomia_km = 50 WHERE producto_id = 15;
UPDATE ficha_tecnica SET potencia_motor = '500W', potencia_bateria = '48V/24AH', tipo_bateria = 'Litio', velocidad_max_kmh = 22, autonomia_km = 70 WHERE producto_id = 17;
UPDATE ficha_tecnica SET potencia_motor = '1800W', potencia_bateria = '72V/58AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 40, largo_cm = 286, ancho_cm = 102, alto_cm = 180 WHERE producto_id = 18;
UPDATE ficha_tecnica SET potencia_motor = '800W', potencia_bateria = '60V/32AH', tipo_bateria = 'Plomo Ácido', largo_cm = 250, ancho_cm = 90, alto_cm = 113 WHERE producto_id = 19;
UPDATE ficha_tecnica SET potencia_motor = '1000W', potencia_bateria = '72V/23AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 45, autonomia_km = 55 WHERE producto_id = 20;
UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/38AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 75, autonomia_km = 70, largo_cm = 183, ancho_cm = 74, alto_cm = 112 WHERE producto_id = 21;
UPDATE ficha_tecnica SET potencia_motor = '250W', potencia_bateria = '48V/12AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 22, autonomia_km = 40, largo_cm = 140, ancho_cm = 64, alto_cm = 102 WHERE producto_id = 22;
UPDATE ficha_tecnica SET potencia_motor = '1200W', potencia_bateria = '72V/20AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 45, autonomia_km = 55 WHERE producto_id = 23;
UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/25AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 60, autonomia_km = 55 WHERE producto_id = 24;
UPDATE ficha_tecnica SET potencia_motor = '1200W', potencia_bateria = '72V/23AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 50, autonomia_km = 65 WHERE producto_id = 25;
UPDATE ficha_tecnica SET potencia_motor = '350W', potencia_bateria = '48V/12AH', tipo_bateria = 'Litio', velocidad_max_kmh = 22, autonomia_km = 45, largo_cm = 148, ancho_cm = 63, alto_cm = 103 WHERE producto_id = 26;
UPDATE ficha_tecnica SET potencia_motor = '1200W', potencia_bateria = '60V/45AH', tipo_bateria = 'Plomo Ácido', largo_cm = 300, ancho_cm = 110, alto_cm = 180 WHERE producto_id = 27;
UPDATE ficha_tecnica SET potencia_motor = '1000W', potencia_bateria = '60V/20AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 45, autonomia_km = 55 WHERE producto_id = 28;
UPDATE ficha_tecnica SET potencia_motor = '800W', potencia_bateria = '60V/25AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 22, autonomia_km = 50, largo_cm = 220, ancho_cm = 80, alto_cm = 109 WHERE producto_id = 29;
UPDATE ficha_tecnica SET potencia_motor = '650W', potencia_bateria = '48V/24AH', tipo_bateria = 'Litio', velocidad_max_kmh = 22, autonomia_km = 70, largo_cm = 167, ancho_cm = 75, alto_cm = 107 WHERE producto_id = 30;
UPDATE ficha_tecnica SET potencia_motor = '350W', potencia_bateria = '48V/15AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 22, autonomia_km = 35, largo_cm = 144, ancho_cm = 61, alto_cm = 122 WHERE producto_id = 31;
UPDATE ficha_tecnica SET potencia_motor = '500W', potencia_bateria = '48V/20AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 22, autonomia_km = 40, largo_cm = 157, ancho_cm = 72, alto_cm = 125 WHERE producto_id = 32;
UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/26AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 50, autonomia_km = 60 WHERE producto_id = 33;

-- ============================================================
-- 4. LIMPIEZA TOTAL DE HTML EN DESCRIPCIONES DE PRODUCTOS
-- ============================================================
UPDATE productos SET descripcion = 'GreenLine VMP S9: Potencia Visual y Funcionalidad Urbana Elevada. El GreenLine VMP S9 no es simplemente una bicimoto; es una declaración de estilo y rendimiento en movilidad personal. Su diseño, visiblemente robusto e inspirado en la estética de una motocicleta, presenta un chasis reforzado resaltado por llamativas defensas laterales de alta visibilidad, que no solo protegen el vehículo, sino que definen su personalidad audaz. Equipado con un motor de alto rendimiento de 500W y una batería de 60V20AH, el S9 ofrece trayectos ágiles y constantes, alcanzando una velocidad de 22±3 km/h con función de velocidad crucero y una autonomía de 40 a 50 km, ideales para superar el tráfico urbano. La visibilidad y seguridad han sido llevadas al máximo nivel. El frontal del S9 es único, caracterizado por un faro LED dual de diseño tecnológico, compuesto por dos unidades circulares que garantizan una iluminación superior y una presencia inconfundible en la vía. Este sistema se complementa con luces direccionales LED de alta potencia, tanto delanteras como posteriores, y una potente bocina, permitiéndote conducir con total confianza y asegurando que tus maniobras sean anticipadas por otros conductores en todo momento. En el apartado de confort y practicidad, el modelo S9 destaca por su capacidad y ergonomía. Posee un sistema de asientos biplaza, donde el conductor disfruta de una postura relajada y los posapiés ergonómicos integrados, mientras que el pasajero cuenta con un asiento trasero acolchado y un respaldo de diseño flotante, diseñado para un soporte óptimo. Este diseño funcional incorpora una canasta frontal de gran capacidad con tapa protectora y una placa identificativa de GreenLine, perfecta para tus pertenencias diarias. El control es total mediante un sistema de seguridad avanzado que incluye control inalámbrico y dos llaves físicas. Finalmente, el GreenLine VMP S9 se consolida como el Vehículo de Movilidad Personal (VMP) definitivo para quienes buscan la funcionalidad de una bicicleta con la robustez y comodidad de una motocicleta compacta. Sus dimensiones y su diseño integral lo convierten en una solución de transporte inteligente, eficiente y estilizada, perfecta para enfrentar la ciudad con libertad, seguridad y un diseño que no pasa desapercibido.' WHERE id = 15;
UPDATE productos SET descripcion = 'La nueva GreenLine VMP L3 Pro llega al mercado como la evolución definitiva de su antecesora, destacando por una versión de batería notablemente mejorada. Esta bicimoto eléctrica está diseñada para quienes buscan eficiencia y rendimiento en sus trayectos diarios, consolidándose como una opción ideal para la movilidad urbana moderna. En el apartado técnico, está equipada con una potente batería de litio de 48V24AH (no extraíble) y un motor de 500W. Esta combinación le permite alcanzar una velocidad máxima de 22±3 km/h y ofrece una excelente autonomía promedio de 60 a 70 km (verificada con GPS), sumando además la opción de velocidad crucero para viajes más confortables. La seguridad es una prioridad en este modelo, el cual incorpora un sistema de iluminación avanzado que incluye un faro delantero LED tipo halo de alta potencia, luz de freno integrada y luces direccionales tanto delanteras como posteriores para anticipar cualquier maniobra. Además, el diseño de su batería no extraíble aporta un blindaje extra contra robos. Finalmente, la GreenLine VMP L3 Pro no escatima en comodidad y equipamiento funcional. Cuenta con un práctico posapié delantero para una conducción más relajada, una amplia canasta frontal para carga, una potente bocina y un sistema de control inalámbrico respaldado por dos llaves de seguridad para tu total tranquilidad.' WHERE id = 17;
UPDATE productos SET descripcion = 'Redescubre la movilidad urbana con la GreenLine F4 Pro, una moto eléctrica que combina a la perfección la elegancia del estilo retro con la eficiencia que exige la ciudad. Impulsada por un motor de 1000W y una batería de 72V 23Ah de Grafeno, alcanza una velocidad máxima de 45 km/h y ofrece una autonomía de 45 a 55 km por carga. Es la opción ideal para transformar tus recorridos diarios en trayectos fluidos, silenciosos y altamente económicos. Diseñada para brindarte la máxima practicidad en todo momento, cuenta con un ergonómico asiento de espuma de alta calidad que garantiza un viaje cómodo en cada trayecto. Su destacada guantera de 32 litros bajo el asiento, con sistema de apertura directa desde la chapa principal, te permite resguardar tus pertenencias de forma rápida y sencilla. Además, integra un práctico gancho utilitario con compartimento frontal y un puerto USB pensado para mantener tu celular cargado mientras te desplazas. Para tu tranquilidad y seguridad, la GreenLine F4 Pro está equipada con un sistema de autobloqueo sin llave de fácil activación. Su paquete de iluminación con luces intermitentes de diseño vanguardista asegura una excelente visibilidad en la vía, mientras que sus llantas de 3.00 – 10 ofrecen una adherencia firme y un manejo estable sobre el asfalto. El equilibrio definitivo entre tecnología, confort y funcionalidad para el día a día.' WHERE id = 20;
UPDATE productos SET descripcion = 'La GreenLine TM6 Pro es una trimoto eléctrica de paseo diseñada para la máxima versatilidad familiar, destacando por su sistema de 3 asientos transformables que permiten llevar hasta tres pasajeros con total comodidad. Esta versión premium eleva la experiencia de conducción al incluir un techo integrado, brindando protección contra el sol y la lluvia, además de una amplia canasta bajo el asiento y un chasis robusto con llantas 3.0 (aro 10) que ofrecen mayor altura y estabilidad en diversos terrenos. En cuanto al rendimiento, cuenta con un motor de 800W alimentado por una batería de 60V23AH, lo que le permite alcanzar una velocidad de 22±3 km/h con una autonomía de 35 a 45 km. Su sistema de transmisión está optimizado para ofrecer un alto torque, facilitando el avance incluso con carga completa, mientras que la nueva función de Parking temporal permite detener el vehículo de forma segura y rápida durante paradas breves, manteniendo el control total del equipo. La seguridad es un pilar fundamental en este modelo, integrando un sistema de freno de mano antideslizante ideal para pendientes y un freno de pie de respuesta inmediata. Para proteger tu inversión, incluye una alarma eléctrica antirrobo que bloquea el motor automáticamente, gestionada a través de sus dos controles inalámbricos y dos llaves físicas que vienen de serie, asegurando que tu vehículo esté siempre resguardado. Finalmente, la visibilidad está garantizada gracias a su completo sistema de iluminación, que incluye luces intermitentes y direccionales para que otros conductores anticipen tus maniobras con facilidad. Con la suma de su función de retroceso para maniobras sencillas y su diseño ergonómico, la GreenLine TM6 Pro se consolida como la opción más segura, cómoda y funcional para el transporte personal y familiar en la ciudad.' WHERE id = 14;
UPDATE productos SET descripcion = 'Descubre la Nueva Greenline GL3, que redefine tu experiencia de conducción en Perú combinando potencia, tecnología y diseño en un solo paquete eficiente y seguro. Equipada con un robusto motor de 1500W y una batería de plomo ácido con grafeno de 72V 38AH, esta moto te permite alcanzar una velocidad máxima de 75 km/h y disfrutar de una autonomía de 60 a 70 km por carga, ideal para tus recorridos diarios. La seguridad está garantizada con su Llantas deportivas altas y sistema de freno CBS. Su pantalla digital facilita el encendido con un simple toque, mientras que funciones como el modo parking y retroceso añaden una comodidad inigualable que incorpora un sistema de bloqueo en la chapa. Además, viene con un color innovador Camaleón (verde/purpura) que realza su estilo, acompañado de un sistema de seguridad avanzado y resistente. Todo lo que necesitas para disfrutar de cada recorrido con confianza, estilo y comodidad.' WHERE id = 21;
UPDATE productos SET descripcion = 'Vehículo de movilidad personal (VMP) también conocido como bicimoto con batería de plomo ácido 48V12AH y motor de alto rendimiento con 250W. Cuenta con velocidad máxima de 22±3 km/h,  y autonomía de 30 a 40 km en promedio. Para mayor seguridad este vehículo tiene un faro con potente luz led de tipo halo. Además, posee función de parking temporal, luz de freno, luces direccionales; características que permiten a los demás conductores anticipar tus próximas maniobras mientras conduces. Como componentes adicionales el vehículo cuenta con amplia canasta frontal, potente bocina, control inalámbrico y dos llaves. GreenLine Vmp S1 es muy económico y muy práctico en uso.' WHERE id = 22;
UPDATE productos SET descripcion = 'Greenline V8, un modelo , cuenta con Batería de plomo acido 72V20AH, motor 1200W, velocidad máxima 45km/h y autonomía 45 – 55km. Posee, Aro de 12, llantas de 90/80 -12, amortiguador regulable, botón retroceso,  botón ready y función de parking temporal. Este elegante diseño aerodinámico, que permite la reducción en la resistencia del aire, cuenta con puerto USB, asiento con espuma viscoelástica para mayor comodidad y potente luz de faro led tipo halo. Además, tiene una amplia guantera bajo el asiento. Todos los acabados y fabricación de este vehículo son de primer nivel.' WHERE id = 23;
UPDATE productos SET descripcion = 'La moto eléctrica tiene una batería de plomo acido 72V25AH, motor 1500W, velocidad máxima 60km/h y autonomía 45 - 55 km, además posee llantas de 3.0-10, Monoshock posterior, botón ready y función de parking temporal. Este diseño super deportivo permite la reducción en la resistencia del aire, asiento con espuma y luces LED llamativas para ser vistos de todos los ángulos. Además, tiene una guantera bajo el asiento. Todos los acabados y fabricación de este vehículo son de primer nivel.' WHERE id = 24;
UPDATE productos SET descripcion = 'Con motor de 12ooW; batería de plomo ácido con Grafeno 72V23AH,  velocidad máxima 50 km/h y autonomía 55 – 65 km. Posee llantas de 3.0 – 10, autobloqueo sin llave y marcador del porcentaje de carga de la batería en la pantalla. Su diseño detallado destaca su estilo retro en sus cuatro colores: rojo y gris para un estilo más atrevido; plateado y negro para uno más clásico. Además este vehículo cuenta con un cómodo' WHERE id = 25;

-- ============================================================
-- MIGRACIÓN: Precios + Info Adicional + Limpieza y Extracción de Datos Técnicos
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. PRECIOS

UPDATE productos SET precio_actual = 2300, precio_original = 2600 WHERE id = 15;  -- Greenline Vmp S9
UPDATE productos SET precio_actual = 2900, precio_original = 3400 WHERE id = 17;  -- Greenline VMP L3 Pro
UPDATE productos SET precio_actual = 3700, precio_original = 4000 WHERE id = 20;  -- GreenLine F4 Pro
UPDATE productos SET precio_actual = 4200, precio_original = 4600 WHERE id = 14;  -- Trimoto TM6 PRO
UPDATE productos SET precio_actual = 5200, precio_original = 5500 WHERE id = 21;  -- GreenLine GL3
UPDATE productos SET precio_actual = 6400, precio_original = 7300 WHERE id = 18;  -- GreenLine TC-BUS
UPDATE productos SET precio_actual = 7200, precio_original = 7600 WHERE id = 19;  -- Carguero TC2-110A
UPDATE productos SET precio_actual = 2300, precio_original = 2150 WHERE id = 1;  --  Bicicleta FL2
UPDATE productos SET precio_actual = 4100, precio_original = 3700 WHERE id = 5;  -- Greenline T6
UPDATE productos SET precio_actual = 5500, precio_original = 5200 WHERE id = 6;  -- GreenLine M3
UPDATE productos SET precio_actual = 6500, precio_original = 6000 WHERE id = 9;  -- Trimoto TM9
UPDATE productos SET precio_actual = 8000, precio_original = 7300 WHERE id = 16;  -- GreenLine TC2-180A
UPDATE productos SET precio_actual = 5000, precio_original = 5600 WHERE id = 7;   -- GreenLine SR
UPDATE productos SET precio_actual = 5500, precio_original = 5900 WHERE id = 8;   -- GreenLine MX6
UPDATE productos SET precio_actual = 4500, precio_original = 5000 WHERE id = 10;  -- Trimoto TM7 v2026
UPDATE productos SET precio_actual = 3600, precio_original = 3800 WHERE id = 11;  -- GreenLine H3 Pro
UPDATE productos SET precio_actual = 3700, precio_original = 4000 WHERE id = 12;  -- GreenLine V9 Pro
UPDATE productos SET precio_actual = 5200, precio_original = 5500 WHERE id = 13;  -- GreenLine M3 Pro


-- 2. INFO ADICIONAL DEL GL3 (id 21) - VERSIÓN A PRUEBA DE ERRORES

INSERT INTO info_adicional (producto_id, data) VALUES (21, '{"Número modos de manejo": "4", "Altura del piso a la base (cm)": "12.5 (considerando un conductor de 65 kg sentado)", "Altura del asiento al piso (cm)": "74.0 (sin conductor sentado)", "Tablero de información": "Digital, pantalla negativa contra rayos de sol", "Alarma/seguridad": "Sí, autobloqueo contra robos. Bloqueo de timón", "Cajuela/asiento": "Sí, amplia guantera abajo del asiento (45 litros)", "Puerto USB para carga de celular": "Sí, con guantera para celular", "Luces direccionales (delantero/posterior)": "Sí / Sí", "Luces intermitentes": "Sí", "Suspensión delantera/trasera": "Telescópica / Amortiguador", "Freno delantero/trasero": "Disco / Disco", "Llanta delantera/trasera": "110/70-12 - 120/70-10. Sin cámara", "Largo*ancho*altura (cm)": "183 × 74 × 112", "Peso en seco (kg)": "151 kg", "Detalles": "Luz intermitente y faros con diseño, sistema de freno CBS en la manija delantera, parador central y lateral"}'::jsonb) ON CONFLICT (producto_id) DO UPDATE SET data = EXCLUDED.data;

-- ============================================================
-- 3. EXTRACCIÓN DE DATOS LIMPIOS PARA FICHA TÉCNICA
-- Asignación directa de campos en formato estandarizado (Ej: "1500W", "72V/38AH")
-- ============================================================

UPDATE ficha_tecnica SET potencia_motor = '240W', potencia_bateria = '36V/8AH', tipo_bateria = 'Litio', velocidad_max_kmh = 20, autonomia_km = 35, largo_cm = 88, ancho_cm = 50, alto_cm = 70 WHERE producto_id = 1;

UPDATE ficha_tecnica SET tipo_bateria = 'Litio', largo_cm = 172, ancho_cm = 71, alto_cm = 111 WHERE producto_id = 5;

UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/38AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 80, autonomia_km = 70 WHERE producto_id = 6;

UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/38AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 65, autonomia_km = 80 WHERE producto_id = 7;

UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/38AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 55, autonomia_km = 75 WHERE producto_id = 8;

UPDATE ficha_tecnica SET potencia_motor = '800W', potencia_bateria = '60V/23AH', tipo_bateria = 'Plomo Grafeno', autonomia_km = 40, largo_cm = 217, ancho_cm = 95, alto_cm = 168 WHERE producto_id = 9;

UPDATE ficha_tecnica SET potencia_motor = '800W', potencia_bateria = '60V/25AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 22, autonomia_km = 30, largo_cm = 220, ancho_cm = 80, alto_cm = 109 WHERE producto_id = 10;

UPDATE ficha_tecnica SET potencia_motor = '1200W', potencia_bateria = '60V/23AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 50, autonomia_km = 35, largo_cm = 171, ancho_cm = 44, alto_cm = 110 WHERE producto_id = 11;

UPDATE ficha_tecnica SET potencia_motor = '1200W', potencia_bateria = '72V/23AH', tipo_bateria = 'Plomo Grafeno', autonomia_km = 55, largo_cm = 172, ancho_cm = 71, alto_cm = 111 WHERE producto_id = 12;

UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/38AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 75, autonomia_km = 70 WHERE producto_id = 13;

UPDATE ficha_tecnica SET potencia_motor = '800W', potencia_bateria = '60V/23AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 22, autonomia_km = 35 WHERE producto_id = 14;

UPDATE ficha_tecnica SET potencia_motor = '500W', potencia_bateria = '60V/20AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 22, autonomia_km = 40 WHERE producto_id = 15;

UPDATE ficha_tecnica SET potencia_motor = '1800W', potencia_bateria = '60V/45Ah', tipo_bateria = 'Plomo Ácido', largo_cm = 332, ancho_cm = 130, alto_cm = 142, autonomia_km = 45 WHERE producto_id = 16;

UPDATE ficha_tecnica SET potencia_motor = '500W', potencia_bateria = '48V/24AH', tipo_bateria = 'Litio', velocidad_max_kmh = 22, autonomia_km = 60, largo_cm = 158, ancho_cm = 70, alto_cm = 103 WHERE producto_id = 17;

UPDATE ficha_tecnica SET potencia_motor = '1800W', potencia_bateria = '72V/58AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 40, largo_cm = 286, ancho_cm = 102, alto_cm = 180, autonomia_km = 50 WHERE producto_id = 18;

UPDATE ficha_tecnica SET potencia_motor = '800W', potencia_bateria = '60V/32AH', tipo_bateria = 'Plomo Ácido', largo_cm = 250, ancho_cm = 90, alto_cm = 113 WHERE producto_id = 19;

UPDATE ficha_tecnica SET potencia_motor = '1000W', potencia_bateria = '72V/23AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 45, autonomia_km = 45 WHERE producto_id = 20;
UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/38AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 75, autonomia_km = 60, largo_cm = 183, ancho_cm = 74, alto_cm = 112 WHERE producto_id = 21;
UPDATE ficha_tecnica SET potencia_motor = '250W', potencia_bateria = '48V/12AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 22, autonomia_km = 30, largo_cm = 140, ancho_cm = 64, alto_cm = 102 WHERE producto_id = 22;
UPDATE ficha_tecnica SET potencia_motor = '1200W', potencia_bateria = '72V/20AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 45, autonomia_km = 45 WHERE producto_id = 23;
UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/25AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 60, autonomia_km = 45 WHERE producto_id = 24;
UPDATE ficha_tecnica SET potencia_motor = '350W', potencia_bateria = '48V/12AH', tipo_bateria = 'Litio', velocidad_max_kmh = 22, autonomia_km = 35, largo_cm = 148, ancho_cm = 63, alto_cm = 103 WHERE producto_id = 26;
UPDATE ficha_tecnica SET potencia_motor = '1200W', potencia_bateria = '60V/45AH', tipo_bateria = 'Plomo Ácido', largo_cm = 300, ancho_cm = 110, alto_cm = 180 WHERE producto_id = 27;
UPDATE ficha_tecnica SET potencia_motor = '1000W', potencia_bateria = '60V/20AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 45, autonomia_km = 45 WHERE producto_id = 28;
UPDATE ficha_tecnica SET potencia_motor = '800W', potencia_bateria = '60V/25AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 22, autonomia_km = 40, largo_cm = 220, ancho_cm = 80, alto_cm = 109 WHERE producto_id = 29;
UPDATE ficha_tecnica SET potencia_motor = '650W', potencia_bateria = '48V/24AH', tipo_bateria = 'Litio', velocidad_max_kmh = 22, autonomia_km = 60, largo_cm = 167, ancho_cm = 75, alto_cm = 107 WHERE producto_id = 30;
UPDATE ficha_tecnica SET potencia_motor = '350W', potencia_bateria = '48V/15AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 22, autonomia_km = 25, largo_cm = 144, ancho_cm = 61, alto_cm = 122 WHERE producto_id = 31;
UPDATE ficha_tecnica SET potencia_motor = '500W', potencia_bateria = '48V/20AH', tipo_bateria = 'Plomo Ácido', velocidad_max_kmh = 22, autonomia_km = 30, largo_cm = 157, ancho_cm = 72, alto_cm = 125 WHERE producto_id = 32;
UPDATE ficha_tecnica SET potencia_motor = '1500W', potencia_bateria = '72V/26AH', tipo_bateria = 'Plomo Grafeno', velocidad_max_kmh = 50, autonomia_km = 50 WHERE producto_id = 33;
UPDATE ficha_tecnica SET potencia_motor = '1000W', potencia_bateria = '48V24AH', tipo_bateria = 'Litio', velocidad_max_kmh = 45, autonomia_km = 45, largo_cm = 172, ancho_cm = 71, alto_cm = 111 WHERE producto_id = 5;




-- ============================================================
-- 4. AISLAMIENTO DE LA DESCRIPCIÓN (BLOQUE DE TEXTO LIMPIO)
-- Agregamos la descripción pura, sin etiquetas HTML ni datos enredados
-- ============================================================

-- *Nota: Si la columna 'descripcion' no existe en tu tabla 'productos', 
-- descomenta la siguiente línea antes de ejecutar los UPDATES:
-- ALTER TABLE productos ADD COLUMN descripcion TEXT;

UPDATE productos SET descripcion = E'Bicicleta eléctrica plegable TAILG FL2 con batería extraíble de litio y motor de alto rendimiento. Cuenta con velocidad asistida y diseño de marco de aluminio que cubre el sistema eléctrico. Diseño minimalista, plegable y fácil de guardar.\nIncluye sistema de cambios SHIMANO, pantalla LCD, luz faro LED y asiento para copiloto.' WHERE id = 1;
UPDATE productos SET descripcion = E'Moto Eléctrica T6: Redefine tu Viaje Urbano. Solución ideal para la movilidad moderna, combinando un diseño vanguardista y deportivo con cero emisiones. Chasis robusto y color vibrante.\nBatería extraíble de litio de alto rendimiento para carga inteligente en casa u oficina.' WHERE id = 5;
UPDATE productos SET descripcion = E'Moto Eléctrica Greenline M3 que redefine tu experiencia de conducción en Perú. Equipada con tecnología avanzada, sistema de frenos de disco, pantalla digital con tecnología NFC y funciones como modo parking y retroceso. Acabado mate Robuster y barras protectoras.' WHERE id = 6;
UPDATE productos SET descripcion = E'Moto Eléctrica Greenline SR. Combina potencia y tecnología para ofrecer una experiencia de conducción mejorada y segura. Sistema de autobloqueo sin llave, pantalla digital con NFC, modo parking y retroceso. Incluye maletera tipo top case para mayor practicidad.' WHERE id = 7;
UPDATE productos SET descripcion = E'Moto Eléctrica Greenline MX6. Diseño moderno y futurista. Cuenta con sistema de autobloqueo sin llave, frenos de disco, modo parking, retroceso y un parlante integrado con conexión Bluetooth para disfrutar de tu música favorita durante el viaje.' WHERE id = 8;
UPDATE productos SET descripcion = E'Trimoto GreenLine TM9 con techo, diseñada para ofrecerte protección, comodidad y practicidad. Alarma antirrobo, bloqueo de motor, frenos con sistema antideslizante, pantalla de retroceso, puerto USB, limpiaparabrisas y techo protector para cualquier clima.' WHERE id = 9;
UPDATE productos SET descripcion = E'Trimoto GreenLine TM7 V2026. Alarma eléctrica antirrobo, freno de pie con función antideslizante, luces direccionales, controles inalámbricos, porta celular con USB y amortiguadores para mayor confort en tus trayectos.' WHERE id = 10;
UPDATE productos SET descripcion = E'Modelo GreenLine H3 Pro. Elegante diseño vintage moderno. Cuenta con posapié incorporado para copiloto, profunda guantera bajo el asiento, maletera adicional, luces intermitentes y bloqueo de timón y motor para máxima seguridad.' WHERE id = 11;
UPDATE productos SET descripcion = E'GreenLine V9 PRO. Combinación perfecta entre tecnología, eficiencia y diseño moderno. Batería de alto rendimiento con tecnología de grafeno, motor eléctrico de respuesta ágil y diseño estilizado ideal para el ritmo urbano actual.' WHERE id = 12;
UPDATE productos SET descripcion = E'Moto Eléctrica Greenline M3 Pro. Redefine tu experiencia de conducción combinando potencia y diseño seguro. Sistema de autobloqueo sin llave, pantalla digital avanzada, modo parking, retroceso y maletera de alta resistencia.' WHERE id = 13;
UPDATE productos SET descripcion = E'GreenLine TM6 Pro: Trimoto eléctrica de paseo con sistema de 3 asientos transformables. Techo integrado, amplia canasta, función de parking temporal, sistema de freno de mano antideslizante, alarma antirrobo e iluminación completa con direccionales.' WHERE id = 14;
UPDATE productos SET descripcion = E'GreenLine VMP S9: Vehículo de movilidad personal con diseño robusto inspirado en motocicletas. Faro LED dual, luces direccionales, asientos biplaza, canasta frontal de gran capacidad y sistema de seguridad avanzado con control inalámbrico.' WHERE id = 15;
UPDATE productos SET descripcion = E'Carguero Eléctrico GreenLine TC2-180A para carga pesada. Tolva de gran volumen con sistema basculante, chasis reforzado, llantas todoterreno, parabrisas acrílico aerodinámico, asiento acolchado ergonómico, faro principal LED y suspensión reforzada.' WHERE id = 16;
UPDATE productos SET descripcion = E'GreenLine VMP L3 Pro. Bicimoto eléctrica con faro delantero LED tipo halo, luz de freno integrada, posapié delantero, amplia canasta frontal, potente bocina y sistema de control inalámbrico. Blindaje extra de batería no extraíble contra robos.' WHERE id = 17;
UPDATE productos SET descripcion = E'Vehículo Eléctrico GreenLine TC-BUS para transporte urbano y comercial de pasajeros. Capacidad para 5 pasajeros en 3 filas de asientos, techo protector integral, limpiaparabrisas, faros dobles LED, función de retroceso y frenos de disco ventilado.' WHERE id = 18;
UPDATE productos SET descripcion = E'CARGUERO GREENLINE TC2-110A. Herramienta de trabajo robusta con sistema de transmisión optimizado para alto torque. Incluye asientos amplios, moderno sistema de audio Bluetooth, función de retroceso y doble sistema de frenado.' WHERE id = 19;
UPDATE productos SET descripcion = E'GreenLine F4 Pro. Elegancia retro y eficiencia. Asiento de espuma de alta calidad, guantera de 32 litros bajo el asiento, gancho utilitario, puerto USB, sistema de autobloqueo sin llave y luces intermitentes de diseño vanguardista.' WHERE id = 20;
UPDATE productos SET descripcion = E'Greenline GL3. Llantas deportivas, sistema de freno CBS, pantalla digital intuitiva, modo parking, retroceso, sistema de bloqueo en la chapa y un innovador color camaleón (verde/púrpura) que realza su estilo.' WHERE id = 21;
UPDATE productos SET descripcion = E'GreenLine Vmp S1 PRO. Vehículo de movilidad personal (bicimoto) con faro LED tipo halo, función de parking temporal, luces direccionales, canasta frontal, bocina potente y control inalámbrico. Práctico y económico.' WHERE id = 22;
UPDATE productos SET descripcion = E'Moto Eléctrica Greenline modelo V8. Elegante diseño aerodinámico con amortiguador regulable, botón retroceso, función de parking temporal, puerto USB, asiento con espuma viscoelástica, amplia guantera y faro LED tipo halo.' WHERE id = 23;
UPDATE productos SET descripcion = E'Modelo GreenLine X3. Diseño super deportivo que reduce la resistencia del aire. Llantas deportivas, monoshock posterior, botón ready, función de parking temporal, luces LED llamativas y guantera bajo el asiento.' WHERE id = 24;
UPDATE productos SET descripcion = E'Moto Eléctrica Greenline Y5. Diseño retro con autobloqueo sin llave, marcador de porcentaje de carga en pantalla, asiento de espuma, guantera de 30 litros con apertura desde la chapa principal, gancho utilitario y puerto USB.' WHERE id = 25;
UPDATE productos SET descripcion = E'GreenLine VMP S6 PRO. Bicimoto con batería extraíble, faro LED tipo halo, función de parking temporal, luces direccionales, canasta frontal y control inalámbrico. Seguridad y maniobrabilidad para la ciudad.' WHERE id = 26;
UPDATE productos SET descripcion = E'Carguero ELÉCTRICO GreenLine TC2-160 - Con Techo. Chasis reforzado, función de retroceso, freno de pie y de mano tipo palanca, tres velocidades. Asientos cómodos y luces direccionales para mayor seguridad.' WHERE id = 27;
UPDATE productos SET descripcion = E'Modelo GreenLine H5. Diseño vintage moderno disponible con vinilos dorados. Posapié incorporado en el chasis, cómodo asiento y espaldar retapizado, y guantera bajo el asiento con apertura desde la chapa principal.' WHERE id = 28;
UPDATE productos SET descripcion = E'Trimoto GreenLine TM4 Pro con techo. Alarma antirrobo, freno de mano antideslizante, controles inalámbricos, puerto USB, asientos amplios ergonómicos y amortiguadores reforzados para viajes prolongados.' WHERE id = 29;
UPDATE productos SET descripcion = E'Modelo GreenLine VMP T4. Bicimoto de paseo con alarma eléctrica, luces direccionales, función de estacionamiento, puerto USB, guantera en el timón, doble asiento cómodo y maletera trasera de gran capacidad.' WHERE id = 30;
UPDATE productos SET descripcion = E'GreenLine VMP S7. Bicimoto con faro delantero LED tipo halo, posapié para el piloto, luces direccionales, amplia canasta frontal, potente bocina y control inalámbrico. Ideal para conducción confortable y segura.' WHERE id = 31;
UPDATE productos SET descripcion = E'GreenLine VMP P01. Vehículo de movilidad personal con faro LED tipo halo, luz de freno integrada, luces direccionales, posapié delantero, canasta frontal, potente bocina y control inalámbrico. Opción de velocidad crucero.' WHERE id = 32;
UPDATE productos SET descripcion = E'Moto Eléctrica Greenline X6PRO. Sistema de autobloqueo sin llave, doble freno de disco, pantalla digital avanzada, modo parking y retroceso. Diseño moderno en colores vibrantes adaptables a todo estilo.' WHERE id = 33;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================

SELECT id, precio_actual, precio_original
FROM productos WHERE id IN (15, 17, 20, 14, 21);

SELECT producto_id, potencia_motor, potencia_bateria, tipo_bateria 
FROM ficha_tecnica 
WHERE potencia_motor IS NOT NULL OR potencia_bateria IS NOT NULL
LIMIT 10;