import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, X, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';

export default function CartDrawer() {
  const { items, removeItem, updateQty, clear, total, count, isOpen, closeCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

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

        {items.length === 0 ? (
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
                      className="w-20 h-20 rounded-lg object-contain bg-gray-50 shrink-0"
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
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Total</span>
                <span className="text-2xl font-bold text-brand">{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3 rounded-lg font-semibold text-base bg-brand text-white hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
              >
                Finalizar compra
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-gray-400 text-center">
                Finaliza sin crear una cuenta. Nuestro equipo coordinará contigo el pago y la
                entrega.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
