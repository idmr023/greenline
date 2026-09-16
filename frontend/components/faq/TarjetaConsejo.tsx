import type { ReactNode } from 'react';

interface TarjetaConsejoProps {
  titulo: ReactNode;
  texto: ReactNode;
  variante?: 'verde' | 'rojo' | 'azul' | 'neutro';
  icono?: ReactNode;
}

const VARIANTE_STYLES = {
  verde: 'bg-brand/10 border-brand/30 text-brand-dark',
  rojo: 'bg-neutral-900 border-neutral-900 text-white',
  azul: 'bg-neutral-100 border-neutral-300 text-neutral-900',
  neutro: 'bg-white border-neutral-200 text-neutral-800',
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
