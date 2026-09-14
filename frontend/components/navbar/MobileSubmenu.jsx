import { Link } from 'react-router-dom';

export function MobileSubmenu({ navigationSection, onBack, onNavigate }) {
  if (!navigationSection) return null;

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="block py-2 font-semibold text-brand text-sm flex items-center gap-1"
      >
        ← {navigationSection.label}
      </button>

      {navigationSection.links.map((link) => (
        <Link
          key={link.label}
          to={link.to}
          className="block pl-4 py-2 text-sm text-gray-600"
          onClick={onNavigate}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}