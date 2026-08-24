import { Package, Wrench, CreditCard } from 'lucide-react';

const objeciones = [
  {
    icon: Package,
    title: 'Stock garantizado de repuestos',
    text: 'No te preocupes por repuestos. Tenemos inventario propio en almacén para cada modelo que vendemos.',
    highlight: 'Stock propio',
  },
  {
    icon: Wrench,
    title: 'Servicio técnico propio',
    text: 'Talleres propios en Lima, Arequipa y Trujillo con técnicos capacitados por la marca.',
    highlight: '3 sedes principales',
  },
  {
    icon: CreditCard,
    title: 'Tarjeta de circulación gratis',
    text: 'En la mayoría de nuestros modelos la tarjeta de circulación está incluida. Sin costos ocultos.',
    highlight: 'En modelos seleccionados',
  },
];

export default function Objecciones() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            ¿Por qué confiar en Green Line?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Resolver tus dudas antes de comprar es nuestra prioridad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {objeciones.map(({ icon: Icon, title, text, highlight }) => (
            <div
              key={title}
              className="group bg-gray-bg rounded-2xl p-6 text-center hover:bg-brand/5 hover:ring-1 hover:ring-brand/20 transition-all"
            >
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-2xl bg-brand/10 text-brand mb-5 group-hover:bg-brand group-hover:text-white transition-colors">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 mb-3">{text}</p>
              <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full">
                {highlight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
