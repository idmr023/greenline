import { GraduationCap } from '../../lib/icons';

export function CommunityButton({ onClick, mobile = false }) {
  if (mobile) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="p-2 text-brand"
        aria-label="Comunidad UPN"
      >
        <GraduationCap className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand text-sm font-semibold rounded-full hover:bg-brand/20 transition-colors"
    >
      <GraduationCap className="w-4 h-4" />
      Comunidad UPN
    </button>
  );
}
