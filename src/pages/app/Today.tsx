import { storage } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, CheckSquare, Flame, Camera, ChevronRight, Sparkles, Droplets, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';

const Today = () => {
  const profile = storage.getProfile();
  const auth = storage.getAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const streak = storage.getStreak();
  const morningDone = storage.getRoutineStatus('morning');
  const nightDone = storage.getRoutineStatus('night');
  const fileRef = useRef<HTMLInputElement>(null);

  const checklist = storage.getChecklist() ?? [];
  const doneCount = checklist.filter(i => i.done).length;
  const totalCount = checklist.length || 5;

  const handleSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      storage.saveSelfie(ev.target?.result as string);
      toast({ title: 'Selfie salva! 📸', description: 'Seu histórico foi atualizado.' });
    };
    reader.readAsDataURL(f);
  };

  return (
    <section className="space-y-5">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {auth?.name ?? 'linda'} ✨
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Este é seu painel de cuidados diários</p>
      </div>

      {/* Skin Age Hero */}
      {profile && (
        <button onClick={() => navigate('/app/relatorio')} className="w-full">
          <div className="app-card gradient-porcelain relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-foreground/60 mb-1">Idade da pele</p>
                <p className="text-4xl font-bold text-accent-foreground">{profile.skinAge} <span className="text-lg font-normal">anos</span></p>
                <p className="text-xs text-accent-foreground/60 mt-1.5 flex items-center gap-1">
                  Ver diagnóstico completo <ChevronRight className="w-3 h-3" />
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-accent" />
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Checklist */}
        <button onClick={() => navigate('/app/checklist')} className="app-card text-left group">
          <div className="flex items-center justify-between mb-3">
            <CheckSquare className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {doneCount}/{totalCount}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground mb-2">Checklist do dia</p>
          <Progress value={(doneCount / totalCount) * 100} className="h-1.5" />
        </button>

        {/* Morning Routine */}
        <button onClick={() => navigate('/app/rotina')} className="app-card text-left group">
          <div className="flex items-center justify-between mb-3">
            <Sun className="w-5 h-5 text-accent" />
            {morningDone && <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">✓</span>}
          </div>
          <p className="text-sm font-semibold text-foreground">Rotina Manhã</p>
          <p className="text-xs text-muted-foreground mt-0.5">{morningDone ? 'Concluída' : 'Pendente'}</p>
        </button>

        {/* Night Routine */}
        <button onClick={() => navigate('/app/rotina')} className="app-card text-left group">
          <div className="flex items-center justify-between mb-3">
            <Moon className="w-5 h-5 text-primary" />
            {nightDone && <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">✓</span>}
          </div>
          <p className="text-sm font-semibold text-foreground">Rotina Noite</p>
          <p className="text-xs text-muted-foreground mt-0.5">{nightDone ? 'Concluída' : 'Pendente'}</p>
        </button>

        {/* Streak */}
        <div className="app-card text-left">
          <div className="flex items-center justify-between mb-3">
            <Flame className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-sm font-semibold text-foreground">Streak</p>
          <p className="text-2xl font-bold text-foreground mt-0.5">{streak} <span className="text-xs font-normal text-muted-foreground">dias</span></p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-2">
        <button onClick={() => navigate('/app/nutrientes')} className="app-card w-full flex items-center gap-4 !p-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-foreground">Nutrientes essenciais</p>
            <p className="text-xs text-muted-foreground">Veja o que sua pele precisa</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button onClick={() => navigate('/app/produtos')} className="app-card w-full flex items-center gap-4 !p-4">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-foreground">Produtos recomendados</p>
            <p className="text-xs text-muted-foreground">Seleção para seu perfil</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Selfie CTA */}
      <Button onClick={() => fileRef.current?.click()} variant="outline" className="w-full rounded-2xl h-12 border-dashed border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
        <Camera className="w-4 h-4 mr-2 text-primary" />
        <span className="text-sm font-medium">Registrar selfie semanal</span>
      </Button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelfie} />
    </section>
  );
};

export default Today;
