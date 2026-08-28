import { useMemo, useState } from 'react';
import { Check, RefreshCw, Search, X } from 'lucide-react';
import { formatPrice } from '../lib/utils';

const METRICAS_HIGHLIGHT = [
  { key: 'velocidad_max_kmh', unidad: ' km/h', label: 'más de velocidad máxima', mejor: 'mayor' },
  { key: 'autonomia_km', unidad: ' km', label: 'más de autonomía', mejor: 'mayor' },
  { key: 'capacidad_bateria', unidad: '', label: 'más de capacidad de batería', mejor: 'mayor' },
  { key: 'potencia_motor', unidad: 'W', label: 'más de potencia de motor', mejor: 'mayor' },
  { key: 'tiempo_carga_min', unidad: ' min', label: 'menos de tiempo de carga', mejor: 'menor' },
];

const GRUPOS = [
  {
    titulo: 'Rendimiento',
    filas: [
      ['potencia_motor', 'Potencia del motor'],
      ['velocidad_max_kmh', 'Velocidad máxima'],
      ['autonomia_km', 'Autonomía'],
      ['carga_maxima_kg', 'Carga máxima'],
    ],
  },
  {
    titulo: 'Batería',
    filas: [
      ['tipo_bateria', 'Tipo de batería'],
      ['potencia_bateria', 'Potencia de batería'],
      ['capacidad_bateria', 'Capacidad de batería'],
      ['bateria_extraible', 'Batería extraíble'],
      ['tiempo_carga_min', 'Tiempo de carga'],
    ],
  },
  {
    titulo: 'Dimensiones',
    filas: [
      ['largo_cm', 'Largo'],
      ['ancho_cm', 'Ancho'],
      ['alto_cm', 'Alto'],
    ],
  },
];

const UNIDADES_FILA = {
  velocidad_max_kmh: 'km/h',
  autonomia_km: 'km',
  tiempo_carga_min: 'min',
  carga_maxima_kg: 'kg',
  largo_cm: 'cm',
  ancho_cm: 'cm',
  alto_cm: 'cm',
};

