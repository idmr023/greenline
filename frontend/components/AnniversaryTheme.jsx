import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  temaAniversarioActivo,
  toggleTemaAniversario,
  SERPENTINAS,
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
        {/* {SERPENTINAS.map((s, i) => (
          <div
            key={i}
            className="gl-aniv-serpentina"
            style={{
              left: s.left,
              color: s.color,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))} */}

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
    </>
  );
}