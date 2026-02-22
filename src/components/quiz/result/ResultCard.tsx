import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import marbleBg from "@/assets/result/marble-bg.png";

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
};

export default function ResultCard({ title, subtitle, children, className, headerRight }: Props) {
  return (
    <section className={cn("px-5", className)}>
      <div
        className={cn(
          // base premium (porcelana)
          "relative overflow-hidden",
          "rounded-[var(--radius-card)]",
          "border border-border/30",
          "bg-card",
          "shadow-card",
          "px-5 py-5",
        )}
      >
        {/* brilho/texture sutil por cima do card (porcelain wash) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url(${marbleBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* brilho/texture sutil por cima do card (porcelain wash) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.65]"
          style={{
            background:
              "radial-gradient(circle at 18% 12%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 55%), linear-gradient(145deg, hsl(var(--surface-strong)), hsl(var(--surface-soft)))",
          }}
        />

        <div className="relative z-10">
          {(title || subtitle || headerRight) && (
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                {title && (
                  <h3 className="font-display text-[18px] leading-snug text-foreground font-semibold">{title}</h3>
                )}
                {subtitle && <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{subtitle}</p>}
              </div>

              {headerRight ? <div className="flex-shrink-0">{headerRight}</div> : null}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
