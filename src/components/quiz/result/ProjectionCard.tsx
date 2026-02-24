import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultCard from "./ResultCard";
import RejuvenationChart from "./RejuvenationChart";

interface ProjectionCardProps {
  skinAge: number;
  onAccess?: () => void;
}

export default function ProjectionCard({ skinAge, onAccess }: ProjectionCardProps) {
  return (
    <section className="px-5">
      <ResultCard title="Projeção com o Protocolo" subtitle="Resultados estimados em 20 dias">
        {/* Container Lado a Lado: Gráfico + Evolução Visual */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 min-h-[180px]">
            <RejuvenationChart skinAge={skinAge} />
          </div>

          {/* Círculo de Evolução */}
          <div className="w-24 flex flex-col items-center gap-2 flex-shrink-0">
            <div className="relative w-20 h-20 rounded-full border-2 border-primary/15 overflow-hidden bg-secondary/40 flex items-center justify-center">
              <div className="text-[9px] font-bold text-primary leading-tight text-center px-1">ANTES<br />|<br />DEPOIS</div>
            </div>
            <span className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">
              Evolução
            </span>
          </div>
        </div>

        {/* Banner de Destaque */}
        <div className="bg-secondary/35 rounded-[20px] p-5 border border-border/50 mb-6 shadow-card">
          <p className="font-display italic text-primary text-[17px] leading-relaxed text-center">
            Você pode reverter de <span className="font-bold underline decoration-accent/60">2 a 4 anos</span> na aparência da sua pele.
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-4 mb-6">
          {[
            "Plano diário guiado passo a passo",
            "Checklist + streak de consistência",
            "Selfie semanal para comparar evolução",
          ].map((text) => (
            <div key={text} className="flex items-center gap-3 text-[13px] text-foreground/90 font-medium">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
                <Check className="w-3 h-3 text-primary" strokeWidth={3} />
              </div>
              {text}
            </div>
          ))}
        </div>

        {onAccess && (
          <div className="space-y-3">
            <Button onClick={onAccess} className="w-full rounded-[20px] h-14 text-base font-bold shadow-elegant">
              <Sparkles className="w-5 h-5 mr-2 text-accent" />
              Começar protocolo agora
            </Button>
            <div className="flex justify-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold opacity-70">
              <span>● Acesso Imediato</span>
              <span>● Checkout Seguro</span>
            </div>
          </div>
        )}
      </ResultCard>
    </section>
  );
}