function numDe(valor) {
  if (valor == null) return null;
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : null;
  const n = parseFloat(String(valor).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function textoValor(key, valor) {
  if (valor == null || valor === '') return '—';
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
  const unidad = UNIDADES_FILA[key];
  if (unidad && typeof valor !== 'string') return `${valor} ${unidad}`;
  return String(valor);
}

function ganadorDe(key, valorA, valorB) {
  const esBooleano = typeof valorA === 'boolean' || typeof valorB === 'boolean';
  if (esBooleano) {
    if (valorA === valorB) return 0;
    return valorA === true ? -1 : 1;
  }
  const na = numDe(valorA);
  const nb = numDe(valorB);
  if (na == null || nb == null) return 0;
  if (na === nb) return 0;
  const menorMejor = key === 'tiempo_carga_min';
  const ganaA = menorMejor ? na < nb : na > nb;
  return ganaA ? -1 : 1;
}

function razonTexto(metrica, diff) {
  const txt = Number.isInteger(diff) ? diff : diff.toFixed(1);
  if (metrica.unidad) return `${txt}${metrica.unidad} ${metrica.label}`;
  return `${txt} ${metrica.label}`;
}

function razonesDe(a, b) {
  const razones = [];
  METRICAS_HIGHLIGHT.forEach((m) => {
    const va = a?.ficha_tecnica?.[m.key];
    const vb = b?.ficha_tecnica?.[m.key];
    const na = numDe(va);
    const nb = numDe(vb);
    if (na == null || nb == null || na === nb) return;
    const ganaA = m.mejor === 'menor' ? na < nb : na > nb;
    if (!ganaA) return;
    razones.push({
      id: m.key,
      texto: razonTexto(m, Math.abs(na - nb)),
    });
  });
  return razones.slice(0, 5);
}

function imgDe(producto) {
  const imgs = producto?.imagenes || [];
  const principal = imgs.find((i) => i.es_principal && i.src);
  const primera = imgs.find((i) => i.src);
  return (principal || primera)?.src || null;
}

function Celda({ valor, estado }) {
  let clases = 'px-2 py-1 rounded';
  if (estado === 'gana') clases += ' font-bold text-gray-900 bg-green-50';
  else if (estado === 'igual') clases += ' text-gray-500';
  else clases += ' text-gray-700';
  return <div className={clases}>{valor}</div>;
}

export default function VersusComparator({ productos = [] }) {
  const lista = productos;

  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(1);
  const [pickerSlot, setPickerSlot] = useState(null); // 'a' | 'b'
  const [busqueda, setBusqueda] = useState('');

  const productoA = lista[idxA] || lista[0];
  const productoB = lista[idxB] || lista[lista.length - 1];

  const razonesA = useMemo(
    () => razonesDe(productoA, productoB),
    [productoA, productoB]
  );
  const razonesB = useMemo(
    () => razonesDe(productoB, productoA),
    [productoA, productoB]
  );

  const opciones = useMemo(() => {
    const otroId =
      pickerSlot === 'a' ? productoB?.id : productoA?.id;
    const q = busqueda.trim().toLowerCase();
    return lista
      .filter((p) => p.id !== otroId)
      .filter((p) => !q || String(p.nombre).toLowerCase().includes(q))
      .slice(0, 30);
  }, [lista, pickerSlot, busqueda, productoA?.id, productoB?.id]);

  if (!productoA || !productoB || lista.length < 2) {
    return (
      <p className="text-center text-sm text-gray-500 py-10">
        No hay suficientes vehículos para comparar por ahora.
      </p>
    );
  }

  const elegirProducto = (slot, producto) => {
    const idx = lista.findIndex((p) => p.id === producto.id);
    if (idx === -1) return;
    if (slot === 'a') setIdxA(idx);
    else setIdxB(idx);
    setPickerSlot(null);
    setBusqueda('');
  };

  const cabeceraVehiculo = (slot, producto) => {
    const src = imgDe(producto);
    return (
      <div className="flex flex-col items-center text-center gap-2 px-3 py-3 sm:flex-row sm:text-left sm:items-center sm:gap-3">
        {src ? (
          <img
            src={src}
            alt={producto.nombre}
            className="w-full max-w-[140px] h-20 object-contain bg-gray-bg rounded-lg shrink-0"
          />
        ) : (
          <div className="w-full max-w-[140px] h-20 bg-gray-bg rounded-lg flex items-center justify-center shrink-0">
            <span className="text-[10px] text-gray-400">Sin foto</span>
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm line-clamp-2">
            {producto.nombre}
          </p>
          <p className="text-brand font-bold">{formatPrice(producto.precio_actual)}</p>
          <button
            type="button"
            onClick={() => setPickerSlot(slot)}
            className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Cambiar vehículo
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Cabecera sticky */}
      <div className="sticky top-[57px] z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm grid grid-cols-2 divide-x divide-gray-100 rounded-t-xl">
        {cabeceraVehiculo('a', productoA)}
        {cabeceraVehiculo('b', productoB)}
      </div>

      {/* Razones para elegir */}
      {(razonesA.length > 0 || razonesB.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {[
            { producto: productoA, razones: razonesA },
            { producto: productoB, razones: razonesB },
          ].map(({ producto, razones }) => (
            <div
              key={producto.id}
              className={`rounded-xl border p-4 ${
                razones.length ? 'border-green-200 bg-green-50/40' : 'border-gray-100 bg-white'
              }`}
            >
              <p className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">
                Razones para elegir{' '}
                <span className="text-brand">{producto.nombre}</span>
              </p>
              {razones.length === 0 ? (
                <p className="text-xs text-gray-500">
                  Empate en los datos comparables.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {razones.map((r) => (
                    <li key={r.id} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                      {r.texto}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tabla de especificaciones */}
      <div className="overflow-x-auto mt-6">
        <div className="min-w-[480px]">
          {GRUPOS.map((grupo) => (
            <div key={grupo.titulo} className="mb-6">
              <h3 className="text-center text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
                {grupo.titulo}
              </h3>
              {grupo.filas.map(([key, label]) => {
                const va = productoA.ficha_tecnica?.[key];
                const vb = productoB.ficha_tecnica?.[key];
                const resultado = ganadorDe(key, va, vb);
                return (
                  <div key={key} className="border-b border-gray-100 py-2">
                    <p className="text-center text-xs text-gray-400 mb-1">{label}</p>
                    <div className="grid grid-cols-2 justify-items-center text-sm">
                      <Celda
                        valor={textoValor(key, va)}
                        estado={
                          resultado === 0 ? 'igual' : resultado === -1 ? 'gana' : 'pierde'
                        }
                      />
                      <Celda
                        valor={textoValor(key, vb)}
                        estado={
                          resultado === 0 ? 'igual' : resultado === 1 ? 'gana' : 'pierde'
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Modal cambiar vehículo */}
      {pickerSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPickerSlot(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-900 text-sm">Cambiar vehículo</p>
              <button
                type="button"
                onClick={() => setPickerSlot(null)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar modelo..."
                  autoFocus
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>
            <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {opciones.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => elegirProducto(pickerSlot, p)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 transition-colors text-left"
                  >
                    {imgDe(p) ? (
                      <img
                        src={imgDe(p)}
                        alt=""
                        className="w-12 h-10 object-contain bg-gray-bg rounded"
                      />
                    ) : (
                      <span className="w-12 h-10 bg-gray-bg rounded inline-flex items-center justify-center text-[9px] text-gray-400">
                        Sin foto
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-gray-900 truncate">
                        {p.nombre}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {formatPrice(p.precio_actual)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {opciones.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-gray-400">
                  Sin resultados.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
