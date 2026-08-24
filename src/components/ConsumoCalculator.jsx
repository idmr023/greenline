import { useState, useMemo, useEffect } from 'react';
import { Route, Fuel, Leaf, Zap, TrendingDown } from 'lucide-react';
import { formatPrice, estimateAutonomia, CATEGORIAS } from '../lib/utils';
import {
  costoRecargaDeProducto,
  costoRecargaPromedio,
} from '../utils/batteryCalculator';
import { fetchProductos } from '../lib/productos';

const COSTO_GASOLINA_KM = 0.35;
const CO2_MOTO_KM = 0.1;

function mediana(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

export default function ConsumoCalculator() {
  const [kmDiarios, setKmDiarios] = useState(20);
  const [tipo, setTipo] = useState('Motos Eléctricas');
  const [productos, setProductos] = useState([]);
  const km = Number(kmDiarios) || 0;

  useEffect(() => {
    fetchProductos().then(setProductos).catch(console.error);
  }, []);

  // Referencias reales por categoría: autonomía del motor mediano de sus
  // productos y costo de recarga promedio según batteryCosts.json.
  const ref = useMemo(() => {
    const delTipo = productos.filter((p) => p.categoria === tipo);
    if (!delTipo.length) {
      return { autonomia: 40, costoRecarga: costoRecargaPromedio(), modelos: 0 };
    }
    const motores = delTipo
      .map((p) => parseInt(p.motor, 10))
      .filter((n) => !Number.isNaN(n));
    const costos = delTipo
      .map((p) => costoRecargaDeProducto(p))
      .filter((c) => c != null);
    return {
      autonomia: motores.length ? estimateAutonomia(mediana(motores)) : 40,
      costoRecarga: costos.length
        ? costos.reduce((s, c) => s + c, 0) / costos.length
        : costoRecargaPromedio(),
      modelos: delTipo.length,
    };
  }, [productos, tipo]);

  const stats = useMemo(() => {
    const recargasMes = (km * 30) / ref.autonomia;
    const consumoElectrico = recargasMes * ref.costoRecarga;
    const costoGasolina = km * 30 * COSTO_GASOLINA_KM;
    const ahorro = costoGasolina - consumoElectrico;
    const co2Evitado = km * 30 * CO2_MOTO_KM;
    return { recargasMes, consumoElectrico, costoGasolina, ahorro, co2Evitado };
  }, [km, ref]);

  const maxCost = Math.max(stats.costoGasolina, 1);

  return (
    <section className="py-14 bg-gradient-to-br from-brand/5 via-white to-emerald-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-brand/10 rounded-full text-sm font-semibold text-brand mb-4">
            Ahorra dinero y el planeta
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Calcula tu consumo eléctrico
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Ingresa tus kilómetros diarios y descubre cuánto gastarías vs. una moto a gasolina.
          </p>
        </div>

        {/* Selector de tipo de vehículo */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              onClick={() => setTipo(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                tipo === c
                  ? 'bg-brand text-white border-brand shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Route className="w-4 h-4 inline mr-1 text-brand" />
                ¿Cuántos km recorres al día?
              </label>
              <input
                type="range"
                min={5}
                max={150}
                value={kmDiarios}
                onChange={(e) => setKmDiarios(Number(e.target.value))}
                className="w-full accent-brand h-2"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5 km</span>
                <span className="text-brand font-bold text-lg">{km} km/día</span>
                <span>150 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Consumo eléctrico */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-brand/10 mb-4">
              <Zap className="w-6 h-6 text-brand" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Consumo eléctrico mensual</p>
            <p className="text-3xl font-bold text-brand">{formatPrice(stats.consumoElectrico)}</p>
            <p className="text-xs text-gray-400 mt-1">
              ~{stats.recargasMes.toFixed(1)} recargas × S/ {ref.costoRecarga.toFixed(2)}
              {ref.modelos > 0 && <> · {ref.modelos} modelos {tipo.toLowerCase()}</>}
            </p>
          </div>

          {/* Costo gasolina */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-50 mb-4">
              <Fuel className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Costo gasolina mensual</p>
            <p className="text-3xl font-bold text-red-500">{formatPrice(stats.costoGasolina)}</p>
            <p className="text-xs text-gray-400 mt-1">
              ~S/ {COSTO_GASOLINA_KM.toFixed(2)} por km (moto promedio)
            </p>
          </div>

          {/* Ahorro */}
          <div className="bg-white rounded-2xl shadow-sm border border-brand/20 p-6 text-center ring-1 ring-brand/10">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-brand/10 mb-4">
              <TrendingDown className="w-6 h-6 text-brand" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Ahorro mensual</p>
            <p className="text-3xl font-bold text-brand">{formatPrice(stats.ahorro)}</p>
            <p className="text-xs text-gray-400 mt-1">
              Ahorro anual: <span className="font-bold text-brand">{formatPrice(stats.ahorro * 12)}</span>
            </p>
          </div>
        </div>

        {/* Barra comparativa visual */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">Comparativa mensual</p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Zap className="w-3.5 h-3.5 text-brand" /> Eléctrico
                </span>
                <span className="font-bold text-brand">{formatPrice(stats.consumoElectrico)}</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-500"
                  style={{ width: `${Math.max((stats.consumoElectrico / maxCost) * 100, 2)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Fuel className="w-3.5 h-3.5 text-red-500" /> Gasolina
                </span>
                <span className="font-bold text-red-500">{formatPrice(stats.costoGasolina)}</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full transition-all duration-500"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CO2 */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="w-6 h-6 text-emerald-600" />
            <span className="text-lg font-bold text-emerald-800">Cero emisiones de CO₂</span>
          </div>
          <p className="text-sm text-emerald-700">
            Al mes evitarías <span className="font-bold">{stats.co2Evitado.toFixed(1)} kg de CO₂</span> —
            equivalente a plantar <span className="font-bold">{Math.ceil(stats.co2Evitado / 21)} árboles</span> cada mes.
          </p>
        </div>
      </div>
    </section>
  );
}
