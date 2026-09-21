import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { SOCIAL_GRID_ITEMS } from "../../src/data_json";

export function SocialPost({ item, variant = 'full' }) {
  if (variant === 'thumbnail') {
    return (
      <div className="relative w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
        <img src={item.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute top-1 right-1 bg-brand text-white text-[9px] px-1 rounded font-bold">
          {item.network === 'TikTok' ? 'TK' : 'IG'}
        </div>
      </div>
    );
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute inset-0 w-full h-full flex flex-col bg-white cursor-pointer group/social"
    >
      <div className="flex items-center justify-center gap-2 shrink-0 bg-brand py-3 px-4 text-white">
        <FontAwesomeIcon icon={item.network === 'TikTok' ? faTiktok : faInstagram} className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest">
          {item.network} - Ver publicación original
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center bg-neutral-100 overflow-hidden relative">
        <img
          src={item.image}
          alt={item.caption}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/social:scale-105"
        />
      </div>
      <div className="flex items-center justify-center shrink-0 bg-brand py-3 px-4 text-white">
        <span className="text-xs font-semibold uppercase tracking-wide text-center">
          {item.caption} (Click para abrir en {item.network})
        </span>
      </div>
    </a>
  );
}

export function socialItemsForProduct(product) {
  if (!product) return [];
  const nombreNorm = (product.nombre || '').toLowerCase();
  const modeloNorm = (product.modelo || '').toLowerCase();
  const slugNorm = (product.slug || '').toLowerCase();

  return SOCIAL_GRID_ITEMS.filter((item) => {
    if (!item.modelo) return false;
    const m = item.modelo.toLowerCase();
    return (
      nombreNorm.includes(m) ||
      modeloNorm.includes(m) ||
      slugNorm.includes(m) ||
      m.includes(nombreNorm) ||
      m.includes(slugNorm)
    );
  });
}