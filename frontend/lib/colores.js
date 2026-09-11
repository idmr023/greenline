const COLOR_DOT_CLASS = {
  Blanco: 'bg-white border-gray-300',
  Negro: 'bg-gray-900',
  Gris: 'bg-gray-500',
  'Gris Oscuro': 'bg-gray-700',
  Rojo: 'bg-red-600',
  'Verde (y sus variantes)': 'bg-green-400',
  Celeste: 'bg-sky-400',
  Azul: 'bg-blue-600',
  Crema: 'bg-orange-100',
  Rosado: 'bg-pink-400',
  Plateado: 'bg-gray-400',
  Plata: 'bg-gray-400',
  Marrón: 'bg-amber-800',
  Morado: 'bg-purple-600',
  Naranja: 'bg-orange-500',
  Camaleón: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-500',
};

export const DEFAULT_COLOR_DOT = 'bg-gray-300';

export function colorDotClassFor(nombre) {
  return COLOR_DOT_CLASS[nombre] || DEFAULT_COLOR_DOT;
}

export default COLOR_DOT_CLASS;
