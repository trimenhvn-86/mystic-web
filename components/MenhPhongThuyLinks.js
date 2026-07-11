import Link from 'next/link';

export default function MenhPhongThuyLinks({ year, exclude }) {
  const items = [
    { key: 'menh', label: 'Tra cứu mệnh', href: year ? `/${year}-menh-gi` : '/menh-ngu-hanh' },
    { key: 'mau', label: 'Màu hợp mệnh', href: year ? `/${year}-hop-mau-gi` : '/mau-sac-hop-menh' },
    { key: 'da', label: 'Đá phong thủy', href: year ? `/${year}-hop-da-gi` : '/da-phong-thuy' },
    { key: 'huong', label: 'Hướng nhà hợp tuổi', href: '/huong-nha-hop-tuoi' }
  ].filter((i) => i.key !== exclude);

  return (
    <div className="mt-6">
      <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <Link
            key={i.key}
            href={i.href}
            className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
          >
            {i.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
