import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { CARRUSEL } from '../lib/images';
import AnniversaryBanner from './AnniversaryBanner';

const slides = [
  {
    // title: 'Dile adiós al tráfico',
    // subtitle: 'Ahorra tiempo y dinero con nuestros vehículos eléctricos.',
    // cta: 'Simular ahorro',
    to: '/tienda',
    img: CARRUSEL[1].img,
  },
  {
    title: 'Nueve años contigo',
    subtitle: 'Mes de locura: celebramos nuestro aniversario con descuentos y promociones por nuestro 9no aniversario.',
    cta: 'Acerca de los descuentos',
    to: '/aniversario',
    img: CARRUSEL[2].img,
  },
  {
    title: 'Siempre hay una Greenline cerca de ti',
    subtitle: 'Visita nuestras tiendas en Perú y Chile, o encuentra un distribuidor.',
    cta: 'Ver tiendas',
    to: '/tiendas',
    img: CARRUSEL[3].img,
  },
  {
    title: 'Nueve años contigo',
    subtitle: 'Mes de locura: celebramos nuestro aniversario con descuentos y promociones por nuestro 9no aniversario.',
    cta: 'Acerca de los descuentos',
    to: '/aniversario',
    reactBanner: true,
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
      <div className="relative overflow-hidden bg-gradient-to-r from-[#072146] via-[#14549c] to-[#072146] text-white text-center py-3 px-4 shadow-md flex items-center justify-center gap-3 sm:gap-4 border-b border-[#072146]">
      
      {/* Ícono con una animación sutil para captar el ojo */}
      <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300 animate-pulse drop-shadow-md" />
      
      {/* Texto con jerarquía visual */}
        <span className="text-sm sm:text-base font-medium tracking-wide">
          Paga en{' '}
          <strong className="font-extrabold text-blue-950 text-base sm:text-lg drop-shadow-md uppercase tracking-wider mx-1">
            6 meses sin intereses
          </strong>{' '}
          con tarjetas BBVA
        </span>
        
        {/* Brillo decorativo de fondo (opcional, le da un toque premium) */}
        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Carousel */}
      <div className="relative aspect-[1920/800] overflow-hidden from-black to-black/70 bg-gradient-to-b">
        {slides.map((slide, index) => (
          /* 1. UN SOLO PADRE: Aquí va el KEY y la animación de transición de la diapositiva */
          <div
            key={index} // El key siempre en el elemento superior del map
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            
            <a href={slide.to} className="block w-full h-full">
              {slide.reactBanner ? (
                <AnniversaryBanner />
              ) : (
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-80"
                />
              )}
            </a>

            /* 3. LOS TEXTOS (Superpuestos) */
            /* Nota: pointer-events-none permite que el clic "atraviese" el texto y funcione el enlace de atrás */
            /* En el slide del banner de aniversario (reactBanner) el texto ya
               vive dentro del propio banner; se omite el superpuesto para no
               duplicarlo ni saturarlo. */
            {!slide.reactBanner && (
              <div className="absolute inset-0 flex items-center pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  {/* Restauramos los eventos de clic solo para el texto por si hay botones */}
                  <div className="max-w-xl text-white pointer-events-auto">
                    
                    <h2 className="text-[clamp(1.5rem,3.5vw,3rem)] font-bold mb-[clamp(0.75rem,1.5vw,1rem)] leading-tight">
                      {slide.title}
                    </h2>

                    <p className="text-[clamp(0.875rem,1.5vw,1.125rem)] mb-[clamp(1rem,2vw,1.5rem)] text-gray-100">
                      {slide.subtitle}
                    </p>

                  </div>
                </div>
              </div>
            )}
            
          </div>
        ))}

  {/* Flecha anterior */}
    <button
      type="button"
      onClick={() =>
        setCurrent((current - 1 + slides.length) % slides.length)
      }
      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all"
      aria-label="Slide anterior"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 sm:w-6 sm:h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
    </button>

    {/* Flecha siguiente */}
    <button
      type="button"
      onClick={() =>
        setCurrent((current + 1) % slides.length)
      }
      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all"
      aria-label="Siguiente slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 sm:w-6 sm:h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>

    {/* Indicadores */}
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
      {slides.map((slide, index) => (
        <button
          key={slide.title}
          type="button"
          onClick={() => setCurrent(index)}
          aria-label={`Ir al slide ${index + 1}`}
          className={`h-2 rounded-full transition-all ${
            index === current
              ? 'w-8 bg-white'
              : 'w-2 bg-white/50 hover:bg-white/80'
          }`}
        />
      ))}
    </div>
  </div>
    </section>
  );
}
