import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Minus, Plus, Trash2, Loader2,
  CheckCircle2, Phone, AlertCircle,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { pedidosAPI } from '../lib/api';
import { formatPrice } from '../lib/utils';
import { CONTACT, BRAND } from '../lib/config';
import PageBanner from '../components/PageBanner';

function generarCodigo() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `GL-${stamp}${rand}`;
}

function armarMensajeWhatsApp(codigo, items, total) {
  const detalle = items
    .map(
      (it) =>
        `• ${it.nombre}${it.color ? ` (${it.color})` : ''} x${it.cantidad} — ${formatPrice(it.precio_actual)}`,
    )
    .join('\n');
  return (
    `Hola ${BRAND.name}, quiero confirmar mi pedido ${codigo}:\n\n` +
    `${detalle}\n\n` +
    `Total: ${formatPrice(total)}\n` +
    `¿Me ayudan a coordinar la compra y entrega?`
  );
}

const EMPTY_FORM = {
  nombre: '',
  dni: '',
  telefono: '',
  email: '',
  direccion: '',
};

const inputClass =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm';

export default function Checkout() {
  const { items, removeItem, updateQty, clear, total, count } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const todoValido = useMemo(
    () =>
      items.length > 0 &&
      form.nombre.trim().length >= 2 &&
      form.dni.trim().length >= 7 &&
      form.telefono.trim().length >= 6 &&
      form.direccion.trim().length >= 5,
    [items, form],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending || items.length === 0) return;

    const codigo = generarCodigo();
    setSending(true);
    setError('');

    const cliente = {
      nombre: form.nombre.trim(),
      dni: form.dni.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim() || null,
      direccion: form.direccion.trim(),
    };

    const payload = {
      codigo,
      cliente,
      items: items.map((it) => ({
        slug: it.slug,
        nombre: it.nombre,
        color: it.color,
        cantidad: it.cantidad,
        precio_actual: it.precio_actual,
      })),
      total: Math.round(total * 100) / 100,
    };

    const snapshotItems = [...payload.items];
    const snapshotTotal = payload.total;

    try {
      const { error: insertErr } = await supabase.from('pedidos').insert(payload);
      if (insertErr) throw new Error('supabase');

      try {
        await pedidosAPI.send({
          codigo,
          cliente,
          items: snapshotItems,
          total: snapshotTotal,
        });
      } catch (mailErr) {
        console.error('No se pudo enviar el correo del pedido:', mailErr);
      }

      setSuccess({ codigo, items: snapshotItems, total: snapshotTotal });
      clear();
    } catch (err) {
      setError(
        err.message === 'supabase'
          ? 'No se pudo registrar el pedido. Intenta nuevamente o escríbenos por WhatsApp.'
          : 'No se pudo registrar el pedido. Intenta nuevamente.',
      );
    } finally {
      setSending(false);
    }
  };

  const waUrl = success
    ? `${CONTACT.whatsappUrl}?text=${encodeURIComponent(
        armarMensajeWhatsApp(success.codigo, success.items || [], success.total || 0),
      )}`
    : CONTACT.whatsappUrl;

  if (success) {
    return (
      <div>
        <PageBanner
          title="¡Pedido registrado!"
          subtitle="Gracias por tu compra en GreenLine"
          bgClass="bg-gradient-to-br from-brand to-brand-dark"
        />
        <section className="py-14 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9 text-brand" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tu pedido fue recibido</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
              Tu pedido <span className="font-bold text-gray-900">{success.codigo}</span> fue
              registrado. Nuestro equipo te contactará para coordinar el pago y la entrega.
            </p>
            <div className="mb-6">
              {success.items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-700 truncate">
                    {it.nombre}
                    {it.color ? ` (${it.color})` : ''} × {it.cantidad}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(it.precio_actual * it.cantidad)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm py-2 mt-2">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-brand text-lg">{formatPrice(success.total)}</span>
              </div>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Phone className="w-5 h-5" />
              Confirmar por WhatsApp
            </a>
            <div className="mt-4">
              <Link to="/tienda" className="text-sm text-brand font-semibold hover:underline">
                Seguir comprando
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <PageBanner
          title="Finalizar compra"
          subtitle="Completa tus datos para registrar tu pedido"
          bgClass="bg-gradient-to-br from-brand to-brand-dark"
        />
        <section className="py-14 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
          <Link
            to="/tienda"
            className="inline-block px-5 py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors text-sm"
          >
            Ir a la tienda
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageBanner
        title="Finalizar compra"
        subtitle="Registra tu pedido sin necesidad de crear una cuenta"
        bgClass="bg-gradient-to-br from-brand to-brand-dark"
      />

      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Datos de facturación */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Datos de facturación</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre y apellido"
                  value={form.nombre}
                  onChange={(e) => setField('nombre', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
                  DNI *
                </label>
                <input
                  id="dni"
                  type="text"
                  inputMode="numeric"
                  placeholder="Número de DNI"
                  value={form.dni}
                  onChange={(e) => setField('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  id="telefono"
                  type="tel"
                  placeholder="Ej. 919 445 661"
                  value={form.telefono}
                  onChange={(e) => setField('telefono', e.target.value)}
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
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección de facturación *
                </label>
                <textarea
                  id="direccion"
                  rows={3}
                  placeholder="Calle, número, distrito, ciudad"
                  value={form.direccion}
                  onChange={(e) => setField('direccion', e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sending || !todoValido}
                className={`w-full py-3 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 ${
                  sending || !todoValido
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-brand text-white hover:bg-brand-dark'
                }`}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registrando pedido…
                  </>
                ) : (
                  'Registrar pedido'
                )}
              </button>
              <p className="text-[11px] text-gray-400 text-center">
                Al registrar el pedido, nuestro equipo se contactará contigo para coordinar el
                pago y la entrega. No necesitas crear una cuenta.
              </p>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-brand" />
              Resumen del pedido ({count} ítems)
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="max-h-80 overflow-y-auto px-4 py-2">
                {items.map((it) => (
                  <div
                    key={it.key}
                    className="flex gap-3 py-3 border-b border-gray-100 last:border-0"
                  >
                    {it.imagen ? (
                      <img
                        src={it.imagen}
                        alt={it.nombre}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{it.nombre}</p>
                      {it.color && <p className="text-xs text-gray-500 mt-0.5">Color: {it.color}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateQty(it.key, it.cantidad - 1)}
                            className="p-1.5 text-gray-500 hover:text-brand transition-colors"
                            aria-label="Menos"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-semibold w-7 text-center">
                            {it.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(it.key, it.cantidad + 1)}
                            className="p-1.5 text-gray-500 hover:text-brand transition-colors"
                            aria-label="Más"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">
                            {formatPrice(it.precio_actual * it.cantidad)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(it.key)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Quitar del carrito"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 px-4 py-4 flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Total</span>
                <span className="text-2xl font-bold text-brand">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-4 w-full py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ← Volver
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
