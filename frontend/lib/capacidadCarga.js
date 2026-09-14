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

export function estimateAutonomia(motorWatts) {
  const w = Number.parseInt(motorWatts, 10);
  if (Number.isNaN(w)) return 30;
  if (w <= 350) return 45;
  if (w <= 500) return 40;
  if (w <= 800) return 35;
  if (w <= 1000) return 30;
  if (w <= 1200) return 28;
  return 25;
}

export function consumoMensual(kmDiarios, autonomia) {
  if (!autonomia || autonomia <= 0 || kmDiarios === '' || kmDiarios == null) return 0;
  return (Number(kmDiarios) * 30 / autonomia) * 1.20;
}