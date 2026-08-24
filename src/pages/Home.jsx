import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Armchair, ArrowRight, Heart, Accessibility } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import Pillars from '../components/Pillars';
import ProductCard from '../components/ProductCard';
import Benefits from '../components/Benefits';
import Testimonials from '../components/Testimonials';
import ConsumoCalculator from '../components/ConsumoCalculator';
import Objecciones from '../components/Objeciones';
import { CATEGORIAS, sortProducts } from '../lib/utils';
import { fetchProductos } from '../lib/productos';

const inclusiveVehicles = [
  {
    id: 'inc-1',
    title: 'Trimoto Adaptada',
    desc: 'Diseñada con ergonomía accesible para mayor comodidad y libertad de movimiento.',
    icon: Armchair,
  },
  {
    id: 'inc-2',
    title: 'Carguero Inclusivo',
    desc: 'Capacidad ampliada y acceso facilitado para todos los usuarios.',
    icon: Accessibility,
  },
  {
    id: 'inc-3',
    title: 'Programa de Adaptación',
    desc: 'Adaptamos cualquier vehículo a tus necesidades específicas. Consulta disponibilidad.',
    icon: Heart,
  },
];

export default function Home() {
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos().then(setProductos).catch(console.error);
  }, []);

  const lowStockProducts = useMemo(
    () =>
      productos.filter(
        (p) =>
          p.disponibilidad !== 'Fuera de stock' &&
          p.unidades != null &&
          p.unidades <= 5,
      ),
    [productos],
  );

  const displayed = useMemo(() => {
    let list = [...productos];
    if (filterCategory !== 'Todas') {
      list = list.filter((p) => p.categoria === filterCategory);
    }
    list = sortProducts(list, 'price_asc');
    return list.slice(0, 12);
  }, [productos, filterCategory]);

  return (
    <>
      <HeroCarousel />
      <Pillars />

      {/* Organic Grid - Destacados */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lo más destacado de nuestra tienda
            </h2>
            <p className="text-gray-600 mt-1">
              Vehículos eléctricos ordenados por precio de menor a mayor.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterCategory('Todas')}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                filterCategory === 'Todas'
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-brand hover:text-brand'
              }`}
            >
              Todas
            </button>
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  filterCategory === c
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-brand hover:text-brand'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {displayed.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No hay productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayed.map((p) => (
              <ProductCard
                key={p.id}
                producto={p}
                featured={p.destacado}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/tienda"
            className="inline-block px-8 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg transition-colors"
          >
            Ver más productos
          </Link>
        </div>
      </section>

      {/* Scarcity Zone */}
      {lowStockProducts.length > 0 && (
        <section className="py-14 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Últimas unidades disponibles
              </h2>
            </div>
            <p className="text-gray-600 mb-8 ml-6">
              Estos modelos se están agotando. No dejes pasar la oportunidad.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {lowStockProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  producto={p}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inclusive Line */}
      <section className="py-14 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm font-semibold mb-4">
              Movilidad para todos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Diseño universal, libertad sin límites
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Creamos soluciones de movilidad pensadas para personas con capacidades
              diversas. Ergonomía, comodidad total y acceso igualitario.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {inclusiveVehicles.map(({ id, title, desc, icon: Icon }) => (
              <div
                key={id}
                className="bg-white/10 backdrop-blur rounded-xl p-6 text-center hover:bg-white/15 transition-colors"
              >
                <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-white/20 mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold mb-2 text-lg">{title}</h3>
                <p className="text-sm text-white/80">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/tienda?categoria=Cargueros"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-dark font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explorar opciones
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Benefits />
      <ConsumoCalculator />
      <Objecciones />
      <Testimonials />
    </>
  );
}
