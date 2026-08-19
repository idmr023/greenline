import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { getProductImage } from '../lib/utils';

const slides = [
  {
    title: 'Movilidad eléctrica para todos',
    subtitle: 'Descubre VMP, motos, trimotos y cargueros 100% eléctricos.',
    cta: 'Ver tienda',
    label: 'Hero 1',
  },
  {
    title: 'Ahorra con cada kilómetro',
    subtitle: 'Dile adiós a la gasolina. Calcula tu ahorro mensual con nuestro simulador.',
    cta: 'Simular ahorro',
    label: 'Hero 2',
  },
  {
    title: 'Tecnología verde peruana',
    subtitle: 'Calidad, confianza y garantía en cada modelo Green Line.',
    cta: 'Conócenos',
    label: 'Hero 3',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((i) => (i + 1) % slides.length), []);
  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="w-full">
      {/* BBVA banner */}
      <div className="bg-bbva text-white text-center py-2.5 px-4 text-sm sm:text-base font-semibold flex items-center justify-center gap-2">
        <CreditCard className="w-5 h-5" />
        <span>Paga 6 meses sin intereses</span>
      </div>

      {/* Carousel */}
      <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[500px] overflow-hidden bg-gray-900">
        {slides.map((slide, index) => {
          const { webp, fallback } = getProductImage(slide.label, 1200, 500);
          return (
            <div
              key={slide.label}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <picture className="block w-full h-full">
                <source type="image/webp" srcSet={webp} />
                <img
                  src={fallback}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-80"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl text-white">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-base sm:text-lg mb-6 text-gray-100">
                      {slide.subtitle}
                    </p>
                    <button
                      type="button"
                      className="px-6 py-3 bg-brand hover:bg-brand-light text-white font-semibold rounded-lg transition-colors"
                    >
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Controls */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === current ? 'bg-brand' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
