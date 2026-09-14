import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function BBVACard({ isBanner }) {
  // Retornamos directamente la evaluación del ternario
  return isBanner ? (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#072146] via-[#14549c] to-[#072146] text-white text-center py-3 px-4 shadow-md flex items-center justify-center gap-3 sm:gap-4 border-b border-[#072146]">
      <FontAwesomeIcon icon={faCreditCard} className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300 animate-pulse drop-shadow-md" />
      
      <span className="text-sm sm:text-base font-medium tracking-wide">
        Paga en{' '}
        <strong className="font-extrabold text-blue-950 text-base sm:text-lg drop-shadow-md uppercase tracking-wider mx-1">
          6 meses sin intereses
        </strong>{' '}
        con tarjetas BBVA
      </span>
      
      {/* Brillo decorativo de fondo */}
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  ) : (
    <div className="flex items-center gap-3 rounded-xl border border-[#004481]/15 bg-[#004481]/5 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#004481]">
        <span className="text-xs font-bold text-white">BBVA</span>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          Compra con tarjetas BBVA
        </p>
        <p className="text-xs text-gray-600">
          Accede a descuentos y beneficios exclusivos.
        </p>
      </div>
    </div>
  );
}