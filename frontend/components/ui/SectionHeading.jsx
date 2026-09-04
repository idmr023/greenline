import React from 'react';

/**
 * Encabezado de sección reutilizable (eyebrow + título + subtítulo),
 * centrado o alineado a la izquierda, siguiendo la identidad Green Line.
 *
 * <SectionHeading
 *   eyebrow="Nuestra historia"
 *   title="Transformando la movilidad en el Perú"
 *   subtitle="Desde 2017..." align="center"
 * />
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignCls =
    align === 'center' ? 'text-center mx-auto' : 'text-left mx-0';
  return (
    <div className={`max-w-2xl mb-10 ${alignCls} ${className}`.trim()}>
      {eyebrow && (
        <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-sm font-semibold rounded-full mb-4">
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-gray-600 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
