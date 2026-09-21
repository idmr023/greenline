import { Link } from 'react-router-dom';
import { Calendar, MapPin, TicketPercent, Check, ArrowRight } from '../lib/icons';
import { CONTACT } from '../lib/config';
import PageBanner from '../components/PageBanner';
import SEOHead, { breadcrumbSchema } from '../components/SEOHead';

// URL por defecto para el Google Form (se puede cambiar por la URL exacta cuando esté disponible)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdoHJmTM4v8FBXJmmCH9r5gf9AhYmGX4RLEcWe-qv78M59gzA/viewform";

export default function ExpoChina() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Green Line en ExpoChina — Inscríbete y Conócenos"
        description="Acompáñanos en la feria ExpoChina. Inscríbete para conocer nuestras últimas novedades en movilidad eléctrica, pruebas de manejo y descuentos exclusivos."
        url="/expochina"
        keywords={['ExpoChina', 'Expo China Perú', 'movilidad eléctrica', 'vehículos eléctricos', 'Green Line feria']}
        jsonLd={[breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'ExpoChina', url: '/expochina' },
        ])]}
      />

      <PageBanner
        title="Green Line en ExpoChina"
        subtitle="Próximamente: Conoce el futuro de la movilidad eléctrica en la feria ExpoChina"
        bgClass="bg-gradient-to-br from-brand to-brand-dark"
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-brand text-white rounded-full text-sm font-semibold mb-4">
            Evento Especial
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            ¡Nos vemos en ExpoChina!
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg">
            Green Line estará presente en la feria <strong>ExpoChina</strong>, trayendo los mejores modelos de scooters, motos, trimotos y cargueros eléctricos con la más alta tecnología.
            Regístrate previamente para asegurar tu lugar, recibir atención personalizada y acceder a beneficios exclusivos.
          </p>
        </div>

        {/* Detalles del Evento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-5">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Fecha y Hora</h3>
            <p className="text-gray-600 text-sm">
              Próximamente en 2026<br />
              <span className="text-xs text-gray-400">(Fechas exactas a confirmar)</span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-5">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Ubicación</h3>
            <p className="text-gray-600 text-sm">
              Centro de Exposiciones - Lima, Perú<br />
              <span className="text-xs text-gray-400">Stand Oficial Green Line</span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-5">
              <TicketPercent className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Beneficios Exclusivos</h3>
            <p className="text-gray-600 text-sm">
              Descuentos de feria, regalos y prueba de manejo garantizada para inscritos.
            </p>
          </div>
        </div>

        {/* ¿Qué encontrarás? */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-100 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ¿Qué encontrarás en nuestro stand?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Exhibición de nuevos modelos 2026', desc: 'Conoce antes que nadie nuestras últimas novedades en movilidad eléctrica urbana y de carga.' },
              { title: 'Test Drive en vivo', desc: 'Siente la potencia y suavidad de nuestras motos y scooters eléctricos en nuestro circuito de prueba.' },
              { title: 'Asesoría personalizada', desc: 'Nuestros especialistas te guiarán para elegir el vehículo perfecto según tus necesidades de movilidad o negocio.' },
              { title: 'Descuentos y bonos especiales', desc: 'Precios exclusivos de feria únicamente para clientes que se registren previamente.' },
              { title: 'Planes de financiamiento', desc: 'Opciones de crédito directo y convenios bancarios listos para ayudarte a estrenar.' },
              { title: 'Sorteos y sorpresas', desc: 'Participa por accesorios, cascos y mantenimientos gratuitos durante los días de feria.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Formulario de Google */}
        <div id="registro" className="bg-gradient-to-br from-brand to-brand-dark rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Inscripción Previa
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Pre-inscríbete para la ExpoChina
            </h3>
            <p className="text-white/80 text-sm sm:text-base">
              Completa el formulario oficial para recibir tu pase preferencial, coordinar tu prueba de manejo y asegurar tus promociones de feria.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            {/* Embed / Botón Google Form */}
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-brand font-bold text-lg rounded-xl shadow-lg hover:bg-gray-100 hover:scale-105 transition-all"
            >
              Completar Formulario de Inscripción
              <ArrowRight className="w-5 h-5" />
            </a>

            <p className="text-xs text-white/70 text-center max-w-md">
              Serás redirigido al formulario seguro de Google Forms. También puedes escribirnos directamente a WhatsApp para registrarte.
            </p>

            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium underline"
            >
              ¿Prefieres inscribirte por WhatsApp? Haz clic aquí
            </a>
          </div>
        </div>

        {/* Volver al inicio */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand font-medium hover:underline"
          >
            ← Volver al inicio
          </Link>
        </div>
      </section>
    </div>
  );
}