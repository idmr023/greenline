import { ShoppingCart } from '../../lib/icons';

export function CartButton({ count, onClick, mobile = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        mobile
          ? 'relative p-2 text-gray-700'
          : 'relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors'
      }
      aria-label="Abrir carrito"
    >
      <ShoppingCart className={mobile ? 'w-6 h-6' : 'w-5 h-5 text-gray-700'} />

      {count > 0 && (
        <span
          className={
            mobile
              ? 'absolute top-0 right-0 min-w-[16px] h-[16px] px-0.5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center'
              : 'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center'
          }
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>

  );
}