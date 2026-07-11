const SUIT_COLOR = {
  wands: '#D98A3D',
  cups: '#4A90D9',
  swords: '#9AA5B8',
  pentacles: '#3E8E7E'
};
const MAJOR_COLOR = '#C9A24B';

const SUIT_SYMBOL = {
  wands: (color) => <path d="M50 20 L50 80" stroke={color} strokeWidth="4" strokeLinecap="round" />,
  cups: (color) => (
    <path
      d="M32 30 Q32 55 50 55 Q68 55 68 30 Z M50 55 L50 75 M38 78 L62 78"
      fill="none"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  swords: (color) => (
    <path d="M50 15 L50 70 M40 60 L60 60 M45 75 L55 75" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
  ),
  pentacles: (color) => (
    <g fill="none" stroke={color} strokeWidth="3">
      <circle cx="50" cy="48" r="26" />
      <path d="M50 24 L58 44 L80 44 L62 57 L69 78 L50 65 L31 78 L38 57 L20 44 L42 44 Z" strokeWidth="2" />
    </g>
  )
};

function MajorSymbol({ color }) {
  return (
    <g fill="none" stroke={color} strokeWidth="3">
      <path d="M50 15 L58 40 L83 40 L63 55 L71 80 L50 65 L29 80 L37 55 L17 40 L42 40 Z" />
    </g>
  );
}

function toRoman(num) {
  if (num === 0) return '0';
  const map = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let n = num;
  let result = '';
  for (const [val, sym] of map) {
    while (n >= val) {
      result += sym;
      n -= val;
    }
  }
  return result;
}

export default function TarotCardArt({ card, upright = true, size = 200 }) {
  const color = card.arcana === 'major' ? MAJOR_COLOR : SUIT_COLOR[card.suit] || MAJOR_COLOR;
  const height = size * 1.6;

  return (
    <div
      className="rounded-2xl overflow-hidden border-2 shadow-xl transition-transform"
      style={{
        width: size,
        height,
        borderColor: color,
        background: 'linear-gradient(160deg, #141830 0%, #0B0E1A 100%)',
        transform: upright ? 'none' : 'rotate(180deg)'
      }}
    >
      <svg viewBox="0 0 100 160" width="100%" height="100%">
        <rect x="6" y="6" width="88" height="148" rx="6" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />

        <text x="14" y="22" fontSize="9" fill={color} fontFamily="serif" fontWeight="700">
          {card.arcana === 'major' ? toRoman(card.number) : card.number}
        </text>

        <g transform="translate(0,10)">
          {card.arcana === 'major' ? <MajorSymbol color={color} /> : SUIT_SYMBOL[card.suit]?.(color)}
        </g>

        <text x="50" y="130" fontSize="8" fill={color} fontFamily="sans-serif" fontWeight="700" textAnchor="middle" letterSpacing="0.5">
          {card.nameVi.toUpperCase()}
        </text>
        <text x="50" y="141" fontSize="6" fill="#8D96B8" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">
          {card.nameEn}
        </text>
      </svg>
    </div>
  );
}
