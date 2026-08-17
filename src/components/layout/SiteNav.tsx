import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PowerConsultLogo } from '@/components/brand/PowerConsultLogo';

const links: { label: string; to: string }[] = [
  { label: 'Home', to: '/' },
  { label: 'Recruitment', to: '/recruitment' },
  { label: 'Admin', to: '/admin' },
];

export function SiteNav({ cta }: { cta?: { label: string; onClick: () => void } }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-border bg-background/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link to="/" aria-label="Powers Consult home">
          <PowerConsultLogo size="md" />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: 'text-sm font-semibold text-foreground' }}
              activeOptions={{ exact: l.to === '/' }}
            >
              {l.label}
            </Link>
          ))}
          {cta ? (
            <button
              onClick={cta.onClick}
              className="rounded-[8px] bg-[var(--navy)] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--navy-deep)]"
            >
              {cta.label}
            </button>
          ) : (
            <Link
              to="/consultation"
              className="rounded-[8px] bg-[var(--navy)] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--navy-deep)]"
            >
              Book an HR Consultation
            </Link>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-[8px] text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-[8px] px-3 py-2.5 text-left text-sm font-semibold text-foreground hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            {cta ? (
              <button
                onClick={() => {
                  setOpen(false);
                  cta.onClick();
                }}
                className="mt-2 rounded-[8px] bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                {cta.label}
              </button>
            ) : (
              <Link
                to="/consultation"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-[8px] bg-[var(--navy)] px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Book an HR Consultation
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}