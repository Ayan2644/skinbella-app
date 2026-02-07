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
    <div className={cn('bg-card rounded-3xl border border-border/20 p-5 shadow-card', className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-bold text-foreground font-['Playfair_Display']">{title}</h3>
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
