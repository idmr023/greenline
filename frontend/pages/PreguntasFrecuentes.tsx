import { useState, useMemo } from 'react';
import {
  Search,
  Zap,
  Battery,
  Clock,
  Gauge,
  DollarSign,
  Wrench,
  Shield,
  MessageCircle,
  BatteryCharging,
  CircleDollarSign,
  Settings,
} from 'lucide-react';
import { CONTACT } from '../lib/config';
import PageBanner from '../components/PageBanner';
import AccordionItem from '../components/faq/AccordionItem';
import SeccionNavegacion from '../components/faq/SeccionNavegacion';
import TablaComparativa from '../components/faq/TablaComparativa';
import FormulaBlock from '../components/faq/FormulaBlock';
import TarjetaConsejo from '../components/faq/TarjetaConsejo';
import CurvaCargaSVG from '../components/faq/CurvaCargaSVG';

const SECTIONS = [
  {
    id: 'motos-electricas',
    questions: [
      'cómo funciona una moto eléctrica',
      'diferencia entre las motos eléctricas y los de gasolina',
      'dónde puedo cargar los productos eléctricos',
      'cuánto tiempo tiene que recargar las baterías',
      'qué tipo de batería llevan las motos eléctricas y cuál es la vida útil',
      'cuántos caballos de fuerza equivale un watt',
    ],
  },
  {
    id: 'costos',
    questions: [
      'cuánto es el costo en consumo de energía',
      'es costoso mantener una moto eléctrica',
      'cuánto cuestan las baterías',
      'es costoso los repuestos de la moto eléctrica',
    ],
  },
  {
    id: 'mantenimiento',
    questions: [
      'qué tipo de mantenimiento o revisión necesitan las motos eléctricas',
      'cuál es la diferencia entre mantenimiento y revisión técnica',
    ],
  },
  {
    id: 'garantia',
    questions: [
      'a quién debo acudir en caso de requerir alguna asistencia técnica',
      'cuál es la garantía de greenline',
    ],
  },
];

function normalize(v: string) {
  return v.replace(/\s+/g, ' ').trim().toLowerCase();
}

