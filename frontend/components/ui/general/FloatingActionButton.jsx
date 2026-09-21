export default function FloatingActionButton({
  href,
  onClick,
  icon,
  ariaLabel,
  visible = true,
  pulse = false,
  className = '',
}) {
  const classes = `fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-all hover:scale-105 ${
    pulse ? 'animate-pulse' : ''
  } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={classes}
      >
        {icon}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
    >
      {icon}
    </button>
  );
}