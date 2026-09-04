import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, X } from 'lucide-react';
import {
  temaAniversarioActivo,
  toggleTemaAniversario,
  BALLOONS,
} from '../lib/aniversario';

export default function AnniversaryTheme() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Re-evalúa la activación (manual + fechas) al montar y ante toggles externos
    const sync = () => setActive(temaAniversarioActivo());
    sync();
    window.addEventListener('greenline:aniversario', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('greenline:aniversario', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!active) return null;

  const toggleOff = () => {
    toggleTemaAniversario();
    setActive(false);
  };

  return (
    <>
      {/* Capa de atmósfera aniversario */}
      <div className="gl-aniv-layer" aria-hidden="true">
        {/* Globos — solo verde y blanco */}
        {BALLOONS.map((b, i) => (
          <div
            key={i}
            className="gl-aniv-balloon"
            style={{
              left: b.left,
              color: b.color,
              background: `radial-gradient(circle at 30% 30%, #fff8, transparent 45%), ${b.color}`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          >
            <div
              className="gl-aniv-gift"
              style={{ background: b.color }}
              title={i % 3 === 2 ? 'Descuentos de aniversario' : undefined}
            >
              {i % 3 === 2 ? <Gift className="w-3 h-3 text-white" /> : null}
            </div>
          </div>
        ))}

        {/* N° 9 gigante de fondo, detrás del contenido (sombra) */}
        <span className="gl-aniv-num gl-aniv-num-bg">9</span>

        {/* Etiqueta: MES DE LOCURA — costado izquierdo abajo */}
        <span
          className="gl-aniv-tag"
          style={{ bottom: '12%', left: '4%' }}
        >
          MES DE LOCURA
        </span>
      </div>

      {/* Botón S/ (descuentos) arriba del botón de subir — discret y con acento amarillo eléctrico */}
      <Link
        to="/aniversario"
        className="gl-aniv-sol fixed bottom-36 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-electric text-black-contrast font-black text-xl shadow-xl ring-2 ring-yellow-electric hover:scale-110 transition-transform"
        aria-label="Ver ofertas de aniversario"
        title="Ofertas de aniversario"
      >
        S<span className="text-sm">/</span>
      </Link>

      {/* Toggle manual (cerrar el tema) */}
      <button
        type="button"
        onClick={toggleOff}
        className="gl-aniv-close fixed bottom-4 right-4 z-40 p-2 rounded-full bg-greenline/10 text-greenline shadow hover:bg-greenline/20 transition-colors"
        aria-label="Quitar tema de aniversario"
        title="Tema de aniversario activo — haz clic para quitarlo"
      >
        <X className="w-4 h-4" />
      </button>
    </>
  );
}
