import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import PageBanner from '../components/PageBanner';

export default function Contactanos() {
  return (
    <div>
      <PageBanner
        title="Contáctanos"
        subtitle="Estamos aquí para ayudarte"
        bgClass="bg-gradient-to-br from-brand to-brand-dark"
      />

      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Envíanos un mensaje
            </h2>
            <p className="text-gray-600 mb-6">
              Completa el formulario y te responderemos lo antes posible.
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Asunto
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="¿Cómo podemos ayudarte?"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Información de contacto
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Teléfono</p>
                  <p className="text-gray-600 text-sm">(01) 555 1234</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Correo</p>
                  <p className="text-gray-600 text-sm">contacto@greenline.com.pe</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Sede principal</p>
                  <p className="text-gray-600 text-sm">Av. La Marina 2890, San Martín de Porres, Lima</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">WhatsApp</p>
                  <p className="text-gray-600 text-sm">+51 999 888 777</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/tiendas"
                className="inline-flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Ver todas nuestras tiendas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
