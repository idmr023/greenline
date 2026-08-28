import { useState, useMemo } from 'react';
import {
  MapPin,
  Wallet,
  Users,
  ChevronDown,
} from 'lucide-react';
import ProductImage from './ProductImage';
import {
  estimateAutonomia,
  formatPrice,
  sortProducts,
} from '../lib/utils';
import { costoRecargaDeProducto } from '../utils/batteryCalculator';
import KilometerMaps from './KilometerMaps';

const COSTO_GASOLINA_KM = 0.35;

function imgDe(producto) {
  const imgs = producto?.imagenes || [];
  const principal = imgs.find((i) => i.es_principal && i.src);
  const primera = imgs.find((i) => i.src);
  return (principal || primera)?.src || null;
}

export default function ProductViewer({ productos = [] }) {
  const [presupuesto, setPresupuesto] = useState(5000);
  const [kmDiarios, setKmDiarios] = useState(20);
  const [pasajeros, setPasajeros] = useState(1);
  const [selectedModelo, setSelectedModelo] = useState(null);
  const [conRuta, setConRuta] = useState(false);
  const [viewerAbierto, setViewerAbierto] = useState(false);

  const alCambiarKm = (km) => {
    setKmDiarios(km);
    setConRuta(true);
  };

  const disponibles = useMemo(
    () => productos.filter((p) => p.precio_actual != null),
    [productos],
  );

  const recommended = useMemo(() => {
    let list = disponibles.filter((p) => p.precio_actual <= presupuesto);
    if (pasajeros >= 3) {
      const preferidas = list.filter((p) =>
        ['Trimotos Eléctricas', 'Cargueros'].includes(p.categoria),
      );
      if (preferidas.length) list = preferidas;
    }
    return sortProducts(list, 'price_asc');
  }, [disponibles, presupuesto, pasajeros]);

  const modeloActual =
    selectedModelo && recommended.some((p) => p.id === selectedModelo.id)
      ? selectedModelo
      : recommended[0] || null;

  const autonomia = modeloActual ? estimateAutonomia(modeloActual.motor) : 30;
  const bateriaTexto = modeloActual
    ? modeloActual.ficha_tecnica?.potencia_bateria ||
      modeloActual.ficha_tecnica?.tipo_bateria ||
      modeloActual.bateria
    : null;
  const costoRecarga = costoRecargaDeProducto(modeloActual);
  const recargasMes =
    kmDiarios && autonomia > 0 ? (Number(kmDiarios) * 30) / autonomia : 0;
  const consumo = recargasMes * (costoRecarga ?? 1.2);
  const costoGasolina = Number(kmDiarios) * 30 * COSTO_GASOLINA_KM;
  const ahorro = Math.max(costoGasolina - consumo, 0);

  return (
    <section className="mb-10 bg-gradient-to-br from-gray-bg to-white rounded-2xl border border-gray-200 p-6 lg:p-8">
      {!viewerAbierto && (
        <button
          type="button"
          onClick={() => setViewerAbierto(true)}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-3 bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
        >
          <MapPin className="w-4 h-4" />
          Haz click aquí para encontrar tu modelo ideal
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      <div className={viewerAbierto ? 'block' : 'hidden'}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <MapPin className="w-6 h-6 text-brand" /> Encuentra tu modelo ideal
          </h2>
          <button
            type="button"
            onClick={() => setViewerAbierto(false)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-brand transition-colors"
          >
            Minimizar
            <ChevronDown className="w-4 h-4 rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 items-start">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              <Wallet className="w-4 h-4" /> Presupuesto: <span className="text-brand font-bold">{formatPrice(presupuesto)}</span>
            </label>
            <input
              type="range"
              min={1500}
              max={8000}
              step={100}
              value={presupuesto}
              onChange={(e) => setPresupuesto(Number(e.target.value))}
              className="w-full accent-brand h-2"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 mb-5">
              <span>S/ 1,500</span>
              <span>S/ 8,000</span>
            </div>

            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4" /> Pasajeros
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPasajeros(n)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    pasajeros === n
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand'
                  }`}
                >
                  {n === 3 ? '3+' : n} {n === 1 ? 'pasajero' : 'pasajeros'}
                </button>
              ))}
            </div>
          </div>

          <KilometerMaps abierto={viewerAbierto} onKmChange={alCambiarKm} view="split" />

          <div className="space-y-3">
            {conRuta ? (
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Consumo mensual</span>
                  <span className="text-brand font-bold text-sm">{formatPrice(consumo)}</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  {costoRecarga != null
                    ? `Batería ${bateriaTexto}: S/ ${costoRecarga.toFixed(2)} por carga`
                    : 'Recarga estimada S/ 1.20'} · {autonomia} km autonomía
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-red-50 border border-red-100 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[10px] text-gray-500">Gasolina</p>
                    <p className="text-sm font-bold text-red-500">{formatPrice(costoGasolina)}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[10px] text-gray-500">Ahorras</p>
                    <p className="text-sm font-bold text-brand">{formatPrice(ahorro)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand shrink-0" />
                <p className="text-xs text-gray-500">
                  Traza tu ruta para ver tu consumo y ahorro.
                </p>
              </div>
            )}
          </div>
        </div>

        {recommended.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-gray-900 text-sm">
              Modelos recomendados
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {recommended.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedModelo(p)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedModelo(p);
                  }}
                  title="Ver este modelo"
                  className={`min-w-[140px] max-w-[140px] bg-white border rounded-xl p-2 shadow-sm cursor-pointer transition-all hover:ring-2 hover:ring-brand ${
                    modeloActual?.id === p.id
                      ? 'border-brand ring-1 ring-brand'
                      : 'border-gray-100'
                  }`}
                >
                  {imgDe(p) ? (
                    <div className="h-20 mb-2 rounded-lg bg-gray-bg overflow-hidden">
                      <ProductImage
                        src={imgDe(p)}
                        nombre={p.nombre}
                        width={200}
                        height={150}
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="h-20 mb-2 rounded-lg bg-gray-bg flex items-center justify-center">
                      <span className="text-[10px] text-gray-400">Sin foto</span>
                    </div>
                  )}
                  <p className="text-xs font-semibold line-clamp-2 text-gray-900 leading-tight">
                    {p.nombre}
                  </p>
                  <p className="text-brand font-bold text-xs mt-1">
                    {formatPrice(p.precio_actual)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
