interface CircularProgressProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    label: string;
    color?: string;
  }
  
  const CircularProgress = ({ value, size = 100, strokeWidth = 6, label, color }: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
  
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="progress-ring" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth={strokeWidth}
            />
            <circle
              className="progress-ring__circle"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color || "hsl(var(--primary))"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-foreground">{value}%</span>
          </div>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
    );
  };
  
  export default CircularProgress;
  