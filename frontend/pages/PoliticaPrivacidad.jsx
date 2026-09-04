import { CONTACT } from '../lib/config';
import PageBanner from '../components/PageBanner';
import SEOHead, { breadcrumbSchema } from '../components/SEOHead';

export default function PoliticaPrivacidad() {
  return (
    <div>
      <SEOHead
        title="Política de Privacidad"
        description="Conoce cómo Green Line protege tus datos personales y su política de privacidad."
        url="/politica-privacidad"
        keywords={['política de privacidad', 'datos personales', 'Green Line']}
        jsonLd={[breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Política de Privacidad', url: '/politica-privacidad' },
        ])]}
      />
      <PageBanner
        title="Política de Privacidad"
        subtitle="Conoce cómo protegemos tus datos personales"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-500 mb-8">
            Última actualización: 26 de agosto de 2026
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Información que recopilamos</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              En Green Line SAC recopilamos información que usted nos proporciona directamente al:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Crear una cuenta en nuestra plataforma</li>
              <li>Realizar una compra o solicitud de presupuesto</li>
              <li>Comunicarse con nuestro equipo de soporte</li>
              <li>Participar en promociones o encuestas</li>
              <li>Visitar nuestro sitio web (datos de navegación mediante cookies)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Los datos personales que podemos recopilar incluyen: nombre completo, número de documento de identidad, correo electrónico, número telefónico, dirección, datos de ubicación y preferencias de producto.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Uso de la información</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Utilizamos su información personal para:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Gestionar pedidos, entregas y servicios post-venta</li>
              <li>Enviar comunicaciones sobre su cuenta, pedidos o servicios</li>
              <li>Procesar pagos y gestionar garantías</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Enviar información sobre promociones, eventos y novedades (con su consentimiento)</li>
              <li>Cumplir con obligaciones legales y fiscales</li>
              <li>Prevenir fraudes y proteger la seguridad de nuestra plataforma</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Protección de datos</h2>
            <p className="text-gray-600 leading-relaxed">
              Implementamos medidas de seguridad técnica, administrativa y física para proteger sus datos personales contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos conexiones cifradas (SSL/TLS) y almacenamiento seguro en servidores protegidos. Nuestro cumplimiento se rige conforme a la Ley N° 29733 - Ley de Protección de Datos Personales del Perú y su reglamento.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Compartición de datos</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              No vendemos ni compartimos sus datos personales con terceros, excepto en los siguientes casos:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Proveedores de servicios de entrega y logística (para procesar envíos)</li>
              <li>Proveedores de servicios de pago (para procesar transacciones)</li>
              <li>Autoridades competentes cuando sea requerido por ley</li>
              <li>Con su consentimiento expreso previo</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Puede configurar su navegador para rechazar cookies, aunque esto podría afectar la funcionalidad del sitio.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Sus derechos</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Conforme a la legislación peruana, usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Acceder a sus datos personales</li>
              <li>Solicitar la rectificación de datos inexactos</li>
              <li>Solicitar la eliminación de sus datos personales</li>
              <li>Oponerse al procesamiento de sus datos</li>
              <li>Solicitar la portabilidad de sus datos</li>
              <li>Revocar su consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Retención de datos</h2>
            <p className="text-gray-600 leading-relaxed">
              Conservamos sus datos personales solo durante el tiempo necesario para los fines para los que fueron recopilados, o según lo requiera la ley. Los datos de transacciones comerciales se conservan por un período mínimo de 10 años conforme a la normativa tributaria peruana.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Menores de edad</h2>
            <p className="text-gray-600 leading-relaxed">
              Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente datos personales de menores de edad. Si usted es padre o tutor y cree que su hijo nos ha proporcionado datos personales, contáctenos para que podamos eliminar dicha información.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Cambios en esta política</h2>
            <p className="text-gray-600 leading-relaxed">
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Los cambios serán publicados en esta página con la fecha de última actualización. Le recomendamos revisar periódicamente esta política.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Contacto</h2>
            <p className="text-gray-600 leading-relaxed">
              Si tiene preguntas sobre esta política de privacidad o sobre el tratamiento de sus datos personales, puede contactarnos a través de:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700"><strong>Green Line SAC</strong></p>
              <p className="text-gray-600">Correo electrónico: privacidad@greenlineperu.com</p>
              <p className="text-gray-600">Teléfono: {CONTACT.phoneDisplay}</p>
              <p className="text-gray-600">Dirección: Lima, Perú</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
