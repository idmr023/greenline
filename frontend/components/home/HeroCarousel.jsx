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

    <div className="relative aspect-1920/600 overflow-hidden bg-gradient-to-b from-[#064e3b] to-black">
      <div className="pointer-events-none absolute inset-0 z-10" />
        {carrousel_slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >

          {slide.expoBanner ? (
            <a href={slide.to} className="block w-full h-full">
              <ExpoChinaBanner />
            </a>
          ) : (
              <>
                <a href={slide.to} className="block w-full h-full">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-70"
                    style={{ filter: 'brightness(0.92) saturate(1.05) hue-rotate(-8deg)' }}
                  />
                </a>
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
              </>
            )}
          
        </div>
      ))}

    <button
      type="button"
      onClick={() =>
        setCurrent((current - 1 + carrousel_slides.length) % carrousel_slides.length)
      }
      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all"
      aria-label="Slide anterior"
    >
      <AngleLeft className='w-5 h-5 sm:w-6 sm:h-6' />
    </button>

    <button
      type="button"
      onClick={() =>
        setCurrent((current + 1) % carrousel_slides.length)
      }
      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all"
      aria-label="Siguiente slide"
    >
      <AngleRight className='w-5 h-5 sm:w-6 sm:h-6' />
    </button>

    {/* Indicadores */}
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
      {carrousel_slides.map((slide, index) => (
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