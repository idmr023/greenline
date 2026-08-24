import { useState, useEffect, useCallback, useRef, lazy, Suspense, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import ProductImage from './ProductImage';
import { BBVACard } from './BBVACard';
import { formatPrice } from '../lib/utils';

const LazyYouTube = lazy(() => import('./YouTubeEmbed'));

const colorDotClass = {
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
  Crema: 'bg-orange-100',
  Plata: 'bg-gray-400',
  Morado: 'bg-purple-600',
  Naranja: 'bg-orange-500',
  Plateado: 'bg-gray-400',
  Camaleón: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-500',
};

function ImageCarousel({ images, nombre, onClose }) {
  const [idx, setIdx] = useState(0);
  const total = images.length;
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0, time: 0 });

  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, next, prev]);

  if (!total) return null;

  const THRESHOLD = 50;

  function handleStart(clientX, clientY) {
    startPos.current = { x: clientX, y: clientY, time: Date.now() };
    setDragging(true);
  }

  function handleMove(clientX, clientY) {
    if (!dragging) return;
    const dx = clientX - startPos.current.x;
    const dy = clientY - startPos.current.y;
    if (Math.abs(dy) > Math.abs(dx)) return;
    setDragX(dx);
  }

  function handleEnd() {
    if (!dragging) return;
    setDragging(false);
    if (dragX > THRESHOLD) prev();
    else if (dragX < -THRESHOLD) next();
    setDragX(0);
  }

  const transition = dragging ? 'none' : 'transform 0.3s ease';

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative w-full aspect-[4/3] md:aspect-video rounded-xl group select-none"
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX, e.clientY); }}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={() => { if (dragging) handleEnd(); }}
      >
        {images.map((img, i) => {
          let translate = 0;
          if (i === idx) translate = dragX;
          else if (i === idx + 1 && dragX < 0) translate = dragX + 100;
          else if (i === idx - 1 && dragX > 0) translate = dragX - 100;

          return (
            <picture
              key={`${img.src}-${i}`}
              className={`absolute inset-0 block w-full h-full ${
                i === idx || (dragX < 0 && i === idx + 1) || (dragX > 0 && i === idx - 1)
                  ? 'opacity-100 z-10'
                  : 'opacity-0 z-0'
              }`}
              style={{
                transform: `translateX(${translate}%)`,
                transition,
              }}
            >
              <img
                src={img.src}
                alt={`${nombre} ${img.color || ''} ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </picture>
          );
        })}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/80 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/80 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {images.map((_, i) => (
            total > 1 && (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === idx ? 'bg-brand' : 'bg-white/60'
                  }`}
                />
              )
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                i === idx ? 'border-brand' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img src={img.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductModal({ producto, onClose }) {
  const [showVideo, setShowVideo] = useState(false);
  const [activeColor, setActiveColor] = useState(null);

  const hasRealImages = producto.imagenes?.length > 0;
  const hasVideo = !!producto.videoId;

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
    setShowVideo(false);
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
                <>
                  <ImageCarousel
                    images={displayedImages}
                    nombre={producto.nombre}
                    onClose={onClose}
                  />
                </>
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

              {hasVideo && (
                <div className="mt-4">
                  {!showVideo ? (
                    <button
                      type="button"
                      onClick={() => setShowVideo(true)}
                      className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center gap-3 text-white hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-0.5" fill="white" />
                      </div>
                      <span className="font-semibold">Ver video del producto</span>
                    </button>
                  ) : (
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <Suspense
                        fallback={
                          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        }
                      >
                        <LazyYouTube videoId={producto.videoId} />
                      </Suspense>
                    </div>
                  )}
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
                          colorDotClass[c] || 'bg-gray-300'
                        }`}
                      />
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {producto.unidades > 0 && producto.unidades <= 5 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-sm font-semibold text-amber-800">
                    ¡Solo {producto.unidades} unidades disponibles!
                  </span>
                </div>
              )}

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
