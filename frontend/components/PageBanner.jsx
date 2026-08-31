export default function PageBanner({
  title,
  subtitle,
  image = "/assets/imagenes/banner_categoria_producto/encabezaado-web-fijo.jpg",
}) {
  return (
    <section className="relative w-full h-[200px] sm:h-[260px] overflow-hidden flex items-center">
      
      {/* Fondo */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
      />

      {/* Oscurecimiento */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Imagen completa */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Contenido */}
      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
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