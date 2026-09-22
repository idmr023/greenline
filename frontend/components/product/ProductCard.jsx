import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Battery, Route } from '../../lib/icons';
import ProductImage from './ProductImage';
import { formatPrice } from '../../lib/utils';
import { colorDotClassFor, colorDotStyle } from '../../lib/colores';
import { cleanWatts, cleanBateria } from '../../utils/stripHtml';

// COMENTADO (temporal — "últimas unidades" por números. Se reactiva cuando
// vuelva el stock numérico). Requiere re-importar AlertTriangle desde './lib/icons'.
// function AvailabilityBadge({ status, unidades }) {
//   if (unidades != null && unidades <= 3 && unidades > 0) {
//     return (
//       <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-800">
//         <AlertTriangle className="w-3 h-3" />
//         ¡Solo {unidades}!
//       </span>
//     );
//   }
//   if (status === 'Pocas unidades') {
//     return (
//       <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-800">
//         Pocas unidades
//       </span>
//     );
//   }
//   return null;
// }

export default function ProductCard({ producto, featured = false }) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(null);
  const outOfStock = producto.disponibilidad === 'Fuera de stock';

  const availableColors = useMemo(() => {
    if (!producto.imagenes?.length) return [];
    const seen = new Set();
    return producto.imagenes
      .filter((img) => img.color && !seen.has(img.color) && seen.add(img.color))
      .map((img) => img.color);
  }, [producto.imagenes]);

  const currentColor = selectedColor || availableColors[0] || null;

  const mainImg = useMemo(() => {
    if (!producto.imagenes?.length) return null;
    if (currentColor) {
      const match = producto.imagenes.find((img) => img.color === currentColor && img.src);
      if (match) return match.src;
    }
    return producto.imagenes[0]?.src || null;
  }, [producto.imagenes, currentColor]);

  const watts = cleanWatts(producto.motor);
  const autonomia = producto.ficha_tecnica?.autonomia_km;
  const bateria = cleanBateria(producto.bateria);
  const descuento =
    producto.precio_original && producto.precio_actual < producto.precio_original
      ? Math.round((1 - producto.precio_actual / producto.precio_original) * 100)
      : 0;

  return (
    <article
      onClick={() => producto.slug && navigate(`/producto/${producto.slug}`)}
      className={`bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${
        featured
          ? 'border-brand/40 ring-1 ring-brand/20 sm:col-span-2 lg:col-span-2'
          : 'border-gray-100'
      } cursor-pointer hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className={`relative w-full ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
        <ProductImage
          src={mainImg}
          nombre={producto.nombre}
          width={featured ? 1200 : 600}
          height={featured ? 525 : 450}
          className="block w-full h-full"
        />
        {descuento > 0 && (
          <div
            className="absolute top-2 right-2 z-10 -rotate-6 px-3 py-1.5 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white font-extrabold text-sm shadow-lg ring-2 ring-white animate-bounce"
          >
            -{descuento}%
          </div>
        )}
        {/* COMENTADO (temporal — badge de "últimas unidades"):
        <div className="absolute top-3 right-3">
          <AvailabilityBadge
            status={producto.disponibilidad}
            unidades={producto.unidades}
          />
        </div> */}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
          {producto.nombre}
        </h3>

        <div className="mb-3">
          {producto.precio_actual != null && (
            <>
              {producto.precio_original && producto.precio_actual < producto.precio_original && (
                <span className="text-gray-400 line-through text-sm mr-2">
                  {formatPrice(producto.precio_original)}
                </span>
              )}
              <span className="text-brand font-bold text-lg">
                {formatPrice(producto.precio_actual)}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {watts && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-brand text-white">
              <Zap className="w-3 h-3" /> {watts}
            </span>
          )}
          {autonomia && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-brand text-white">
              <Route className="w-3 h-3" /> {/km/i.test(String(autonomia)) ? autonomia : `${autonomia} km`}
            </span>
          )}
          {bateria && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-brand text-white">
              <Battery className="w-3 h-3" /> {bateria}
            </span>
          )}
        </div>

        {availableColors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {availableColors.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={(e) => { e.stopPropagation(); setSelectedColor(c); }}
                style={colorDotStyle(producto.colores_detalle, c)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  colorDotClassFor(c)
                } ${
                  currentColor === c
                    ? 'border-brand ring-2 ring-brand/30 scale-110'
                    : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                }`}
              />
            ))}
          </div>
        )}

        <div className="mt-auto">
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
