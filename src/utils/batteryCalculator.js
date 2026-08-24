import batteryCosts from '../data/batteryCosts.json';

/**
 * Extrae voltaje y amperaje de un texto descriptivo de batería.
 * Ej: "batería de plomo ácido de 72V 20AH" → { voltaje: 72, amperaje: 20 }
 */
function parseBatterySpec(text) {
  if (!text || typeof text !== 'string') return null;

  const voltMatch = text.match(/(\d+)\s*[Vv]/);
  const ampMatch = text.match(/(\d+)\s*[Aa][Hh]/);

  if (!voltMatch || !ampMatch) return null;

  return {
    voltaje: parseInt(voltMatch[1], 10),
    amperaje: parseInt(ampMatch[1], 10),
  };
}

/**
 * Busca el modelo de batería más cercano en batteryCosts.json.
 * Si no encuentra el amperaje exacto, usa el más cercano hacia abajo.
 */
function findBatteryModel(voltaje, amperaje) {
  const candidates = batteryCosts.filter((b) => b.voltaje_v === voltaje);
  if (!candidates.length) return null;

  const exact = candidates.find((b) => b.amperaje_ah === amperaje);
  if (exact) return exact;

  const lower = candidates
    .filter((b) => b.amperaje_ah <= amperaje)
    .sort((a, b) => b.amperaje_ah - a.amperaje_ah);

  if (lower.length) return lower[0];

  return candidates.sort((a, b) => a.amperaje_ah - b.amperaje_ah)[0];
}

/**
 * Calcula el costo de carga para un texto de batería dado.
 *
 * @param {string} tipoBateriaText - Texto descriptivo (ej: "de 72V 22Ah grafeno")
 * @param {number} hours - Horas de carga (default: 8)
 * @returns {number|null} - Costo en soles o null si no se pudo calcular
 */
export function getChargingCost(tipoBateriaText, hours = 8) {
  try {
    const spec = parseBatterySpec(tipoBateriaText);
    if (!spec) return null;

    const model = findBatteryModel(spec.voltaje, spec.amperaje);
    if (!model) return null;

    const hourIndex = Math.min(Math.max(hours - 1, 0), model.costo_por_hora.length - 1);
    return model.costo_por_hora[hourIndex] ?? null;
  } catch {
    return null;
  }
}

/**
 * Costo de referencia de una carga completa, promediado entre todos los
 * modelos de batería de batteryCosts.json. Útil cuando no hay un producto
 * concreto (ej: calculadora genérica del Home).
 *
 * @param {number} hours - Horas de carga (default: 8)
 * @returns {number}
 */
export function costoRecargaPromedio(hours = 8) {
  const hourIndex = Math.min(Math.max(hours - 1, 0), 11);
  const costos = batteryCosts
    .map((b) => b.costo_por_hora[hourIndex])
    .filter((c) => typeof c === 'number' && c > 0);

  if (!costos.length) return 1.2;
  return costos.reduce((sum, c) => sum + c, 0) / costos.length;
}

/**
 * Costo de carga completa de un producto usando su especificación real de
 * batería. Prueba en orden: ficha_tecnica.potencia_bateria (ej: "72V/38AH",
 * el dato más confiable), luego ficha_tecnica.tipo_bateria y producto.bateria.
 * El modelo se busca en batteryCosts.json (exacto o el más cercano hacia abajo).
 *
 * @param {object} producto - Producto normalizado (con ficha_tecnica)
 * @param {number} hours - Horas de carga (default: 8)
 * @returns {number|null} - Costo en soles, o null si ninguna spec es parseable
 */
export function costoRecargaDeProducto(producto, hours = 8) {
  const candidatos = [
    producto?.ficha_tecnica?.potencia_bateria,
    producto?.ficha_tecnica?.tipo_bateria,
    producto?.bateria,
  ].filter((t) => typeof t === 'string' && t.trim());

  for (const texto of candidatos) {
    const costo = getChargingCost(texto, hours);
    if (costo != null) return costo;
  }
  return null;
}
