import FeatureCard from '../ui/general/FeaturedCard';
import { objeciones } from '../../../src/data_json';

export default function Objecciones() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5">
            ¿Por qué confiar en Green Line?
          </h2>
          <p className="text-gray-600">
            Resolvemos tus dudas antes de comprar es nuestra prioridad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {objeciones.map(({ icon, title, text, highlight }) => (
            <FeatureCard
              key={title}
              icon={icon}
              title={title}
              text={text}
              badgeText={highlight}
            />
          ))}
        </div>
      </div>
    </section>
  );
}