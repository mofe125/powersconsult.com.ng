import { cn } from '@/lib/utils';

interface PowerConsultLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  className?: string;
}

const sizeMap = {
  sm: { box: 'h-7 w-7', text: 'text-sm' },
  md: { box: 'h-8 w-8', text: 'text-base' },
  lg: { box: 'h-10 w-10', text: 'text-lg' },
};

export function PowerConsultLogo({ size = 'md', variant = 'light', className }: PowerConsultLogoProps) {
  const s = sizeMap[size];
  const onDark = variant === 'dark';
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-[8px] bg-[var(--navy)] text-white',
          s.box,
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-1/2 w-1/2">
          <path d="M5 19V8l6 5 6-8 2 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span
        className={cn(
          'font-bold tracking-[-0.02em] leading-none',
          s.text,
          onDark ? 'text-white' : 'text-foreground',
        )}
      >
        Power<span className="text-[var(--teal)]">.</span>Consult
      </span>
    </div>
  );
}