import { cn } from '@/lib/utils';
import logoAsset from '@/assets/power-consult-logo.png.asset.json';

interface PowerConsultLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  className?: string;
}

const sizeMap = {
  sm: { box: 'h-8 w-8', text: 'text-sm' },
  md: { box: 'h-10 w-10', text: 'text-base' },
  lg: { box: 'h-12 w-12', text: 'text-lg' },
};

export function PowerConsultLogo({ size = 'md', variant = 'light', className }: PowerConsultLogoProps) {
  const s = sizeMap[size];
  const onDark = variant === 'dark';
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img
        src={logoAsset.url}
        alt="Powers Consult"
        className={cn('object-contain', s.box)}
      />
      <span
        className={cn(
          'font-bold tracking-[-0.02em] leading-none',
          s.text,
          onDark ? 'text-white' : 'text-foreground',
        )}
      >
        Powers<span className="text-[var(--teal)]">.</span>Consult
      </span>
    </div>
  );
}