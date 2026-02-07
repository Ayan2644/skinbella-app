interface QuizProgressProps {
  current: number;
  total: number;
}

const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full px-4 py-3">
      <div className="h-[6px] rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
          }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;
