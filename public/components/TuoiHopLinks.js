import Link from 'next/link';

const ALL_TOOLS = [
  { key: 'tuoi-hop', label: 'Tuổi hợp theo năm sinh', href: '/tuoi-hop' },
  { key: 'so-sanh-tuoi', label: 'So sánh tuổi 2 người', href: '/so-sanh-tuoi' },
  { key: 'xem-tuoi-ket-hon', label: 'Xem tuổi kết hôn', href: '/xem-tuoi-ket-hon' },
  { key: 'xem-tuoi-lam-an', label: 'Xem tuổi làm ăn', href: '/xem-tuoi-lam-an' }
];

export default function TuoiHopLinks({ exclude }) {
  const tools = ALL_TOOLS.filter((t) => t.key !== exclude);

  return (
    <div className="mt-6">
      <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
      <div className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
          >
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
