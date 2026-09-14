import { Link } from 'react-router-dom';
import { ChevronDown } from '../../lib/icons';

export function NavDropdown({ label, links, align = 'left' }) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1 hover:text-brand transition-colors outline-none"
      >
        {label} <ChevronDown className="w-4 h-4" />
      </button>

      <div
        className={`absolute top-full mt-2 ${
          align === 'right' ? 'right-0' : 'left-0'
        } w-56 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50`}
      >
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="block px-4 py-2 hover:bg-gray-100 hover:text-brand text-sm text-left"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
