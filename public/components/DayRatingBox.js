import { Star, Check, X } from 'lucide-react';

export default function DayRatingBox({ stars, label, nenLam, kiengKy }) {
  return (
    <div className="mystic-card p-6">
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={22}
            className={i <= stars ? 'fill-gold text-gold' : 'text-ink-line'}
          />
        ))}
      </div>
      <p className="font-display text-xl text-gold-soft mb-4">{label}</p>
      <div className="grid sm:grid-cols-2 gap-2">
        {nenLam.slice(0, 3).map((v) => (
          <div key={v} className="flex items-center gap-2 text-sm text-parchment/90">
            <Check size={16} className="text-jade flex-shrink-0" /> {v}
          </div>
        ))}
        {kiengKy.slice(0, 2).map((v) => (
          <div key={v} className="flex items-center gap-2 text-sm text-parchment/60">
            <X size={16} className="text-vermilion flex-shrink-0" /> {v}
          </div>
        ))}
      </div>
    </div>
  );
}
