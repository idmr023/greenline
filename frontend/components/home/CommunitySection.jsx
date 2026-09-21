import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { SOCIAL } from '../../lib/config';

export default function CommunitySection() {
  return (
    <section id="comunidad" className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full bg-brand px-3 py-1 text-sm font-semibold text-white">
            Comunidad
          </span>
          <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            Únete a la comunidad Green Line
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Síguenos en Instagram y escríbenos por WhatsApp para mantenerte al tanto
            de las últimas actualizaciones, promociones y lanzamientos.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          <a
            href={SOCIAL.instagram_comunidad}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-10 text-center transition-all hover:shadow-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <FontAwesomeIcon icon={faInstagram} className="h-7 w-7" />
            </span>
            <span className="text-lg font-semibold text-gray-900">Instagram</span>
            <span className="text-sm text-gray-500">
              Síguenos para ver novedades y comunidad
            </span>
            <span className="mt-1 text-sm font-semibold text-brand">@greenline_peru</span>
          </a>

          <a
            href={SOCIAL.whatsapp_comunidad}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-10 text-center transition-all hover:shadow-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white">
              <FontAwesomeIcon icon={faWhatsapp} className="h-7 w-7" />
            </span>
            <span className="text-lg font-semibold text-gray-900">WhatsApp</span>
            <span className="text-sm text-gray-500">
              Únete para recibir las últimas actualizaciones
            </span>
            <span className="mt-1 text-sm font-semibold text-brand">Escríbenos ahora</span>
          </a>
        </div>
      </div>
    </section>
  );
}