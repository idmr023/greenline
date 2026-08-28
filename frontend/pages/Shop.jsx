import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import ProductCard from '../components/ProductCard';
import ProductViewer from '../components/ProductViewer';
import EcommerceStrip from '../components/EcommerceStrip';
import {
  CATEGORIAS,
  BATERIAS,
  BANNERS,
  sortProducts,
  formatPrice,
} from '../lib/utils';
import { fetchProductos } from '../lib/productos';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('categoria');

  const [productos, setProductos] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(() =>
    initialCat && CATEGORIAS.includes(initialCat) ? [initialCat] : [],
  );
  const [selectedBaterias, setSelectedBaterias] = useState([]);
  const [priceMax, setPriceMax] = useState(10000);
  const [sortBy, setSortBy] = useState('price_asc');

  useEffect(() => {
    fetchProductos().then(setProductos).catch(console.error);
  }, []);

  // Sincronizar URL con filtros si el usuario llega desde navbar
  useEffect(() => {
    if (initialCat && CATEGORIAS.includes(initialCat)) {
      setSelectedCategories([initialCat]);
    }
  }, [initialCat]);

  const toggle = (val, list, setList) => {
    setList(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);
  };

  const filtered = useMemo(() => {
    let list = productos.filter((p) => p.precio_actual != null && p.precio_actual <= priceMax);
    if (selectedCategories.length) {
      list = list.filter((p) => selectedCategories.includes(p.categoria));
    }
    if (selectedBaterias.length) {
      list = list.filter((p) => selectedBaterias.includes(p.bateria));
    }
    return sortProducts(list, sortBy);
  }, [productos, selectedCategories, selectedBaterias, priceMax, sortBy]);

  const banner =
    BANNERS[searchParams.get('categoria')] ?? BANNERS.default;

  return (
    <div>
      <PageBanner {...banner} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <ProductViewer productos={productos} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
              <SlidersHorizontal className="w-5 h-5 text-brand" /> Filtros
            </h3>

            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-800">
                Categoría
              </h4>
              {CATEGORIAS.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 text-sm text-gray-700 mb-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c)}
                    onChange={() =>
                      toggle(c, selectedCategories, setSelectedCategories)
                    }
                    className="accent-brand"
                  />
                  {c}
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-800">
                Batería
              </h4>
              {BATERIAS.map((b) => (
                <label
                  key={b}
                  className="flex items-center gap-2 text-sm text-gray-700 mb-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBaterias.includes(b)}
                    onChange={() =>
                      toggle(b, selectedBaterias, setSelectedBaterias)
                    }
                    className="accent-brand"
                  />
                  {b}
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-800">
                Precio máximo: {formatPrice(priceMax)}
              </h4>
              <input
                type="range"
                min={1500}
                max={8000}
                step={100}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-800">
                Ordenar
              </h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border-gray-300 border px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="name_asc">Nombre A-Z</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} productos encontrados
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-gray-bg rounded-xl">
              <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                No hay productos con esos filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          )}

          <EcommerceStrip />
        </div>
      </div>
      </div>
    </div>
  );
}
