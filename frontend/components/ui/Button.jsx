import { Link } from 'react-router-dom';

const VARIANTS = {
  primary:
    'bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand',
  secondary:
    'bg-brand-light text-white hover:bg-brand focus-visible:outline-brand',
  outline:
    'border border-brand text-brand bg-transparent hover:bg-brand/5 focus-visible:outline-brand',
  ghost:
    'text-brand bg-transparent hover:bg-brand/5 focus-visible:outline-brand',
  dark: 'bg-black-contrast text-white hover:opacity-90 focus-visible:outline-black-contrast',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

function classes({ variant = 'primary', size = 'md', className = '' }) {
  return `${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`.trim();
}

/**
 * Botón reutilizable. Si recibe `to`, renderiza un <Link>; si no, un <button>.
 *
 * <Button variant="primary" size="md" to="/tienda">Ver tienda</Button>
 * <Button variant="outline" onClick={...}>Cancelar</Button>
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  className = '',
  children,
  ...rest
}) {
  const cls = classes({ variant, size, className });

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
