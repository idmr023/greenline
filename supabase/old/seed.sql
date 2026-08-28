-- ============================================================
-- SCRIPT DE INSERCIÓN DE PRODUCTOS - GREENLINE SUPABASE
-- ============================================================

ALTER TABLE imagenes ALTER COLUMN url DROP NOT NULL;

-- ============================================================
-- 1. INSERTAR PRODUCTOS PRINCIPALES
-- ============================================================

INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (1, 1, 'Bicicleta Eléctrica Plegable FL2', 'bicicleta-elctrica-plegable-fl2', '<strong>Bicicleta Tailg FL2</strong>
Bicicleta eléctrica plegable TAILG FL2 con batería extraíble de <a href="https://glperu.com/tienda/36v10-4ah-bateria-de-litio/">litio 36V 8AH</a> y motor 240W. Cuenta con velocidad de 20±5 km/h, velocidad asistida y autonomía de 30 a 35 km en promedio.
Tiene el marco de aluminio la cual cubre el sistema eléctrico, lo que permite un diseño minimalista y limpio de cables. Una vez terminado de usarlo puedes doblar (88 cm largo x 70 cm alto) y guardar (24 Kg).
Como componentes adicionales de gran utilidad para el usuario el vehículo cuenta con llantas con aro 20, sistema de<a href="https://bike.shimano.com/es-AR/technologies/component/details/linkglide.html"> cambios SHIMANO 7 cambios</a>, asiento y posa pie para copiloto, pantalla LCD, asiento regulable, manubrio ergonómico, luz faro LED adelante y atrás, luz de freno y dos llaves.

<hr />

PLEGABLE
Largo: 88 cm.
Ancho: 50 cm.
Altura: 70 cm.
Peso: 24 kg.', NULL, NULL, false, ARRAY['vmpLitio']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (1, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/bicicletas_electricas/fl2/fl2_negro_costado.webp', 'Negro', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (1, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/bicicletas_electricas/fl2/fl2_blanco_costado.webp', 'Blanco', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (1, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/bicicletas_electricas/fl2/fl2_rojo_costado.webp', 'Rojo', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (1, NULL, NULL, false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (1, NULL, NULL, false, 4);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (1, '240W. Cuenta con velocidad de 20±5 km/h, velocidad asistida y autonomía de 30 a 35 km en promedio.','extraíble de <a href="https://glperu.com/tienda/36v10-4ah-bateria-de-litio/">litio 36V 8AH</a> y motor 240W. Cuenta con velocidad de 20±5 km/h, velocidad asistida y autonomía de 30 a 35 km en promedio.', 20, 30);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (2, 5, 'Casco Greenline BK800 Negro Demonio', 'casco-greenline-bk800-negro-demonio', 'Características :
Marca: Greenline
Modelo: BK800
Acabado: Brillante
Material: ABS
Tallas disponibles: S – M – L – XL – XXL', NULL, NULL, false, '{}'::TEXT[]);
INSERT INTO imagenes (producto_id, url, es_principal, orden) VALUES (2, 'https://glperu.com/wp-content/uploads/2023/07/CASCO-BK800-1-GREENLINE.png', true, 0);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (3, 5, 'Casco Greenline infantil azul', 'casco-greenline-infantil-azul', 'Características :
Marca: Greenline
Acabado: Brillante
Material: ABS
Talla: para niños', 80.00, 60.00, false, '{}'::TEXT[]);
INSERT INTO imagenes (producto_id, url, es_principal, orden) VALUES (3, 'https://glperu.com/wp-content/uploads/2023/07/CASCO-GREENLINE-NINOS-AZUL.png', true, 0);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (4, 5, 'Casco Greenline infantil rosa', 'casco-greenline-infantil-rosa', 'Características :
Marca: Greenline
Acabado: Brillante
Material: ABS
Talla: para niños', 80.00, 60.00, false, '{}'::TEXT[]);
INSERT INTO imagenes (producto_id, url, es_principal, orden) VALUES (4, 'https://glperu.com/wp-content/uploads/2023/07/CASCO-GREENLINE-NINOS-ROSA.png', true, 0);

INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (5, 2, 'Greenline T6', 'greenline-t6', '<h3>Moto eléctrica Greenline T6</h3>
La Moto eléctrica T6 de Greenline posee un motor de 1000 watts, que te permite alcanzar velocidades de hasta 45 km/h. y con su batería de grafeno con capacidad de 72V 22Ah que te permitirá manejar distancias largas de 60 a 70 km por cada recarga y una durabilidad prolongada.

Experimenta la seguridad al conducir gracias a su sistema de freno de disco delantero y freno de tambor posterior, así como luces LED e intermitentes para ser visto en todo momento.

DIMENSIONES

Largo: 181 cm.
Ancho: 73 cm.
Altura: 111 cm.', NULL, NULL, false, ARRAY['destacado','MotoElectricaLitio','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_negro_costado.webp', 'Negro', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_negro_frontal.webp', 'Negro', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_negro_perfil.webp', 'Negro', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_blanco_costado.webp', 'Blanco', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_blanco_frontal.webp', 'Blanco', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_blanco_perfil.webp', 'Blanco', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_gris_costado.webp', 'Gris', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_gris_frontal.webp', 'Gris', false, 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_gris_perfil.webp', 'Gris', false, 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_verde_costado.webp', 'Verde', false, 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_verde_frontal.webp', 'Verde', false, 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (5, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/t6/t6_verde_perfil.webp', 'Verde', false, 11);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (5, '1000W','Litio', 45, 60);

INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (6, 2, 'GreenLine M3', 'greenline-m3', '<h3>Moto Eléctrica M3</h3>
La moto eléctrica M3 es el modelo insignia que lidera nuestra familia de motocicletas deportivas en Greenline. Está equipada con un motor potente de 2000 Watts y una eficiente batería de Plomo Graphene de 72 voltios y 22 amperios, que te permitirá alcanzar velocidades de hasta 60 km/h y disfrutar de una autonomía de 50 a 60 kilómetros.
<p style="text-align: justify;">Esta moto eléctrica M3 es ideal para desplazarte con estilo y sin emisiones por la ciudad.</p>
DIMENSIONES

Largo: 184 cm.
Ancho: 73 cm.
Altura: 110 cm.', NULL, NULL, false, ARRAY['destacado','MotoElectricaGrafeno','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (6, NULL, NULL, true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (6, NULL, NULL, false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (6, NULL, NULL, false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (6, NULL, NULL, false, 3);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (6, 'potente de 2000 Watts y una eficiente batería de Plomo Graphene de 72 voltios y 22 amperios, que te permitirá alcanzar velocidades de hasta 60 km/h y disfrutar de una autonomía de 50 a 60 kilómetros.','de Plomo Graphene de 72 voltios y 22 amperios, que te permitirá alcanzar velocidades de hasta 60 km/h y disfrutar de una autonomía de 50 a 60 kilómetros.', 60, 50);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (7, 2, 'GreenLine SR', 'greenline-sr', '<h3>Moto Eléctrica Greenline SR</h3>
¡La revolución ha llegado a tus viajes con la moto eléctrica SR de Greenline! Siente la verdadera libertad sobre dos ruedas. Imagina desplazarte a velocidades de hasta 65 km/h, impulsado por un motor de 2000 W y una batería de 72V 22Ah.

Esta combinación perfecta te otorga la confianza necesaria para enfrentar largos recorridos, alcanzando hasta 60 km de autonomía con una sola carga.

DIMENSIONES

Largo: 191 cm.
Ancho: 74 cm.
Altura: 113 cm.', NULL, NULL, false, ARRAY['destacado','MotoElectricaGrafeno','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_blanca_costado.webp', 'Blanca', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_blanca_frontal.webp', 'Blanca', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_blanca_posterior.webp', 'Blanca', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_blanca_perfil.webp', 'Blanca', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_negro_costado.webp', 'Negra', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_negro_frontal.webp', 'Negra', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_negro_posterior.webp', 'Negra', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_negro_perfil.webp', 'Negra', false, 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_gris_costado.webp', 'Gris', false, 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_gris_posterior.webp', 'Gris', false, 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (7, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/sr/sr_gris_perfil.webp', 'Gris', false, 10);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (7, 'de 2000 W y una batería de 72V 22Ah.','de 72V 22Ah.', 65, 60);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (8, 2, 'GreenLine MX6', 'greenline-mx6', '<h3>Moto Eléctrica MX6</h3>
<p style="text-align: justify;">La asombrosa Moto eléctrica MX6 posee un motor súper potente de 2000 watts, que te permite alcanzar velocidades de hasta 65 km/h. y con su eficiente batería de de 72 voltios y 22 amperios, que te permitirá manejar distancias largas de 50 a 60 km por cada recarga y una durabilidad prolongada.</p>
DIMENSIONES

Largo: 194 cm.
Ancho: 73 cm.
Altura: 112 cm.', NULL, NULL, false, ARRAY['destacado','MotoElectricaGrafeno','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_negra_costado.webp', 'Negra', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_negro_frontal.webp', 'Negra', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_negro_posterior.webp', 'Negra', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_negro_perfil.webp', 'Negra', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_blanca_costado.webp', 'Blanca', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_blanca_frontal.webp', 'Blanca', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_blanca_posterior.webp', 'Blanca', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_blanca_perfil.webp', 'Blanca', false, 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_gris_costado.webp', 'Gris', false, 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_gris_frontal.webp', 'Gris', false, 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_gris_posterior.webp', 'Gris', false, 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (8, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/mx6/mx6_gris_perfil.webp', 'Gris', false, 11);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (8, 'súper potente de 2000 watts, que te permite alcanzar velocidades de hasta 65 km/h. y con su eficiente batería de de 72 voltios y 22 amperios, que te permitirá manejar distancias largas de 50 a 60 km por cada recarga y una durabilidad prolongada.','de de 72 voltios y 22 amperios, que te permitirá manejar distancias largas de 50 a 60 km por cada recarga y una durabilidad prolongada.', 65, 50);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (9, 3, 'Trimoto GreenLine TM9', 'trimoto-greenline-tm9', '<h3>Trimoto Greenline TM9</h3>
Un Vehículo hecho para la familia TM9 de Greenline cuenta con una potencia de motor 800 W que permite subir pendientes hasta de 15°. Su increíble diseño le da el confort que toda familia merece.

DIMENSIONES

Largo: 200 cm.
Ancho: 95 cm.
Altura: 112 cm.', NULL, NULL, false, ARRAY['destacado','TrimotoLitio','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_blanco_costado_der.webp', 'Blanco', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_blanco_costado_izq.webp', 'Blanco', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_blanco_frontal.webp', 'Blanco', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_blanco_posterior.webp', 'Blanco', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_blanco_posterior_der.webp', 'Blanco', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_blanco_perfil.webp', 'Blanco', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_crema_costado_der.webp', 'Crema', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_crema_costado_izq.webp', 'Crema', false, 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_crema_frontal.webp', 'Crema', false, 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_crema_posterior.webp', 'Crema', false, 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_crema_posterior_der.webp', 'Crema', false, 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_crema_perfil.webp', 'Crema', false, 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_morada_frontal.webp', 'Morada', false, 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_morado_costado_der.webp', 'Morada', false, 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_morado_costado_izq.webp', 'Morada', false, 14);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_morado_posterior.webp', 'Morada', false, 15);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_morado_posterior_der.webp', 'Morada', false, 16);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (9, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm9/tm9_morado_perfil.webp', 'Morada', false, 17);
INSERT INTO ficha_tecnica (producto_id, potencia_motor) VALUES (9, '800 W que permite subir pendientes hasta de 15°. Su increíble diseño le da el confort que toda familia merece.');
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (10, 3, 'Trimoto GreenLine TM7 v2026', 'trimoto-greenline-tm7-v2026', '<h3>Trimoto Greenline TM7 v2026</h3>
¡Llegó la Versión 2026! Viaja, diviértete y compártelo en familia con nuestro vehículo Trimoto TM7 de Greenline. Acompañado de la increíble potencia de 800W con velocidades hasta 30 Km/h es el transporte ideal para disfrutarlo junto a tu familia. Además este vehículo cuenta con las exclusivas baterías de grafeno 60V y 22Ah.

DIMENSIONES

Largo: 215 cm.
Ancho: 86 cm.
Altura: 105 cm.', NULL, NULL, false, ARRAY['destacado','TrimotoLitio','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm7_2026/tmt7_gris_costado.webp', 'Gris', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm7_2026/tmt7_gris_frontal.webp', 'Gris', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm7_2026/tmt7_gris_perfil.webp', 'Gris', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm7_2026/tmt7_crema_costado.webp', 'Crema', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm7_2026/tmt7_crema_frontal.webp', 'Crema', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (10, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/trimotos/tm7_2026/tmt7_crema_perfil.webp', 'Crema', false, 5);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,velocidad_max_kmh) VALUES (10, 'de 800W con velocidades hasta 30 Km/h es el transporte ideal para disfrutarlo junto a tu familia. Además este vehículo cuenta con las exclusivas baterías de grafeno 60V y 22Ah.', 30);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (11, 2, 'GreenLine H3 Pro', 'greenline-h3-pro', '<h3>Moto Eléctrica H3 PRO</h3>
Conoce a nuestra Moto eléctrica H3 Pro que gracias a su Batería de GRAFENO que cuenta con una mayor densidad de energía a comparación de la Batería de Plomo, lo que le permite brindar mayor autonomía de hasta 70 Km y una vida útil más prolongada; por esto sumado a un Motor de 1200 W con picos de 2000 W que le permitirá subir pendientes de 15°, hace de este vehículo el ideal si buscas desplazarte con estilo y sin emisiones por la ciudad.

DIMENSIONES

Largo: 180 cm.
Ancho: 73 cm.
Altura: 106 cm.', NULL, NULL, false, ARRAY['destacado','MotoElectricaGrafeno','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_rosado_costado.webp', 'Rosado', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_rosado_frontal.webp', 'Rosado', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_rosado_poterior.webp', 'Rosado', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_rosado_perfil.webp', 'Rosado', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_negro_costado.webp', 'Negro', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_negro_frontal.webp', 'Negro', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_negro_posterior.webp', 'Negro', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_negro_perfil.webp', 'Negro', false, 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_blanco_costado.webp', 'Blanco', false, 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_blanco_frontal.webp', 'Blanco', false, 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_blanco_posterior.webp', 'Blanco', false, 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_blanco_perfil.webp', 'Blanco', false, 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_verde_costado.webp', 'Verde', false, 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_verde_perfil.webp', 'Verde', false, 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (11, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/h3%20pro/h3_pro_verde_posterior.webp', 'Verde', false, 14);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,autonomia_km) VALUES (11, 'de 1200 W con picos de 2000 W que le permitirá subir pendientes de 15°, hace de este vehículo el ideal si buscas desplazarte con estilo y sin emisiones por la ciudad.', 70);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (12, 2, 'GreenLine V9 Pro', 'greenline-v9-pro', '<h3>Moto Eléctrica V9 Pro</h3>
<strong>¡NUEVO INGRESO!</strong> Desplázate con estilo y de manera sostenible con la nueva <strong>moto eléctrica V9 Pro de Greenline</strong>. Disfruta de un rendimiento de otro nivel gracias a su diseño elegante que combina tecnología avanzada y máxima comodidad. Su motor de <strong>1200 W</strong> y batería de <strong>GRAFENO (72V 22Ah)</strong> te ofrecen una autonomía de hasta <strong>70 km</strong>, perfecta para tus recorridos diarios. Además, cuenta con características Premium como luces LED brillantes, un panel de control digital intuitivo y un sistema de frenos de disco para tu seguridad. 

¡Únete a la revolución verde y transforma tus viajes diarios con la Moto eléctrica V9 Pro de GreenLine hoy mismo!

DIMENSIONES

Largo: 181 cm.
Ancho: 73 cm.
Altura: 111 cm.', NULL, NULL, false, ARRAY['destacado','MotoElectricaGrafeno','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_negro_costado.webp', 'Negro', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_negro_frontal.webp', 'Negro', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_negro_posterior.webp', 'Negro', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_negro_perfil.webp', 'Negro', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_blanco_costado.webp', 'Blanco', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_blanco_frontal.webp', 'Blanco', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_blanco_posterior.webp', 'Blanco', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_blanco_perfil.webp', 'Blanco', false, 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_gris_costado.webp', 'Gris', false, 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_gris_frontal.webp', 'Gris', false, 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_gris_posterior.webp', 'Gris', false, 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_gris_perfil.webp', 'Gris', false, 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_verde_costado.webp', 'Verde', false, 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_verde_frontal.webp', 'Verde', false, 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_verde_posterior.webp', 'Verde', false, 14);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (12, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/v9_pro/v9_pro_verde_perfil.webp', 'Verde', false, 15);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,autonomia_km) VALUES (12, 'de <strong>1200 W</strong> y batería de <strong>GRAFENO (72V 22Ah)</strong> te ofrecen una autonomía de hasta <strong>70 km</strong>, perfecta para tus recorridos diarios. Además, cuenta con características Premium como luces LED brillantes, un panel de control digital intuitivo y un sistema de frenos de disco para tu seguridad.','de <strong>GRAFENO (72V 22Ah)</strong> te ofrecen una autonomía de hasta <strong>70 km</strong>, perfecta para tus recorridos diarios. Además, cuenta con características Premium como luces LED brillantes, un panel de control digital intuitivo y un sistema de frenos de disco para tu seguridad.', 70);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (13, 2, 'GreenLine M3 Pro', 'greenline-m3-pro', '<h3>Moto Eléctrica M3 Pro</h3>
<p style="text-align: justify;">La Moto eléctrica M3 Pro es nuestra gama Top que lidera la familia de motocicletas deportivas en Greenline. Está equipada con un motor potente de 3000 Watts y una súper eficiente batería de GRAFENO de 72 voltios y 35 amperios, que te permitirá alcanzar velocidades de hasta 75 km/h y disfrutar de una asombrosa autonomía de 90 a 100 kilómetros.</p>
<p style="text-align: justify;">¡No esperes más para disfrutar de tus paseos como un Pro y sin emisiones por la ciudad!</p>

DIMENSIONES

Largo: 184 cm.
Ancho: 73 cm.
Altura: 110 cm.', NULL, NULL, false, ARRAY['destacado','MotoElectricaGrafeno','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/m3pro/M3-PRO-CREMA.webp', 'Crema', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/m3pro/M3-PRO-GRIS-CLARO.webp', 'Gris Claro', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/m3pro/M3-PRO-GRIS-OSCURO.webp', 'Gris Oscuro', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/m3pro/M3-PRO-FRONTAL.webp', 'Crema', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/m3pro/M3-PRO-POSTERIOR.webp', 'Crema', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/m3pro/M3-PRO-PERFIL-DERECHO.webp', 'Crema', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (13, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/m3pro/M3-PRO-PERFIL-IZQUIERDO.webp', 'Crema', false, 6);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (13, 'potente de 3000 Watts y una súper eficiente batería de GRAFENO de 72 voltios y 35 amperios, que te permitirá alcanzar velocidades de hasta 75 km/h y disfrutar de una asombrosa autonomía de 90 a 100 kilómetros.</p>','de GRAFENO de 72 voltios y 35 amperios, que te permitirá alcanzar velocidades de hasta 75 km/h y disfrutar de una asombrosa autonomía de 90 a 100 kilómetros.</p>', 75, 90);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (14, 3, 'Trimoto GreenLine TM6 PRO', 'trimoto-greenline-tm6-pro', '<h3>Trimoto Greenline TM6 Pro</h3>
Viaja, diviértete y compártelo en familia con nuestro nuevo vehículo Trimoto TM6 PRO de Greenline. Acompañado de la increíble potencia de 1000W con velocidades hasta 35 Km/h y con una autonomía de hasta 70 Km es el transporte ideal para disfrutarlo junto a los que más amas. Además este vehículo cuenta con las exclusivas baterías de grafeno 60V y 22Ah.

DIMENSIONES

Largo: 202 cm.
Ancho: 86 cm.
Altura: 105 cm.', NULL, NULL, false, ARRAY['destacado','TrimotoLitio','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tm6_pro/tm6_pro_crema_costado.webp', 'Crema', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tm6_pro/tm6_pro_crema_frontal.webp', 'Crema', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tm6_pro/tm6_pro_crema_posterior.webp', 'Crema', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tm6_pro/tm6_pro_crema_perfil.webp', 'Crema', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tm6_pro/tm6_pro_rojo_costado.webp', 'Rojo', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tm6_pro/tm6_pro_rojo_frontal.webp', 'Rojo', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tm6_pro/tm6_pro_rojo_posterior.webp', 'Rojo', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (14, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tm6_pro/tm6_pro_rojo_perfil.webp', 'Rojo', false, 7);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,velocidad_max_kmh,autonomia_km) VALUES (14, 'de 1000W con velocidades hasta 35 Km/h y con una autonomía de hasta 70 Km es el transporte ideal para disfrutarlo junto a los que más amas. Además este vehículo cuenta con las exclusivas baterías de grafeno 60V y 22Ah.', 35, 70);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (15, 1, 'Greenline Vmp S9', 'greenline-vmp-s9', '<h3>Vehículo de Movilidad Personal Greenline S9</h3>
¡Recorre la ciudad con Estilo y de manera sostenible con la S9 de Greenline! Su diseño elegante y potente motor de 500 Watts que te permitirán alcanzar velocidades de hasta 35 km/h. Además con la eficiente batería de Plomo Graphene disfrutarás de viajes con una autonomía de hasta 50 km. ¡Únete a la revolución de movilidad sostenible con este vehículo Top que está de promoción hasta Agotar Stock!

DIMENSIONES

Largo: 154 cm.
Ancho: 71 cm.
Altura: 107 cm.', NULL, NULL, false, ARRAY['destacado','vmpGraphene','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (15, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/S9/vmp_s9_blanco.webp', 'Blanco', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (15, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/S9/vmp_s9_gris.webp', 'Gris', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (15, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/S9/vmp_s9_rojo.webp', 'Rojo', false, 2);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (15, 'de 500 Watts que te permitirán alcanzar velocidades de hasta 35 km/h. Además con la eficiente batería de Plomo Graphene disfrutarás de viajes con una autonomía de hasta 50 km. ¡Únete a la revolución de movilidad sostenible con este vehículo Top que está de promoción hasta Agotar Stock!','de Plomo Graphene disfrutarás de viajes con una autonomía de hasta 50 km. ¡Únete a la revolución de movilidad sostenible con este vehículo Top que está de promoción hasta Agotar Stock!', 35, 50);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (16, 4, 'GreenLine TC2-180A', 'greenline-tc2-180a', '<h3>Carguero Eléctrico GreenLine TC2-180A</h3>
<p style="text-align: justify;">Lleva tu negocio a un nivel PRO. Nuestro vehículo eléctrico de carga TC2-180A cuenta con un potente motor de 1500 Watts y una eficiente batería de 60 Voltios y 45 Amperios, además puedes alcanzar velocidades de hasta 35 km/h.</p>
<p style="text-align: justify;">¡No esperes más para potenciar tus emprendimientos!</p>

DIMENSIONES

Largo: 310 cm.
Ancho: 110 cm.
Altura: 140 cm.

DIMENSIONES DE LA TOLVA

Largo: 160 cm.
Ancho: 110 cm.', NULL, NULL, false, ARRAY['carguero-promocion','destacado','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (16, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc2_180a/TC2-180-AZUL-INCLINADO.webp', 'Azul', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (16, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc2_180a/TC2-180-ROJO-INCLINADO.webp', 'Rojo', false, 1);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh) VALUES (16, 'de 1500 Watts y una eficiente batería de 60 Voltios y 45 Amperios, además puedes alcanzar velocidades de hasta 35 km/h.</p>','de 60 Voltios y 45 Amperios, además puedes alcanzar velocidades de hasta 35 km/h.</p>', 35);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (17, 1, 'Greenline VMP L3 Pro', 'greenline-vmp-l3-pro', '<h3>Vehículo de Movilidad Personal L3 Pro</h3>
<p style="text-align: justify;">¡Lleva tu viajes a un Nivel PRO con nuestra Nuevo Ingreso, la L3 Pro de Greenline! Su diseño elegante y potente motor de 500 Watts te permitirán alcanzar velocidades de hasta 35 km/h. Además con la súper eficiente batería de GRAFENO disfrutarás de una asombrosa autonomía de hasta 70 km. ¡Únete a la revolución de movilidad sostenible con este vehículo PRO!</p>

DIMENSIONES

Largo: 156 cm.
Ancho: 71 cm.
Altura: 106 cm.', NULL, NULL, false, ARRAY['destacado','vmpGraphene','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/l3pro/L3-NEGRO.webp', 'Negro', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/l3pro/L3-FRENTE-NEGRO.webp', 'Negro', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/l3pro/L3-POSTERIOR-NEGRO.webp', 'Negro', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/l3pro/L3-CELESTE.webp', 'Celeste', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/l3pro/L3-FRENTE-CELESTE-scaled.webp', 'Celeste', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/l3pro/L3-POSTERIOR-CELESTE.webp', 'Celeste', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/l3pro/L3-CREMA.webp', 'Crema', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/l3pro/L3-CREMA-2.webp', 'Crema', false, 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/l3pro/L3-FRENTE-CREMA-scaled.webp', 'Crema', false, 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (17, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/vmp/l3pro/L3-POSTERIOR.webp', NULL, false, 9);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (17, 'de 500 Watts te permitirán alcanzar velocidades de hasta 35 km/h. Además con la súper eficiente batería de GRAFENO disfrutarás de una asombrosa autonomía de hasta 70 km. ¡Únete a la revolución de movilidad sostenible con este vehículo PRO!</p>','de GRAFENO disfrutarás de una asombrosa autonomía de hasta 70 km. ¡Únete a la revolución de movilidad sostenible con este vehículo PRO!</p>', 35, 70);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (18, 4, 'GreenLine TC-BUS', 'greenline-tc-bus', '<h3>Carguero Eléctrico GreenLine TC-BUS</h3>
Potencia tus operaciones de transporte con el TC-Bus de Greenline, ideal para logística y traslados turísticos. Equipado con un motor potente de 1500 Watts y una batería eficiente de 60 voltios y 45 amperios, alcanza velocidades de hasta 35 km/h con una carga máxima de 350 a 400 kg.

Descubre una solución confiable, ecológica y eficiente para tus necesidades comerciales. ¡Haz avanzar tu negocio con Greenline!

DIMENSIONES

Largo: 290 cm.
Ancho: 115 cm.
Altura: 172 cm.', NULL, NULL, false, ARRAY['carguero-promocion','destacado','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (18, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc_bus/tc_bus_azul.webp', 'Azul', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (18, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc_bus/tc_bus_negro.webp', 'Negro', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (18, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc_bus/tc_bus_rojo.webp', 'Rojo', false, 2);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,carga_maxima_kg) VALUES (18, 'potente de 1500 Watts y una batería eficiente de 60 voltios y 45 amperios, alcanza velocidades de hasta 35 km/h con una carga máxima de 350 a 400 kg.','eficiente de 60 voltios y 45 amperios, alcanza velocidades de hasta 35 km/h con una carga máxima de 350 a 400 kg.', 35, 350);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (19, 4, 'Carguero GreenLine TC2-110A', 'carguero-greenline-tc2-110a', '<h3>Carguero Eléctrico Greenline TC2-110A</h3>
<p style="text-align: justify;">¡Haz de tu emprendimiento un éxito con nuestro Carguero TC2-110A! Este vehículo de carga y pasajeros ha sido diseñado con la máxima eficiencia para impulsar tu negocio. Disfruta de desplazamientos veloces de hasta 25 km/h, respaldados por un motor de 600 W y una batería de 60V y 22Ah.</p>
<p style="text-align: justify;">La autonomía de 30 km a 35 km en promedio garantiza que tus entregas sean impecables.</p>

DIMENSIONES

Largo: 250 cm.
Ancho: 88 cm.
Altura: 120 cm.

DIMENSIONES TOLVA

Largo: 110 cm.
Ancho: 85 cm.', NULL, NULL, false, ARRAY['carguero-promocion','destacado','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc2_110a/tc2_110a_naranja_costado.webp', 'Naranja', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc2_110a/tc2_110a_naranja_frontal.webp', 'Naranja', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc2_110a/tc2_110a_naranja_posterior.webp', 'Naranja', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc2_110a/tc2_110a_naranja_perfil.webp', 'Naranja', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc2_110a/tc2_110a_plata_costado.webp', 'Plata', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc2_110a/tc2_110a_plata_frontal.webp', 'Plata', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc2_110a/tc2_110a_plata_posterior.webp', 'Plata', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (19, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/cargueros/tc2_110a/tc2_110a_plata_perfil.webp', 'Plata', false, 7);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (19, 'de 600 W y una batería de 60V y 22Ah.</p>','de 60V y 22Ah.</p>', 25, 30);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (20, 2, 'GreenLine F4 Pro', 'greenline-f4-pro', '<h3>Moto Eléctrica GreenLine F4 Pro</h3>
<p style="text-align: justify;">Recorre y explora la ciudad con la Moto eléctrica F4 PRO de Greenline. Está equipada con un motor potente de 2000 Watts y una súper eficiente batería de GRAFENO de 72 voltios y 35 amperios, que te permitirá alcanzar velocidades de hasta 60 km/h y disfrutar de una asombrosa autonomía de 90 a 100 kilómetros.</p>
<p style="text-align: justify;">¡No esperes más para disfrutar de tus paseos como un Pro y sin emisiones por la ciudad!</p>

DIMENSIONES

Largo: 181 cm.
Ancho: 71 cm.
Altura: 110 cm.', NULL, NULL, false, ARRAY['destacado','MotoElectricaGrafeno','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_azul_costado.webp', 'Azul', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_azul_frontal.webp', 'Azul', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_azul_posterior.webp', 'Azul', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_azul_perfil.webp', 'Azul', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_negro_costado.webp', 'Negro', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_negro__frontal.webp', 'Negro', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_negro_posterior.webp', 'Negro', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_negro_perfil.webp', 'Negro', false, 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_rojo_costado.webp', 'Rojo', false, 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_rojo_frontal.webp', 'Rojo', false, 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_rojo_posterior.webp', 'Rojo', false, 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_rojo_perfil.webp', 'Rojo', false, 11);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_gris_costado.webp', 'Gris', false, 12);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_gris_frontal.webp', 'Gris', false, 13);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_gris_posterior.webp', 'Gris', false, 14);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (20, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/f4%20pro/f4pro_gris_perfil.webp', 'Gris', false, 15);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (20, 'potente de 2000 Watts y una súper eficiente batería de GRAFENO de 72 voltios y 35 amperios, que te permitirá alcanzar velocidades de hasta 60 km/h y disfrutar de una asombrosa autonomía de 90 a 100 kilómetros.</p>','de GRAFENO de 72 voltios y 35 amperios, que te permitirá alcanzar velocidades de hasta 60 km/h y disfrutar de una asombrosa autonomía de 90 a 100 kilómetros.</p>', 60, 90);
INSERT INTO productos (id, categoria_id, nombre, slug, descripcion, precio_original, precio_actual, destacado, etiquetas) VALUES (21, 2, 'GreenLine GL3', 'greenline-gl3', '<h3>Moto Eléctrica GreenLine GL3</h3>
¡Vive la emoción de viajar sin límites con nuestra increíble Moto eléctrica GL3! ¿Te imaginas recorriendo la ciudad de manera sostenible, veloz y sin esfuerzo? Con nuestra Moto GL3, ese sueño se hace realidad.  Está equipada con un motor potente de 2000 Watts y una eficiente batería de 72 voltios y 22 amperios, que te permitirá alcanzar velocidades de hasta 55 km/h y disfrutar de una autonomía de 50 a 60 kilómetros. ¡Disfruta de tus paseos sin emisiones por la ciudad!

DIMENSIONES

Largo: 182 cm.
Ancho: 75 cm.
Altura: 111 cm.', NULL, NULL, false, ARRAY['destacado','MotoElectricaGrafeno','promocion']::TEXT[]);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_negro_costado.webp', 'Negro', true, 0);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_negro_frontal.webp', 'Negro', false, 1);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_negro_posterior.webp', 'Negro', false, 2);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_negro_perfil.webp', 'Negro', false, 3);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_camaleon_frente.webp', 'Camaleon', false, 4);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_camaleon_frontal.webp', 'Camaleon', false, 5);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_camaleon_posterior.webp', 'Camaleon', false, 6);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_camaleon_perfil.webp', 'Camaleon', false, 7);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_verde_metalico_costado.webp', 'Verde Metalico', false, 8);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_verde_metalico_frontal.webp', 'Verde Metalico', false, 9);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_verde_metalico_posterior.webp', 'Verde Metalico', false, 10);
INSERT INTO imagenes (producto_id, url, color, es_principal, orden) VALUES (21, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/productos/motos/gl3/gl3_verde_metalico_perfil.webp', 'Verde Metalico', false, 11);
INSERT INTO ficha_tecnica (producto_id, potencia_motor,tipo_bateria,velocidad_max_kmh,autonomia_km) VALUES (21, 'potente de 2000 Watts y una eficiente batería de 72 voltios y 22 amperios, que te permitirá alcanzar velocidades de hasta 55 km/h y disfrutar de una autonomía de 50 a 60 kilómetros. ¡Disfruta de tus paseos sin emisiones por la ciudad!','de 72 voltios y 22 amperios, que te permitirá alcanzar velocidades de hasta 55 km/h y disfrutar de una autonomía de 50 a 60 kilómetros. ¡Disfruta de tus paseos sin emisiones por la ciudad!', 55, 50);

-- Continuación de la inserción de productos para asegurarnos de que la secuencia avanza correctamente
SELECT setval('productos_id_seq', 22);

-- ============================================================
-- 2. INSERTAR RELACIÓN PRODUCTO-COLOR (Variaciones/Stock)
-- ============================================================

INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (1, 5, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (1, 2, 0) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (1, 1, 0) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (2, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (5, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (5, 3, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (5, 8, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (5, 1, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (6, 14, 0) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (6, 1, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (6, 11, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (6, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (7, 1, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (7, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (8, 5, 0) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (8, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (9, 5, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (9, 1, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (10, 3, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (10, 1, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (11, 13, 0) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (11, 14, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (11, 1, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (11, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (11, 11, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (12, 1, 0) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (12, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (12, 3, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (13, 14, 0) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (13, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (14, 6, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (14, 3, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (15, 11, 0) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (15, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (16, 5, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 14, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 3, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 5, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 11, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 1, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (17, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (18, 11, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (19, 5, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (20, 11, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (20, 1, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (20, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (20, 5, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (21, 1, 0) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
INSERT INTO prod_color_rel (producto_id, color_id, stock) VALUES (21, 2, 1) ON CONFLICT (producto_id, color_id) DO UPDATE SET stock = prod_color_rel.stock + EXCLUDED.stock;
