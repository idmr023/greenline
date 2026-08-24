import { useEffect, useRef } from 'react';
import { X, GraduationCap, Users, Gift, ExternalLink } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TiktokIcon } from './SocialIcons';

const communityLinks = [
  {
    icon: GraduationCap,
    title: 'Descuento Estudiantil',
    description: '15% de descuento en vehículos eléctricos para estudiantes de universidades asociadas.',
  },
  {
    icon: Users,
    title: 'Club GreenLine UPN',
    description: 'Accede a eventos exclusivos, pruebas de manejo y promociones especiales.',
  },
  {
    icon: Gift,
    title: 'Beneficios por referidos',
    description: 'Invita a tus compañeros y gana S/ 200 por cada compra referida.',
  },
];

const socials = [
  { icon: FacebookIcon, label: 'Facebook', href: '#' },
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: YoutubeIcon, label: 'YouTube', href: '#' },
  { icon: TiktokIcon, label: 'TikTok', href: '#' },
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
              <p className="text-xs text-gray-500">GreenLine x Universidad</p>
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
              Universidad Privada del Norte
            </p>
            <p className="text-xs text-gray-600">
              Programa de fidelización exclusivo para la comunidad UPN. Accede a descuentos,
              beneficios y eventos especiales.
            </p>
          </div>

          {communityLinks.map(({ icon: Icon, title, description }) => (
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

          <a
            href="#"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors"
          >
            Registrarme ahora
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-3 text-center">
              Síguenos en redes
            </p>
            <div className="flex justify-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-brand hover:text-white flex items-center justify-center text-gray-600 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
