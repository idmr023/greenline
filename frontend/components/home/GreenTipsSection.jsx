import { Instagram } from '../../lib/icons';
import { SOCIAL } from '../../lib/config';
import { green_tips } from '../../../src/data_json';
import FeatureCard from '../ui/general/FeaturedCard';

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
          <p className="text-gray-600 mx-auto">
            Pequeños hábitos que cuidan tu vehículo, tu bolsillo y el planeta.
            Compartimos tips de movilidad eléctrica todos los días.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {green_tips.map(({ icon, title, text }) => (
            <FeatureCard
              key={title}
              icon={icon}
              title={title}
              text={text}
            />
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
              href={SOCIAL.instagram_greentips}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 px-6 py-3 bg-white text-brand font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Instagram className="w-5 h-5" />
              @greenline_peru
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}