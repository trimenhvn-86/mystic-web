import Link from 'next/link';
import { HA_DO } from '../lib/luckyNumber';

const COLOR_DOT = {
  'Trắng': 'bg-gray-100', 'Xám': 'bg-gray-400', 'Ánh kim': 'bg-yellow-100',
  'Xanh lá': 'bg-jade', 'Xanh rêu': 'bg-jade',
  'Đen': 'bg-black', 'Xanh dương đậm': 'bg-blue-900',
  'Đỏ': 'bg-vermilion', 'Cam': 'bg-orange-500', 'Hồng': 'bg-pink-400',
  'Vàng đất': 'bg-yellow-700', 'Nâu': 'bg-yellow-900'
};

export default function MauSoHomNay({ hanh, mauHop }) {
  const numbers = HA_DO[hanh] || [];
  return (
    <div className="mystic-card p-6 grid sm:grid-cols-2 gap-6">
      <div>
        <p className="text-xs text-moon uppercase mb-3">Hôm nay hợp màu gì?</p>
        <div className="flex flex-wrap gap-2">
          {mauHop.map((m) => {
            const baseColor = m.split(' (')[0];
            return (
              <span key={m} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-soft border border-ink-line text-sm">
                <span className={`w-2.5 h-2.5 rounded-full ${COLOR_DOT[baseColor] || 'bg-gold'}`} />
                {m}
              </span>
            );
          })}
        </div>
      </div>
      <div>
        <p className="text-xs text-moon uppercase mb-3">Hôm nay hợp số nào?</p>
        <div className="flex gap-2 mb-3">
          {numbers.map((n) => (
            <span key={n} className="w-9 h-9 rounded-full bg-gold text-ink font-display text-lg flex items-center justify-center">
              {n}
            </span>
          ))}
        </div>
        <Link href="/than-so-hoc" className="text-xs text-gold-soft hover:underline">
          Xem thêm với Thần số học →
        </Link>
      </div>
    </div>
  );
}
