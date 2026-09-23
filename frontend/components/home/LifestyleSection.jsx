import { motion } from 'framer-motion';
import { Leaf, Heart } from '../../lib/icons';

export default function LifestyleSection({ products = [] }) {
  const lifestyleProducts = products.slice(0, 4);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
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
        </motion.div>

        {/* Lifestyle grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {lifestyleProducts.map((product, index) => (
            <motion.div
              key={product.id || product.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 p-8 lg:p-12">
                {/* White margin aesthetic - the intentional space */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-white border-2 border-dashed border-gray-200 flex items-center justify-center">
                  {product.imagenes?.[0]?.src ? (
                    <img
                      src={product.imagenes[0].src}
                      alt={product.nombre}
                      className="w-full h-full object-contain p-6"
                      style={{ objectPosition: 'center' }}
                    />
                  ) : (
                    <div className="text-gray-300 text-sm">Imagen del producto</div>
                  )}
                </div>

                {/* Lifestyle tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.info_adicional?.ideal_para?.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700"
                    >
                      <Heart className="w-3 h-3" />
                      {item}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {product.nombre}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Diseñado para espacios que valoran la claridad y la simplicidad.
                  El margen es una declaración de estilo.
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-brand font-bold text-xl">
                    {product.precio_actual && typeof product.precio_actual === 'number'
                      ? `S/ ${product.precio_actual.toLocaleString()}`
                      : product.precio_actual}
                  </span>
                  <a
                    href={`/producto/${product.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Ver estilo de vida
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}