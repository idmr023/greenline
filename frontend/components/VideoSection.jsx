import { Play } from '../lib/icons';
import { useState } from 'react';
import YouTubeEmbed from './YouTubeEmbed';
import { versionarImagen } from '../lib/images';

const VIDEO_PREVIEW = versionarImagen('/assets/imagenes/otros/vistaprevia_videoseccion.png');

export default function VideoSection() {
  const [showVideo, setShowVideo] = useState(false);
  const videoId = '1FCT0rusksA?si=Nzjxuyz72ZfMO5Af'; // Video institucional / demostrativo

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-greenline text-white-legible ring-2 ring-yellow-electric rounded-full text-sm font-bold mb-4 shadow-sm">
            🎬 ¡MIRA EL PODER DE GREEN LINE EN ACCIÓN!
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            La Revolución de la Movilidad Eléctrica en el Perú
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mx-auto">
            Descubre por qué miles de peruanos ya ahorran tiempo, dinero y cuidan el planeta con nuestros vehículos eléctricos.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-white">
          {!showVideo ? (
            <div 
              onClick={() => setShowVideo(true)}
              className="relative aspect-video w-full cursor-pointer group bg-gray-900 flex items-center justify-center overflow-hidden"
            >
              <img
                src={VIDEO_PREVIEW}
                alt="Green Line en acción"
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-electric text-black-contrast shadow-2xl transition transform group-hover:scale-110 ring-4 ring-white/30">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </span>
                <span className="text-white font-extrabold text-lg sm:text-xl drop-shadow-md">
                  Reproducir Video Oficial
                </span>
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full">
              <YouTubeEmbed videoId={videoId} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}