import { useEffect, useState } from 'react';
import { Loader2, WifiOff } from 'lucide-react';
import { COLD_START_THRESHOLD_MS } from '../lib/api';

/**
 * Banner proactivo ante cold-start del backend en Render.
 *
 * Escucha el evento 'gl:coldstart' emitido por el cliente API cuando una
 * petición tarda más que COLD_START_THRESHOLD_MS (Render "dormido"). Mientras
 * el servidor despierta se muestra un banner + skeleton; se oculta al responder.
 */
export default function ColdStartBanner() {
  const [waking, setWaking] = useState(false);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    const onChange = (e) => {
      const detail = e.detail || {};
      setWaking(Boolean(detail.coldStart));
      if (detail.coldStart) setLatency(detail.latency || COLD_START_THRESHOLD_MS);
    };
    window.addEventListener('gl:coldstart', onChange);
    return () => window.removeEventListener('gl:coldstart', onChange);
  }, []);

  if (!waking) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 inset-x-0 z-[60] px-4"
    >
      <div className="mx-auto max-w-xl bg-brand-dark text-white rounded-xl shadow-lg shadow-brand-dark/20 px-5 py-4 flex items-start gap-3">
        <Loader2 className="w-5 h-5 animate-spin shrink-0 mt-0.5 text-brand-light" />
        <div className="flex-1">
          <p className="text-sm font-semibold">
            Despertando sistema, esto tomará unos segundos…
          </p>
          <div className="mt-2 space-y-1.5">
            <SkeletonBar width="100%" />
            <SkeletonBar width="75%" />
            <SkeletonBar width="50%" />
          </div>
          <p className="mt-2 text-[11px] text-white/60 flex items-center gap-1">
            <WifiOff className="w-3.5 h-3.5" />
            El servidor estaba inactivo y está reanudando ({latency}ms de espera).
          </p>
        </div>
      </div>
    </div>
  );
}

function SkeletonBar({ width }) {
  return (
    <div
      className="h-2.5 rounded-full bg-white/20 overflow-hidden relative"
      style={{ width }}
    >
      <div className="absolute inset-y-0 w-1/3 bg-white/30 rounded-full animate-pulse" />
    </div>
  );
}
