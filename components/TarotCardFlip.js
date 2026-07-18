import { useState } from 'react';
import TarotCardArt from './TarotCardArt';

export default function TarotCardFlip({ card, upright, flipped, onFlip, size = 200, responsive = false, hint = true }) {
  const [animating, setAnimating] = useState(false);
  const height = size * 1.6;
  const responsiveClass = responsive
    ? 'w-[220px] h-[352px] sm:w-[280px] sm:h-[448px] lg:w-[340px] lg:h-[544px]'
    : '';

  function handleClick() {
    if (flipped || animating) return;
    setAnimating(true);
    onFlip();
    setTimeout(() => setAnimating(false), 650);
  }

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      style={{ ...(responsive ? {} : { width: size, height }), perspective: 1000, cursor: flipped ? 'default' : 'pointer' }}
      className={`mx-auto select-none ${responsiveClass}`}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0.1, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        <div
          style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}
          className="rounded-2xl border-2 border-gold/50 bg-ink-soft flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full border-2 border-gold/60 flex items-center justify-center">
            <span className="text-gold font-display text-lg">TM</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {card && <TarotCardArt card={card} upright={upright} size={size} responsive={responsive} />}
        </div>
      </div>
      {!flipped && hint && (
        <p className="text-center text-xs text-moon/60 mt-3">Bấm vào lá bài để rút</p>
      )}
    </div>
  );
}