export default function PreguntasFrecuentes() {
  const [query, setQuery] = useState('');

  const matchesQuery = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    return (text: string) => normalize(text).includes(q);
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner
        title="Preguntas Frecuentes"
        subtitle="Todo lo que necesitas saber sobre tu vehículo eléctrico"
        bgClass="bg-gradient-to-br from-brand to-brand-dark"
      />

      {/* Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <label className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 transition-colors focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/20">
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar una pregunta..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Limpiar
              </button>
            )}
          </label>
          {matchesQuery && (
            <p className="mt-2 text-xs text-gray-500">
              {query.trim()
                ? 'Escribe para filtrar las preguntas'
                : 'Haz clic en una pregunta para expandir'}
            </p>
          )}
        </div>
      </div>

      {/* Sticky navigation */}
      <SeccionNavegacion />

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-16">
        {/* ═══════════════════════════════════════════════════ */}
        {/* SECCIÓN 1: CONOZCAMOS LAS MOTOS ELÉCTRICAS         */}
        {/* ═══════════════════════════════════════════════════ */}
        <section id="motos-electricas" className="scroll-mt-32">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-sm font-semibold rounded-full mb-3">
              Básicos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Conozcamos más de las Motos Eléctricas
            </h2>
          </div>

          <div className="space-y-3">
            {/* 1. ¿Cómo funciona una moto eléctrica? */}
            <AccordionItem
              title="¿Cómo funciona una moto eléctrica?"
              icon={<Zap className="h-4 w-4" />}
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                Una moto eléctrica utiliza un motor eléctrico alimentado por baterías
                recargables. Al presionar el acelerador, la energía eléctrica se convierte
                en movimiento de forma directa, sin quemar combustible ni producir
                emisiones. El motor entrega torque de forma inmediata desde 0 RPM.
              </p>
            </AccordionItem>

            {/* 2. ¿Cuál es la diferencia entre motos eléctricas y gasolina? */}
            <AccordionItem
              title="¿Cuál es la diferencia entre las motos eléctricas y los de gasolina?"
              icon={<Gauge className="h-4 w-4" />}
            >
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Las motos eléctricas no requieren cambios de aceite, afinamientos ni
                otros procesos que generan gastos periódicos al usuario. Son muchísimo
                más económicas en mantenimiento y operación.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TarjetaConsejo
                  variante="verde"
                  titulo="Moto Eléctrica"
                  texto="Sin combustible, sin aceite, sin bujías. Mantenimiento 70% más económico. Cero emisiones."
                />
                <TarjetaConsejo
                  variante="rojo"
                  titulo="Moto de Gasolina"
                  texto="Combustible, cambios de aceite, filtros, bujías, afinamientos periódicos. Emisiones contaminantes."
                />
              </div>
            </AccordionItem>

            {/* 3. ¿Dónde puedo cargar los productos eléctricos? */}
            <AccordionItem
              title="¿Dónde puedo cargar los productos eléctricos?"
              icon={<BatteryCharging className="h-4 w-4" />}
              badge="Carga en casa"
            >
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Carga donde quieras
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    La mayoría de nuestros modelos en todas las categorías son de baterías
                    internas, las cuales brindan mayor seguridad. No requieres una entrada
                    específica, ya que cuentan con su cargador especial de uso doméstico
                    donde cualquier enchufe sirve para cargar tu moto eléctrica.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">
                      Baterías Internas
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      La mayoría de nuestros modelos son de baterías internas, brindando
                      mayor seguridad. Cualquier enchufe doméstico sirve para cargar.
                    </p>
                    <div className="mt-3 rounded-xl bg-brand/5 border border-brand/10 p-3">
                      <p className="text-xs font-semibold text-brand mb-1">
                        ¿Cómo debo cargar mi moto?
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Fácil y sencillo, solo debes siempre tener en cuenta que debes
                        conectar el cargador primero al vehículo y después a la toma de
                        energía de la pared, esto para cuidar no solo tus baterías sino tu
                        cargador también.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">
                      Baterías Extraíbles
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      La categoría de modelos con estas baterías son las Bicimotos (VMP) y
                      lo mejor es su fácil extracción para llevarla a cualquier lugar: tu
                      departamento, oficina o salón de clase. No requieres un punto de
                      carga especial.
                    </p>
                    <div className="mt-3 rounded-xl bg-brand/5 border border-brand/10 p-3">
                      <p className="text-xs font-semibold text-brand mb-1">
                        ¿Cuánto pesa esta batería?
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Una batería de litio promedio pesa solo 8-12 kg, equivalente a un
                        pack de agua.
                      </p>
                    </div>
                  </div>
                </div>

                <CurvaCargaSVG />

                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-3">
                    Consejos de Oro
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TarjetaConsejo
                      variante="verde"
                      titulo="Regla del 20/80"
                      texto="Mantén tu carga entre estos niveles para duplicar la vida útil de tu batería."
                      icono="🔋"
                    />
                    <TarjetaConsejo
                      variante="rojo"
                      titulo="Cargador Original"
                      texto="Nunca uses genéricos; el voltaje incorrecto puede causar daños irreversibles."
                      icono="⚡"
                    />
                    <TarjetaConsejo
                      variante="azul"
                      titulo="Enfría antes de cargar"
                      texto="Después de un viaje largo, espera 15 min antes de conectar."
                      icono="❄️"
                    />
                    <TarjetaConsejo
                      variante="neutro"
                      titulo="Carga aunque no la uses"
                      texto="Si guardas la moto, cárgala al menos una vez a la semana."
                      icono="📅"
                    />
                  </div>
                </div>
              </div>
            </AccordionItem>

            {/* 4. ¿Cuánto tiempo tiene que recargar las baterías? */}
            <AccordionItem
              title="¿Cuánto tiempo tiene que recargar las baterías?"
              icon={<Clock className="h-4 w-4" />}
              badge="Tiempos"
            >
              <div className="space-y-5">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    ¿Cuánto tiempo <span className="text-brand">toma realmente?</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
                    Cargar tu moto es tan sencillo como cargar tu celular. Aquí te
                    mostramos los tiempos exactos según tu configuración.
                  </p>
                </div>

                <FormulaBlock
                  formula={
                    <>
                      <span className="text-white">TIEMPO = </span>
                      <span className="text-emerald-400">Capacidad de la Batería (Ah)</span>
                      <span className="text-white"> / </span>
                      <span className="text-emerald-400">Corriente del Cargador (A)</span>
                    </>
                  }
                  nota="Todo cargador original muestra su especificación técnica y está diseñado específicamente para su batería."
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <TarjetaConsejo
                    variante="neutro"
                    titulo="Capacidad"
                    texto="A mayor amperaje (Ah), más energía almacena y más tiempo requiere de carga."
                    icono="📦"
                  />
                  <TarjetaConsejo
                    variante="neutro"
                    titulo="Potencia"
                    texto="El cargador (Amperios) determina qué tan rápido fluye la energía hacia las celdas."
                    icono="⚡"
                  />
                  <TarjetaConsejo
                    variante="neutro"
                    titulo="Clima"
                    texto="Las temperaturas extremas pueden ralentizar el proceso químico de carga."
                    icono="🌡️"
                  />
                </div>

                <TablaComparativa
                  titulo="Tiempos de carga en moto eléctrica"
                  columnas={[
                    { label: 'Motor (W)' },
                    { label: 'Tipo de Batería' },
                    { label: '20% – 100%' },
                    { label: '5% – 100%' },
                  ]}
                  filas={[
                    { cells: ['800 W', 'Plomo Ácido', '6 – 8 horas', '8 – 10 horas'] },
                    { cells: ['1200 W', 'Plomo Ácido con Grafeno', '4 – 6 horas', '6 – 7 horas'] },
                    { cells: ['1500 W', 'Litio', '3 – 5 horas', '5 – 6 horas'], highlight: true },
                  ]}
                  nota="* El cuadro es referencial dependiendo de las características del modelo de vehículo y su respectivo cargador ya que puede variar según su fabricación."
                />

                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-3">
                    Comparativa de Litio Vs. Plomo Ácido
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    El litio no solo es más ligero, sino que acepta cargas mucho más
                    rápidas y eficientes.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-sm font-bold text-emerald-700 mb-1">Litio</p>
                      <p className="text-2xl font-bold text-emerald-600">3 – 6 horas</p>
                      <p className="text-xs text-emerald-600/70 mt-1">Carga Total</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gray-100 p-4">
                      <p className="text-sm font-bold text-gray-700 mb-1">Plomo Ácido</p>
                      <p className="text-2xl font-bold text-gray-500">6 – 10 horas</p>
                      <p className="text-xs text-gray-500 mt-1">Carga Total</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 text-center italic">
                    * Basado en tomacorrientes domésticos estándar de 220V.
                  </p>
                </div>
              </div>
            </AccordionItem>

            {/* 5. ¿Qué tipo de batería llevan las motos eléctricas y cuál es la vida útil? */}
            <AccordionItem
              title="¿Qué tipo de batería llevan las motos eléctricas y cuál es la vida útil de ellas?"
              icon={<Battery className="h-4 w-4" />}
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                Nuestras motos eléctricas utilizan diferentes tipos de batería según la
                categoría: baterías de plomo ácido, plomo ácido con grafeno para mayor
                durabilidad, y baterías de litio para los modelos de mayor rendimiento. La
                vida útil varía entre 1.5 y 3 años dependiendo del tipo y el uso, pudiendo
                extenderse con un buen mantenimiento.
              </p>
            </AccordionItem>

            {/* 6. ¿Cuántos caballos de fuerza equivale un Watt? */}
            <AccordionItem
              title="¿A cuántos caballos de fuerza equivale un Watt? ¿Cuánto es la potencia equivalente en C.C.?"
              icon={<Gauge className="h-4 w-4" />}
              badge="Potencia"
            >
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    La Ciencia de la Conversión
                  </h3>
                  <p className="text-sm text-gray-600">
                    Para entender la potencia de nuestras motos, aplicamos los estándares
                    internacionales de ingeniería mecánica:
                  </p>
                </div>

                <FormulaBlock
                  formula={
                    <>
                      <span className="text-white">1 Hp = 746 W</span>
                      <span className="text-gray-400 mx-2">|</span>
                      <span className="text-white">1 Hp ≈ </span>
                      <span className="text-emerald-400">14 cc – 17 cc</span>
                    </>
                  }
                  nota="El motor eléctrico entrega el torque de forma inmediata, superando la respuesta inicial de la gasolina."
                />

                <TablaComparativa
                  titulo="Tabla Comparativa Oficial"
                  columnas={[
                    { label: 'Categoría de Vehículo' },
                    { label: 'Potencia Eléctrica (W | Hp)' },
                    { label: 'Equivalente Combustible (CC)' },
                  ]}
                  filas={[
                    { cells: ['Bicimoto / VMP', '250 – 350 W | 0.3 – 0.5 Hp', '6 – 8 CC'] },
                    { cells: ['Trimoto Pasajero', '500 – 600 W | 0.7 – 0.8 Hp', '14 CC'] },
                    { cells: ['Moto Tipo Scooter', '800 – 1500 W | 1.1 – 2 Hp', '18 – 34 CC'], highlight: true },
                    { cells: ['Alta Potencia / Carga', '2000 – 3000 W | 2.7 – 4 Hp', '39 – 68 CC'] },
                    { cells: ['Pisteras / Pesada', '5000 – 10000 W | 6.7 – 13.4 Hp', '114 – 228 CC'] },
                  ]}
                  nota="* Leyenda: ✦ = El modelo eléctrico más vendido."
                />

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <h4 className="text-base font-bold text-gray-900 mb-2">
                    Líderes en Eficiencia Urbana
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    La categoría <strong>Moto Eléctrica (800 – 1500 Watts)</strong> es
                    nuestra línea más vendida. Ofrece el equilibrio perfecto entre autonomía
                    y potencia equivalente a una <strong>34 cc</strong> de gasolina, pero con{' '}
                    <strong>0 emisiones</strong> y un <strong>ahorro del 90%</strong> en
                    combustible.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Torque inmediato desde 0 RPM',
                      'Sin cambios de aceite ni bujías',
                      'Mantenimiento 70% más económico',
                    ].map((t) => (
                      <span
                        key={t}
                        className="inline-block rounded-full bg-brand/10 text-brand text-xs font-semibold px-3 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionItem>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* SECCIÓN 2: COSTOS                                   */}
        {/* ═══════════════════════════════════════════════════ */}
        <section id="costos" className="scroll-mt-32">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-3">
              Ahorro
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Costos de las Motos Eléctricas
            </h2>
          </div>

          <div className="space-y-3">
            {/* 7. ¿Cuánto es el costo en consumo de energía? */}
            <AccordionItem
              title="¿Cuánto es el costo en consumo de energía de los vehículos eléctricos? ¿Es costoso cargar la batería?"
              icon={<CircleDollarSign className="h-4 w-4" />}
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                No, es muy económico. Cargar una moto eléctrica completa cuesta
                aproximadamente S/ 1.50, mientras que llenar medio tanque de gasolina para
                recorrer la misma distancia cuesta alrededor de S/ 10.00. Es decir, el
                ahorro en combustible es de aproximadamente el 85%.
              </p>
            </AccordionItem>

            {/* 8. ¿Es costoso mantener una moto eléctrica? */}
            <AccordionItem
              title="¿Es costoso mantener una moto eléctrica?"
              icon={<DollarSign className="h-4 w-4" />}
              badge="Ahorro del 62%"
            >
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    ¿Es costoso realmente?
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    No, todo lo contrario. A diferencia de las motos tradicionales, las motos
                    eléctricas no requieren ni de cambios de aceite, afinamientos, ni otros
                    procesos que generan gastos periódicos al usuario. En consecuencia, son
                    muchísimo más económicas.
                  </p>
                </div>

                <h4 className="text-base font-bold text-gray-900">
                  El duelo del bolsillo
                </h4>
                <p className="text-sm text-gray-600">
                  Consumo diario y mensual
                </p>

                <TablaComparativa
                  columnas={[
                    { label: 'Métrica (Rendimiento 60 km)' },
                    { label: 'Moto Gasolinera (125 cc)' },
                    { label: 'Moto Eléctrica (1000 W)', highlight: true },
                  ]}
                  filas={[
                    { cells: ['Combustible / Energía', '1/2 Galón de gasolina', '1 Carga eléctrica completa'] },
                    { cells: ['Costo estimado por recorrido', 'S/ 10.00', 'S/ 1.50'], highlight: true },
                    { cells: ['Gasto Mensual Total (30 días)', 'S/ 300.00', 'S/ 45.00'], highlight: true },
                  ]}
                />

                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">
                    Proyección de mantenimiento
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    En 18 meses se estima un cálculo aproximado:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Gasolina */}
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                      <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
                        Gasolina (125 cc)
                      </p>
                      <h5 className="text-sm font-bold text-gray-900 mb-2">
                        Costos de Taller Frecuentes
                      </h5>
                      <ul className="text-sm text-gray-700 space-y-1.5 mb-4">
                        <li className="flex justify-between">
                          <span>6 cambios de aceites obligatorios</span>
                          <span className="font-bold">S/ 360.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Afinamientos y mantenimientos (×6)</span>
                          <span className="font-bold">S/ 480.00</span>
                        </li>
                        <li className="text-gray-500 text-xs">
                          Filtros, bujías y piezas móviles varias
                        </li>
                      </ul>
                      <div className="border-t border-red-200 pt-3">
                        <p className="text-xs text-gray-500">Gasto acumulado total</p>
                        <p className="text-xl font-bold text-red-600">S/ 5,470.00</p>
                      </div>
                    </div>

                    {/* Eléctrica */}
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                        Eléctrica (1000 W)
                      </p>
                      <h5 className="text-sm font-bold text-gray-900 mb-2">
                        Estructura simplificada de atención
                      </h5>
                      <ul className="text-sm text-gray-700 space-y-1.5 mb-4">
                        <li className="text-emerald-600">
                          Cambios de aceite <strong>(no requiere)</strong>
                        </li>
                        <li className="flex justify-between">
                          <span>Revisiones periódicas ligeras (×6)</span>
                          <span className="font-bold">S/ 240.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Renovación de baterías Pack 6 (1.5 años)</span>
                          <span className="font-bold">S/ 1,050.00</span>
                        </li>
                      </ul>
                      <div className="border-t border-emerald-200 pt-3">
                        <p className="text-xs text-gray-500">Gasto acumulado total</p>
                        <p className="text-xl font-bold text-emerald-600">S/ 2,110.00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-brand to-brand-dark p-6 text-white text-center">
                  <h4 className="text-lg font-bold mb-1">
                    ¡Tu cuenta bancaria te lo va a agradecer!
                  </h4>
                  <p className="text-sm text-white/80 mb-3">
                    Considerando combustible, mantenimiento y consumibles totales
                    acumulados a los 3 años
                  </p>
                  <p className="text-3xl font-bold text-emerald-300">S/ 8,560.00</p>
                  <p className="text-sm text-white/80 mt-2">
                    Ahorro Neto Total Garantizado. Prácticamente recuperas la inversión
                    inicial de tu moto.
                  </p>
                </div>

                <p className="text-[11px] text-gray-400 italic text-center">
                  * Nota: En la moto de combustión se generan gastos variables adicionales
                  por pastillas de freno, embragues y filtros que varían según la marca y no
                  fueron incluidos en este cálculo base, haciendo que el ahorro real sea aún
                  mayor.
                </p>
              </div>
            </AccordionItem>

            {/* 9. ¿Cuánto cuestan las baterías? */}
            <AccordionItem
              title="¿Cuánto cuestan las baterías?"
              icon={<Battery className="h-4 w-4" />}
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                El costo de las baterías varía según el tipo y capacidad. Las baterías de
                plomo ácido son las más económicas, las de grafeno ofrecen mejor
                durabilidad a un precio intermedio, y las de litio son la inversión más alta
                pero con mayor vida útil y rendimiento. Consulta en nuestras tiendas por los
                precios actuales de cada tipo.
              </p>
            </AccordionItem>

            {/* 10. ¿Es costoso los repuestos de la moto eléctrica? */}
            <AccordionItem
              title="¿Es costoso los repuestos de la moto eléctrica?"
              icon={<Settings className="h-4 w-4" />}
            >
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    ¿Por qué se piensa que son caros?
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Existe el mito de que al ser tecnología nueva, cualquier reparación
                    costará una fortuna. Sin embargo, la realidad de la ingeniería eléctrica
                    es totalmente opuesta. Al no sufrir por la fricción extrema del calor, las
                    explosiones del motor ni el desgaste de fluidos, el catálogo de repuestos
                    se reduce en más de un 80% en comparación con una moto tradicional.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">
                      Repuestos comunes
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Componentes estándar con precios de mercado comunes:
                    </p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>Pastillas de freno (S/ 15 – S/ 35)</li>
                      <li>Llantas y cámaras universales</li>
                      <li>Amortiguadores y horquillas</li>
                      <li>Focos y direcionales LED</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <h4 className="text-sm font-bold text-emerald-700 mb-2">
                      Piezas que ya no existen
                    </h4>
                    <p className="text-xs text-emerald-600/70 mb-2">
                      Gastos mecánicos críticos que eliminas para siempre:
                    </p>
                    <ul className="text-xs text-emerald-700 space-y-1">
                      <li>Fajas de embrague</li>
                      <li>Bujías y bobinas de encendido</li>
                      <li>Filtros de gasolina y aire</li>
                      <li>Kit de arrastre (Cadena/Corona)</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4">
                    <h4 className="text-sm font-bold text-brand mb-2">
                      El bloque tecnológico
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Sistemas libres de mantenimiento periódicos:
                    </p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>
                        <strong>Motor HUB:</strong> Integrado en la rueda, sin fricción interna
                      </li>
                      <li>
                        <strong>Controlador digital:</strong> Cerebro que gestiona la energía
                      </li>
                      <li>
                        <strong>Batería:</strong> Única inversión mayor a largo plazo
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-900 p-4 text-center text-sm text-gray-300">
                  <span className="font-semibold text-brand">¿Sabías que?</span>{' '}
                  Al no generar explosiones ni calor extremo como un motor a gasolina, los
                  componentes eléctricos no sufren fatiga de material, prolongando su vida
                  útil por años.
                </div>
              </div>
            </AccordionItem>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* SECCIÓN 3: MANTENIMIENTO                            */}
        {/* ═══════════════════════════════════════════════════ */}
        <section id="mantenimiento" className="scroll-mt-32">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-3">
              Cuidado
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Cómo mantener una Moto Eléctrica
            </h2>
          </div>

          <div className="space-y-3">
            {/* 11. ¿Qué tipo de mantenimiento o revisión necesitan? */}
            <AccordionItem
              title="¿Qué tipo de mantenimiento o revisión necesitan las motos eléctricas?"
              icon={<Wrench className="h-4 w-4" />}
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                Las motos eléctricas requieren mantenimiento periódico ligero: revisión
                de pastillas de freno, presión de llantas, limpieza de contactos eléctricos
                y una prueba de manejo. No necesitan cambios de aceite, filtros ni
                afinamientos como las motos de combustión.
              </p>
            </AccordionItem>

            {/* 12. ¿Cuál es la diferencia entre Mantenimiento y Revisión Técnica? */}
            <AccordionItem
              title="¿Cuál es la diferencia entre Mantenimiento y Revisión Técnica?"
              icon={<Settings className="h-4 w-4" />}
              badge="Importante"
            >
              <div className="space-y-5">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Es muy común confundir ambos términos, pero en el mundo de la movilidad
                  eléctrica cumplen roles totalmente distintos. Mientras uno se encarga de
                  analizar mapas de datos y el estado físico de la moto, el otro ejecuta las
                  acciones necesarias para asegurar su máximo rendimiento en las calles de
                  Lima.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Revisión */}
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                        1
                      </span>
                      <h4 className="text-sm font-bold text-gray-900">La Revisión</h4>
                    </div>
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider mb-2">
                      El diagnóstico analítico y visual
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      Un proceso puramente de evaluación. Consiste en examinar el estado
                      actual de tu vehículo para mapear qué funciona a la perfección y qué
                      requiere atención inmediata, sin intervenir o cambiar piezas en el
                      momento.
                    </p>
                    <p className="text-xs font-semibold text-gray-900 mb-1.5">
                      ¿Qué incluye el chequeo?
                    </p>
                    <ul className="text-xs text-gray-700 space-y-1.5">
                      <li>
                        <strong>Lectura de Batería:</strong> Revisión de conexiones de
                        terminales y análisis de cada celda.
                      </li>
                      <li>
                        <strong>Inspección de desgaste:</strong> Evaluación física de la vida
                        útil de las pastillas de freno y neumáticos.
                      </li>
                      <li>
                        <strong>Historial del controlador:</strong> Escaneo del cerebro
                        digital en busca de alertas o códigos de error latentes.
                      </li>
                      <li>
                        <strong>Verificación estructural:</strong> Control de cableado y
                        conexiones propensas a aflojarse por las vibraciones de la ruta.
                      </li>
                    </ul>
                    <div className="mt-3 rounded-xl bg-blue-100/50 p-3">
                      <p className="text-xs font-bold text-blue-700">El Resultado:</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Te entregamos un diagnóstico detallado con las prioridades de tu moto
                        (ej. "Batería en óptimo estado al 92%, pero pastillas de freno al 15%
                        de vida útil").
                      </p>
                    </div>
                  </div>

                  {/* Mantenimiento */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                        2
                      </span>
                      <h4 className="text-sm font-bold text-gray-900">El Mantenimiento</h4>
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-2">
                      La acción operativa y preventiva
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      El proceso de corrección y puesta a punto. Aquí es donde el equipo
                      técnico especializado interviene, limpia, ajusta o reemplaza
                      componentes específicos para extender la vida útil de la moto.
                    </p>
                    <p className="text-xs font-semibold text-gray-900 mb-1.5">
                      ¿Qué acciones se ejecutan?
                    </p>
                    <ul className="text-xs text-gray-700 space-y-1.5">
                      <li>
                        <strong>Soporte Mecánico:</strong> Cambio de pastillas de freno,
                        purgado de líquido hidráulico, calibración de suspensión y ajuste de
                        neumáticos.
                      </li>
                      <li>
                        <strong>Protección Eléctrica:</strong> Limpieza profunda de contactos
                        con sprays dieléctricos especiales para evitar sulfataciones por
                        humedad o lluvia.
                      </li>
                      <li>
                        <strong>Prueba de Operativa:</strong> Prueba de manejo en ruta real
                        realizada por el técnico para validar el correcto desempeño y asegurar
                        que todo marche excelente.
                      </li>
                    </ul>
                    <div className="mt-3 rounded-xl bg-emerald-100/50 p-3">
                      <p className="text-xs font-bold text-emerald-700">El Resultado:</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Tu moto regresa a las pistas totalmente optimizada, con los
                        componentes de desgaste renovados y lista para rodar con seguridad.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-900 p-4 text-sm text-gray-300">
                  <span className="font-semibold text-brand">En resumen:</span> La revisión
                  busca los problemas (es tu examen médico), mientras que el mantenimiento
                  los previene o los soluciona (es el tratamiento). Por seguridad y
                  transparencia, todos nuestros paquetes de mantenimiento en{' '}
                  <strong className="text-white">GreenLine</strong> ya incluyen la revisión
                  y el diagnóstico previo en el precio final del servicio.
                </div>
              </div>
            </AccordionItem>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* SECCIÓN 4: GARANTÍA Y SOPORTE                       */}
        {/* ═══════════════════════════════════════════════════ */}
        <section id="garantia" className="scroll-mt-32">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-3">
              Post-Venta
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Servicio Post Venta de GreenLine
            </h2>
          </div>

          <div className="space-y-3">
            {/* 13. ¿A quién debo acudir? */}
            <AccordionItem
              title="¿A quién debo acudir en caso de requerir alguna asistencia técnica con mi moto eléctrica?"
              icon={<Shield className="h-4 w-4" />}
              badge="Talleres"
            >
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Calidad, Confianza y Garantía
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Para mantener el rendimiento óptimo de tu vehículo y asegurar que
                    conserve los altos estándares de fábrica, debes acudir exclusivamente a
                    la red de talleres autorizados de <strong>GreenLine</strong>. Contamos con
                    la infraestructura especializada para el diagnóstico y reparación precisa
                    de sistemas de movilidad eléctrica.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TarjetaConsejo
                    variante="verde"
                    titulo="Repuestos 100% Originales"
                    texto="Nuestras sedes están completamente equipadas con el stock necesario de componentes legítimos directamente de fábrica, asegurando una compatibilidad perfecta y una larga durabilidad."
                    icono="🔧"
                  />
                  <TarjetaConsejo
                    variante="azul"
                    titulo="Expansión y Cobertura"
                    texto="Contamos con centros de soporte técnico estratégico en varios distritos en Lima y futuramente apertura de nuevos locales oficiales a nivel nacional."
                    icono="📍"
                  />
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold text-amber-700 mb-1">
                    Recomendación estricta de seguridad:
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Aunque te olvidarás por completo de los talleres mecánicos tradicionales,
                    sugerimos realizar una revisión cada 3 meses para mantener un desempeño
                    óptimo en tus rutas diarias. Principalmente validar la presión de llanta y
                    pastillas de freno por seguridad.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
                  <p className="text-sm text-gray-700 mb-3">
                    Centros de servicio técnico autorizados en Lima. Puedes agendar tus
                    revisiones periódicas o consultas técnicas directamente en cualquiera de
                    nuestras sedes:
                  </p>
                  <a
                    href="https://glperu.com/contactanos/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contactar
                  </a>
                </div>
              </div>
            </AccordionItem>

            {/* 14. ¿Cuál es la garantía de GreenLine? */}
            <AccordionItem
              title="¿Cuál es la garantía de GreenLine?"
              icon={<Shield className="h-4 w-4" />}
              badge="Garantía"
            >
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Garantía Verdadera: Cobertura transparente y repuestos asegurados
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Nuestro principal objetivo es brindarte una satisfacción total en tu
                    compra y darte la máxima tranquilidad en cada ruta. Por ello, ofrecemos
                    una Garantía Verdadera ante cualquier defecto de calidad atribuido a
                    materiales o daños de fábrica directos, respaldados bajo las condiciones
                    detalladas en tu{' '}
                    <a
                      href="https://glperu.com/manuales-de-uso/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline hover:text-brand-dark"
                    >
                      Certificado de Garantía oficial
                    </a>
                    .
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TarjetaConsejo
                    variante="verde"
                    titulo="Soporte Técnico y Repuestos Oficiales"
                    texto="Contamos con un almacén propio de repuestos legítimos y un equipo de técnicos especializados listos para evaluar y atender las reparaciones o sustituciones que correspondan según los términos de tu cobertura oficial."
                    icono="🛠️"
                  />
                  <TarjetaConsejo
                    variante="neutro"
                    titulo="Accesorios Fuera de Garantía"
                    texto="Si sufres algún incidente imprevisto fuera de los términos de fábrica, ponemos a tu completa disposición la venta directa de todo tipo de accesorios y repuestos originales para que tu moto nunca deje de rodar."
                    icono="🛒"
                  />
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-bold text-red-700 mb-2">
                    ¿Qué situaciones no cubre la garantía oficial?
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Para mantener la transparencia con el usuario, la cobertura de fábrica no
                    aplica en casos derivados de un uso inadecuado o accidentes externos:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                      Daños estructurales, averías mecánicas o colisiones causadas directamente por el usuario.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                      Filtración o derrame de líquidos en componentes de la parte electrónica de la moto.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                      Sobrecarga excesiva de la batería o uso de cargadores no autorizados por la empresa.
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">
                    Respaldo a nivel nacional
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Si te encuentras en provincia, disponemos de una red de distribuidores
                    autorizados altamente entrenados para atender el servicio técnico
                    requerido, con el soporte y envío de repuestos directo desde la central
                    GreenLine en Lima.
                  </p>
                </div>
              </div>
            </AccordionItem>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-brand to-brand-dark p-8 text-center text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            ¿Tienes más dudas?
          </h3>
          <p className="text-sm text-white/80 mb-5">
            Nuestro equipo está listo para responder cualquier pregunta que tengas sobre
            nuestros vehículos eléctricos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-gray-100"
            >
              <MessageCircle className="h-4 w-4" />
              Contáctanos
            </a>
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
