import { useState } from 'react';
import { getLucNham } from '../lib/lucNham';

const GIO_OPTIONS = [
  { label: 'Tý (23h-1h)', hour: 23 },
  { label: 'Sửu (1h-3h)', hour: 1 },
  { label: 'Dần (3h-5h)', hour: 3 },
  { label: 'Mão (5h-7h)', hour: 5 },
  { label: 'Thìn (7h-9h)', hour: 7 },
  { label: 'Tỵ (9h-11h)', hour: 9 },
  { label: 'Ngọ (11h-13h)', hour: 11 },
  { label: 'Mùi (13h-15h)', hour: 13 },
  { label: 'Thân (15h-17h)', hour: 15 },
  { label: 'Dậu (17h-19h)', hour: 17 },
  { label: 'Tuất (19h-21h)', hour: 19 },
  { label: 'Hợi (21h-23h)', hour: 21 }
];

export default function LucNhamPicker({ lunarDay, lunarMonth }) {
  const [hour, setHour] = useState(GIO_OPTIONS[0].hour);
  const result = getLucNham(lunarDay, lunarMonth, hour);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-moon block mb-2">Chọn giờ dự định xuất hành:</label>
        <select
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="w-full bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
        >
          {GIO_OPTIONS.map((g) => (
            <option key={g.hour} value={g.hour}>Giờ {g.label}</option>
          ))}
        </select>
      </div>

      <div className={`rounded-lg border p-4 ${result.tot ? 'border-jade/40 bg-jade/5' : 'border-vermilion/40 bg-vermilion/5'}`}>
        <p className="flex items-center gap-2 mb-2">
          <span className="font-display text-xl text-gold-soft">Giờ {result.ten}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${result.tot ? 'text-jade border border-jade/40' : 'text-vermilion border border-vermilion/40'}`}>
            {result.tot ? 'Tốt' : 'Không nên đi'}
          </span>
        </p>
        <p className="text-sm text-parchment/90">{result.text}</p>
        {result.huong && <p className="text-sm text-moon mt-2">Hướng cầu tài gợi ý: <strong className="text-parchment">{result.huong}</strong></p>}
      </div>
      <p className="text-xs text-moon/50">
        * Cách tính theo Lục Nhâm Tướng Pháp (Lý Thuần Phong) — mang tính tham khảo, chiêm nghiệm dân gian.
      </p>
    </div>
  );
}
