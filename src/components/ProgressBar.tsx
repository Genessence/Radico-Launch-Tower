interface Props {
  value: number;
  className?: string;
}

export default function ProgressBar({ value, className = "" }: Props) {
  return (
    <div className={`h-2 w-full bg-muted rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
