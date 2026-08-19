import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import Pillars from '../components/Pillars';
import ProductCard from '../components/ProductCard';
import Benefits from '../components/Benefits';
import { CATEGORIAS, sortProducts } from '../lib/utils';
import productos from '../data/productos.json';

export default function Home() {
  const [filterCategory, setFilterCategory] = useState('Todas');

  const displayed = useMemo(() => {
    let list = [...productos];
    if (filterCategory !== 'Todas') {
      list = list.filter((p) => p.categoria === filterCategory);
    }
    list = sortProducts(list, 'price_asc');
    return list.slice(0, 12);
  }, [filterCategory]);

  return (
    <>
      <HeroCarousel />
      <Pillars />

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
              <ProductCard key={p.id} producto={p} />
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

      <Benefits />
    </>
  );
}
