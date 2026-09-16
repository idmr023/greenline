import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MapPinned,
  MessageCircle,
  Navigation,
  BadgeCheck,
} from '../../lib/icons';
import { fetchDistributors } from '../../lib/locations';
import { LinkButton } from '../ui/general/LinkButton.jsx';

const LIMITE = 8;

function DistributorMiniCard({ d }) {
  return (
    <div className="shrink-0 snap-start w-64 md:w-72 bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-start gap-2">
        <h4 className="font-bold text-gray-900 text-sm flex-1 min-w-0">{d.name}</h4>
        {d.priority === 1 && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-brand/10 text-brand border border-brand/20 whitespace-nowrap">
            <BadgeCheck className="w-3 h-3" /> Oficial
          </span>
        )}
      </div>
      <p className="flex items-start gap-1.5 text-xs text-gray-500 mt-2">
        <MapPin className="w-3.5 h-3.5 mt-0.5 text-brand shrink-0" />
        <span>{d.district}, {d.province}</span>
      </p>
      <div className="flex gap-2 mt-auto pt-3">
        {d.maps_url && (
          <a
            href={d.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 shrink-0" /> Maps
          </a>
        )}
        {d.whatsapp_url && (
          <a
            href={d.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-emerald-500 rounded-lg py-2 hover:bg-emerald-600 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

export default function OficialDistributors() {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

  useEffect(() => {
    let activo = true;
    fetchDistributors()
      .then((data) => {
        if (!activo) return;
        setDistributors(data);
        setLoading(false);
      })
      .catch(() => {
        if (activo) setLoading(false);
      });
    return () => { activo = false; };
  }, []);

  const destacados = useMemo(() => {
    const vistos = new Set();
    const res = [];
    for (const d of distributors) {
      if (d.country !== 'Perú') continue;
      const clave = d.name.trim().toLowerCase();
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      res.push(d);
      if (res.length >= LIMITE) break;
    }
    return res;
  }, [distributors]);

  if (loading || destacados.length === 0) return null;

  const desplazar = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const paso = el.children[0]?.offsetWidth + 16 || 288;
    el.scrollBy({ left: dir * paso, behavior: 'smooth' });
  };

  return (
    <section className="py-14 bg-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-white rounded-full text-sm font-semibold mb-3">
              <MapPinned className="w-4 h-4" /> Distribuidores oficiales
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Encuentra Green Line cerca de ti
            </h2>
            <p className="text-gray-600 mt-2">
              Puntos de venta autorizados a nivel nacional donde comprar, probar y recibir soporte.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => desplazar(-1)}
              aria-label="Anteriores"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 border border-gray-200 shadow-sm hover:text-brand transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => desplazar(1)}
              aria-label="Siguientes"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 border border-gray-200 shadow-sm hover:text-brand transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 snap-x snap-mandatory overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {destacados.map((d) => (
            <DistributorMiniCard key={d.id} d={d} />
          ))}
        </div>

        <LinkButton to="/tiendas" text="Ver todos" />
      </div>
    </section>
  );
}