BEGIN;

DROP VIEW IF EXISTS greenline_locations_public;
DROP TABLE IF EXISTS greenline_distributors;
DROP TABLE IF EXISTS greenline_stores;
DROP TABLE IF EXISTS greenline_province_sales;

CREATE TABLE greenline_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country TEXT NOT NULL DEFAULT 'Perú',
    department TEXT NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    schedule TEXT,
    phone TEXT,
    whatsapp_number TEXT,
    whatsapp_url TEXT,
    maps_url TEXT,
    technical_service BOOLEAN NOT NULL DEFAULT FALSE,
    technical_phone TEXT,
    technical_whatsapp_number TEXT,
    technical_whatsapp_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE greenline_distributors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country TEXT NOT NULL DEFAULT 'Perú',
    department TEXT NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    name TEXT NOT NULL,
    ruc TEXT,
    contact_name TEXT,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    coordinate_precision TEXT NOT NULL DEFAULT 'city',
    maps_url TEXT,
    phone TEXT,
    whatsapp_number TEXT,
    whatsapp_url TEXT,
    priority SMALLINT CHECK (priority IN (1, 2, 3)),
    technical_service BOOLEAN NULL DEFAULT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE greenline_province_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country TEXT NOT NULL DEFAULT 'Perú',
    name TEXT NOT NULL DEFAULT 'Ventas provincias',
    phone TEXT,
    whatsapp_number TEXT,
    whatsapp_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_greenline_stores_country_department ON greenline_stores(country, department);
CREATE INDEX idx_greenline_stores_department_province ON greenline_stores(department, province);
CREATE INDEX idx_greenline_distributors_department_province ON greenline_distributors(department, province);
CREATE INDEX idx_greenline_distributors_priority ON greenline_distributors(priority);
CREATE INDEX idx_greenline_distributors_active ON greenline_distributors(active);

-- TIENDAS
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'Lince', 'Lince', 'Av. José Leal 507', -12.085146567066403, -77.03900011936942, 'Lun-Sáb: 9am-7pm', '(51)960 773 053', '51960773053', 'https://api.whatsapp.com/send?phone=51960773053', 'https://maps.app.goo.gl/6cg4VfqtiS9krXqN8', TRUE, '(51)960 123 827', '51960123827', 'https://api.whatsapp.com/send?phone=51960123827', TRUE, 1);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'Surco', 'Surco', 'Av. Surco 790', -12.13808834009009, -76.99365814803508, 'Lun-Sáb: 9am-7pm', '(51)977 814 692', '51977814692', 'https://api.whatsapp.com/send?phone=51977814692', 'https://maps.app.goo.gl/PwHPbwoTmcS9TZ6CA', TRUE, '(51)960 696 097', '51960696097', 'https://api.whatsapp.com/send?phone=51960696097', TRUE, 2);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'San Miguel', 'San Miguel', 'Av. de la Marina 1465', -12.078932027540436, -77.07759297208621, 'Lun-Sáb: 9am-7pm', '(51)960 789 915', '51960789915', 'https://api.whatsapp.com/send?phone=51960789915', 'https://maps.app.goo.gl/BWouoxjVrWEF6y9w7', TRUE, '(51)960 685 280', '51960685280', 'https://api.whatsapp.com/send?phone=51960685280', TRUE, 3);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'Miraflores', 'Miraflores', 'Ca. Enrique Palacios 762', -12.116596161177519, -77.0364691616974, 'Lun-Sáb: 9am-7pm', '(51)960 263 301', '51960263301', 'https://api.whatsapp.com/send?phone=51960263301', NULL, FALSE, NULL, NULL, NULL, TRUE, 4);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'La Molina', 'La Molina', 'Av. Javier Prado Este 5393', -12.074346110017737, -76.96315207658266, 'Lun-Sáb: 9am-7pm', '(51)960 138 010', '51960138010', 'https://api.whatsapp.com/send?phone=51960138010', 'https://maps.app.goo.gl/Fn8CDxb55v62MbGG9', TRUE, '(51)981 382 163', '51981382163', 'https://api.whatsapp.com/send?phone=51981382163', TRUE, 5);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'Comas', 'Comas', 'Av. Tupac Amaru 3999', -11.932495139254188, -77.04623190402846, 'Lun-Sáb: 9am-7pm', '(51)992 179 133', '51992179133', 'https://api.whatsapp.com/send?phone=51992179133', NULL, FALSE, NULL, NULL, NULL, TRUE, 6);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('Perú', 'Junín', 'Huancayo', 'Huancayo', 'Huancayo', 'Av. Huancavelica 290', -12.065580600861884, -75.2174621040265, 'Lun-Sáb: 9am-6pm', '(51)944 030 267', '51944030267', 'https://api.whatsapp.com/send?phone=51944030267', 'https://maps.app.goo.gl/Ugc4XWjwPGqt3CYP7', TRUE, '(51)944 030 267', '51944030267', 'https://api.whatsapp.com/send?phone=51944030267', TRUE, 8);
INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude, schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service, technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES ('Chile', 'Región Metropolitana', 'Santiago', 'Santiago', 'Santiago', 'San Diego 1202, Santiago, Región Metropolitana', -33.4565, -70.6483, NULL, '9 8662 0355', '986620355', 'https://wa.link/5b95ba', 'https://goo.gl/maps/CPQMviL766DPDgN96', FALSE, NULL, NULL, NULL, TRUE, 9);

