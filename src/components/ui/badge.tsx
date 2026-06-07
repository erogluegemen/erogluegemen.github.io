import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'yellow' | 'red' | 'green' | 'muted';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border',
        variant === 'default' && 'bg-card border-card-border text-ink shadow-sm',
        variant === 'yellow' && 'bg-dhl-yellow/20 border-dhl-yellow/60 text-ink',
        variant === 'red' && 'bg-dhl-red/10 border-dhl-red/30 text-dhl-red',
        variant === 'green' && 'bg-green-50 border-green-300/60 text-green-700',
        variant === 'muted' && 'bg-card border-card-border text-muted',
        className
      )}
      {...props}
    />
  );
}

export { Badge };
