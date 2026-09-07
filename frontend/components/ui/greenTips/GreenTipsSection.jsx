import { Zap, Gauge, BatteryCharging, Recycle } from 'lucide-react';
import { InstagramIcon } from '../../SocialIcons';
import { SOCIAL } from '../../../lib/config';

const TIPS = [
  {
    icon: Zap,
    title: 'Carga de noche',
    text: 'Las tarifas eléctricas suelen ser más bajas de madrugada. Carga tu batería a esas horas y aligeras la red.',
  },
  {
    icon: Gauge,
    title: 'Presión de llantas',
    text: 'Revisa la presión una vez al mes: un neumático bien calibrado suma autonomía y alarga la vida de la cubierta.',
  },
  {
    icon: BatteryCharging,
    title: 'Cuida la batería',
    text: 'Evita descargarla al 0% o dejarla bajo el sol directo. Cargarla entre el 20% y el 80% alarga su vida útil.',
  },
  {
    icon: Recycle,
    title: 'Recicla y dispón',
    text: 'Lleva las baterías en desuso a un punto de acopio. GreenLine las gestiona de forma responsable.',
  },
];

export default function GreenTipsSection() {
  return (
    <section id="green-tips" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-brand text-white rounded-full text-sm font-semibold mb-4">
            GreenTips
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Consejos verdes para moverte mejor
          </h2>
          <p className="text-gray-600 mx-auto max-w-xl">
            Pequeños hábitos que cuidan tu vehículo, tu bolsillo y el planeta.
            Compartimos tips de movilidad eléctrica todos los días.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIPS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-[#F3F7F3] rounded-xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand/10 mb-4">
                <Icon className="w-6 h-6 text-brand" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-gradient-to-r from-brand to-green-700 text-white overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                ¿Quieres más tips como estos?
              </h3>
              <p className="text-white/80 text-sm sm:text-base">
                Síguenos en Instagram para recibir consejos de movilidad eléctrica,
                promociones y novedades.
              </p>
            </div>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 px-6 py-3 bg-white text-brand font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
              @greenline_peru
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}