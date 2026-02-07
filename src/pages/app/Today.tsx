import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, CheckSquare, Flame, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';

const Today = () => {
  const profile = storage.getProfile();
  const auth = storage.getAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const streak = storage.getStreak();
  const morningDone = storage.getRoutineStatus('morning');
  const nightDone = storage.getRoutineStatus('night');
  const [showSelfie, setShowSelfie] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      storage.saveSelfie(ev.target?.result as string);
      toast({ title: 'Selfie salva! 📸', description: 'Seu histórico foi atualizado.' });
      setShowSelfie(false);
    };
    reader.readAsDataURL(f);
  };

  return (
    <section>
      <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-1">
        Olá, {auth?.name ?? 'linda'} ✨
      </h1>
      <p className="text-sm text-muted-foreground mb-6">Seu painel de cuidados diários</p>

      {profile && (
        <div className="app-card gradient-porcelain mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/70 mb-1">Idade da pele</p>
          <p className="text-3xl font-bold text-accent-foreground font-['Playfair_Display']">{profile.skinAge} anos</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={() => navigate('/app/checklist')} className="app-card text-left">
          <CheckSquare className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm font-medium text-card-foreground">Checklist do dia</p>
        </button>
        <button onClick={() => navigate('/app/rotina')} className="app-card text-left">
          <Sun className="w-5 h-5 text-accent mb-2" />
          <p className="text-sm font-medium text-card-foreground">
            Rotina da manhã {morningDone && '✅'}
          </p>
        </button>
        <button onClick={() => navigate('/app/rotina')} className="app-card text-left">
          <Moon className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm font-medium text-card-foreground">
            Rotina da noite {nightDone && '✅'}
          </p>
        </button>
        <div className="app-card text-left">
          <Flame className="w-5 h-5 text-destructive mb-2" />
          <p className="text-sm font-medium text-card-foreground">Streak</p>
          <p className="text-2xl font-bold text-foreground">{streak} <span className="text-xs text-muted-foreground">dias</span></p>
        </div>
      </div>

      <Button onClick={() => fileRef.current?.click()} variant="outline" className="w-full rounded-2xl h-12">
        <Camera className="w-4 h-4 mr-2" />
        Registrar selfie semanal
      </Button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelfie} />
    </section>
  );
};

export default Today;
