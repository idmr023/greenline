/**
 * Card base reutilizable con variantes de padding y estilo.
 *
 * <Card padding="md" className="hover:shadow-lg">...</Card>
 */
const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
  xl: 'p-8',
};

const BASE =
  'bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden';

export default function Card({
  padding = 'lg',
  className = '',
  children,
  ...rest
}) {
  const cls = `${BASE} ${PADDING[padding] || PADDING.lg} ${className}`.trim();
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}
