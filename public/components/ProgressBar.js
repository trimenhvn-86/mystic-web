export default function ProgressBar({ label, value }) {
  const color = value >= 80 ? 'bg-jade' : value >= 60 ? 'bg-gold' : 'bg-vermilion';
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-moon">{label}</span>
        <span className="text-parchment font-medium">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-ink-soft overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
