import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, X, CheckCircle2, Phone } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { CONTACT, BRAND } from '../lib/config';

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

export default function CartDrawer() {
  const { items, removeItem, updateQty, clear, total, count, isOpen, closeCart } = useCart();

  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); // { codigo }
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending || items.length === 0) return;

    const codigo = generarCodigo();
    setSending(true);
    setError('');

    const payload = {
      codigo,
      cliente: {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim() || null,
      },
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

    const { error: err } = await supabase.from('pedidos').insert(payload);
    setSending(false);

    if (err) {
      setError('No se pudo registrar el pedido. Intenta nuevamente o escríbenos por WhatsApp.');
      return;
    }

    setSuccess({ codigo, items: snapshotItems, total: snapshotTotal });
    clear();
  };

  const waUrl = success
    ? `${CONTACT.whatsappUrl}?text=${encodeURIComponent(
        armarMensajeWhatsApp(success.codigo, success.items || [], success.total || 0),
      )}`
    : CONTACT.whatsappUrl;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 bg-black/50"
      />

      {/* Panel */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand" />
            Tu carrito
            {count > 0 && (
              <span className="text-sm font-semibold text-gray-500">({count} ítems)</span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {success ? (
          /* ── Éxito ─────────────────────────────── */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-brand" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">¡Pedido registrado!</h3>
            <p className="text-sm text-gray-600">
              Tu pedido <span className="font-bold text-gray-900">{success.codigo}</span> fue
              recibido. Nuestro equipo te contactará para coordinar el pago y la entrega.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Phone className="w-5 h-5" />
              Confirmar por WhatsApp
            </a>
            <button
              type="button"
              onClick={closeCart}
              className="text-sm text-brand font-semibold hover:underline"
            >
              Seguir comprando
            </button>
          </div>
        ) : items.length === 0 ? (
          /* ── Vacío ─────────────────────────────── */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300" />
            <p className="text-gray-500">Tu carrito está vacío.</p>
            <Link
              to="/tienda"
              onClick={closeCart}
              className="px-5 py-2.5 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors text-sm"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          /* ── Con productos ─────────────────────── */
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((it) => (
                <div key={it.key} className="flex gap-3 p-3 rounded-xl border border-gray-100">
                  {it.imagen ? (
                    <img
                      src={it.imagen}
                      alt={it.nombre}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{it.nombre}</p>
                        {it.color && (
                          <p className="text-xs text-gray-500 mt-0.5">Color: {it.color}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(it.key)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Quitar del carrito"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

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
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(it.precio_actual * it.cantidad)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors w-full text-center"
                >
                  Vaciar carrito
                </button>
              )}
            </div>

            {/* Footer / Checkout */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-4">
              {(error || sending) && (
                <p
                  className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
                  role="alert"
                >
                  {error || 'Registrando tu pedido…'}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Total</span>
                <span className="text-2xl font-bold text-brand">{formatPrice(total)}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2.5">
                <input
                  type="text"
                  required
                  placeholder="Tu nombre completo"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                />
                <input
                  type="tel"
                  required
                  placeholder="Tu WhatsApp (ej. 919 445 661)"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                />
                <input
                  type="email"
                  placeholder="Email (opcional)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                />
                <button
                  type="submit"
                  disabled={sending || !form.nombre.trim() || !form.telefono.trim()}
                  className={`w-full py-3 rounded-lg font-semibold text-base transition-colors ${
                    sending || !form.nombre.trim() || !form.telefono.trim()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-brand text-white hover:bg-brand-dark'
                  }`}
                >
                  {sending ? 'Registrando…' : 'Registrar pedido'}
                </button>
                <p className="text-[11px] text-gray-400 text-center">
                  Al registrar el pedido, nuestro equipo se contactará contigo por WhatsApp
                  para coordinar el pago y la entrega.
                </p>
              </form>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}