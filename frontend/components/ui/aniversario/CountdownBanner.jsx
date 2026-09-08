import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Gift } from 'lucide-react';
import useCountdown from '../../../hooks/useCountdown';
import { isAniversarioActivo, aniversarioNumero } from '../../../lib/aniversario';
import AnniversaryPromo from './AniversaryPromo';

const UNIDADES = [
  { key: 'dias', label: 'Días' },
  { key: 'horas', label: 'Horas' },
  { key: 'minutos', label: 'Min' },
  { key: 'segundos', label: 'Seg' },
];

export default function CountdownBanner() {
  const numero = aniversarioNumero();
  const target = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), 8, 30, 23, 59, 59); // 30 sep, fin de campaña
  }, []);
  const tiempo = useCountdown(target);

  if (!isAniversarioActivo() || !tiempo) return null;

  return (
    <aside className="bg-yellow-electric text-black-contrast" aria-label="Campaña de aniversario">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-3">
            <span className="hidden sm:flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-greenline text-white">
              <Gift className="w-5 h-5" />
            </span>
            <div>
              <p className="text-base sm:text-lg font-black leading-tight">
                ¡Faltan {tiempo.dias} {tiempo.dias === 1 ? 'día' : 'días'} para que terminen las
                ofertas del {numero}° aniversario!
              </p>
              <p className="text-xs sm:text-sm font-semibold opacity-80">
                50% del catálogo en descuento durante todo setiembre. No dejes pasar tu GreenLine.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden xl:flex items-center gap-1.5 text-sm font-bold mr-1">
              <Clock className="w-4 h-4" />
              Ofertas terminan en
            </span>
            {UNIDADES.map((u) => (
              <div
                key={u.key}
                className="flex flex-col items-center rounded-lg bg-greenline text-white px-3 py-2 min-w-[3.4rem]"
              >
                <span className="text-xl sm:text-2xl font-black tabular-nums leading-none">
                  {String(tiempo[u.key]).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold opacity-80 mt-1">
                  {u.label}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/aniversario"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-greenline text-white font-black text-sm rounded-full shadow-md hover:bg-greenline-dark transition-colors"
          >
            Ver ofertas
          </Link>
        </div>
      </div>

    </aside>
  );
}