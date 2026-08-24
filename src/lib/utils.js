export function formatPrice(value) {
  if (value == null) return 'S/ --';
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

export const BANNERS = {
  default: {
    title: 'Tienda Green Line',
    subtitle: 'Encuentra tu vehículo eléctrico ideal.',
    image: '',
  },
  VMP: {
    title: 'Vehículos de Movilidad Personal',
    subtitle: 'Bicimotos, monopatines y más para tu día a día.',
    image: './assets/imagenes/banner_categoria_producto/vmp.jpg',
  },
  'Motos Eléctricas': {
    title: 'Motos Eléctricas',
    subtitle: 'Potencia, autonomía y cero emisiones.',
    image: './assets/imagenes/banner_categoria_producto/motos.jpg',
  },
  'Trimotos Eléctricas': {
    title: 'Trimotos Eléctricas',
    subtitle: 'Estabilidad y carga para tu trabajo diario.',
    image: './assets/imagenes/banner_categoria_producto/trimotos.jpg',
  },
  Cargueros: {
    title: 'Cargueros Eléctricos',
    subtitle: 'La solución de carga para tu negocio.',
    image: './assets/imagenes/banner_categoria_producto/cargueros.jpg',
  },
};

export function sortProducts(products, sortBy = 'price_asc') {
  const sorted = [...products];
  switch (sortBy) {
    case 'price_desc':
      return sorted.sort((a, b) => (b.precio_actual ?? 0) - (a.precio_actual ?? 0));
    case 'name_asc':
      return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
    default:
      return sorted.sort((a, b) => (a.precio_actual ?? Infinity) - (b.precio_actual ?? Infinity));
  }
}
