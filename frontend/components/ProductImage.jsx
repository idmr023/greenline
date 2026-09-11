import { versionarImagen } from '../lib/imagenVersionada';

export default function ProductImage({
  src,
  nombre,
  width = 800,
  height = 600,
  className = '',
  imgClassName = '',
}) {

  return (
    <picture className={`block ${className}`}>
      <img
        src={versionarImagen(src)}
        alt={nombre}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-contain ${imgClassName}`}
      />
    </picture>
  );
}