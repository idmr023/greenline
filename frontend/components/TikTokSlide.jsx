import { Radio, ExternalLink, TikTok } from '../lib/icons';
import { SOCIAL } from '../lib/config';

/**
 * Slide del carrousel del home dedicado a los en vivos de TikTok.
 * No indica "estamos en vivo ahora" (eso lo hace LiveIndicator flotante);
 * solo invita a conectarse todas las tardes a la cuenta oficial.
 * Paleta inspirada en TikTok: negro con acentos cyan y magenta.
 */
export default function TikTokSlide() {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-gradient-to-br from-[#101013] via-[#1d1d22] to-[#2a0a1f]">
      {/* Glow cyan */}
      <div
        aria-hidden="true"
        className="absolute -left-1/4 -top-1/4 h-[70%] w-[70%] rounded-full bg-[#25f4ee]/15 blur-3xl"
      />
      {/* Glow magenta */}
      <div
        aria-hidden="true"
        className="absolute -bottom-1/4 -right-1/4 h-[70%] w-[70%] rounded-full bg-[#fe2c55]/20 blur-3xl"
      />

      {/* Logo TikTok gigante de fondo */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pr-[8%] select-none"
        style={{ fontSize: 'min(30vw, 34vh)' }}
      >
        <TikTok className="text-white/5" style={{ width: '1em', height: '1em' }} />
      </span>

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14 lg:px-24">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#fe2c55] px-4 py-1.5 text-sm font-black uppercase tracking-wider text-white shadow-lg">
          <Radio className="h-4 w-4" />
          En vivos todas las tardes
        </span>

        <h2 className="max-w-2xl text-[clamp(1.75rem,4vw,3.25rem)] font-black leading-tight text-white">
          Conéctate a nuestros en vivos
        </h2>

        <p className="mt-4 max-w-xl text-[clamp(0.9rem,1.4vw,1.1rem)] font-medium text-white/90">
          Síguenos en nuestra cuenta oficial{' '}
          <span className="font-black text-[#25f4ee]">@greenline_peru</span> y mira lo último en
          movilidad eléctrica, promociones y mucho más.
        </p>

        <a
          href={SOCIAL.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#25f4ee] px-7 py-3 font-bold text-black-contrast transition-all hover:scale-105 hover:bg-[#4ff9f3]"
        >
          <TikTok className="h-5 w-5" />
          Ver nuestro TikTok
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}