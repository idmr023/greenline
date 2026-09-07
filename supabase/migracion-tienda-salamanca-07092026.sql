-- ============================================================
-- Migración 2026-09-07: Nueva tienda Salamanca (greenline_stores)
-- Fuente: reunión 07/09/2026. WhatsApp 991 196 895 / wa.link/kb8ur1
-- Coordenadas provistas por el equipo: -12.07548387997236, -76.98728711532839
-- ============================================================

INSERT INTO greenline_stores
(country, department, province, district, name, address, latitude, longitude,
 schedule, phone, whatsapp_number, whatsapp_url, maps_url, technical_service,
 technical_phone, technical_whatsapp_number, technical_whatsapp_url, active, sort_order)
VALUES (
    'Perú',
    'Lima',
    'Lima',
    'Salamanca',
    'Salamanca',
    'Jr Inca Garcilazo de la Vega N°218, 1er piso, Salamanca de Monterrico',
    -12.07548387997236,
    -76.98728711532839,
    NULL,
    '(51)991 196 895',
    '51991196895',
    'https://wa.link/kb8ur1',
    'https://maps.app.goo.gl/SE1kDkKQZo3uiuHK7',
    FALSE,
    NULL,
    NULL,
    NULL,
    TRUE,
    7
);