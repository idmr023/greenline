import { useState } from 'react';
import '@google/model-viewer';
import { Info } from 'lucide-react';
import Viewer360 from './Viewer360';
import { estimateAutonomia } from '../lib/utils';

export default function ProductViewer({ producto }) {
  const [activeTip, setActiveTip] = useState(null);

  // Si el producto no tiene GLB real, caemos al drag-to-rotate ya construido
  if (!producto?.modelo3d?.glb) {
    return <Viewer360 producto={producto} />;
  }

  const hotspots = [
    { top: '35%', left: '25%', label: 'Motor', value: producto.motor },
    { top: '55%', left: '65%', label: 'Batería', value: producto.bateria },
    {
      top: '25%',
      left: '45%',
      label: 'Autonomía estimada',
      value: `${estimateAutonomia(producto.motor)} km`,
    },
  ];

  return (
    <div className="relative h-64 lg:h-auto min-h-[260px] rounded-xl overflow-hidden bg-gray-900">
      <model-viewer
        src={producto.modelo3d.glb}
        alt={producto.nombre}
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full"
      />

      {hotspots.map((spot) => (
        <div
          key={spot.label}
          className="absolute"
          style={{ top: spot.top, left: spot.left }}
          onMouseEnter={() => setActiveTip(spot.label)}
          onMouseLeave={() => setActiveTip(null)}
          onClick={() =>
            setActiveTip(activeTip === spot.label ? null : spot.label)
          }
        >
          <span className="relative flex h-4 w-4 cursor-pointer">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand border-2 border-white" />
          </span>
          <div
            className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-44 bg-white text-gray-900 text-xs rounded-lg shadow-lg p-2 z-20 transition-opacity ${
              activeTip === spot.label ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            <p className="font-bold flex items-center gap-1">
              <Info className="w-3 h-3 text-brand" /> {spot.label}
            </p>
            <p className="text-gray-600">{spot.value}</p>
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
        Modelo 3D real — arrastra para rotar
      </div>
    </div>
  );
}
