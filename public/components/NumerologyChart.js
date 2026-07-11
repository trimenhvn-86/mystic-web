/**
 * Biểu đồ lưới Pythagoras (Birth Chart) - sắp xếp cố định theo vị trí truyền thống:
 * 3  6  9
 * 2  5  8
 * 1  4  7
 * Mỗi ô hiện số lần chữ số đó xuất hiện trong ngày sinh (dd+mm+yyyy).
 */
const GRID_LAYOUT = [
  [3, 6, 9],
  [2, 5, 8],
  [1, 4, 7]
];

export default function NumerologyChart({ dd, mm, yyyy }) {
  const digits = `${dd}${mm}${yyyy}`.split('').map(Number);
  const counts = {};
  digits.forEach((d) => {
    if (d >= 1 && d <= 9) counts[d] = (counts[d] || 0) + 1;
  });

  return (
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
      {GRID_LAYOUT.flat().map((n) => {
        const count = counts[n] || 0;
        return (
          <div
            key={n}
            className={`aspect-square rounded-lg border flex flex-col items-center justify-center ${
              count > 0 ? 'bg-gold/10 border-gold/40' : 'bg-ink-soft border-ink-line'
            }`}
          >
            <span className={`font-display text-lg ${count > 0 ? 'text-gold-soft' : 'text-moon/30'}`}>
              {count > 0 ? n.toString().repeat(count) : n}
            </span>
          </div>
        );
      })}
    </div>
  );
}
