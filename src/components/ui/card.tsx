import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-card rounded-2xl border border-card-border shadow-md', className)}
      {...props}
    />
  );
}

function CardBand({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-dhl-yellow text-ink font-black text-xs px-5 py-2 rounded-t-2xl tracking-wide uppercase',
        className
      )}
      {...props}
    />
  );
}

function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />;
}

export { Card, CardBand, CardBody };
