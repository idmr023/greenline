import { useState, useEffect, useMemo } from 'react';
import { X } from '../../lib/icons';
import ProductImage from './ProductImage';
import ProductGallery from './ProductGallery';
import { BBVACard } from '../ui/general/BBVACard';
import { formatPrice } from '../../lib/utils';
import { colorDotClassFor } from '../../lib/colores';

export default function ProductModal({ producto, onClose }) {
  const [activeColor, setActiveColor] = useState(null);

  const hasRealImages = producto.imagenes?.length > 0;

  const availableColors = useMemo(() => {
    if (!hasRealImages) return [];
    const seen = new Set();
    return producto.imagenes
      .filter((img) => img.color && !seen.has(img.color) && seen.add(img.color))
      .map((img) => img.color);
  }, [producto.imagenes, hasRealImages]);

  const currentColor = activeColor || availableColors[0] || null;

  const displayedImages = useMemo(() => {
    if (!hasRealImages) return [];
    if (!currentColor) return producto.imagenes;
    return producto.imagenes.filter((img) => img.color === currentColor);
  }, [producto.imagenes, currentColor, hasRealImages]);

  useEffect(() => {
    setActiveColor(null);
  }, [producto.id]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-white/80 hover:bg-white shadow transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
            <div>
              {hasRealImages ? (
                <ProductGallery
                  images={displayedImages}
                  product={producto}
                  nombre={producto.nombre}
                />
              ) : (
                <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
                  <ProductImage
                    nombre={producto.nombre}
                    width={600}
                    height={450}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap gap-1.5 mb-3">
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

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {producto.nombre}
              </h2>

              <div className="mb-4">
                <span className="text-gray-400 line-through text-sm mr-2">
                  {formatPrice(producto.precio_original)}
                </span>
                <span className="text-brand font-bold text-2xl">
                  {formatPrice(producto.precio_actual)}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><span className="font-semibold">Motor:</span> {producto.motor}</p>
                <p><span className="font-semibold">Batería:</span> {producto.bateria}</p>
                <p><span className="font-semibold">Categoría:</span> {producto.categoria}</p>
              </div>

              {availableColors.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {availableColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setActiveColor(c)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        currentColor === c
                          ? 'border-brand bg-brand/5 text-brand font-semibold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full border border-gray-200 ${
                          colorDotClassFor(c)
                        }`}
                      />
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {/* COMENTADO (temporal — banner de "últimas unidades" por números):
              {producto.unidades > 0 && producto.unidades <= 5 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-sm font-semibold text-amber-800">
                    ¡Solo {producto.unidades} unidades disponibles!
                  </span>
                </div>
              )} */}

              <div className="mt-auto">
                <div className="mb-4">
                  <BBVACard />
                </div>
                <button
                  type="button"
                  disabled={producto.disponibilidad === 'Fuera de stock'}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    producto.disponibilidad === 'Fuera de stock'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-brand text-white hover:bg-brand-dark'
                  }`}
                >
                  {producto.disponibilidad === 'Fuera de stock'
                    ? 'Agotado'
                    : 'Agregar al carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
