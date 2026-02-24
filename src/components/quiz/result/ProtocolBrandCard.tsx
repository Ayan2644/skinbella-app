import { Sparkles } from "lucide-react";

export default function ProtocolBrandCard() {
  return (
    <section className="px-5">
      <div className="sb-card text-center py-5 px-5">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl sb-gradient-warm flex items-center justify-center shadow-card">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>

        <h2 className="sb-h2 text-[22px] mb-2 leading-tight">Protocolo Pele de Porcelana™</h2>

        <p className="sb-body text-muted-foreground mb-3">
          Tratamento intensivo de recuperação da idade da pele
        </p>

        <span className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-[11px] font-medium px-3.5 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Plano guiado + acompanhamento diário
        </span>
      </div>
    </section>
  );
}
