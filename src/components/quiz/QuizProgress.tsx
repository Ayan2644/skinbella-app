interface QuizProgressProps {
  current: number;
  total: number;
}

const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Pergunta {current} de {total}
        </span>
        <span className="text-xs font-semibold text-primary">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;
