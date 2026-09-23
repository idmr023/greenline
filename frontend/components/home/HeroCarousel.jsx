import { useState, useEffect, useCallback } from 'react';
import AnniversaryBanner from '../aniversario/AnniversaryBanner';
import ExpoChinaBanner from '../ExpoChinaBanner';
import TikTokSlide from '../TikTokSlide';
import { BBVACard } from '../ui/general/BBVACard';
import { carrousel_slides } from '../../../src/data_json';
import { AngleLeft, AngleRight } from '../../lib/icons';
import CountdownBanner from '../ui/aniversario/CountdownBanner';

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((i) => (i + 1) % carrousel_slides.length), []);
  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + carrousel_slides.length) % carrousel_slides.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="w-full">
      
    <CountdownBanner />

    {/* ── Hero Lifestyle : producto con margen intencional ── */}
    <div className="relative aspect-[16/9] overflow-hidden bg-gray-950">
      {/* Fondo de "margen verde" como sello visual de marca */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-emerald-100 to-emerald-50" />
      
      {/* Imagen con margen intencional - se respeta el "aire de marca" sin forzado de fill de imagen */}
      <div className="relative inset-0 w-full h-full">
        {carrousel_slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <a href={slide.to} className="block w-full h-full relative">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-contain"
                style={{ 
                  objectPosition: 'center',
                  // Mantiene el margen blanco como parte del diseño premium
                }}
              />
              {/* Overlay opaco para legibilidad - NO transparente sobre imagen */}
              <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            </a>
            
            {/* Contenido lifestyle con contraste garantizado */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 p-6 sm:p-8 lg:p-10 max-w-3xl text-center transform opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-sm font-medium text-white/90">
                <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l9 2-9-2-3 9 9-3z" />
                  <circle cx="3" cy="3" r="1" fill="currentColor" />
                  <path d="M17 9l3 3-3 3" />
                  <path d="M3 3l9 9" />
                </svg>
                {slide.title && slide.title.length > 10 ? 'Destacado' : ''}
              </div>
              
              {slide.title && (
                <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-bold text-white tracking-tighter leading-none">
                  {slide.title}
                </h2>
              )}
              
              {slide.subtitle && (
                <p className="mt-3 text-[clamp(1rem,2.5vw,1.5rem)] text-gray-100 leading-relaxed max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores circulares en bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {carrousel_slides.map((slide, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Ir al slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? 'bg-emerald-400' : 'bg-white/20 hover:bg-emerald-300'
            }`}
          />
        ))}
      </div>

      {/* Botones navegación lateral con vidrio sutil */}
      <button
        type="button"
        onClick={() =>
          setCurrent((current - 1 + carrousel_slides.length) % carrousel_slides.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all"
        aria-label="Slide anterior"
      >
        <AngleLeft className='w-6 h-6' />
      </button>

      <button
        type="button"
        onClick={() =>
          setCurrent((current + 1) % carrousel_slides.length)
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all"
        aria-label="Siguiente slide"
      >
        <AngleRight className='w-6 h-6' />
      </button>
    </div>
    </section>
  );
}