import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import ProductImage from './ProductImage';
import { estimateAutonomia } from '../lib/utils';

export default function Viewer360({ producto }) {
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [activeTip, setActiveTip] = useState(null);

  const containerRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0, rotation: 0, tilt: 0 });

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    setShowHint(false);
    dragStart.current = { x: clientX, y: clientY, rotation, tilt };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    const newRotation = dragStart.current.rotation + dx * 0.4;
    const newTilt = Math.max(-15, Math.min(15, dragStart.current.tilt - dy * 0.2));
    setRotation(newRotation);
    setTilt(newTilt);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseDown = (e) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();
    const onMouseLeave = () => handleEnd();
    const onTouchStart = (e) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handleEnd();

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, rotation, tilt]);

  const hotspots = producto
    ? [
        { top: '35%', left: '25%', label: 'Motor', value: producto.motor },
        { top: '55%', left: '65%', label: 'Batería', value: producto.bateria },
        {
          top: '25%',
          left: '45%',
          label: 'Autonomía estimada',
          value: `${estimateAutonomia(producto.motor)} km`,
        },
      ]
    : [];

  const placeholderLabel = producto ? producto.nombre : 'Vista 360 Green Line';

  return (
    <div
      ref={containerRef}
      className="relative h-64 lg:h-auto min-h-[260px] rounded-xl overflow-hidden bg-gray-900 cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative w-full h-full ${
          isDragging ? '' : 'transition-transform duration-500 ease-out'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg) rotateX(${tilt}deg)`,
        }}
      >
        <ProductImage
          nombre={placeholderLabel}
          width={800}
          height={500}
          className="absolute inset-0 opacity-70"
          imgClassName="pointer-events-none"
        />

        {hotspots.map((spot) => (
          <div
            key={spot.label}
            className="absolute"
            style={{
              top: spot.top,
              left: spot.left,
              transform: 'translateZ(60px)',
            }}
            onMouseEnter={() => setActiveTip(spot.label)}
            onMouseLeave={() => setActiveTip(null)}
            onClick={() => setActiveTip(activeTip === spot.label ? null : spot.label)}
          >
            <span className="relative flex h-4 w-4">
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
      </div>

      {showHint && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur flex items-center gap-2">
            <span className="text-lg">⟲</span> Arrastra para girar
          </div>
        </div>
      )}
    </div>
  );
}
