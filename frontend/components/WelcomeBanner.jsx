import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'greenline_welcome_closed';

export default function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Aviso de bienvenida"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      {/* Overlay con blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Caja centrada */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl p-8 text-center animate-scale-in"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar aviso"
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10">
          <Sparkles className="h-8 w-8 text-brand" />
        </span>

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          ¡Hola, GreenLover! 🌱
        </h2>

        <p className="mt-3 text-gray-600 leading-relaxed">
          Pensando en tu mejoría, nos estamos mudando a una nueva página web.
          Explora nuestra tienda renovada, descubre los últimos modelos de
          movilidad eléctrica y aprovecha las promociones de lanzamiento.
        </p>

        <p className="mt-3 text-gray-600 leading-relaxed">
          Cualquier consulta o feedback es bienvenido, nuestro equipo está listo
          para ayudarte a encontrar el vehículo perfecto para ti.
        </p>

        <a
          href="/tienda"
          onClick={handleClose}
          className="mt-8 inline-block w-full rounded-xl bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Explorar la tienda
        </a>

        <button
          type="button"
          onClick={handleClose}
          className="mt-3 w-full rounded-xl py-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          Tal vez más tarde
        </button>
      </div>
    </div>
  );
}