-- DISTRIBUIDORES
-- priority: 1=verde/compran siempre, 2=amarillo/compran, 3=rojo/ocasional.
-- coordinate_precision='city' indica que, al no existir un enlace de Maps
-- en la fuente, la coordenada corresponde a la localidad y no a una puerta
-- exacta. No se inventan coordenadas de establecimiento.
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Barranca', 'Barranca', 'Barranca', 'Aguila Motos', '10455505998', 'Aguila Osorio Johan Yaïd', 'Jr. Ramón Castilla 677', -10.7522, -77.7667, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Ram%C3%B3n+Castilla+677%2C+Barranca%2C+Barranca%2C+Barranca%2C+Per%C3%BA', '+51 997 699 085', '51997699085', 'https://api.whatsapp.com/send?phone=51997699085', 1, TRUE, TRUE, 1);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Huaral', 'Huaral', 'Distribuidora Luis Alberto', '20408124400', 'Rufino Caracciolo Maza', 'Calle circunvalación este s/n, tienda 29, mercado Mora Parra', -11.495, -77.207, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+circunvalaci%C3%B3n+este+s%2Fn%2C+tienda+29%2C+mercado+Mora+Parra%2C+Huaral%2C+Huaral%2C+Lima%2C+Per%C3%BA', '+51 922 434 518', '51922434518', 'https://api.whatsapp.com/send?phone=51922434518', 1, TRUE, TRUE, 2);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Huaral', 'Huaral', 'Comercial Joan', '10408069845', 'Merlyn Cruz Damaso', 'Av. Cahuas 417, Huaral', -11.495, -77.207, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Cahuas+417%2C+Huaral%2C+Huaral%2C+Huaral%2C+Lima%2C+Per%C3%BA', '+51 920 707 776', '51920707776', 'https://api.whatsapp.com/send?phone=51920707776', 2, TRUE, TRUE, 3);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Huaral', 'Huaral', 'Saja Import', '20611349352', 'Jamir Omar Naupari Pastrana', 'Calle Bolognesi 126, Huaral', -11.495, -77.207, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Bolognesi+126%2C+Huaral%2C+Huaral%2C+Huaral%2C+Lima%2C+Per%C3%BA', '+51 941 386 549', '51941386549', 'https://api.whatsapp.com/send?phone=51941386549', 2, TRUE, TRUE, 4);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Huaura', 'Huacho', 'Distribuidora Luis Alberto', '20408124400', 'Rufino Caracciolo Maza', 'Av. Túpac Amaru 174, Huacho', -11.1067, -77.605, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+T%C3%BApac+Amaru+174%2C+Huacho%2C+Huacho%2C+Huaura%2C+Lima%2C+Per%C3%BA', '+51 993 703 549', '51993703549', 'https://api.whatsapp.com/send?phone=51993703549', 1, TRUE, TRUE, 5);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Ancash', 'Huarmey', 'Huarmey', 'Richy Motors', '20606765038', 'Paul Alexis Cáceres Reyes', 'Calle Casma 295, Huarmey', -10.0681, -78.1522, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Casma+295%2C+Huarmey%2C+Huarmey%2C+Huarmey%2C+Ancash%2C+Per%C3%BA', '+51 949 494 430', '51949494430', 'https://api.whatsapp.com/send?phone=51949494430', 1, TRUE, TRUE, 6);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Cajamarca', 'Cajamarca', 'Cajamarca', 'Global Newtech', '20605214186', 'Stiven Mijail Dávila Fernández', 'Jr. Juan Beato Masías 569, Cajamarca', -7.1638, -78.5003, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Juan+Beato+Mas%C3%ADas+569%2C+Cajamarca%2C+Cajamarca%2C+Cajamarca%2C+Cajamarca%2C+Per%C3%BA', '+51 998 885 364', '51998885364', 'https://api.whatsapp.com/send?phone=51998885364', 1, TRUE, TRUE, 7);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Cajamarca', 'Jaén', 'Jaén', 'R&C Soluciones', '20613083791', 'Yonil Isidro Ruiz Bustamante', 'Calle Orellana 210, Jaén', -5.7073, -78.8078, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Orellana+210%2C+Ja%C3%A9n%2C+Ja%C3%A9n%2C+Ja%C3%A9n%2C+Cajamarca%2C+Per%C3%BA', '+51 976 646 029', '51976646029', 'https://api.whatsapp.com/send?phone=51976646029', 1, TRUE, TRUE, 8);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Cajamarca', 'Jaén', 'Jaén', 'Motos Ferdi', '10431291415', 'Aracely del Pilar Tantaleán Díaz', 'Calle María Parado de Bellido 1026, Jaén', -5.7073, -78.8078, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Mar%C3%ADa+Parado+de+Bellido+1026%2C+Ja%C3%A9n%2C+Ja%C3%A9n%2C+Ja%C3%A9n%2C+Cajamarca%2C+Per%C3%BA', '+51 942 189 058', '51942189058', 'https://api.whatsapp.com/send?phone=51942189058', 2, TRUE, TRUE, 9);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lambayeque', 'Chiclayo', 'Chiclayo', 'Korea Motors', '20479779598', 'Belizario Gálvez Bustamante', 'Av. A.B. Leguía 420, Chiclayo', -6.7714, -79.8409, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+A.B.+Legu%C3%ADa+420%2C+Chiclayo%2C+Chiclayo%2C+Chiclayo%2C+Lambayeque%2C+Per%C3%BA', '+51 933 618 828', '51933618828', 'https://api.whatsapp.com/send?phone=51933618828', 1, TRUE, TRUE, 10);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lambayeque', 'Chiclayo', 'Chiclayo', 'MecaElectric', '20606942312', 'Harold Jaime Cachay', 'Calle Teresa Gonzales de Fanning 429, Chiclayo', -6.7714, -79.8409, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Teresa+Gonzales+de+Fanning+429%2C+Chiclayo%2C+Chiclayo%2C+Chiclayo%2C+Lambayeque%2C+Per%C3%BA', '+51 912 902 546', '51912902546', 'https://api.whatsapp.com/send?phone=51912902546', 2, TRUE, TRUE, 11);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'La Libertad', 'Trujillo', 'Trujillo', 'JSV Motos Eléctricas', '10405845038', 'Jacinto Antonio Sánchez Vásquez', 'Calle Cayetano Heredia 163, Urb. Los Granados', -8.1116, -79.0287, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Cayetano+Heredia+163%2C+Urb.+Los+Granados%2C+Trujillo%2C+Trujillo%2C+La+Libertad%2C+Per%C3%BA', '+51 935 405 452', '51935405452', 'https://api.whatsapp.com/send?phone=51935405452', 1, TRUE, TRUE, 12);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'La Libertad', 'Trujillo', 'Trujillo', 'Cel Movil', '20609189534', 'César Antonio Rojas Ruiz', 'Av. América Sur 397, Urb. Aranjuez, Trujillo', -8.1116, -79.0287, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Am%C3%A9rica+Sur+397%2C+Urb.+Aranjuez%2C+Trujillo%2C+Trujillo%2C+Trujillo%2C+La+Libertad%2C+Per%C3%BA', '+51 910 325 038', '51910325038', 'https://api.whatsapp.com/send?phone=51910325038', 1, TRUE, TRUE, 13);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'La Libertad', 'Trujillo', 'Trujillo', 'RG Móviles', '10719849135', 'Raúl Antony Gálvez Miranda', 'Mz. 26 Lt. 26, La Esperanza, Trujillo', -8.1116, -79.0287, 'city', 'https://www.google.com/maps/search/?api=1&query=Mz.+26+Lt.+26%2C+La+Esperanza%2C+Trujillo%2C+Trujillo%2C+Trujillo%2C+La+Libertad%2C+Per%C3%BA', '+51 994 620 079', '51994620079', 'https://api.whatsapp.com/send?phone=51994620079', 2, TRUE, TRUE, 14);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Ancash', 'Santa', 'Chimbote', 'Oveja Negra', '20606507870', 'Jorge Alberto Puente Sarrín', 'Av. Pacífico 580, Nuevo Chimbote', -9.0745, -78.5936, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Pac%C3%ADfico+580%2C+Nuevo+Chimbote%2C+Chimbote%2C+Santa%2C+Ancash%2C+Per%C3%BA', '+51 949 741 274', '51949741274', 'https://api.whatsapp.com/send?phone=51961448299', 1, TRUE, TRUE, 15);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Piura', 'Piura', 'Piura', 'GreenLine Piura', '10026833677', 'Víctor Andrés García Escobar', 'Las Dalias Mz. Q lote 26, Urb. Miraflores Country, Piura', -5.1945, -80.6328, 'city', 'https://www.google.com/maps/search/?api=1&query=Las+Dalias+Mz.+Q+lote+26%2C+Urb.+Miraflores+Country%2C+Piura%2C+Piura%2C+Piura%2C+Piura%2C+Per%C3%BA', '+51 983 459 213', '51983459213', 'https://api.whatsapp.com/send?phone=51983459213', 1, TRUE, TRUE, 16);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Piura', 'Piura', 'Piura', 'Laban Import', '20493915445', 'Amado Laban Peña', 'Av. Andrés Avelino Cáceres 794, Piura', -5.1945, -80.6328, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Andr%C3%A9s+Avelino+C%C3%A1ceres+794%2C+Piura%2C+Piura%2C+Piura%2C+Piura%2C+Per%C3%BA', '+51 904 445 569', '51904445569', 'https://api.whatsapp.com/send?phone=51904445569', 3, TRUE, TRUE, 17);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Ancash', 'Huaylas', 'Huallanca', 'Multicentro Marben', '10444485456', 'Gladys Marlyn Ávila Aquino', 'Jirón Leoncio Prado 207, Huallanca', -9.9, -76.983, 'city', 'https://www.google.com/maps/search/?api=1&query=Jir%C3%B3n+Leoncio+Prado+207%2C+Huallanca%2C+Huallanca%2C+Huaylas%2C+Ancash%2C+Per%C3%BA', '+51 948 489 188', '51948489188', 'https://api.whatsapp.com/send?phone=51948489188', 2, TRUE, TRUE, 18);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Junín', 'Jauja', 'Jauja', 'Hotel Casa', '10207211180', 'Raymundo Villarreal Adriana', 'Av. Héroes de la Breña 389, Jauja', -11.7758, -75.4966, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+H%C3%A9roes+de+la+Bre%C3%B1a+389%2C+Jauja%2C+Jauja%2C+Jauja%2C+Jun%C3%ADn%2C+Per%C3%BA', '+51 900 805 307', '51900805307', 'https://api.whatsapp.com/send?phone=51900805307', 1, TRUE, TRUE, 19);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Junín', 'Huancayo', 'Huancayo', 'K y L Motos', '10427688491', 'Edith Cely Campos Lucas', 'Av. Huancavelica 439, El Tambo, Huancayo', -12.0651, -75.2049, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Huancavelica+439%2C+El+Tambo%2C+Huancayo%2C+Huancayo%2C+Huancayo%2C+Jun%C3%ADn%2C+Per%C3%BA', '+51 953 212 102', '51953212102', 'https://api.whatsapp.com/send?phone=51953212102', 1, TRUE, TRUE, 20);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Junín', 'Huancayo', 'Huancayo', 'Mas Motos', '20613011235', 'Darío Cabezas Zorrilla', 'Av. Huancavelica 540, El Tambo', -12.0651, -75.2049, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Huancavelica+540%2C+El+Tambo%2C+Huancayo%2C+Huancayo%2C+Jun%C3%ADn%2C+Per%C3%BA', '+51 975 999 977', '51975999977', 'https://api.whatsapp.com/send?phone=51975999977', 2, TRUE, TRUE, 21);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Junín', 'Huancayo', 'Huancayo', 'Grupo Mototienda', '20606117281', 'Luis Ernesto Díaz García', 'Jirón Santa Rosa 466, El Tambo, Huancayo', -12.0651, -75.2049, 'city', 'https://www.google.com/maps/search/?api=1&query=Jir%C3%B3n+Santa+Rosa+466%2C+El+Tambo%2C+Huancayo%2C+Huancayo%2C+Huancayo%2C+Jun%C3%ADn%2C+Per%C3%BA', '+51 964 523 752 / +51 947 585 888', '51964523752', 'https://api.whatsapp.com/send?phone=51964523752', 2, TRUE, TRUE, 22);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Pasco', 'Pasco', 'Pasco', 'Multiproductos Nvision E&T', '10719225531', 'Diana Yanina Díaz Dávila', 'Av. Los Próceres, Cerro de Pasco 19001', -10.6864, -76.2625, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Los+Pr%C3%B3ceres%2C+Cerro+de+Pasco+19001%2C+Pasco%2C+Pasco%2C+Pasco%2C+Per%C3%BA', '+51 957 790 239', '51957790239', 'https://api.whatsapp.com/send?phone=51957790239', 1, TRUE, TRUE, 23);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Pasco', 'Oxapampa', 'Oxapampa', 'Home Electronic', '20600217861', 'José Manuel Lozano Palacín de Quispe', 'Jr. Grau 403, Oxapampa', -10.5775, -75.4028, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Grau+403%2C+Oxapampa%2C+Oxapampa%2C+Oxapampa%2C+Pasco%2C+Per%C3%BA', '+51 963 936 400', '51963936400', 'https://api.whatsapp.com/send?phone=51963936400', 3, TRUE, TRUE, 24);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Ucayali', 'Coronel Portillo', 'Pucallpa', 'Amazon GreenLine', '20393347041', 'Saúl Duarte Galarza Granados', 'Jr. Tarapacá 295, distrito Callería, Coronel Portillo', -8.3791, -74.5539, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Tarapac%C3%A1+295%2C+distrito+Caller%C3%ADa%2C+Coronel+Portillo%2C+Pucallpa%2C+Coronel+Portillo%2C+Ucayali%2C+Per%C3%BA', '+51 920 716 945', '51920716945', 'https://api.whatsapp.com/send?phone=51920716945', 1, TRUE, TRUE, 25);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Puno', 'San Román', 'Juliaca', 'Global Ecotech', '20613416642', 'Roosvelth Juárez Condori', 'Jr. Mariano Núñez 1310, Juliaca', -15.4899, -70.1277, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Mariano+N%C3%BA%C3%B1ez+1310%2C+Juliaca%2C+Juliaca%2C+San+Rom%C3%A1n%2C+Puno%2C+Per%C3%BA', '+51 974 545 598', '51974545598', 'https://api.whatsapp.com/send?phone=51974545598', 2, TRUE, TRUE, 26);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Ica', 'Nasca', 'Marcona', 'Hepageza', '20452748291', 'Elder Egerio Pajta Apaza', 'Av. Los Incas Nro. s/n, Marcona, Ica - Nasca', -15.3639, -75.1628, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Los+Incas+Nro.+s%2Fn%2C+Marcona%2C+Ica+-+Nasca%2C+Marcona%2C+Nasca%2C+Ica%2C+Per%C3%BA', '+51 956 955 718', '51956955718', 'https://api.whatsapp.com/send?phone=51956955718', 1, TRUE, TRUE, 27);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Cañete', 'Cañete', 'Export Motors', '20491409089', 'Teodoro Peláez Pérez', 'Av. 28 de Julio 973, Imperial, 15701', -13.077, -76.39, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+28+de+Julio+973%2C+Imperial%2C+15701%2C+Ca%C3%B1ete%2C+Ca%C3%B1ete%2C+Lima%2C+Per%C3%BA', '+51 951 521 664', '51951521664', 'https://api.whatsapp.com/send?phone=51951521664', 3, TRUE, TRUE, 28);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Ica', 'Chincha', 'Chincha', 'Pequiva', '20602103405', 'Jeyson Iván Echajalla Espinoza', 'Panamericana Sur Km 199 #351, Chincha Alta', -13.4099, -76.1326, 'city', 'https://www.google.com/maps/search/?api=1&query=Panamericana+Sur+Km+199+%23351%2C+Chincha+Alta%2C+Chincha%2C+Chincha%2C+Ica%2C+Per%C3%BA', '+51 927 803 061', '51927803061', 'https://api.whatsapp.com/send?phone=51927803061', 1, TRUE, TRUE, 29);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Tacna', 'Tacna', 'Tacna', 'Lupol Motos', '20608240871', 'Lucio Callata Copari', 'A.H. Alfonso Ugarte I Etapa Mz. G3 Lt. 41, Tacna', -18.0147, -70.2536, 'city', 'https://www.google.com/maps/search/?api=1&query=A.H.+Alfonso+Ugarte+I+Etapa+Mz.+G3+Lt.+41%2C+Tacna%2C+Tacna%2C+Tacna%2C+Tacna%2C+Per%C3%BA', '+51 956 018 820', '51956018820', 'https://api.whatsapp.com/send?phone=51956018820', 1, TRUE, TRUE, 30);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Ayacucho', 'Huamanga', 'Ayacucho', 'Sonia Ayme', '10744604279', 'Julieta Plácida Godoy Ayme', 'Jr. Américo Ore 125, Ayacucho', -13.1631, -74.2236, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Am%C3%A9rico+Ore+125%2C+Ayacucho%2C+Ayacucho%2C+Huamanga%2C+Ayacucho%2C+Per%C3%BA', '+51 920 264 834', '51920264834', 'https://api.whatsapp.com/send?phone=51920264834', 2, TRUE, TRUE, 31);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Puno', 'Chucuito', 'Desaguadero', 'Nayoga Group', '20601662672', 'Huber Huacca Ramos', 'Jr. Grau Nro. 524, Puno - Desaguadero', -16.5656, -69.0417, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Grau+Nro.+524%2C+Puno+-+Desaguadero%2C+Desaguadero%2C+Chucuito%2C+Puno%2C+Per%C3%BA', '+51 925 791 681', '51925791681', 'https://api.whatsapp.com/send?phone=51925791681', 2, TRUE, TRUE, 32);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Puno', 'Puno', 'Puno', 'Tienda OLA', '20601969310', 'Ronald Ernesto Castro Hancco', 'Jr. Arequipa Nro. 796, Puno', -15.8402, -70.0219, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Arequipa+Nro.+796%2C+Puno%2C+Puno%2C+Puno%2C+Puno%2C+Per%C3%BA', '+51 916 712 150', '51916712150', 'https://api.whatsapp.com/send?phone=51916712150', 2, TRUE, TRUE, 33);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Puno', 'Azángaro', 'Azángaro', 'Provisur Technologies', '10015449263', 'Elvira Tite Calcina', 'Jr. E. Jiménez 113, Azángaro', -14.9087, -70.1968, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+E.+Jim%C3%A9nez+113%2C+Az%C3%A1ngaro%2C+Az%C3%A1ngaro%2C+Az%C3%A1ngaro%2C+Puno%2C+Per%C3%BA', '+51 910 098 882', '51910098882', 'https://api.whatsapp.com/send?phone=51910098882', 2, TRUE, TRUE, 34);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Cusco', 'Espinar', 'Espinar', 'B Store', '20612589268', 'Jean Carlos Kana Choquenaira', 'Calle Pumacahua 205, Espinar', -14.7934, -71.4127, 'city', 'https://www.google.com/maps/search/?api=1&query=Calle+Pumacahua+205%2C+Espinar%2C+Espinar%2C+Espinar%2C+Cusco%2C+Per%C3%BA', '+51 992 123 031', '51992123031', 'https://api.whatsapp.com/send?phone=51992123031', 1, TRUE, TRUE, 35);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Arequipa', 'Caylloma', 'Majes', 'Motos Eléctricas Aventure', '20615841634', 'Jhon Fernando Chinchercoma Ochoa', 'Av. Arequipa Mz. B lote 01, Majes', -16.3547, -72.1897, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Arequipa+Mz.+B+lote+01%2C+Majes%2C+Majes%2C+Caylloma%2C+Arequipa%2C+Per%C3%BA', '+51 901 055 897', '51901055897', 'https://api.whatsapp.com/send?phone=51901055897', 1, TRUE, TRUE, 36);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Arequipa', 'Arequipa', 'Arequipa', 'Electro Sami Import', '20616195990', 'Gualberto Cristóbal Cahuana Palacios', 'Av. Porongoche N°710, José Luis Bustamante y Rivero', -16.409, -71.5375, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Porongoche+N%C2%B0710%2C+Jos%C3%A9+Luis+Bustamante+y+Rivero%2C+Arequipa%2C+Arequipa%2C+Arequipa%2C+Per%C3%BA', '+51 943 540 373', '51943540373', 'https://api.whatsapp.com/send?phone=51943540373', 1, TRUE, TRUE, 37);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Arequipa', 'Arequipa', 'Arequipa', 'Energreen Vehículos Eléctricos', '10296176155', 'Amador Vega Quispe', 'Av. España 406, Alto Selva Alegre, Arequipa', -16.409, -71.5375, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Espa%C3%B1a+406%2C+Alto+Selva+Alegre%2C+Arequipa%2C+Arequipa%2C+Arequipa%2C+Arequipa%2C+Per%C3%BA', '+51 986 625 685', '51986625685', 'https://api.whatsapp.com/send?phone=51986625685', 1, TRUE, TRUE, 38);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Arequipa', 'Arequipa', 'Arequipa', 'Elektro Energy', '20607270521', 'Kiara Llerena Medina', 'José Luis Bustamante y Rivero 04000, Arequipa', -16.409, -71.5375, 'city', 'https://www.google.com/maps/search/?api=1&query=Jos%C3%A9+Luis+Bustamante+y+Rivero+04000%2C+Arequipa%2C+Arequipa%2C+Arequipa%2C+Arequipa%2C+Per%C3%BA', '+51 943 352 538', '51943352538', 'https://api.whatsapp.com/send?phone=51943352538', 1, TRUE, TRUE, 39);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Arequipa', 'Camaná', 'Camaná', 'Carmen Aragón', '10428108006', 'Carmen Milagros Aragón Saire', 'Jr. San Martín 129, Camaná', -16.6238, -72.7111, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+San+Mart%C3%ADn+129%2C+Caman%C3%A1%2C+Caman%C3%A1%2C+Caman%C3%A1%2C+Arequipa%2C+Per%C3%BA', '+51 950 548 007', '51950548007', 'https://api.whatsapp.com/send?phone=51950548007', 1, TRUE, TRUE, 40);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'San Martín', 'Tocache', 'Tocache', 'O''Lan', '20601579759', 'Oriol Edmundo Lavado Noreña', 'Av. Fernando Belaunde Terry s/n, Nuevo Bambamarca, Tocache', -8.1889, -76.513, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Fernando+Belaunde+Terry+s%2Fn%2C+Nuevo+Bambamarca%2C+Tocache%2C+Tocache%2C+Tocache%2C+San+Mart%C3%ADn%2C+Per%C3%BA', '+51 944 779 635', '51944779635', 'https://api.whatsapp.com/send?phone=51944779635', 2, TRUE, TRUE, 41);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'San Bartolo', 'Electron Motos', '10468200169', 'Carmen Daniela Urbina Malaspina', 'San Bartolo, Lima', -12.3896, -76.78, 'city', 'https://www.google.com/maps/search/?api=1&query=San+Bartolo%2C+Lima%2C+San+Bartolo%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 915 179 744', '51915179744', 'https://api.whatsapp.com/send?phone=51915179744', 1, TRUE, TRUE, 42);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'San Juan de Lurigancho', 'San Lucas', '20550806232', 'Pedro Marcas Mirabal', 'Av. Próceres de la Independencia N° 2142, San Juan de Lurigancho', -11.984, -77.004, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Pr%C3%B3ceres+de+la+Independencia+N%C2%B0+2142%2C+San+Juan+de+Lurigancho%2C+San+Juan+de+Lurigancho%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 932 682 911', '51932682911', 'https://api.whatsapp.com/send?phone=51932682911', 1, TRUE, TRUE, 43);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'San Juan de Lurigancho', 'Jehova Jireh', '10806115741', 'Ledy Maritza Gonzales Mucha', 'Avenida Grau 320, San Juan de Lurigancho', -11.984, -77.004, 'city', 'https://www.google.com/maps/search/?api=1&query=Avenida+Grau+320%2C+San+Juan+de+Lurigancho%2C+San+Juan+de+Lurigancho%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 972 463 141', '51972463141', 'https://api.whatsapp.com/send?phone=51972463141', 2, TRUE, TRUE, 44);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'Puente Piedra', 'AP Motos', '20392652566', 'Manuel Eugenio Paredez Cruzado', 'Av. Panamericana Norte Urb. Huarangal Mz. I Lt. 15, Puente Piedra', -11.865, -77.075, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Panamericana+Norte+Urb.+Huarangal+Mz.+I+Lt.+15%2C+Puente+Piedra%2C+Puente+Piedra%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 992 445 077', '51992445077', 'https://api.whatsapp.com/send?phone=51992445077', 1, TRUE, TRUE, 45);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'Chaclacayo', 'LKP', '20547808429', 'Fidel Luis Arias Cas', 'Cooperativa La Floresta Mz. B lote 18, calle Las Tunas, Chaclacayo', -11.982, -76.767, 'city', 'https://www.google.com/maps/search/?api=1&query=Cooperativa+La+Floresta+Mz.+B+lote+18%2C+calle+Las+Tunas%2C+Chaclacayo%2C+Chaclacayo%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 928 398 831', '51928398831', 'https://api.whatsapp.com/send?phone=51928398831', 1, TRUE, TRUE, 46);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'Ate', 'Motoclass', '20613823086', 'Luis Eduardo Trujillo Saira', 'Mza. Y Lote 2, Asc. Parque Industrial El Asesor, Ate', -12.026, -76.918, 'city', 'https://www.google.com/maps/search/?api=1&query=Mza.+Y+Lote+2%2C+Asc.+Parque+Industrial+El+Asesor%2C+Ate%2C+Ate%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 941 636 941 / +51 921 313 740 / +51 921 636 941', '51941636941', 'https://api.whatsapp.com/send?phone=51941636941', 2, TRUE, TRUE, 47);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'La Victoria', 'Jaames Bike', '20608811347', 'Jaime Alcedo Ureta', 'Jr. Misti 160, La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Misti+160%2C+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 991 907 515', '51991907515', 'https://api.whatsapp.com/send?phone=51991907515', 1, TRUE, TRUE, 48);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'La Victoria', 'HM Bike Shop', '10761940843', 'Juan Martin Honor Montano', 'Jr. Luna Pizarro 129, La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Luna+Pizarro+129%2C+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 933 529 728', '51933529728', 'https://api.whatsapp.com/send?phone=51933529728', 2, TRUE, TRUE, 49);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'La Victoria', 'Bike Ride', '10422127661', 'John Ignacio Alcedo Quiquia', 'Jr. Huascarán 200, La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Huascar%C3%A1n+200%2C+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 987 396 470', '51987396470', 'https://api.whatsapp.com/send?phone=51987396470', 2, TRUE, TRUE, 50);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'La Victoria', 'Rolys Import', '20609490048', 'Elizabeth Marisol Sano Vallejos', 'Jr. Misti Nro. 166, Lima - La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Misti+Nro.+166%2C+Lima+-+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 956 913 784', '51956913784', 'https://api.whatsapp.com/send?phone=51956913784', 2, TRUE, TRUE, 51);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'La Victoria', 'Villegas', '10477371073', 'Isabel Mery Villegas Pari', 'Av. Almirante Miguel Grau 510, La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Almirante+Miguel+Grau+510%2C+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 906 252 707', '51906252707', 'https://api.whatsapp.com/send?phone=51906252707', 2, TRUE, TRUE, 52);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'La Victoria', 'Black Line', '20615993647', 'Angela Sara Pari Cueva', 'Av. Manco Cápac 182-186-190, La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Manco+C%C3%A1pac+182-186-190%2C+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 923 823 957', '51923823957', 'https://api.whatsapp.com/send?phone=51923823957', 2, TRUE, TRUE, 53);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'La Victoria', 'F14 Bike', '20612777200', 'Jorge Luis Mamani Gonzales', 'Jr. Misti Nro. 240 Int. 10, Lima - La Victoria', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Jr.+Misti+Nro.+240+Int.+10%2C+Lima+-+La+Victoria%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 934 360 322', '51934360322', 'https://api.whatsapp.com/send?phone=51934360322', 2, TRUE, TRUE, 54);
INSERT INTO greenline_distributors
(country, department, province, district, name, ruc, contact_name, address, latitude, longitude, coordinate_precision, maps_url, phone, whatsapp_number, whatsapp_url, priority, technical_service, active, sort_order)
VALUES ('Perú', 'Lima', 'Lima', 'La Victoria', 'Goldus Motor', '20566000866', 'Lucia Ayquipa', 'Av. Luna Pizarro Nro. 174 Int. 10, Lima', -12.065, -77.03, 'city', 'https://www.google.com/maps/search/?api=1&query=Av.+Luna+Pizarro+Nro.+174+Int.+10%2C+Lima%2C+La+Victoria%2C+Lima%2C+Lima%2C+Per%C3%BA', '+51 978 219 237', '51978219237', 'https://api.whatsapp.com/send?phone=51978219237', 2, TRUE, TRUE, 55);

-- VENTAS PROVINCIAS
INSERT INTO greenline_province_sales
(country, name, phone, whatsapp_number, whatsapp_url)
VALUES
('Perú', 'Ventas provincias', '(51)992 109 852', '51992109852',
 'https://api.whatsapp.com/send?phone=51992109852');

-- VISTA UNIFICADA PARA REACT
CREATE OR REPLACE VIEW greenline_locations_public AS
SELECT id, 'store'::TEXT AS location_type, country, department, province, district, name,
       address, latitude, longitude, NULL::TEXT AS coordinate_precision, schedule,
       phone, whatsapp_number, whatsapp_url, maps_url, NULL::SMALLINT AS priority,
       technical_service, active, sort_order
FROM greenline_stores
UNION ALL
SELECT id, 'distributor'::TEXT AS location_type, country, department, province, district, name,
       address, latitude, longitude, coordinate_precision, NULL::TEXT AS schedule,
       phone, whatsapp_number, whatsapp_url, maps_url, priority, technical_service,
       active, sort_order
FROM greenline_distributors;

COMMIT;
