import { useEffect, useRef } from 'react';
import {
  X,
  GraduationCap,
  Percent,
  RotateCcw,
  Store,
  Gift,
  CreditCard,
  ExternalLink,
} from 'lucide-react';

const UPN_INFO_URL =
  'https://www.upn.edu.pe/vida-universitaria/promociones-con-id-card/greenline';

const beneficios = [
  {
    icon: Percent,
    title: '10% de descuento',
    description:
      'En vehículos con precio menor a S/ 4,000. Los productos de S/ 4,000 en adelante no participan.',
  },
  {
    icon: RotateCcw,
    title: '2 usos por año',
    description:
      'Cada usuario puede aprovechar el beneficio hasta dos veces al año, sujeto a stock de tienda.',
  },
  {
    icon: Store,
    title: 'Tiendas participantes',
    description:
      'Surco, La Molina, San Miguel, Lince, Comas, Ate y Miraflores.',
  },
  {
    icon: Gift,
    title: 'Beneficios por referidos*',
    description: 'Disponibles únicamente en la tienda de La Molina.*',
  },
  {
    icon: CreditCard,
    title: '¿Cómo acceder?',
    description:
      'Presenta tu ID card virtual o credencial UPN más el código promocional en tienda.',
  },
];

export default function CommunityDrawer({ open, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col animate-slide-in"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Comunidad UPN</h3>
              <p className="text-xs text-gray-500">GreenLine x UPN</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div className="p-4 bg-gradient-to-br from-brand/5 to-brand/10 rounded-xl border border-brand/20">
            <p className="text-sm font-semibold text-brand-dark mb-1">
              Convenio vigente GreenLine × UPN
            </p>
            <p className="text-xs text-gray-600">
              Beneficio exclusivo para estudiantes, egresados y toda la comunidad
              de la Universidad Privada del Norte.
            </p>
          </div>

          {beneficios.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              </div>
            </div>
          ))}

          <p className="text-[11px] text-gray-400 leading-relaxed">
            * El beneficio por referidos es válido únicamente en la tienda de La
            Molina.
          </p>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Más Información en
            </p>
            <a
              href={UPN_INFO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors"
            >
              Promociones UPN – ID Card
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
