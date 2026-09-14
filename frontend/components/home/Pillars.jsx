import { pillars } from '../../../src/data_json';
import FeatureCard from '../ui/general/FeaturedCard';

export default function Pillars() {
  return (
    <section className="py-12 bg-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon, title, text }) => (
            <FeatureCard
              title={title}
              text={text}
              icon={icon}
              variant="light"
            />
          ))}
        </div>
      </div>
    </section>
  );
}