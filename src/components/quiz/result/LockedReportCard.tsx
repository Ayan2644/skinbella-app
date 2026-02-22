import { Lock } from "lucide-react";

export default function LockedReportCard() {
  return (
    <div className="mx-5 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <Lock className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">Relatório Completo</h3>
        <p className="text-xs text-muted-foreground">Desbloqueie para ver sua análise detalhada.</p>
      </div>
    </div>
  );
}
