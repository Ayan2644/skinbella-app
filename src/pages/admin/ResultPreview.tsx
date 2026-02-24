import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultScreen from "@/components/quiz/ResultScreen";
import { toast } from "sonner";

const MOCK_PROFILE = {
  skinAge: 32,
  scores: {
    manchas: 6,
    textura: 5,
    elasticidade: 7,
    poros: 4,
    oleosidade: 6,
    hidratacao: 5,
  },
  prioridadesTop3: ["manchas", "textura", "hidratacao"],
  nutrientesTop4: [],
  rotina: { manha: [], noite: [] },
  dieta: { priorizar: [], reduzir: [], plano: [] },
};

export default function ResultPreview() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Admin preview bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-4 py-2 flex items-center justify-between text-sm">
        <span className="font-semibold tracking-wide">MODO PREVIEW — Admin</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/app/admin/page-editor")}
          className="h-7 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Voltar ao Editor
        </Button>
      </div>
      <div className="pt-10">
        <ResultScreen
          profile={MOCK_PROFILE}
          onRedo={() => navigate("/app/admin/page-editor")}
          onAccess={() => toast.info("Checkout simulado — modo preview")}
        />
      </div>
    </div>
  );
}
