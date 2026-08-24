import { useState, useMemo } from 'react';
import { MapPin, Wallet, Users } from 'lucide-react';
import ProductImage from './ProductImage';
import ChargingCostBadge from './ChargingCostBadge';
import {
  estimateAutonomia,
  formatPrice,
  sortProducts,
} from '../lib/utils';
import { costoRecargaDeProducto } from '../utils/batteryCalculator';
import KilometerMaps from './KilometerMaps';

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

  return (
    <section className="mb-10 bg-gradient-to-br from-gray-bg to-white rounded-2xl border border-gray-200 p-6 lg:p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
        <MapPin className="w-6 h-6 text-brand" /> Encuentra tu modelo ideal
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200 min-h-[260px] flex flex-col">
          {modeloActual && imgDe(modeloActual) ? (
            <>
              <div className="flex-1 min-h-[220px]">
                <ProductImage
                  src={imgDe(modeloActual)}
                  nombre={modeloActual.nombre}
                  width={800}
                  height={500}
                  className="w-full h-full"
                />
              </div>
              
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {modeloActual.nombre}
                </p>
                <p className="text-brand font-bold text-sm shrink-0 ml-3">
                  {formatPrice(modeloActual.precio_actual)}
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-gray-400 text-sm text-center">
                {productos.length === 0
                  ? 'Cargando modelos...'
                  : 'Sube tu presupuesto para ver modelos disponibles.'}
              </p>
            </div>


          )}
        </div>

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

          <KilometerMaps km={kmDiarios} onKmChange={setKmDiarios} />  

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
              {costoRecarga != null
                ? `Batería ${bateriaTexto}: S/ ${costoRecarga.toFixed(2)} por recarga completa`
                : 'Recarga estimada en S/ 1.20'}{' '}
              · autonomía estimada {autonomia} km.
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
                title="Ver este modelo"
                className={`min-w-[180px] bg-white border rounded-lg p-3 shadow-sm cursor-pointer transition-all hover:ring-2 hover:ring-brand ${
                  modeloActual?.id === p.id
                    ? 'border-brand ring-1 ring-brand'
                    : 'border-gray-100'
                }`}
              >
                {imgDe(p) ? (
                  <div className="h-[112px] mb-2">
                    <ProductImage
                      src={imgDe(p)}
                      nombre={p.nombre}
                      width={200}
                      height={150}
                      className="rounded-md h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="h-[112px] mb-2 rounded-md bg-gray-bg flex items-center justify-center">
                    <span className="text-[10px] text-gray-400">Sin foto</span>
                  </div>
                )}
                <p className="text-sm font-semibold line-clamp-1 text-gray-900">
                  {p.nombre}
                </p>
                <p className="text-brand font-bold text-sm">
                  {formatPrice(p.precio_actual)}
                </p>
                <ChargingCostBadge cost={costoRecargaDeProducto(p)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
