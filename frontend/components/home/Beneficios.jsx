import { benefits } from "../../../src/data_json";
import FeatureCard from "../ui/general/FeaturedCard";

export function Beneficios() {
    <section className="py-14 bg-brand-dark text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
        Beneficios de comprar en Greenline
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map(({ icon, title, text }) => (
            <FeatureCard
            key={title}
            title={title}
            text={text}
            icon={icon}
            variant="dark"
            />
        ))}
        </div>
    </div>
    </section>
}