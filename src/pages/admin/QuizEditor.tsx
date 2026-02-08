import { useState, useEffect } from 'react';
import { QuizQuestion, QuestionType, QuizOption, quizQuestions } from '@/lib/quizData';
import { quizStorage } from '@/lib/quizStorage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  GripVertical, Plus, Trash2, ArrowUp, ArrowDown, RotateCcw, Save, ChevronRight,
  SlidersHorizontal, LayoutGrid, Hash, Camera, CheckSquare, List,
} from 'lucide-react';
import { toast } from 'sonner';

const typeLabels: Record<QuestionType, { label: string; icon: typeof SlidersHorizontal }> = {
  slider: { label: 'Slider', icon: SlidersHorizontal },
  'cards-emoji': { label: 'Cards Emoji', icon: LayoutGrid },
  'cards-image': { label: 'Cards Imagem', icon: LayoutGrid },
  chips: { label: 'Chips', icon: Hash },
  'multi-chips': { label: 'Multi Chips', icon: CheckSquare },
  selfie: { label: 'Selfie', icon: Camera },
};

const QuizEditor = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setQuestions(quizStorage.getActiveQuestions());
  }, []);

  const selected = selectedIdx !== null ? questions[selectedIdx] : null;

  const updateQuestion = (idx: number, patch: Partial<QuizQuestion>) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, ...patch } : q));
    setHasChanges(true);
  };

  const updateOption = (qIdx: number, oIdx: number, patch: Partial<QuizOption>) => {
    const q = questions[qIdx];
    const newOptions = (q.options ?? []).map((o, i) => i === oIdx ? { ...o, ...patch } : o);
    updateQuestion(qIdx, { options: newOptions });
  };

  const addOption = (qIdx: number) => {
    const q = questions[qIdx];
    const newOptions = [...(q.options ?? []), { value: `opt_${Date.now()}`, label: 'Nova opção', description: '' }];
    updateQuestion(qIdx, { options: newOptions });
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const q = questions[qIdx];
    const newOptions = (q.options ?? []).filter((_, i) => i !== oIdx);
    updateQuestion(qIdx, { options: newOptions });
  };

  const addQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q_${Date.now()}`,
      type: 'cards-emoji',
      title: 'Nova pergunta',
      subtitle: '',
      options: [
        { value: 'opcao1', label: 'Opção 1', description: 'Descrição' },
        { value: 'opcao2', label: 'Opção 2', description: 'Descrição' },
      ],
    };
    setQuestions(prev => [...prev, newQ]);
    setSelectedIdx(questions.length);
    setHasChanges(true);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
    if (selectedIdx === idx) setSelectedIdx(null);
    else if (selectedIdx !== null && selectedIdx > idx) setSelectedIdx(selectedIdx - 1);
    setHasChanges(true);
  };

  const moveQuestion = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= questions.length) return;
    const copy = [...questions];
    [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
    setQuestions(copy);
    if (selectedIdx === idx) setSelectedIdx(newIdx);
    else if (selectedIdx === newIdx) setSelectedIdx(idx);
    setHasChanges(true);
  };

  const handleSave = () => {
    quizStorage.saveQuestions(questions);
    setHasChanges(false);
    toast.success('Quiz salvo com sucesso!');
  };

  const handleReset = () => {
    quizStorage.resetToDefaults();
    setQuestions([...quizQuestions]);
    setSelectedIdx(null);
    setHasChanges(false);
    toast.info('Quiz restaurado para o padrão');
  };

  const needsOptions = selected && !['slider', 'selfie'].includes(selected.type);
  const isSlider = selected?.type === 'slider';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Editor do Quiz</h1>
          <p className="text-sm text-muted-foreground">Gerencie as etapas, perguntas e respostas do quiz</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="rounded-xl gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges} className="rounded-xl gap-1.5">
            <Save className="w-3.5 h-3.5" /> Salvar
          </Button>
        </div>
      </div>

      {quizStorage.isCustom() && (
        <div className="text-xs text-accent bg-accent/10 px-3 py-2 rounded-xl">
          ✏️ Usando quiz personalizado. Clique "Restaurar" para voltar ao original.
        </div>
      )}

      <div className="grid md:grid-cols-[320px_1fr] gap-4">
        {/* Steps List */}
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Etapas ({questions.length})</p>
              <Button variant="ghost" size="sm" onClick={addQuestion} className="h-7 gap-1 text-xs rounded-lg">
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </Button>
            </div>
            <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
              {questions.map((q, i) => {
                const TypeIcon = typeLabels[q.type]?.icon ?? List;
                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedIdx(i)}
                    className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm ${
                      selectedIdx === i
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                    <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{i + 1}</span>
                    <TypeIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate flex-1">{q.title}</span>
                    <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); moveQuestion(i, -1); }} className="p-0.5 hover:text-primary" disabled={i === 0}>
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); moveQuestion(i, 1); }} className="p-0.5 hover:text-primary" disabled={i === questions.length - 1}>
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); removeQuestion(i); }} className="p-0.5 hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-opacity ${selectedIdx === i ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Edit Panel */}
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-5">
            {selected && selectedIdx !== null ? (
              <div className="space-y-5 animate-fade-in" key={selected.id}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Etapa {selectedIdx + 1}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {typeLabels[selected.type]?.label}
                  </span>
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tipo de Componente</label>
                  <Select value={selected.type} onValueChange={(v) => updateQuestion(selectedIdx, { type: v as QuestionType })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeLabels).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">ID (identificador único)</label>
                  <Input
                    value={selected.id}
                    onChange={(e) => updateQuestion(selectedIdx, { id: e.target.value })}
                    className="rounded-xl font-mono text-sm"
                  />
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Pergunta</label>
                  <Input
                    value={selected.title}
                    onChange={(e) => updateQuestion(selectedIdx, { title: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Subtítulo</label>
                  <Input
                    value={selected.subtitle ?? ''}
                    onChange={(e) => updateQuestion(selectedIdx, { subtitle: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                {/* Slider config */}
                {isSlider && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Mínimo</label>
                      <Input
                        type="number"
                        value={selected.sliderMin ?? 0}
                        onChange={(e) => updateQuestion(selectedIdx, { sliderMin: Number(e.target.value) })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Máximo</label>
                      <Input
                        type="number"
                        value={selected.sliderMax ?? 10}
                        onChange={(e) => updateQuestion(selectedIdx, { sliderMax: Number(e.target.value) })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Unidade</label>
                      <Input
                        value={selected.sliderUnit ?? ''}
                        onChange={(e) => updateQuestion(selectedIdx, { sliderUnit: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {/* Options */}
                {needsOptions && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opções</label>
                      <Button variant="ghost" size="sm" onClick={() => addOption(selectedIdx)} className="h-7 gap-1 text-xs rounded-lg">
                        <Plus className="w-3.5 h-3.5" /> Opção
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                      {(selected.options ?? []).map((opt, oi) => (
                        <div key={oi} className="p-3 rounded-xl bg-muted/30 border border-border/20 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              value={opt.emoji ?? ''}
                              onChange={(e) => updateOption(selectedIdx, oi, { emoji: e.target.value })}
                              className="w-14 text-center rounded-lg"
                              placeholder="😊"
                            />
                            <Input
                              value={opt.label}
                              onChange={(e) => updateOption(selectedIdx, oi, { label: e.target.value })}
                              className="flex-1 rounded-lg"
                              placeholder="Label"
                            />
                            <button onClick={() => removeOption(selectedIdx, oi)} className="p-1 text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <Input
                            value={opt.value}
                            onChange={(e) => updateOption(selectedIdx, oi, { value: e.target.value })}
                            className="rounded-lg font-mono text-xs"
                            placeholder="value (identificador)"
                          />
                          <Input
                            value={opt.description ?? ''}
                            onChange={(e) => updateOption(selectedIdx, oi, { description: e.target.value })}
                            className="rounded-lg text-sm"
                            placeholder="Descrição da opção"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <List className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Selecione uma etapa para editar</p>
                <p className="text-xs mt-1">Ou adicione uma nova etapa ao quiz</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizEditor;
