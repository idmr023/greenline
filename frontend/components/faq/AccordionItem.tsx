import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  children: ReactNode;
}

export default function AccordionItem({
  title,
  icon,
  defaultOpen = false,
  badge,
  children,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0,
  );

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      setHeight(el.scrollHeight);
      const timer = setTimeout(() => setHeight(undefined), 300);
      return () => clearTimeout(timer);
    }
    setHeight(el.scrollHeight);
    requestAnimationFrame(() => setHeight(0));
  }, [open]);

  return (
    <div
      className={`rounded-2xl border transition-colors ${
        open
          ? 'border-brand/30 bg-white shadow-md'
          : 'border-gray-200 bg-white hover:border-brand/20'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-2xl"
      >
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            {icon}
          </span>
        )}
        <span className="flex-1 text-sm sm:text-base font-semibold text-gray-900 leading-snug">
          {title}
        </span>
        {badge && (
          <span className="hidden sm:inline-block shrink-0 rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-brand">
            {badge}
          </span>
        )}
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
            open ? 'rotate-180 text-brand' : ''
          }`}
        />
      </button>

      <div
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: height !== undefined ? `${height}px` : 'auto' }}
      >
        <div ref={contentRef} className="px-5 pb-5 pt-1">
          {children}
        </div>
      </div>
    </div>
  );
}
