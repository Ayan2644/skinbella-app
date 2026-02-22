import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function ResultCard({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('result-card-premium p-5', className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-foreground font-display">{title}</h3>
          )}
          {subtitle && (
            <p className="text-[12px] text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
