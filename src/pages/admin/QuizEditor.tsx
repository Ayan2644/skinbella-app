import { useState, useEffect, useRef, useCallback } from 'react';
import { QuizQuestion, QuestionType, QuizOption, quizQuestions, QuizQuestionStyles, OptionLayout } from '@/lib/quizData';
import { useQuizQuestions } from '@/hooks/useQuizQuestions';
import { useQuizPresets, QuizPreset } from '@/hooks/useQuizPresets';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, Plus, Trash2, Undo2, Save, ChevronRight, Copy,
  SlidersHorizontal, LayoutGrid, Hash, Camera, CheckSquare, List,
  Palette, Type, Eye, Layers, Check, Pencil, FolderPlus,
} from 'lucide-react';
import { toast } from 'sonner';

/* ── Constants ── */
const typeLabels: Record<QuestionType, { label: string; icon: typeof SlidersHorizontal }> = {
  slider: { label: 'Slider', icon: SlidersHorizontal },
  'cards-emoji': { label: 'Cards Emoji', icon: LayoutGrid },
  'cards-image': { label: 'Cards Imagem', icon: LayoutGrid },
  chips: { label: 'Chips', icon: Hash },
  'multi-chips': { label: 'Multi Chips', icon: CheckSquare },
  selfie: { label: 'Selfie', icon: Camera },
  'face-map': { label: 'Face Map', icon: LayoutGrid },
};

