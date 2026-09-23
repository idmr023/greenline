import { useEffect, useRef, useState } from 'react';
import { Leaf, Heart } from '../../lib/icons';
import { formatPrice } from '../../lib/utils';

// Reveal-on-scroll sin framer-motion (mismo patrón IntersectionObserver del proyecto)
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function RevealCard({ index = 0, children }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {children}
    </div>
  );
}

function idealParaItems(product) {
  const raw = product?.info_adicional?.ideal_para;
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string') return raw.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

export default function LifestyleSection({ products = [] }) {
  const lifestyleProducts = products.slice(0, 4);
  const { ref: headerRef, visible: headerVisible } = useReveal();

  if (!lifestyleProducts.length) return null;

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-4">
            <Leaf className="w-4 h-4" />
            Estilo de Vida Verde
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Productos diseñados para tu vida
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cada pieza encaja perfectamente en tu espacio, con el margen de
            diseño que solo GreenLine puede ofrecer. Simplicidad que habla por sí sola.
          </p>
        </div>

        {/* TODO: insertar vídeo aquí */}

        {/* Lifestyle grid — 4 en fila en desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lifestyleProducts.map((product, index) => (
            <RevealCard key={product.id || product.slug} index={index}>
              <article className="group relative h-full">
                <div className="relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 p-4 lg:p-5 h-full flex flex-col">
                  {/* White margin aesthetic - the intentional space */}
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-white border-2 border-dashed border-gray-200 flex items-center justify-center">
                    {product.imagenes?.[0]?.src ? (
                      <img
                        src={product.imagenes[0].src}
                        alt={product.nombre}
                        loading="lazy"
                        className="w-full h-full object-contain p-3"
                        style={{ objectPosition: 'center' }}
                      />
                    ) : (
                      <div className="text-gray-300 text-sm">Imagen del producto</div>
                    )}
                  </div>

                  {/* Lifestyle tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {idealParaItems(product).map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-full bg-emerald-50 text-emerald-700"
                      >
                        <Heart className="w-3 h-3" />
                        {item}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {product.nombre}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-3">
                    Diseñado para espacios que valoran la claridad y la simplicidad.
                    El margen es una declaración de estilo.
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-1">
                    <span className="text-brand font-bold text-lg">
                      {formatPrice(product.precio_actual)}
                    </span>
                    <a
                      href={`/producto/${product.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Ver estilo de vida
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  );
}
