export function formatPrice(value) {
  return `S/ ${Number(value).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getProductImage(nombre, width = 600, height = 400) {
  const text = encodeURIComponent(nombre);
  return {
    webp: `https://placehold.co/${width}x${height}/009000/ffffff.webp?text=${text}`,
    fallback: `https://placehold.co/${width}x${height}/009000/ffffff.png?text=${text}`,
  };
}

export function estimateAutonomia(motorWatts) {
  const w = parseInt(motorWatts, 10);
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

export const CATEGORIAS = [
  'VMP',
  'Motos Eléctricas',
  'Trimotos Eléctricas',
  'Cargueros',
];

export const BATERIAS = ['Litio', 'Plomo Ácido', 'Plomo Grafeno'];

export function sortProducts(products, sortBy = 'price_asc') {
  const sorted = [...products];
  switch (sortBy) {
    case 'price_desc':
      return sorted.sort((a, b) => b.precio_actual - a.precio_actual);
    case 'name_asc':
      return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
    default:
      return sorted.sort((a, b) => a.precio_actual - b.precio_actual);
  }
}
