import { Newspaper } from "lucide-react";

type Props = {
  src?: string | null;
  alt?: string;
  className?: string;
};

/**
 * Imagen de una novedad. Si no hay imagen, renderiza un bloque
 * con gradiente e ícono en lugar de un <img> roto.
 */
export default function NovedadImagen({ src, alt = "", className = "" }: Props) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={`flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 ${className}`}
      >
        <Newspaper className="h-10 w-10 text-emerald-300" />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />;
}