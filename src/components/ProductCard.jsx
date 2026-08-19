import { Zap } from 'lucide-react';
import ProductImage from './ProductImage';
import { formatPrice } from '../lib/utils';

const colorMap = {
  Blanco: 'bg-white border-gray-300',
  Negro: 'bg-gray-900',
  Gris: 'bg-gray-500',
  'Gris Oscuro': 'bg-gray-700',
  Rojo: 'bg-red-600',
  Verde: 'bg-brand',
  'Verde ligero': 'bg-green-400',
  'Verde Esmeralda': 'bg-emerald-600',
  'Verde Metálico': 'bg-emerald-700',
  Celeste: 'bg-sky-400',
  Azul: 'bg-blue-600',
  Beige: 'bg-amber-200',
  Crema: 'bg-orange-100',
  Rosado: 'bg-pink-400',
  Plateado: 'bg-gray-400',
  Marrón: 'bg-amber-800',
  Camaleón: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-500',
};

function ColorDot({ color }) {
  const cls = colorMap[color] || 'bg-gray-300';
  return (
    <span
      title={color}
      className={`inline-block w-4 h-4 rounded-full border border-gray-200 ${cls}`}
    />
  );
}

function AvailabilityBadge({ status }) {
  if (status === 'En stock') {
    return (
      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
        En stock
      </span>
    );
  }
  if (status === 'Pocas unidades') {
    return (
      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-800">
        Pocas unidades
      </span>
    );
  }
  return (
    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
      Fuera de stock
    </span>
  );
}

export default function ProductCard({ producto }) {
  const outOfStock = producto.disponibilidad === 'Fuera de stock';

  return (
    <article
      className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col ${
        outOfStock ? 'grayscale opacity-75' : ''
      }`}
    >
      <div className="relative aspect-[4/3]">
        <ProductImage
          nombre={producto.nombre}
          width={600}
          height={450}
          className="w-full h-full"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {producto.etiquetas.map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 text-xs font-bold rounded text-white ${
                tag === 'Hot' ? 'bg-red-500' : 'bg-bbva'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute top-3 right-3">
          <AvailabilityBadge status={producto.disponibilidad} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
          {producto.nombre}
        </h3>

        <div className="mb-3">
          <span className="text-gray-400 line-through text-sm mr-2">
            {formatPrice(producto.precio_original)}
          </span>
          <span className="text-brand font-bold text-lg">
            {formatPrice(producto.precio_actual)}
          </span>
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand" /> {producto.motor}
          </p>
          <p>Batería: {producto.bateria}</p>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-gray-500 mb-2">Colores disponibles</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {producto.colores.map((c) => (
              <ColorDot key={c} color={c} />
            ))}
          </div>
          <button
            type="button"
            disabled={outOfStock}
            className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
              outOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-brand text-white hover:bg-brand-dark'
            }`}
          >
            {outOfStock ? 'Agotado' : 'Ver detalles'}
          </button>
        </div>
      </div>
    </article>
  );
}
