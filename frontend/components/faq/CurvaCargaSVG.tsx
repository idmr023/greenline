export default function CurvaCargaSVG() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-900">Curva de Carga</h4>
        <span className="text-[11px] text-gray-500">
          Proceso en 4 etapas · ~8 horas totales
        </span>
      </div>

      <div className="flex items-end gap-2 mb-2">
        <span className="text-[10px] text-gray-400 font-medium">Capacidad (%)</span>
        <span className="text-[10px] text-gray-400 font-medium ml-auto">
          Tiempo de carga →
        </span>
      </div>

      <svg
        aria-label="Curva de carga de batería de 0% a 100% en 8 horas"
        viewBox="0 0 560 320"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="mX"
            markerHeight="7"
            markerWidth="7"
            orient="auto"
            refX="3.5"
            refY="3.5"
          >
            <path d="M1,1 L7,3.5 L1,6" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
          </marker>
          <marker
            id="mY"
            markerHeight="7"
            markerWidth="7"
            orient="auto"
            refX="3.5"
            refY="3.5"
          >
            <path d="M1,1 L7,3.5 L1,6" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
          </marker>
        </defs>

        {/* Cuadrícula horizontal */}
        {[280, 226, 64, 25, 10].map((y) => (
          <line key={y} stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="548" y1={y} y2={y} />
        ))}
        {/* Cuadrícula vertical */}
        {[120, 240, 360, 480].map((x) => (
          <line key={x} stroke="#e2e8f0" strokeWidth="0.5" x1={x} x2={x} y1="0" y2="280" />
        ))}

        {/* Ejes principales */}
        <line markerEnd="url(#mX)" stroke="#cbd5e1" strokeWidth="1.5" x1="0" x2="552" y1="280" y2="280" />
        <line markerEnd="url(#mY)" stroke="#cbd5e1" strokeWidth="1.5" x1="0" x2="0" y1="280" y2="-50" />

        {/* Rellenos */}
        <path d="M0,280 L120,226 L240,64 L360,25 L360,280 Z" fill="#e24b4a" fillOpacity="0.07" />
        <path d="M360,25 L480,10 L480,280 L360,280 Z" fill="#009A44" fillOpacity="0.09" />

        {/* Líneas */}
        <polyline
          fill="none"
          points="0,280 120,226 240,64 360,25"
          stroke="#e24b4a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        <polyline
          fill="none"
          points="360,25 480,10"
          stroke="#009A44"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />

        {/* Etiquetas eje Y */}
        {([
          [6, 284, '0%'],
          [6, 230, '20%'],
          [6, 68, '80%'],
          [6, 29, '95%'],
          [6, 14, '100%'],
        ] as [string, string, string][]).map(([x, y, text]) => (
          <text key={text} fill="#94a3b8" fontFamily="sans-serif" fontSize="10" textAnchor="end" x={x} y={y}>
            {text}
          </text>
        ))}

        {/* Etiquetas eje X */}
        {([
          [0, 296, '0h', '#94a3b8', 'normal'],
          [120, 296, '2h', '#e24b4a', '600'],
          [240, 296, '4h', '#e24b4a', '600'],
          [360, 296, '6h', '#e24b4a', '600'],
          [480, 296, '8h', '#009A44', '600'],
        ] as [string, string, string, string, string][]).map(([x, y, text, fill, weight]) => (
          <text
            key={text}
            fill={fill}
            fontFamily="sans-serif"
            fontSize="10"
            fontWeight={weight}
            textAnchor="middle"
            x={x}
            y={y}
          >
            {text}
          </text>
        ))}

        {/* Nombres de fase */}
        {([
          [60, 310, 'Inicio'],
          [180, 310, 'Fase rápida'],
          [300, 310, 'Balanceo'],
          [440, 310, 'Corte automático'],
        ] as [string, string, string][]).map(([x, y, text]) => (
          <text key={text} fill="#64748b" fontFamily="sans-serif" fontSize="9" textAnchor="middle" x={x} y={y}>
            {text}
          </text>
        ))}

        {/* ══ PUNTO 1: 20% / 2h ══ */}
        <g aria-label="Etapa 1: 0% a 20% en 2 horas">
          <line opacity="0.4" stroke="#e24b4a" strokeDasharray="5,3" strokeWidth="0.8" x1="0" x2="120" y1="226" y2="226" />
          <line opacity="0.4" stroke="#e24b4a" strokeDasharray="5,3" strokeWidth="0.8" x1="120" x2="120" y1="226" y2="280" />
          <circle cx="120" cy="226" fill="#e24b4a" r="5" stroke="#fff" strokeWidth="2" />
          <g transform="translate(120,226)">
            <rect fill="#e24b4a" height="48" rx="8" width="110" x="-55" y="-66" />
            <polygon fill="#e24b4a" points="-6,-18 6,-18 0,-10" />
            <text fill="#fff" fontFamily="sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="-48">
              0% → 20%
            </text>
            <text fill="rgba(255,255,255,0.88)" fontFamily="sans-serif" fontSize="9" textAnchor="middle" x="0" y="-33">
              Carga inicial · 0h–2h
            </text>
          </g>
        </g>

        {/* ══ PUNTO 2: 80% / 4h ══ */}
        <g aria-label="Etapa 2: 20% a 80% en 4 horas">
          <line opacity="0.4" stroke="#e24b4a" strokeDasharray="5,3" strokeWidth="0.8" x1="0" x2="240" y1="64" y2="64" />
          <line opacity="0.4" stroke="#e24b4a" strokeDasharray="5,3" strokeWidth="0.8" x1="240" x2="240" y1="64" y2="280" />
          <circle cx="240" cy="64" fill="#e24b4a" r="5" stroke="#fff" strokeWidth="2" />
          <g transform="translate(240,64)">
            <rect fill="#e24b4a" height="48" rx="8" width="110" x="-55" y="-66" />
            <polygon fill="#e24b4a" points="-6,-18 6,-18 0,-10" />
            <text fill="#fff" fontFamily="sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="-48">
              20% → 80%
            </text>
            <text fill="rgba(255,255,255,0.88)" fontFamily="sans-serif" fontSize="9" textAnchor="middle" x="0" y="-33">
              Zona rápida · 2h–4h
            </text>
          </g>
        </g>

        {/* ══ PUNTO 3: 95% / 6h ══ */}
        <g aria-label="Etapa 3: 80% a 95% en 6 horas">
          <line opacity="0.4" stroke="#e24b4a" strokeDasharray="5,3" strokeWidth="0.8" x1="0" x2="360" y1="25" y2="25" />
          <line opacity="0.4" stroke="#e24b4a" strokeDasharray="5,3" strokeWidth="0.8" x1="360" x2="360" y1="25" y2="280" />
          <circle cx="360" cy="25" fill="#e24b4a" r="5" stroke="#fff" strokeWidth="2" />
          <g transform="translate(360,25)">
            <rect fill="#e24b4a" height="48" rx="8" width="110" x="-55" y="-66" />
            <polygon fill="#e24b4a" points="-6,-18 6,-18 0,-10" />
            <text fill="#fff" fontFamily="sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="-48">
              80% → 95%
            </text>
            <text fill="rgba(255,255,255,0.88)" fontFamily="sans-serif" fontSize="9" textAnchor="middle" x="0" y="-33">
              Balanceo · 4h–6h
            </text>
          </g>
        </g>

        {/* ══ PUNTO 4: 100% / 8h ══ */}
        <g aria-label="Etapa 4: 95% a 100% en 8 horas">
          <line opacity="0.4" stroke="#009A44" strokeDasharray="5,3" strokeWidth="0.8" x1="0" x2="480" y1="10" y2="10" />
          <line opacity="0.4" stroke="#009A44" strokeDasharray="5,3" strokeWidth="0.8" x1="480" x2="480" y1="10" y2="280" />
          <circle cx="480" cy="10" fill="#009A44" r="5" stroke="#fff" strokeWidth="2" />
          <g transform="translate(480,10)">
            <rect fill="#009A44" height="48" rx="8" width="140" x="-70" y="-66" />
            <polygon fill="#009A44" points="-6,-18 6,-18 0,-10" />
            <text fill="#fff" fontFamily="sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="-48">
              95% → 100%
            </text>
            <text fill="rgba(255,255,255,0.88)" fontFamily="sans-serif" fontSize="9" textAnchor="middle" x="0" y="-33">
              Corte automático · 6h–8h
            </text>
          </g>
        </g>
      </svg>

      {/* Tarjetas informativas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        {[
          { rango: '0% – 20%', desc: 'Carga inicial de protección', tiempo: '0h a 2h', color: 'border-red-200 bg-red-50' },
          { rango: '20% – 80%', desc: 'Máximo flujo de energía', tiempo: '2h a 4h', color: 'border-red-200 bg-red-50' },
          { rango: '80% – 95%', desc: 'Carga de goteo y balanceo', tiempo: '4h a 6h', color: 'border-red-200 bg-red-50' },
          { rango: '95% – 100%', desc: 'Optimización y corte automático', tiempo: '6h a 8h', color: 'border-emerald-200 bg-emerald-50' },
        ].map((item) => (
          <div
            key={item.rango}
            className={`rounded-xl border p-3 ${item.color}`}
          >
            <p className="text-xs font-bold text-gray-900">{item.rango}</p>
            <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
              {item.desc}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">{item.tiempo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
