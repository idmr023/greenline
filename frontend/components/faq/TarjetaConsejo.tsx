import type { ReactNode } from 'react';

interface TarjetaConsejoProps {
  titulo: ReactNode;
  texto: ReactNode;
  variante?: 'verde' | 'rojo' | 'azul' | 'neutro';
  icono?: ReactNode;
}

const VARIANTE_STYLES = {
  verde: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  rojo: 'bg-red-50 border-red-200 text-red-800',
  azul: 'bg-blue-50 border-blue-200 text-blue-800',
  neutro: 'bg-gray-50 border-gray-200 text-gray-800',
} as const;

export default function TarjetaConsejo({
  titulo,
  texto,
  variante = 'neutro',
  icono,
}: TarjetaConsejoProps) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-colors hover:shadow-sm ${VARIANTE_STYLES[variante]}`}
    >
      <div className="flex items-start gap-3">
        {icono && (
          <span className="mt-0.5 shrink-0 text-lg">{icono}</span>
        )}
        <div className="min-w-0">
          <h5 className="text-sm font-bold mb-1">{titulo}</h5>
          <div className="text-sm leading-relaxed opacity-80">{texto}</div>
        </div>
      </div>
    </div>
  );
}
