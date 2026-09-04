import { Gift, MessageSquareHeart } from 'lucide-react';
import { aniversarioNumero } from '../lib/aniversario';

/**
 * Banner de aniversario 100% React (sin imagen).
 *
 * Slide adicional del carrousel del home, coherente con la página
 * /aniversario: usa la paleta de la marca (verde Green Line + amarillo
 * eléctrico) y traslada parte de su mensaje — el aniversario, el 50%
 * del catálogo en setiembre y la idea de "tu opinión es premiada"
 * (testimonios con recompensas). Composición sobria, sin elementos
 * disruptivos ni duplicar el texto superpuesto del carrousel.
 */
export default function AnniversaryBanner() {
  const numero = aniversarioNumero();

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-gradient-to-br from-[#0b3d0b] via-[#007a00] to-[#1fa01f]">
      {/* Agua marca gigante (sombra) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pr-[8%] font-black leading-none select-none"
        style={{
          fontSize: 'min(42vw, 42vh)',
          color: 'rgba(255,255,255,0.07)',
        }}
      >
        {numero}
      </span>

      {/* Resplandor sutil amarillo eléctrico */}
      <div
        aria-hidden="true"
        className="absolute -right-1/4 -top-1/4 h-[65%] w-[65%] rounded-full bg-yellow-electric/10 blur-3xl"
      />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14 lg:px-24">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-yellow-electric px-4 py-1.5 text-sm font-black uppercase tracking-wider text-black-contrast shadow-lg">
          <Gift className="h-4 w-4" />
          Mes de locura · {numero}° aniversario
        </span>

        <h2 className="max-w-2xl text-[clamp(1.75rem,4vw,3.25rem)] font-black leading-tight text-white">
          ¡{numero} años moviendo al Perú!
        </h2>

        <p className="mt-4 max-w-xl text-[clamp(0.9rem,1.4vw,1.1rem)] font-medium text-white/90">
          Todo setiembre:{' '}
          <span className="font-black text-yellow-electric">
            50% de nuestro catálogo
          </span>{' '}
          en descuento, con promociones y activaciones.
        </p>

        <p className="mt-6 flex items-center gap-2 text-[clamp(0.85rem,1.2vw,1rem)] font-semibold text-white/90">
          <MessageSquareHeart className="h-5 w-5 shrink-0 text-yellow-electric" />
          Tu opinión es premiada: deja tu testimonio y recibe recompensas exclusivas.
        </p>
      </div>
    </div>
  );
}
