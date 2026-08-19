import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  MapPin,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import ProductViewer from '../components/ProductViewer';
import {
  CATEGORIAS,
  BATERIAS,
  sortProducts,
  formatPrice,
  estimateAutonomia,
  consumoMensual,
} from '../lib/utils';
import productos from '../data/productos.json';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('categoria');

  const [selectedCategories, setSelectedCategories] = useState(() =>
    initialCat && CATEGORIAS.includes(initialCat) ? [initialCat] : [],
  );
  const [selectedBaterias, setSelectedBaterias] = useState([]);
  const [priceMax, setPriceMax] = useState(8000);
  const [sortBy, setSortBy] = useState('price_asc');

  // Simulador
  const [presupuesto, setPresupuesto] = useState(5000);
  const [kmDiarios, setKmDiarios] = useState(20);
  const [pasajeros, setPasajeros] = useState(1);
  const [selectedModelo, setSelectedModelo] = useState(null);

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
    let list = productos.filter((p) => p.precio_actual <= priceMax);
    if (selectedCategories.length) {
      list = list.filter((p) => selectedCategories.includes(p.categoria));
    }
    if (selectedBaterias.length) {
      list = list.filter((p) => selectedBaterias.includes(p.bateria));
    }
    return sortProducts(list, sortBy);
  }, [selectedCategories, selectedBaterias, priceMax, sortBy]);

  const recommended = useMemo(() => {
    let list = productos.filter((p) => p.precio_actual <= presupuesto);
    if (pasajeros >= 3) {
      const preferidas = list.filter((p) =>
        ['Trimotos Eléctricas', 'Cargueros'].includes(p.categoria),
      );
      if (preferidas.length) list = preferidas;
    }
    return sortProducts(list, 'price_asc');
  }, [presupuesto, pasajeros]);

  const autonomia = recommended.length
    ? estimateAutonomia(recommended[0].motor)
    : 30;
  const consumo = consumoMensual(kmDiarios, autonomia);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tienda Green Line</h1>
      <p className="text-gray-600 mb-8">Elige tu vehículo eléctrico ideal.</p>

      {/* Simulador */}
      <section className="mb-10 bg-gradient-to-br from-gray-bg to-white rounded-2xl border border-gray-200 p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
          <MapPin className="w-6 h-6 text-brand" /> Encuentra tu modelo ideal
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductViewer producto={selectedModelo ?? recommended[0]} />

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Wallet className="w-4 h-4 inline mr-1" /> Presupuesto máximo
              </label>
              <input
                type="number"
                min={1000}
                max={8000}
                value={presupuesto}
                onChange={(e) => setPresupuesto(Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" /> Kilómetros diarios:{' '}
                {kmDiarios} km
              </label>
              <input
                type="range"
                min={5}
                max={100}
                value={kmDiarios}
                onChange={(e) => setKmDiarios(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users className="w-4 h-4 inline mr-1" /> Capacidad de pasajeros
              </label>
              <select
                value={pasajeros}
                onChange={(e) => setPasajeros(Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-brand outline-none"
              >
                <option value={1}>1 pasajero</option>
                <option value={2}>2 pasajeros</option>
                <option value={3}>3+ pasajeros</option>
              </select>
            </div>
            <div className="bg-brand/10 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Consumo estimado mensual:{' '}
                <span className="text-brand font-bold text-lg">
                  {formatPrice(consumo)}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Basado en S/ 1.20 x recarga y autonomía estimada de {autonomia}{' '}
                km.
              </p>
            </div>
          </div>
        </div>

        {recommended.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3 text-gray-900">
              Modelos recomendados dentro de tu presupuesto
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recommended.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedModelo(p)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedModelo(p);
                  }}
                  title="Ver en 3D"
                  className="min-w-[180px] bg-white border border-gray-100 rounded-lg p-3 shadow-sm cursor-pointer hover:ring-2 hover:ring-brand transition-all"
                >
                  <ProductImage
                    nombre={p.nombre}
                    width={200}
                    height={150}
                    className="rounded-md mb-2"
                  />
                  <p className="text-sm font-semibold line-clamp-1 text-gray-900">
                    {p.nombre}
                  </p>
                  <p className="text-brand font-bold text-sm">
                    {formatPrice(p.precio_actual)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

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
        </div>
      </div>
    </div>
  );
}
