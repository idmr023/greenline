-- ============================================================================
-- Unificar variantes de nombre de color en `imagenes.color`
-- ----------------------------------------------------------------------------
-- Evita mostrar dos chips del mismo color (Blanca/Blanco, Negra/Negro,
-- Morada/Morado, Plata/Plateado, Verde Metalico/Verde Metálico).
-- Idempotente: puede ejecutarse varias veces sin efectos adicionales.
-- ============================================================================

UPDATE imagenes SET color = 'Blanco'         WHERE color = 'Blanca';
UPDATE imagenes SET color = 'Negro'          WHERE color = 'Negra';
UPDATE imagenes SET color = 'Morado'         WHERE color = 'Morada';
UPDATE imagenes SET color = 'Plateado'       WHERE color = 'Plata';
UPDATE imagenes SET color = 'Verde Metálico' WHERE color = 'Verde Metalico';

-- Limpia del catálogo los nombres que quedaron sin uso (y sin referencias).
DELETE FROM colores c
 WHERE c.nombre IN ('Blanca', 'Negra', 'Morada', 'Plata', 'Verde Metalico')
   AND NOT EXISTS (SELECT 1 FROM imagenes i WHERE i.color = c.nombre)
   AND NOT EXISTS (SELECT 1 FROM prod_color_rel r WHERE r.color_id = c.id)
   AND NOT EXISTS (SELECT 1 FROM prod_color_stock s WHERE s.color_id = c.id);
