import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import SEOHead, { organizationSchema, breadcrumbSchema } from '../components/SEOHead';
import { contactAPI } from '../lib/api';
import { CONTACT } from '../lib/config';

const EMPTY_FORM = { nombre: '', email: '', asunto: '', mensaje: '', empresa: '' };

export default function Contactanos() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim() || !form.email.trim() || !form.asunto.trim() || !form.mensaje.trim()) {
      setError('Todos los campos son obligatorios.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setError('');

    try {
      await contactAPI.send({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        asunto: form.asunto.trim(),
        mensaje: form.mensaje.trim(),
        empresa: form.empresa,
      });
      setForm(EMPTY_FORM);
      setStatus('success');
    } catch (err) {
      setError(err.error || 'No se pudo enviar el mensaje. Intenta más tarde.');
      setStatus('error');
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm';

  return (
    <div>
      <SEOHead
        title="Contacto"
        description={`Contáctanos en Green Line. Te ayudamos a elegir tu vehículo de movilidad eléctrica. Teléfono ${CONTACT.phoneDisplay} - ${CONTACT.address}.`}
        url="/contacto"
        keywords={['contacto Green Line', 'atención al cliente', 'scooters eléctricos Lima']}
        jsonLd={[organizationSchema(), breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Contacto', url: '/contacto' },
        ])]}
      />
      <PageBanner
        title="Contáctanos"
        subtitle="Estamos aquí para ayudarte a encontrar tu greenline ideal"
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

            {status === 'success' ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-1">¡Mensaje enviado!</h3>
                <p className="text-sm text-green-700">
                  Gracias por escribirnos. Te responderemos a la brevedad.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-sm font-semibold text-green-700 hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={(e) => setField('nombre', e.target.value)}
                    className={inputClass}
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
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    className={inputClass}
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
                    value={form.asunto}
                    onChange={(e) => setField('asunto', e.target.value)}
                    className={inputClass}
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
                    value={form.mensaje}
                    onChange={(e) => setField('mensaje', e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Honeypot (oculto para humanos) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    id="empresa"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.empresa}
                    onChange={(e) => setField('empresa', e.target.value)}
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar mensaje'
                  )}
                </button>
              </form>
            )}
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
                  <p className="text-gray-600 text-sm">{CONTACT.phoneDisplay}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Correo</p>
                  <p className="text-gray-600 text-sm">{CONTACT.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Sede principal</p>
                  <p className="text-gray-600 text-sm">{CONTACT.address}</p>
                </div>
              </div>

              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">WhatsApp</p>
                    <p className="text-gray-600 text-sm">{CONTACT.phoneDisplay}</p>
                  </div>
                </div>
              </a>
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