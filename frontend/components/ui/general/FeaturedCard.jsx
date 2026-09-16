import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FeatureCard({
  title,
  text,
  icon,
  variant = 'light', // Por defecto será blanco/claro
  badgeText,
  className = '',
  children
}) {
  const isDark = variant === 'dark';

  const iconProps = { className: 'text-3xl w-7 h-7' };
  let iconNode = null;
  if (typeof icon === 'function') {
    const IconComponent = icon;
    iconNode = <IconComponent {...iconProps} />;
  } else if (typeof icon === 'object' && icon !== null) {
    // Definición cruda de FontAwesome ({ prefix, iconName, ... })
    iconNode = <FontAwesomeIcon icon={icon} {...iconProps} strokeWidth={2.5} />;
  } else {
    iconNode = icon; // Nodo React ya montado
  }

  return (
    <div
      className={`relative rounded-2xl p-6 md:p-8 text-center flex flex-col items-center shadow-sm border transition-all duration-300 hover:-translate-y-1 ${
        isDark
          ? 'bg-[#009000] text-white border-transparent'
          : 'bg-white text-gray-900 border-gray-100'
      } ${className}`}
    >
      {/* Contenedor del ícono dinámico */}
      {iconNode && (
        <div
          className={`w-14 h-14 mb-4 flex flex-shrink-0 items-center justify-center rounded-2xl ${
            isDark
              ? 'bg-white text-[#009000]'
              : 'bg-green-100/50 text-[#009000]'
          }`}
        >
          {iconNode}
        </div>
      )}

      {/* Textos */}
      <h3 className="font-extrabold text-lg md:text-xl mb-3 tracking-tight">
        {title}
      </h3>
      <p className={`text-sm md:text-base leading-relaxed mb-auto ${
        isDark ? 'text-white/90' : 'text-gray-600'
      }`}>
        {text}
      </p>

      {/* Etiqueta opcional tipo píldora (ej. "Stock propio") */}
      {badgeText && (
        <span className={`mt-5 inline-block px-4 py-1.5 text-xs font-bold rounded-full ${
          isDark
            ? 'bg-white/20 text-white'
            : 'bg-green-100/50 text-green-700 border border-green-200/50'
        }`}>
          {badgeText}
        </span>
      )}

      {/* Contenido adicional opcional (ej. CTA dentro de la tarjeta) */}
      {children}
    </div>
  );
}