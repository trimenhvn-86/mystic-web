import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Hash } from 'lucide-react';

const CORE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

export default function NumerologyQuickForm() {
  const router = useRouter();
  const today = new Date();
  const [hoTen, setHoTen] = useState('');
  const [dd, setDd] = useState(today.getDate());
  const [mm, setMm] = useState(today.getMonth() + 1);
  const [yyyy, setYyyy] = useState(today.getFullYear() - 25);

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams({ dd, mm, yyyy, hoTen: hoTen.trim() });
    router.push(`/than-so-hoc?${params.toString()}`);
  }

  function goToLuckyNumber() {
    router.push(`/con-so-may-man?dd=${dd}&mm=${mm}&yyyy=${yyyy}`);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mystic-card p-6">
        <p className="text-sm text-moon mb-4">Nhập ngày sinh và họ tên để lập biểu đồ:</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
            Ngày
            <input type="number" min="1" max="31" required value={dd} onChange={(e) => setDd(e.target.value)}
              className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
            Tháng
            <input type="number" min="1" max="12" required value={mm} onChange={(e) => setMm(e.target.value)}
              className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
            Năm
            <input type="number" min="1900" max="2100" required value={yyyy} onChange={(e) => setYyyy(e.target.value)}
              className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-xs text-moon min-w-0 mb-4">
          Họ và tên đầy đủ
          <input type="text" required value={hoTen} onChange={(e) => setHoTen(e.target.value)}
            placeholder="Nhập họ và tên đầy đủ"
            className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
        </label>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 btn-gold py-3 text-sm font-semibold"
        >
          <Hash size={16} /> Tra cứu Thần số học
        </button>
        <button
          type="button"
          onClick={goToLuckyNumber}
          className="w-full text-center text-sm text-gold-soft hover:underline mt-3"
        >
          Khám phá Con số may mắn hôm nay →
        </button>
      </form>

      <div className="mt-8">
        <p className="text-sm text-moon mb-3">Tra cứu nhanh — ý nghĩa từng Số Chủ Đạo:</p>
        <div className="flex flex-wrap gap-2">
          {CORE_NUMBERS.map((n) => (
            <Link
              key={n}
              href={`/than-so-hoc/so-chu-dao-${n}`}
              className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
            >
              Số {n}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
