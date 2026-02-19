import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckSquare, Sun, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const navigate = useNavigate();

  const handleStart = () => {
    // Marcar onboarding como completo
    try {
      localStorage.setItem('onboarding_completed', 'true');
    } catch (e) {
      // Fallback para sessionStorage se localStorage estiver bloqueado
      sessionStorage.setItem('onboarding_completed', 'true');
    }

    onClose();
    navigate('/app/checklist');
  };

  const handleSkip = () => {
    // Apenas fecha modal, NÃO salva flag
    // Modal vai aparecer novamente no próximo acesso
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[90%] max-w-md p-6 rounded-2xl"
        aria-describedby="onboarding-description"
      >
        <div className="text-center space-y-6">
          {/* Título e subtítulo */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Bem-vinda ao SkinBella! ✨
            </h2>
            <p
              id="onboarding-description"
              className="text-sm text-muted-foreground"
            >
              Sua jornada para a Pele de Porcelana começa agora
            </p>
          </div>

          {/* 3 Steps */}
          <div className="space-y-4 text-left">
            {/* Step 1: Checklist */}
            <div className="flex gap-3 p-4 rounded-xl bg-muted/50">
              <CheckSquare className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Complete seu checklist diário
                </h3>
                <p className="text-sm text-muted-foreground">
                  7 tarefas para uma pele radiante
                </p>
              </div>
            </div>

            {/* Step 2: Rotina */}
            <div className="flex gap-3 p-4 rounded-xl bg-muted/50">
              <Sun className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Faça sua rotina de manhã e noite
                </h3>
                <p className="text-sm text-muted-foreground">
                  Produtos certos no momento certo
                </p>
              </div>
            </div>

            {/* Step 3: Selfie */}
            <div className="flex gap-3 p-4 rounded-xl bg-muted/50">
              <Camera className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Registre sua primeira selfie semanal
                </h3>
                <p className="text-sm text-muted-foreground">
                  Acompanhe sua evolução
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 rounded-xl"
            >
              Ver depois
            </Button>
            <Button
              onClick={handleStart}
              className="flex-1 rounded-xl"
            >
              Começar minha jornada!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
