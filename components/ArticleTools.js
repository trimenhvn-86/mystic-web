import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Hash, Layers, Users, Sun, CircleDot } from 'lucide-react';

const KIM_LAU = {
  1: 'Kim Lâu Thân (ảnh hưởng bản thân)',
  3: 'Kim Lâu Thê (ảnh hưởng vợ)',
  6: 'Kim Lâu Tử (ảnh hưởng con)',
  8: 'Kim Lâu Lục súc (ảnh hưởng vật nuôi)'
};

/** Ô tính Kim Lâu: đúng công thức trong bài (tuổi mụ chia 9, dư 1, 3, 6, 8 là phạm). */
export function KimLauCalc({ year = 2027 }) {
  const [birth, setBirth] = useState('');
  const [res, setRes] = useState(null);
  function submit(e) {
    e.preventDefault();
    const b = parseInt(birth, 10);
    if (!b || b < 1900 || b > year) { setRes({ error: true }); return; }
    const age = year - b + 1;
    const r = age % 9;
    setRes({ age, r, hit: !!KIM_LAU[r], label: KIM_LAU[r], b });
  }
  return (
    <div className="mystic-card p-5 sm:p-6 not-prose">
      <p className="font-display font-bold text-parchment text-lg leading-snug">Kiểm tra Kim Lâu năm {year}</p>
      <p className="text-sm text-moon mt-1">Nhập năm sinh, có kết quả ngay và thấy cách tính.</p>
      <form onSubmit={submit} className="mt-4 flex gap-2">
        <label htmlFor="kimlau-y" className="sr-only">Năm sinh</label>
        <input id="kimlau-y" inputMode="numeric" value={birth} onChange={(e) => setBirth(e.target.value)} placeholder="Ví dụ: 1995"
          className="flex-1 min-w-0 bg-ink border border-ink-line rounded-md px-3 py-2.5 text-parchment focus:border-lich" />
        <button type="submit" className="btn-gold px-5 py-2.5 text-sm whitespace-nowrap">Kiểm tra</button>
      </form>
      {res?.error && <p role="alert" className="mt-3 text-sm text-vermilion">Nhập năm sinh từ 1900 đến {year}.</p>}
      {res && !res.error && (
        <div className="mt-4 text-sm" role="status">
          <p className={`inline-block font-semibold px-2.5 py-1 rounded ${res.hit ? 'bg-vermilion text-white' : 'bg-jade text-white'}`}>
            {res.hit ? `Phạm ${res.label}` : 'Không phạm Kim Lâu'}
          </p>
          <p className="mt-3 text-moon leading-relaxed">
            Tuổi mụ = {year} − {res.b} + 1 = <strong className="text-parchment">{res.age}</strong>. {res.age} chia 9 dư <strong className="text-parchment">{res.r}</strong>.
            {res.hit ? ' Dư 1, 3, 6 hoặc 8 là phạm.' : ' Chỉ dư 1, 3, 6 hoặc 8 mới phạm.'}
          </p>
        </div>
      )}
    </div>
  );
}

const BY_HUB = {
  'lich-ngay-tot': { icon: CalendarDays, title: 'Chọn ngày cho việc của bạn', text: 'Chọn ngày, xem ngay tốt hay xấu, giờ đẹp và việc nên làm.', href: '/xem-ngay-tot', button: 'Xem ngày tốt' },
  'tu-vi': { icon: Sun, title: 'Xem tử vi hôm nay theo con giáp', text: 'Chọn tuổi của bạn để xem vận trình trong ngày.', href: '/tu-vi-hom-nay', button: 'Xem tử vi' },
  'menh-phong-thuy': { icon: Layers, title: 'Tra mệnh theo năm sinh', text: 'Nhập năm sinh, biết ngay mệnh, màu hợp và hướng nhà.', href: '/menh-ngu-hanh', button: 'Tra mệnh' },
  'tuoi-tuong-hop': { icon: Users, title: 'Xem tuổi hợp, tuổi kỵ', text: 'Chọn năm sinh để xem tuổi hợp làm ăn, kết hôn.', href: '/tuoi-hop', button: 'Xem tuổi hợp' },
  'tarot': { icon: CircleDot, title: 'Rút một lá bài tarot', text: 'Rút bài miễn phí, có giải nghĩa xuôi và ngược.', href: '/tarot-hom-nay', button: 'Rút bài' },
  'than-so-hoc': { icon: Hash, title: 'Lập biểu đồ thần số học', text: 'Nhập ngày sinh để tính số chủ đạo và các chỉ số.', href: '/than-so-hoc', button: 'Tính số của tôi' }
};

/** Khối công cụ giữa bài: chọn theo chuyên mục của bài, riêng bài Kim Lâu có ô tính. */
export default function ArticleTool({ hub, slug = '' }) {
  if (/kim-lau/.test(slug)) {
    const m = slug.match(/20\d\d/);
    return <KimLauCalc year={m ? parseInt(m[0], 10) : 2027} />;
  }
  const t = BY_HUB[hub] || BY_HUB['lich-ngay-tot'];
  const Icon = t.icon;
  return (
    <aside className="mystic-card p-5 flex items-center gap-4">
      <Icon size={26} className="text-lich flex-shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-parchment leading-snug">{t.title}</p>
        <p className="text-sm text-moon mt-0.5">{t.text}</p>
      </div>
      <Link href={t.href} className="btn-line px-4 py-2.5 text-sm inline-flex items-center gap-2 whitespace-nowrap">
        {t.button} <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </aside>
  );
}
