import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'greenline_cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((it) => it && it.key && it.slug);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage no disponible (modo privado): no romper el carrito en memoria
    }
  }, [items]);

  const addItem = (product, { color = null, cantidad = 1 } = {}) => {
    const qty = Math.max(1, Math.floor(cantidad));
    const key = `${product.slug}:${color || 'default'}`;
    setItems((prev) => {
      const existing = prev.find((it) => it.key === key);
      if (existing) {
        return prev.map((it) =>
          it.key === key ? { ...it, cantidad: it.cantidad + qty } : it,
        );
      }
      return [
        ...prev,
        {
          key,
          slug: product.slug,
          nombre: product.nombre,
          color,
          precio_actual: product.precio_actual,
          imagen:
            product.imagenes?.[0]?.src || product.imagenes?.[0]?.url || null,
          cantidad: qty,
        },
      ];
    });
  };

  const removeItem = (key) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
  };

  const updateQty = (key, qty) => {
    const next = Math.max(1, Math.floor(qty));
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, cantidad: next } : it)),
    );
  };

  const clear = () => setItems([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.cantidad * it.precio_actual, 0),
    [items],
  );
  const count = useMemo(() => items.reduce((sum, it) => sum + it.cantidad, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clear,
        total,
        count,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}