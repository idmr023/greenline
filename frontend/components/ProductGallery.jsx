import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { extractVideoId, youtubeThumbUrl, videosForProduct } from '../lib/videosYT';

const LazyYouTube = lazy(() => import('./YouTubeEmbed'));

export default function ProductGallery({ images = [], product = {}, nombre = '' }) {
  // Recoger videos del producto
  const videoUrls = [];
  if (product?.videoId) {
    const pId = extractVideoId(product.videoId);
    if (pId) videoUrls.push(product.videoId);
  }
  for (const v of videosForProduct(product)) {
    const id = extractVideoId(v.url);
    if (id && !videoUrls.some((u) => extractVideoId(u) === id)) {
      videoUrls.push(v.url);
    }
  }

  // Combinar elementos de la galería: imágenes + videos
  // Cada item: { type: 'image', src, alt, index } o { type: 'video', url, videoId }
  const items = [
    ...images.map((img, i) => ({ type: 'image', src: img.src, alt: `${nombre} ${img.color || ''} ${i + 1}` })),
    ...videoUrls.map((url) => ({ type: 'video', url, videoId: extractVideoId(url) })),
  ];

  const total = items.length;
  const [activeIndex, setActiveIndex] = useState(0);

  // Estados para drag & swipe en la vista principal
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const next = useCallback(() => setActiveIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    setActiveIndex(0);
  }, [images.length, videoUrls.length]);

  useEffect(() => {
    if (total <= 1) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [total, next, prev]);

  if (total === 0) return null;

  const currentItem = items[activeIndex] || items[0];

  const THRESHOLD = 50;
  function handleStart(clientX, clientY) {
    if (currentItem.type !== 'image') return;
    startPos.current = { x: clientX, y: clientY };
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

  return (
    <div className="flex flex-col md:flex-row gap-4 select-none">
      {/* ── Miniaturas a la Izquierda (Vertical en Desktop, Horizontal en Mobile) ── */}
      {total > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[480px] shrink-0 pb-2 md:pb-0 scrollbar-thin">
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={item.type === 'image' ? `${item.src}-${i}` : `vid-${item.videoId}`}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative shrink-0 w-16 h-14 md:w-20 md:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  isActive ? 'border-brand ring-2 ring-brand/20 shadow-sm' : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                }`}
              >
                {item.type === 'image' ? (
                  <img src={item.src} alt="" className="w-full h-full object-contain bg-gray-50" />
                ) : (
                  <div className="relative w-full h-full bg-gray-900">
                    <img
                      src={youtubeThumbUrl(item.videoId, 'mqdefault')}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Vista Principal (Imagen o Video con Drag & Swipe) ── */}
      <div
        className={`relative flex-1 ${
          currentItem.type === 'video' ? 'aspect-video' : 'aspect-[4/3]'
        } rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group`}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX, e.clientY); }}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={() => { if (dragging) handleEnd(); }}
      >
        {currentItem.type === 'image' ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center p-2">
            <img
              src={currentItem.src}
              alt={currentItem.alt}
              className="max-w-full max-h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-black">
            <Suspense
              fallback={
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              }
            >
              <LazyYouTube videoId={currentItem.videoId} />
            </Suspense>
          </div>
        )}

        {/* Botones de navegación lateral en desktop */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicadores de puntos en mobile */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:hidden">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-brand w-4' : 'bg-black/30'
                }`}
                aria-label={`Ir a item ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
