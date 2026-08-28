import { HardHat, Wrench, Truck, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: HardHat,
    title: 'Casco incluido',
    text: 'En la compra de tu vehículo eléctrico Greenline.',
  },
  {
    icon: Wrench,
    title: 'Conduce sin preocupaciones',
    text: 'Tu seguridad es nuestra prioridad. Disfruta de 2 chequeos integrales cubiertos al 100% durante tus primeros 6 meses en ruta.',
  },
  {
    icon: Truck,
    title: 'Delivery a todo el Perú',
    text: 'Enviamos tu unidad a la puerta de tu casa.',
  },
  {
    icon: ShieldCheck,
    title: 'Garantía',
    text: 'Conduce con confianza. Cobertura específica para motor y batería, con plazos transparentes detallados en tu certificado oficial.',
  },
];

export default function Benefits() {
  return (
    <section className="py-14 bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
          Beneficios de comprar en Greenline
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white/10 backdrop-blur rounded-xl p-6 text-center"
            >
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white text-brand-dark mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-sm text-white/90">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
