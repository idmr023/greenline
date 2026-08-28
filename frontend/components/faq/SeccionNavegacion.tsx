import { useEffect, useState } from 'react';
import { Zap, DollarSign, Wrench, Shield } from 'lucide-react';

const SECCIONES = [
  { id: 'motos-electricas', label: 'Motos Eléctricas', icon: Zap },
  { id: 'costos', label: 'Costos', icon: DollarSign },
  { id: 'mantenimiento', label: 'Mantenimiento', icon: Wrench },
  { id: 'garantia', label: 'Garantía y Soporte', icon: Shield },
];

export default function SeccionNavegacion() {
  const [active, setActive] = useState(SECCIONES[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 },
    );

    SECCIONES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-16 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {SECCIONES.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                active === id
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
