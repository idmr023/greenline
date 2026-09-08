export const CARGA_REFERENCIAS = [
  { nombre: 'saco de papas', unidad: 'sacos de papas (50 kg c/u)', kg: 50 },
  { nombre: 'garrafón de agua', unidad: 'garrafones de agua (20 kg c/u)', kg: 20 },
  { nombre: 'persona adulta', unidad: 'personas adultas (≈70 kg c/u)', kg: 70 },
  { nombre: 'costal de abono', unidad: 'costales de abono (25 kg c/u)', kg: 25 },
];

export function capacidadCargaTexto(ficha) {
  const min = ficha?.carga_minima_kg;
  const max = ficha?.carga_maxima_kg;
  if (!max) return null;
  return min && min !== max ? `${min} a ${max}` : `${max}`;
}

export function equivalentesDeCarga(ficha, referencias = CARGA_REFERENCIAS) {
  const min = ficha?.carga_minima_kg;
  const max = ficha?.carga_maxima_kg;
  if (!max) return [];

  const calc = (kg, ref) => Math.max(1, Math.floor(kg / ref.kg));

  return referencias.map((ref) => {
    const desde = min ? calc(min, ref) : calc(max, ref);
    const hasta = calc(max, ref);
    return {
      ...ref,
      desde,
      hasta,
      texto: desde === hasta ? `≈ ${desde} ${ref.unidad}` : `≈ ${desde} a ${hasta} ${ref.unidad}`,
    };
  });
}