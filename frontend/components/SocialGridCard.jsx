import { InstagramIcon, TiktokIcon } from './SocialIcons';

export default function SocialGridCard({ item }) {
  const Icon = item.network === 'TikTok' ? TiktokIcon : InstagramIcon;

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      aria-label={`Ver ${item.caption} en ${item.network}`}
    >
      {/* Barra verde superior: red social */}
      <div className="flex items-center justify-center gap-2 shrink-0 bg-brand p-5 text-white">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest">
          {item.network}
        </span>
      </div>

      {/* Imagen completa entre las dos barras */}
      <div className="flex min-h-[220px] flex-1 items-center justify-center overflow-hidden bg-neutral-100">
        <img
          src={item.image}
          alt={item.caption}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Barra verde inferior: qué muestra la imagen */}
      <div className="flex items-center justify-center gap-2 shrink-0 bg-brand p-5 text-white">
        <span className="text-xs font-semibold uppercase tracking-wide text-center leading-tight">
          {item.caption}
        </span>
      </div>
    </a>
  );
}
