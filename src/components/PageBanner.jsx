export default function PageBanner({ title, subtitle, image }) {
  return (
    <section className="relative w-full h-[200px] sm:h-[260px] overflow-hidden bg-(--color-brand) justify-center items-center flex">
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-xl text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-gray-100">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}