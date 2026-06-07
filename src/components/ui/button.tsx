import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export function btnCls(
  variant: 'default' | 'outline' | 'ghost' = 'default',
  size: 'sm' | 'default' | 'lg' = 'default',
  extra?: string
) {
  return cn(
    'inline-flex items-center justify-center rounded-xl font-black border-2 cursor-pointer',
    'transition-transform duration-75 hover:-translate-y-0.5 active:translate-y-0 no-underline hover:no-underline',
    variant === 'default' && 'bg-dhl-yellow text-ink border-ink shadow-md',
    variant === 'outline' && 'bg-white text-ink border-card-border shadow-md hover:border-ink',
    variant === 'ghost' && 'bg-transparent text-ink border-transparent',
    size === 'sm' && 'px-3 py-1.5 text-sm',
    size === 'default' && 'px-4 py-2.5 text-base',
    size === 'lg' && 'px-6 py-3 text-lg',
    extra
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-black border-2 cursor-pointer',
        'transition-transform duration-75 hover:-translate-y-0.5 active:translate-y-0',
        variant === 'default' && 'bg-dhl-yellow text-ink border-ink shadow-md',
        variant === 'outline' && 'bg-white text-ink border-card-border shadow-md hover:border-ink',
        variant === 'ghost' && 'bg-transparent text-ink border-transparent',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'default' && 'px-4 py-2.5 text-base',
        size === 'lg' && 'px-6 py-3 text-lg',
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';
export { Button };
