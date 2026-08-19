import { getProductImage } from '../lib/utils';

export default function ProductImage({
  nombre,
  width = 600,
  height = 400,
  className = '',
  imgClassName = '',
}) {
  const { webp, fallback } = getProductImage(nombre, width, height);
  return (
    <picture className={`block ${className}`}>
      <source type="image/webp" srcSet={webp} />
      <img
        src={fallback}
        alt={nombre}
        loading="lazy"
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </picture>
  );
}
