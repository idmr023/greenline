import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2, AlertCircle, Gift } from '../lib/icons';
import PageBanner from '../components/PageBanner';
import SEOHead, { breadcrumbSchema } from '../components/SEOHead';
import { marketingAPI } from '../lib/api';

export default function CancelarSuscripcion() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();

    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Ingresa un correo electrónico válido.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setError('');

    try {
      await marketingAPI.unsubscribe(value);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err?.message || 'No se pudo procesar la baja. Intenta de nuevo.');
    }
  };

  return (
    <div>
      <SEOHead
        title="Cancelar suscripción de correos"
        description="Deja de recibir correos de promociones y novedades de Green Line."
        url="/cancelar-suscripcion"
        keywords={['cancelar suscripción', 'unsubscribe', 'Green Line correos']}
        jsonLd={[breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Cancelar suscripción', url: '/cancelar-suscripcion' },
        ])]}
      />
      <PageBanner
        title="Cancelar suscripción"
        subtitle="Deja de recibir promociones y novedades por correo"
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-6">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Gift className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Baja de correos de marketing</h2>
              <p className="text-sm text-gray-600 mt-1">
                Escribe el correo con el que recibes nuestras promociones. Lo quitaremos de la lista
                de envíos de marketing (no afecta pedidos, garantías ni mensajes de tu cuenta).
              </p>
            </div>
          </div>

          {status === 'success' ? (
            <div
              className="rounded-xl border border-brand/30 bg-brand/5 p-5"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-gray-900">Listo, ya no recibirás estos correos</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Hemos actualizado las preferencias de <strong>{email}</strong>. Si cambias de
                    opinión, puedes contactarnos y reactivarlas.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex mt-4 text-sm font-medium text-brand hover:underline"
                  >
                    Volver al inicio
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="email-unsub" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative mb-4">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                <input
                  id="email-unsub"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="tu@correo.com"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  disabled={status === 'sending'}
                />
              </div>

              {status === 'error' && error ? (
                <div
                  className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-60 transition-colors"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Procesando…
                  </>
                ) : (
                  'Cancelar mi suscripción'
                )}
              </button>

              <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                Al continuar, dejarás de recibir campañas de promociones y aniversario. Seguirás
                recibiendo notificaciones esenciales de pedidos y cuenta.{' '}
                <Link to="/politica-privacidad" className="text-brand hover:underline">
                  Ver política de privacidad
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
