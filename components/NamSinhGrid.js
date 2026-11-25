import Link from 'next/link';

const KINDS = {
  'menh-gi': { suffix: 'menh-gi', title: 'Tra mệnh theo năm sinh', label: (y) => y },
  'hop-tuoi-nao': { suffix: 'hop-tuoi-nao', title: 'Tuổi hợp theo năm sinh', label: (y) => y },
  'hop-mau-gi': { suffix: 'hop-mau-gi', title: 'Màu hợp mệnh theo năm sinh', label: (y) => y },
  'hop-da-gi': { suffix: 'hop-da-gi', title: 'Đá phong thủy theo năm sinh', label: (y) => y }
};

/** Lưới liên kết tới trang /<năm>-<kind>, nhóm theo thập niên. Giúp Google và người dùng tìm thấy mọi trang năm sinh. */
export default function NamSinhGrid({ kind = 'menh-gi', from = 1950, to }) {
  const k = KINDS[kind] || KINDS['menh-gi'];
  const end = to || new Date().getFullYear();
  const decades = [];
  for (let d = Math.floor(end / 10) * 10; d >= Math.floor(from / 10) * 10; d -= 10) {
    const years = [];
    for (let y = Math.min(d + 9, end); y >= Math.max(d, from); y--) years.push(y);
    if (years.length) decades.push({ d, years });
  }
  return (
    <section className="mt-10" aria-label={k.title}>
      <h2 className="font-display text-lg text-parchment mb-3">{k.title}</h2>
      <div className="space-y-2">
        {decades.map(({ d, years }) => (
          <div key={d} className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-moon/60 w-14 shrink-0">Thập niên {d}</span>
            {years.map((y) => (
              <Link key={y} href={`/${y}-${k.suffix}`} className="px-2.5 py-1 rounded border border-ink-line text-xs text-moon hover:border-lich hover:text-gold-soft transition-colors">
                {k.label(y)}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
