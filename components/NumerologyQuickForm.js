import { useState } from 'react';
import { useRouter } from 'next/router';
import { Hash, Sparkles } from 'lucide-react';

export default function NumerologyQuickForm() {
  const router = useRouter();
  const today = new Date();
  const [dd, setDd] = useState(today.getDate());
  const [mm, setMm] = useState(today.getMonth() + 1);
  const [yyyy, setYyyy] = useState(today.getFullYear() - 25);

  function goTo(path) {
    router.push(`${path}?dd=${dd}&mm=${mm}&yyyy=${yyyy}`);
  }

  return (
    <div className="mystic-card p-6">
      <p className="text-sm text-moon mb-4">Nhập ngày sinh, sau đó chọn nội dung muốn tra cứu:</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <label className="flex flex-col gap-1 text-xs text-moon">
          Ngày
          <input type="number" min="1" max="31" value={dd} onChange={(e) => setDd(e.target.value)}
            className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-moon">
          Tháng
          <input type="number" min="1" max="12" value={mm} onChange={(e) => setMm(e.target.value)}
            className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-moon">
          Năm
          <input type="number" min="1900" max="2100" value={yyyy} onChange={(e) => setYyyy(e.target.value)}
            className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={() => goTo('/than-so-hoc')}
          className="flex items-center justify-center gap-2 btn-gold py-3 text-sm font-semibold"
        >
          <Hash size={16} /> Tra cứu Thần số học
        </button>
        <button
          onClick={() => goTo('/con-so-may-man')}
          className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gold/40 text-gold-soft text-sm font-semibold hover:bg-gold/10 transition-colors"
        >
          <Sparkles size={16} /> Con số may mắn
        </button>
      </div>
    </div>
  );
}
