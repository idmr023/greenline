import { Play } from 'lucide-react';
import { SOCIAL } from '../lib/config';
import { InstagramIcon, TiktokIcon } from './SocialIcons';
import { SOCIAL_MEDIA_GRID } from '../lib/images';

const VIDEOS = [
  {
    id: 'gl3_video',
    image: SOCIAL_MEDIA_GRID.gl3_video,
    network: 'Instagram',
    title: 'GL3 en acción',
    href: SOCIAL.instagram,
  },
  {
    id: 'h3_pro_video',
    image: SOCIAL_MEDIA_GRID.h3_pro_video,
    network: 'TikTok',
    title: 'H3 Pro',
    href: SOCIAL.tiktok,
  },
  {
    id: 'm_car_video',
    image: SOCIAL_MEDIA_GRID.m_car_video,
    network: 'Instagram',
    title: 'M-CAR',
    href: SOCIAL.instagram,
  },
  {
    id: 'y5_video_tiktok',
    image: SOCIAL_MEDIA_GRID.y5_video_tiktok,
    network: 'TikTok',
    title: 'Y5',
    href: SOCIAL.tiktok,
  },
  {
    id: 'h3_pro_titktok',
    image: SOCIAL_MEDIA_GRID.h3_pro_titktok,
    network: 'TikTok',
    title: 'H3 Pro TikTok',
    href: SOCIAL.tiktok,
  },
];

export default function VideoSection() {
  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-greenline text-white-legible ring-2 ring-yellow-electric rounded-full text-sm font-semibold mb-4">
            Véanos en acción
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Reseñas y demostraciones reales
          </h2>
          <p className="text-gray-600 mx-auto">
            Mira a clientes probando nuestras M-CAR en Instagram y TikTok. Sin filtros,
            el vehículo tal cual… y en movimiento.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {VIDEOS.map((v) => (
            <a
              key={v.id}
              href={v.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-2xl bg-gray-900 shadow-sm"
              aria-label={`Ver ${v.title} en ${v.network}`}
            >
              <img
                src={v.image}
                alt={v.title}
                loading="lazy"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition transform group-hover:scale-110">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </span>
              </span>
              <span className={`absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full text-white-legible shadow ${
                v.network === 'TikTok' ? 'bg-black-contrast/90' : 'bg-greenline'
              }`}>
                {v.network === 'TikTok' ? (
                  <TiktokIcon className="w-3 h-3" />
                ) : (
                  <InstagramIcon className="w-3 h-3" />
                )}
                {v.network}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
