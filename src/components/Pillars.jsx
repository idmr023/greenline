import { BadgeCheck, ShieldCheck, Award } from 'lucide-react';

const pillars = [
  {
    icon: BadgeCheck,
    title: 'Calidad',
    text: 'Componentes certificados y ensamblaje bajo estándares exigentes.',
  },
  {
    icon: ShieldCheck,
    title: 'Confianza',
    text: 'Miles de peruanos ya eligieron Green Line para su movilidad diaria.',
  },
  {
    icon: Award,
    title: 'Garantía',
    text: 'Respaldamos cada modelo con soporte técnico y repuestos originales.',
  },
];

export default function Pillars() {
  return (
    <section className="py-12 bg-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
            >
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-brand/10 text-brand mb-4">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
