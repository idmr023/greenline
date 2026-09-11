import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronsLeft,
  ChevronsRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ImageOff,
} from 'lucide-react';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DOUBLE_CLICK_ZOOM = 3.5;
const BATCH_SIZE = 24;
const HARD_CAP = 96;

const COLORS_360 = [
  { name: 'Original', dotClass: 'bg-gradient-to-br from-green-400 to-emerald-600', filter: '' },
  { name: 'Azul', dotClass: 'bg-blue-600', filter: 'hue-rotate(130deg) saturate(1.25)' },
  { name: 'Rojo', dotClass: 'bg-red-600', filter: 'hue-rotate(-120deg) saturate(1.35)' },
  { name: 'Naranja', dotClass: 'bg-orange-500', filter: 'hue-rotate(-75deg) saturate(1.3)' },
  { name: 'Morado', dotClass: 'bg-purple-600', filter: 'hue-rotate(150deg) saturate(1.15)' },
  { name: 'Negro', dotClass: 'bg-gray-900', filter: 'grayscale(0.7) brightness(0.45)' },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function Visor360({
  folderPath = '/assets/imagenes/360-base',
  filePrefix = 'moto-360-',
  fileExtension = '.webp',
  colorFilterClass = '',
  colors = COLORS_360,
  showColors = true,
  sensitivity = 15,
  className = 'my-8',
}) {
  const [frameCount, setFrameCount] = useState(-1);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeColor, setActiveColor] = useState(0);
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 });
  const [smooth, setSmooth] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const containerRef = useRef(null);
  const viewRef = useRef({ zoom: 1, x: 0, y: 0 });
  const frameCountRef = useRef(0);
  const pointersRef = useRef(new Map());
  const gestureRef = useRef({
    mode: 'none',
    lastX: 0,
    lastY: 0,
    accum: 0,
    startDist: 1,
    startZoom: 1,
    startMid: { x: 0, y: 0 },
  });
  const wheelTimerRef = useRef(null);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    let cancelled = false;
    const srcOf = (index) =>
      `${folderPath}/${filePrefix}${String(index).padStart(3, '0')}${fileExtension}`;

    const commit = (count) => {
      frameCountRef.current = count;
      setFrameCount(count);
      setCurrentFrame((prev) => clamp(prev, 1, Math.max(count, 1)));
    };

    const probeBatch = (start) => {
      if (cancelled) return;
      const end = Math.min(start + BATCH_SIZE - 1, HARD_CAP);
      let settled = 0;
      let firstFail = end + 1;

      const settle = () => {
        settled += 1;
        if (cancelled || settled < end - start + 1) return;
        if (firstFail > end && end < HARD_CAP) {
          probeBatch(end + 1);
        } else {
          commit(firstFail - 1);
        }
      };

      for (let i = start; i <= end; i += 1) {
        const img = new Image();
        img.onload = settle;
        img.onerror = () => {
          if (i < firstFail) firstFail = i;
          settle();
        };
        img.src = srcOf(i);
      }
    };

    probeBatch(1);
    return () => {
      cancelled = true;
    };
  }, [folderPath, filePrefix, fileExtension]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;
      setSmooth(false);
      setView((v) => {
        const nz = clamp(v.zoom * Math.exp(-e.deltaY * 0.0016), MIN_ZOOM, MAX_ZOOM);
        const k = nz / v.zoom;
        const x = cx - k * (cx - v.x);
        const y = cy - k * (cy - v.y);
        const maxX = (el.clientWidth * (nz - 1)) / 2;
        const maxY = (el.clientHeight * (nz - 1)) / 2;
        return {
          zoom: nz,
          x: clamp(x, -maxX, maxX),
          y: clamp(y, -maxY, maxY),
        };
      });
      clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => setSmooth(true), 160);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimerRef.current);
    };
  }, []);

  const rotate = useCallback((delta) => {
    setCurrentFrame((prev) => {
      const count = frameCountRef.current;
      if (count < 1) return prev;
      return ((((prev - 1 + delta) % count) + count) % count) + 1;
    });
  }, []);

  const clampPan = useCallback((x, y, zoom) => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const maxX = (el.clientWidth * (zoom - 1)) / 2;
    const maxY = (el.clientHeight * (zoom - 1)) / 2;
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  }, []);

  const applyZoom = useCallback(
    (targetZoom, cx = 0, cy = 0) => {
      setSmooth(true);
      setView((v) => {
        const nz = clamp(targetZoom, MIN_ZOOM, MAX_ZOOM);
        if (Math.abs(nz - v.zoom) < 0.001) return v;
        const k = nz / v.zoom;
        const x = cx - k * (cx - v.x);
        const y = cy - k * (cy - v.y);
        const c = clampPan(x, y, nz);
        return { zoom: nz, x: c.x, y: c.y };
      });
    },
    [clampPan],
  );

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const container = containerRef.current;
    if (container && container.setPointerCapture) {
      try {
        container.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gestureRef.current;
    setSmooth(false);

    if (pointersRef.current.size >= 2) {
      const pts = [...pointersRef.current.values()];
      const p1 = pts[0];
      const p2 = pts[1];
      g.mode = 'pinch';
      g.startDist = Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1;
      g.startZoom = viewRef.current.zoom;
      g.startMid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    } else {
      g.mode = viewRef.current.zoom > 1.01 ? 'pan' : 'rotate';
      g.lastX = e.clientX;
      g.lastY = e.clientY;
      g.accum = 0;
      if (g.mode === 'rotate') setHasInteracted(true);
    }
  };

  const handlePointerMove = (e) => {
    const g = gestureRef.current;
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (g.mode === 'pinch') {
      const pts = [...pointersRef.current.values()];
      if (pts.length < 2) return;
      const p1 = pts[0];
      const p2 = pts[1];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1;
      const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      setView((v) => {
        const nz = clamp(g.startZoom * (dist / g.startDist), MIN_ZOOM, MAX_ZOOM);
        const k = nz / v.zoom;
        const x = k * v.x + (mid.x - g.startMid.x);
        const y = k * v.y + (mid.y - g.startMid.y);
        const c = clampPan(x, y, nz);
        return { zoom: nz, x: c.x, y: c.y };
      });
      return;
    }

    if (g.mode === 'rotate') {
      g.accum += e.clientX - g.lastX;
      g.lastX = e.clientX;
      const frames = Math.trunc(g.accum / sensitivity);
      if (frames !== 0) {
        g.accum -= frames * sensitivity;
        rotate(frames);
      }
      return;
    }

    if (g.mode === 'pan') {
      const dx = e.clientX - g.lastX;
      const dy = e.clientY - g.lastY;
      g.lastX = e.clientX;
      g.lastY = e.clientY;
      setView((v) => {
        const c = clampPan(v.x + dx, v.y + dy, v.zoom);
        return { ...v, x: c.x, y: c.y };
      });
    }
  };

  const handlePointerUp = (e) => {
    pointersRef.current.delete(e.pointerId);
    const g = gestureRef.current;

    if (pointersRef.current.size === 0) {
      g.mode = 'none';
      setSmooth(true);
    } else if (pointersRef.current.size === 1 && g.mode === 'pinch') {
      const [p] = [...pointersRef.current.values()];
      g.mode = viewRef.current.zoom > 1.01 ? 'pan' : 'rotate';
      g.lastX = p.x;
      g.lastY = p.y;
      g.accum = 0;
    }
  };

  const handleDoubleClick = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (viewRef.current.zoom > 1.01) {
      applyZoom(MIN_ZOOM);
    } else {
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;
      applyZoom(DOUBLE_CLICK_ZOOM, cx, cy);
    }
  };

  const resetZoom = () => {
    setSmooth(true);
    setView({ zoom: 1, x: 0, y: 0 });
  };

  const stepBy = (delta) => {
    setHasInteracted(true);
    rotate(delta);
  };

  const activeFilter = colors[activeColor]?.filter || '';

  return (
    <div
      className={`w-full max-w-4xl mx-auto flex flex-col items-center gap-3 select-none ${className}`}
    >
      <div
        ref={containerRef}
        aria-label="Vista 360 grados del producto, arrastra para girar"
        className={`relative w-full aspect-video bg-gray-50 rounded-xl overflow-hidden shadow-inner ${
          view.zoom > 1 ? 'cursor-move' : 'cursor-grab'
        } active:cursor-grabbing`}
        style={{ touchAction: view.zoom > 1 ? 'none' : 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      >
        {frameCount === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageOff className="w-10 h-10" />
            <p className="text-sm font-medium">Vista 360 no disponible por ahora</p>
          </div>
        ) : (
          <img
            src={`${folderPath}/${filePrefix}${String(currentFrame).padStart(3, '0')}${fileExtension}`}
            alt={`Vista 360 - Ángulo ${currentFrame}`}
            draggable="false"
            decoding="async"
            className={`w-full h-full object-contain pointer-events-none ${colorFilterClass}`}
            style={{
              transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.zoom})`,
              filter: activeFilter || undefined,
              transition: smooth
                ? 'transform 200ms ease-out, filter 300ms ease'
                : 'filter 300ms ease',
              willChange: 'transform',
            }}
            onError={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
            onLoad={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          />
        )}

        {frameCount > 1 && (
          <>
            <button
              type="button"
              aria-label="Girar a la izquierda"
              onClick={() => stepBy(-1)}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/75 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 animate-pulse"
            >
              <ChevronsLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <button
              type="button"
              aria-label="Girar a la derecha"
              onClick={() => stepBy(1)}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/75 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 animate-pulse"
            >
              <ChevronsRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </>
        )}

        <div className="absolute top-3 right-3 z-20 flex items-center gap-1">
          <button
            type="button"
            aria-label="Alejar"
            onClick={() => applyZoom(viewRef.current.zoom / 1.4)}
            disabled={view.zoom <= MIN_ZOOM + 0.01}
            className="p-1.5 rounded-full bg-white/75 hover:bg-white text-gray-700 shadow backdrop-blur-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {view.zoom > 1.01 && (
            <>
              <span className="text-[11px] font-bold text-gray-700 bg-white/75 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow">
                {Math.round(view.zoom * 100)}%
              </span>
              <button
                type="button"
                aria-label="Restablecer zoom"
                onClick={resetZoom}
                className="p-1.5 rounded-full bg-white/75 hover:bg-white text-gray-700 shadow backdrop-blur-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            type="button"
            aria-label="Acercar"
            onClick={() => applyZoom(viewRef.current.zoom * 1.4)}
            disabled={view.zoom >= MAX_ZOOM - 0.01}
            className="p-1.5 rounded-full bg-white/75 hover:bg-white text-gray-700 shadow backdrop-blur-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {!hasInteracted && frameCount > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-sm pointer-events-none flex items-center gap-2">
            <svg
              className="w-4 h-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Arrastra para girar
          </div>
        )}
      </div>

      {showColors && colors.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {colors.map((color, i) => (
            <button
              type="button"
              key={color.name}
              onClick={() => setActiveColor(i)}
              aria-pressed={activeColor === i}
              className={`flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full border text-xs font-semibold transition-colors ${
                activeColor === i
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border border-gray-300 ${color.dotClass}`} />
              {color.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
