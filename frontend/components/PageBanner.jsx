import { BANNER_DEFAULT } from '../lib/images';

export default function PageBanner({
  title,
  subtitle,
  image = BANNER_DEFAULT,
}) {
  return (
    <section className="relative w-full h-[200px] sm:h-[300px] overflow-hidden flex items-center bg-gradient-to-br from-brand to-brand-dark">
      
      {/* Fondo desenfocado */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-contain blur-md"
      />

      {/* Oscurecimiento */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Imagen principal */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Degradado para integrar la imagen */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-center text-center">
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-gray-100">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}