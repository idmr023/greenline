import { ShieldCheck, Wrench, BadgeCheck, Award } from '../lib/icons';

const SELLOS = [
  {
    icon: ShieldCheck,
    title: 'Garantía oficial',
    text: 'Todos nuestros vehículos cuentan con garantía respaldada por Green Line.',
  },
  {
    icon: Wrench,
    title: 'Servicio técnico certificado',
    text: 'Talleres autorizados en Lima y regiones.',
  },
  {
    icon: BadgeCheck,
    title: 'Distribuidores oficiales',
    text: 'Puntos de venta autorizados a nivel nacional.',
  },
  {
    icon: Award,
    title: 'Marca Nº 1 de Perú',
    text: 'Más de 9 años liderando la movilidad eléctrica.',
  },
];

export default function TrustSeals() {
  return (
    <section className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Compra con confianza</h2>
          <p className="text-gray-600 mt-2">
            Respaldos que acompañan a cada vehículo y a cada punto de venta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SELLOS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center bg-gray-bg rounded-2xl px-6 py-8"
            >
              <span className="w-14 h-14 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-4">
                <Icon className="w-7 h-7" />
              </span>
              <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}