const FONT_OPTIONS = [
  { value: 'default', label: 'Padrão (Playfair)' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Crimson Text', label: 'Crimson Text' },
  { value: 'Josefin Sans', label: 'Josefin Sans' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Rubik', label: 'Rubik' },
  { value: 'Sora', label: 'Sora' },
];

const GRADIENT_PRESETS = [
  { label: 'Nenhum', value: 'none' },
  { label: 'Rosa suave', value: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)' },
  { label: 'Lavanda', value: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)' },
  { label: 'Mint', value: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)' },
  { label: 'Pêssego', value: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' },
  { label: 'Céu', value: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' },
  { label: 'Dourado', value: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)' },
  { label: 'Blush', value: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)' },
  { label: 'Oceano', value: 'linear-gradient(135deg, #e0f7fa 0%, #e8eaf6 100%)' },
  { label: 'Sunset', value: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)' },
  { label: 'Floresta', value: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' },
  { label: 'Noite', value: 'linear-gradient(135deg, #263238 0%, #37474f 100%)' },
  { label: 'Elegante', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
  { label: 'Wine', value: 'linear-gradient(135deg, #4a0e0e 0%, #740e0e 100%)' },
  { label: 'Aurora', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: 'Coral', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
];

const MAX_UNDO = 30;

/* ── Sortable Item ── */
function SortableStep({
  q, index, isSelected, onSelect, onRemove, onDuplicate,
}: {
  q: QuizQuestion; index: number; isSelected: boolean;
  onSelect: () => void; onRemove: () => void; onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: q.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };
  const TypeIcon = typeLabels[q.type]?.icon ?? List;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm ${
        isSelected
          ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
          : 'hover:bg-muted/50 text-foreground'
      }`}
    >
      <button {...attributes} {...listeners} className="touch-none p-0.5 cursor-grab active:cursor-grabbing" onClick={(e) => e.stopPropagation()}>
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
      </button>
      <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{index + 1}</span>
      <TypeIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate flex-1">{q.title}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-primary transition-opacity shrink-0"
        title="Duplicar"
      >
        <Copy className="w-3 h-3" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive transition-opacity shrink-0"
      >
        <Trash2 className="w-3 h-3" />
      </button>
      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}

/* ── Mini Preview ── */
function QuestionPreview({ question }: { question: QuizQuestion }) {
  const s = question.styles ?? {};
  const containerStyle: React.CSSProperties = {
    background: s.bgGradient || s.bgColor || undefined,
    padding: s.padding || '1.25rem',
  };
  const titleStyle: React.CSSProperties = {
    fontFamily: s.fontFamily || "'Playfair Display'",
    fontSize: s.fontSize || '1.125rem',
    fontWeight: (s.fontWeight as any) || '700',
    color: s.titleColor || undefined,
  };
  const subtitleStyle: React.CSSProperties = {
    color: s.subtitleColor || undefined,
  };

  return (
    <div className="rounded-2xl border border-border/30 overflow-hidden" style={containerStyle}>
      <div className="text-center mb-3">
        <h3 style={titleStyle} className="leading-tight">{question.title}</h3>
        {question.subtitle && (
          <p className="text-xs text-muted-foreground mt-1" style={subtitleStyle}>{question.subtitle}</p>
        )}
      </div>
      {question.type === 'slider' ? (
        <div className="flex items-center justify-center gap-2 py-3">
          <span className="text-2xl font-bold text-primary" style={{ fontFamily: titleStyle.fontFamily }}>
            {question.sliderMin ?? 0}
          </span>
          <div className="w-24 h-1.5 rounded-full bg-secondary" />
          <span className="text-2xl font-bold text-primary" style={{ fontFamily: titleStyle.fontFamily }}>
            {question.sliderMax ?? 10}
          </span>
        </div>
      ) : s.optionLayout === 'horizontal' ? (
        <div className="grid grid-cols-2 gap-1.5">
          {question.options?.slice(0, 4).map((opt, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 p-2 rounded-xl border text-xs text-center"
              style={{
                backgroundColor: s.optionBgColor || undefined,
                borderColor: s.optionBorderColor || undefined,
              }}
            >
              {opt.emoji && <span className="text-sm">{opt.emoji}</span>}
              <span className="font-medium">{opt.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          {question.options?.slice(0, 3).map((opt, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 mb-1.5 rounded-xl border text-xs"
              style={{
                backgroundColor: s.optionBgColor || undefined,
                borderColor: s.optionBorderColor || undefined,
              }}
            >
              {opt.emoji && <span className="text-sm">{opt.emoji}</span>}
              <span className="font-medium">{opt.label}</span>
            </div>
          ))}
          {(question.options?.length ?? 0) > 3 && (
            <p className="text-[10px] text-muted-foreground text-center mt-1">+{(question.options?.length ?? 0) - 3} mais...</p>
          )}
        </>
      )}
    </div>
  );
}

/* ── Main Editor ── */
const QuizEditor = () => {
  const { presets, activePreset, isLoading: presetsLoading, createPreset, renamePreset, activatePreset, deletePreset } = useQuizPresets();
  const [currentPresetId, setCurrentPresetId] = useState<string>('main');
  const { questions: dbQuestions, hasCustom, isLoading, saveAll, resetToDefault } = useQuizQuestions(currentPresetId);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const undoStack = useRef<QuizQuestion[][]>([]);

  // Preset management state
  const [showNewPreset, setShowNewPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [copyFromPreset, setCopyFromPreset] = useState<string | undefined>(undefined);
  const [renamingPresetId, setRenamingPresetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Sync current preset to active on load
  useEffect(() => {
    if (!presetsLoading && activePreset) {
      setCurrentPresetId(activePreset.preset_id);
    }
  }, [presetsLoading, activePreset]);

  // Load from DB
  useEffect(() => {
    if (!isLoading && dbQuestions.length > 0) {
      setQuestions(dbQuestions);
    }
  }, [isLoading, dbQuestions]);

  const pushUndo = useCallback(() => {
    undoStack.current = [...undoStack.current.slice(-(MAX_UNDO - 1)), questions.map(q => ({ ...q, options: q.options ? [...q.options] : undefined, styles: q.styles ? { ...q.styles } : undefined }))];
  }, [questions]);

  const handleUndo = () => {
    const prev = undoStack.current.pop();
    if (prev) {
      setQuestions(prev);
      setHasChanges(true);
    }
  };

  const selected = selectedIdx !== null ? questions[selectedIdx] : null;

  const updateQuestion = (idx: number, patch: Partial<QuizQuestion>) => {
    pushUndo();
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, ...patch } : q));
    setHasChanges(true);
  };

  const updateStyles = (idx: number, stylePatch: Partial<QuizQuestionStyles>) => {
    pushUndo();
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, styles: { ...(q.styles ?? {}), ...stylePatch } } : q));
    setHasChanges(true);
  };

  const updateOption = (qIdx: number, oIdx: number, patch: Partial<QuizOption>) => {
    pushUndo();
    const q = questions[qIdx];
    const newOptions = (q.options ?? []).map((o, i) => i === oIdx ? { ...o, ...patch } : o);
    setQuestions(prev => prev.map((qq, i) => i === qIdx ? { ...qq, options: newOptions } : qq));
    setHasChanges(true);
  };

  const addOption = (qIdx: number) => {
    pushUndo();
    const q = questions[qIdx];
    const newOptions = [...(q.options ?? []), { value: `opt_${Date.now()}`, label: 'Nova opção', description: '' }];
    setQuestions(prev => prev.map((qq, i) => i === qIdx ? { ...qq, options: newOptions } : qq));
    setHasChanges(true);
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    pushUndo();
    const q = questions[qIdx];
    const newOptions = (q.options ?? []).filter((_, i) => i !== oIdx);
    setQuestions(prev => prev.map((qq, i) => i === qIdx ? { ...qq, options: newOptions } : qq));
    setHasChanges(true);
  };

  const addQuestion = () => {
    pushUndo();
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

  const duplicateQuestion = (idx: number) => {
    pushUndo();
    const original = questions[idx];
    const clone: QuizQuestion = {
      ...original,
      id: `${original.id}_copy_${Date.now()}`,
      options: original.options ? original.options.map(o => ({ ...o })) : undefined,
      styles: original.styles ? { ...original.styles } : undefined,
    };
    const newList = [...questions];
    newList.splice(idx + 1, 0, clone);
    setQuestions(newList);
    setSelectedIdx(idx + 1);
    setHasChanges(true);
  };

  const removeQuestion = (idx: number) => {
    pushUndo();
    setQuestions(prev => prev.filter((_, i) => i !== idx));
    if (selectedIdx === idx) setSelectedIdx(null);
    else if (selectedIdx !== null && selectedIdx > idx) setSelectedIdx(selectedIdx - 1);
    setHasChanges(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    pushUndo();
    const oldIndex = questions.findIndex(q => q.id === active.id);
    const newIndex = questions.findIndex(q => q.id === over.id);
    const reordered = arrayMove(questions, oldIndex, newIndex);
    setQuestions(reordered);
    if (selectedIdx === oldIndex) setSelectedIdx(newIndex);
    else if (selectedIdx !== null) {
      if (oldIndex < selectedIdx && newIndex >= selectedIdx) setSelectedIdx(selectedIdx - 1);
      else if (oldIndex > selectedIdx && newIndex <= selectedIdx) setSelectedIdx(selectedIdx + 1);
    }
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAll.mutateAsync(questions);
      setHasChanges(false);
      toast.success('Quiz salvo no banco de dados!');
    } catch (e: any) {
      toast.error('Erro ao salvar: ' + (e.message ?? 'Desconhecido'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    pushUndo();
    try {
      await resetToDefault.mutateAsync();
      setQuestions([...quizQuestions]);
      setSelectedIdx(null);
      setHasChanges(false);
      toast.info('Quiz restaurado para o padrão');
    } catch (e: any) {
      toast.error('Erro ao restaurar: ' + (e.message ?? ''));
    }
  };

  const needsOptions = selected && !['slider', 'selfie'].includes(selected.type);
  const isSlider = selected?.type === 'slider';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Editor do Quiz</h1>
          <p className="text-sm text-muted-foreground">Arraste para reordenar • Clique para editar • Salva no banco de dados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={undoStack.current.length === 0} className="rounded-xl gap-1.5">
            <Undo2 className="w-3.5 h-3.5" /> Desfazer
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="rounded-xl gap-1.5">
            Restaurar padrão
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges || saving} className="rounded-xl gap-1.5">
            <Save className="w-3.5 h-3.5" /> {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Preset Selector */}
      <Card className="rounded-2xl border-border/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Predefinições</p>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 gap-1 text-xs rounded-lg"
              onClick={() => { setShowNewPreset(true); setNewPresetName(''); setCopyFromPreset(undefined); }}
            >
              <FolderPlus className="w-3.5 h-3.5" /> Nova
            </Button>
          </div>

          {/* New preset form */}
          {showNewPreset && (
            <div className="flex items-center gap-2 mb-3 p-3 rounded-xl bg-muted/30 border border-border/20">
              <Input
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Nome da predefinição..."
                className="rounded-lg text-sm flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newPresetName.trim()) {
                    createPreset.mutateAsync({ name: newPresetName.trim(), copyFromId: copyFromPreset }).then(() => {
                      setShowNewPreset(false);
                      toast.success('Predefinição criada!');
                    });
                  }
                  if (e.key === 'Escape') setShowNewPreset(false);
                }}
              />
              <Select value={copyFromPreset ?? 'empty'} onValueChange={(v) => setCopyFromPreset(v === 'empty' ? undefined : v)}>
                <SelectTrigger className="w-40 rounded-lg text-xs"><SelectValue placeholder="Copiar de..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="empty">Vazio</SelectItem>
                  {presets.map((p) => (
                    <SelectItem key={p.preset_id} value={p.preset_id}>Copiar: {p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="rounded-lg h-8"
                disabled={!newPresetName.trim() || createPreset.isPending}
                onClick={() => {
                  createPreset.mutateAsync({ name: newPresetName.trim(), copyFromId: copyFromPreset }).then(() => {
                    setShowNewPreset(false);
                    toast.success('Predefinição criada!');
                  });
                }}
              >
                {createPreset.isPending ? '...' : 'Criar'}
              </Button>
              <Button variant="ghost" size="sm" className="rounded-lg h-8" onClick={() => setShowNewPreset(false)}>✕</Button>
            </div>
          )}

          {/* Preset list */}
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => {
              const isEditing = currentPresetId === preset.preset_id;
              const isActive = preset.is_active;
              const isRenaming = renamingPresetId === preset.preset_id;

              return (
                <div
                  key={preset.preset_id}
                  className={`group relative flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                    isEditing
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border/30 hover:border-primary/30'
                  }`}
                  onClick={() => {
                    if (!isRenaming) {
                      setCurrentPresetId(preset.preset_id);
                      setSelectedIdx(null);
                      setHasChanges(false);
                    }
                  }}
                >
                  {isActive && <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                  {isRenaming ? (
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="h-6 text-xs rounded px-1 w-28"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && renameValue.trim()) {
                          renamePreset.mutateAsync({ presetId: preset.preset_id, name: renameValue.trim() });
                          setRenamingPresetId(null);
                        }
                        if (e.key === 'Escape') setRenamingPresetId(null);
                      }}
                      onBlur={() => {
                        if (renameValue.trim()) {
                          renamePreset.mutateAsync({ presetId: preset.preset_id, name: renameValue.trim() });
                        }
                        setRenamingPresetId(null);
                      }}
                    />
                  ) : (
                    <span className="font-medium">{preset.name}</span>
                  )}
                  {isActive && <span className="text-[10px] text-green-600 font-semibold uppercase">Ativa</span>}

                  {/* Actions (visible on hover when editing this preset) */}
                  {isEditing && !isRenaming && (
                    <div className="flex items-center gap-0.5 ml-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingPresetId(preset.preset_id);
                          setRenameValue(preset.name);
                        }}
                        className="p-0.5 hover:text-primary"
                        title="Renomear"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      {!isActive && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              activatePreset.mutateAsync(preset.preset_id).then(() => toast.success(`"${preset.name}" está ativa agora!`));
                            }}
                            className="p-0.5 hover:text-green-600"
                            title="Ativar esta predefinição"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Deletar "${preset.name}"?`)) {
                                deletePreset.mutateAsync(preset.preset_id).then(() => {
                                  if (currentPresetId === preset.preset_id) {
                                    setCurrentPresetId(activePreset?.preset_id ?? 'main');
                                  }
                                  toast.info('Predefinição removida');
                                });
                              }
                            }}
                            className="p-0.5 hover:text-destructive"
                            title="Deletar"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {hasCustom && (
        <div className="text-xs text-accent bg-accent/10 px-3 py-2 rounded-xl">
          ✏️ Usando quiz personalizado salvo no banco. Clique "Restaurar padrão" para voltar ao original.
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
                  {questions.map((q, i) => (
                    <SortableStep
                      key={q.id}
                      q={q}
                      index={i}
                      isSelected={selectedIdx === i}
                      onSelect={() => setSelectedIdx(i)}
                      onRemove={() => removeQuestion(i)}
                      onDuplicate={() => duplicateQuestion(i)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>

        {/* Edit Panel */}
        <Card className="rounded-2xl border-border/30">
          <CardContent className="p-5">
            {selected && selectedIdx !== null ? (
              <div className="space-y-4 animate-fade-in" key={selected.id}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Etapa {selectedIdx + 1}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {typeLabels[selected.type]?.label}
                  </span>
                </div>

                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 rounded-xl h-9">
                    <TabsTrigger value="content" className="text-xs gap-1 rounded-lg"><List className="w-3 h-3" /> Conteúdo</TabsTrigger>
                    <TabsTrigger value="style" className="text-xs gap-1 rounded-lg"><Palette className="w-3 h-3" /> Estilo</TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs gap-1 rounded-lg"><Eye className="w-3 h-3" /> Preview</TabsTrigger>
                  </TabsList>

                  {/* ── Content Tab ── */}
                  <TabsContent value="content" className="space-y-4 mt-4">
                    {/* ID */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">ID (identificador único)</label>
                      <Input value={selected.id} onChange={(e) => updateQuestion(selectedIdx, { id: e.target.value })} className="rounded-xl font-mono text-sm" />
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Pergunta</label>
                      <Input value={selected.title} onChange={(e) => updateQuestion(selectedIdx, { title: e.target.value })} className="rounded-xl" />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Subtítulo</label>
                      <Input value={selected.subtitle ?? ''} onChange={(e) => updateQuestion(selectedIdx, { subtitle: e.target.value })} className="rounded-xl" />
                    </div>

                    {/* Slider config */}
                    {isSlider && (
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Mínimo</label>
                          <Input type="number" value={selected.sliderMin ?? 0} onChange={(e) => updateQuestion(selectedIdx, { sliderMin: Number(e.target.value) })} className="rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Máximo</label>
                          <Input type="number" value={selected.sliderMax ?? 10} onChange={(e) => updateQuestion(selectedIdx, { sliderMax: Number(e.target.value) })} className="rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Unidade</label>
                          <Input value={selected.sliderUnit ?? ''} onChange={(e) => updateQuestion(selectedIdx, { sliderUnit: e.target.value })} className="rounded-xl" />
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
                                <Input value={opt.emoji ?? ''} onChange={(e) => updateOption(selectedIdx, oi, { emoji: e.target.value })} className="w-14 text-center rounded-lg" placeholder="😊" />
                                <Input value={opt.label} onChange={(e) => updateOption(selectedIdx, oi, { label: e.target.value })} className="flex-1 rounded-lg" placeholder="Label" />
                                <button onClick={() => removeOption(selectedIdx, oi)} className="p-1 text-muted-foreground hover:text-destructive">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <Input value={opt.value} onChange={(e) => updateOption(selectedIdx, oi, { value: e.target.value })} className="rounded-lg font-mono text-xs" placeholder="value" />
                              <Input value={opt.description ?? ''} onChange={(e) => updateOption(selectedIdx, oi, { description: e.target.value })} className="rounded-lg text-sm" placeholder="Descrição" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* ── Style Tab ── */}
                  <TabsContent value="style" className="space-y-4 mt-4">
                    {/* Question Type */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <LayoutGrid className="w-3 h-3" /> Tipo de Pergunta
                      </p>
                      <Select value={selected.type} onValueChange={(v) => updateQuestion(selectedIdx, { type: v as QuestionType })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(typeLabels).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Option Layout */}
                    {!['slider', 'selfie'].includes(selected.type) && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Layout das Respostas</p>
                        <div className="grid grid-cols-2 gap-2">
                          {([
                            { value: 'vertical' as OptionLayout, label: 'Vertical', desc: 'Lista completa' },
                            { value: 'horizontal' as OptionLayout, label: 'Horizontal', desc: 'Grade lado a lado' },
                          ]).map((opt) => {
                            const isActive = (selected.styles?.optionLayout ?? 'vertical') === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => updateStyles(selectedIdx, { optionLayout: opt.value })}
                                className={`p-3 rounded-xl border-2 text-left transition-all ${
                                  isActive
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                    : 'border-border/40 hover:border-primary/30'
                                }`}
                              >
                                <div className="flex flex-col gap-1">
                                  {opt.value === 'vertical' ? (
                                    <div className="flex flex-col gap-0.5">
                                      <div className="h-1.5 w-full rounded bg-muted-foreground/20" />
                                      <div className="h-1.5 w-full rounded bg-muted-foreground/20" />
                                      <div className="h-1.5 w-full rounded bg-muted-foreground/20" />
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-2 gap-0.5">
                                      <div className="h-3 rounded bg-muted-foreground/20" />
                                      <div className="h-3 rounded bg-muted-foreground/20" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs font-semibold mt-2">{opt.label}</p>
                                <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Typography */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Type className="w-3 h-3" /> Tipografia
                      </p>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Fonte do título</label>
                          <Select value={selected.styles?.fontFamily || 'default'} onValueChange={(v) => updateStyles(selectedIdx, { fontFamily: v === 'default' ? '' : v })}>
                            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Padrão" /></SelectTrigger>
                            <SelectContent>
                              {FONT_OPTIONS.map(f => (
                                <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value === 'default' ? undefined : f.value }}>{f.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Tamanho</label>
                            <Select value={selected.styles?.fontSize || 'default'} onValueChange={(v) => updateStyles(selectedIdx, { fontSize: v === 'default' ? '' : v })}>
                              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Padrão" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">Padrão</SelectItem>
                                <SelectItem value="1rem">Pequeno</SelectItem>
                                <SelectItem value="1.25rem">Médio</SelectItem>
                                <SelectItem value="1.5rem">Grande</SelectItem>
                                <SelectItem value="1.875rem">Extra grande</SelectItem>
                                <SelectItem value="2.25rem">Gigante</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Peso</label>
                            <Select value={selected.styles?.fontWeight || 'default'} onValueChange={(v) => updateStyles(selectedIdx, { fontWeight: v === 'default' ? '' : v })}>
                              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Padrão" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">Padrão</SelectItem>
                                <SelectItem value="400">Normal</SelectItem>
                                <SelectItem value="500">Médio</SelectItem>
                                <SelectItem value="600">Semibold</SelectItem>
                                <SelectItem value="700">Bold</SelectItem>
                                <SelectItem value="800">Extra Bold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Palette className="w-3 h-3" /> Cores
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Cor do título</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={selected.styles?.titleColor || '#000000'} onChange={(e) => updateStyles(selectedIdx, { titleColor: e.target.value })} className="w-8 h-8 rounded-lg border border-border cursor-pointer" />
                            <Input value={selected.styles?.titleColor ?? ''} onChange={(e) => updateStyles(selectedIdx, { titleColor: e.target.value })} className="rounded-xl text-xs flex-1" placeholder="Padrão" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Cor do subtítulo</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={selected.styles?.subtitleColor || '#888888'} onChange={(e) => updateStyles(selectedIdx, { subtitleColor: e.target.value })} className="w-8 h-8 rounded-lg border border-border cursor-pointer" />
                            <Input value={selected.styles?.subtitleColor ?? ''} onChange={(e) => updateStyles(selectedIdx, { subtitleColor: e.target.value })} className="rounded-xl text-xs flex-1" placeholder="Padrão" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Fundo das opções</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={selected.styles?.optionBgColor || '#ffffff'} onChange={(e) => updateStyles(selectedIdx, { optionBgColor: e.target.value })} className="w-8 h-8 rounded-lg border border-border cursor-pointer" />
                            <Input value={selected.styles?.optionBgColor ?? ''} onChange={(e) => updateStyles(selectedIdx, { optionBgColor: e.target.value })} className="rounded-xl text-xs flex-1" placeholder="Padrão" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Borda das opções</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={selected.styles?.optionBorderColor || '#e5e5e5'} onChange={(e) => updateStyles(selectedIdx, { optionBorderColor: e.target.value })} className="w-8 h-8 rounded-lg border border-border cursor-pointer" />
                            <Input value={selected.styles?.optionBorderColor ?? ''} onChange={(e) => updateStyles(selectedIdx, { optionBorderColor: e.target.value })} className="rounded-xl text-xs flex-1" placeholder="Padrão" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Background gradient */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Gradiente de fundo</p>
                      <div className="grid grid-cols-4 gap-2">
                        {GRADIENT_PRESETS.map((g) => (
                          <button
                            key={g.label}
                            onClick={() => updateStyles(selectedIdx, { bgGradient: g.value === 'none' ? '' : g.value })}
                            className={`h-10 rounded-xl border-2 transition-all text-[9px] font-medium ${
                              (selected.styles?.bgGradient ?? '') === (g.value === 'none' ? '' : g.value)
                                ? 'border-primary ring-1 ring-primary/30'
                                : 'border-border/30 hover:border-primary/30'
                            }`}
                            style={{ background: g.value === 'none' ? 'var(--background)' : g.value }}
                            title={g.label}
                          >
                            {g.value === 'none' && '✕'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reset styles */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={() => updateQuestion(selectedIdx, { styles: {} })}
                    >
                      Limpar todos os estilos
                    </Button>
                  </TabsContent>

                  {/* ── Preview Tab ── */}
                  <TabsContent value="preview" className="mt-4">
                    <p className="text-xs text-muted-foreground mb-3">Prévia de como esta pergunta aparece no quiz:</p>
                    <QuestionPreview question={selected} />
                  </TabsContent>
                </Tabs>
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
