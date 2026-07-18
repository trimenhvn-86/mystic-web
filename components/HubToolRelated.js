import Link from 'next/link';

const ALL_TOOLS = [
  { key: 'doi-lich-am-duong', label: 'Đổi lịch âm dương', href: '/doi-lich-am-duong' },
  { key: 'xem-ngay-tot', label: 'Xem ngày tốt', href: '/xem-ngay-tot' },
  { key: 'gio-hoang-dao', label: 'Giờ hoàng đạo', href: '/gio-hoang-dao' },
  { key: 'ngay-hoang-dao', label: 'Ngày Hoàng đạo', href: '/ngay-hoang-dao' },
  { key: 'ngay-hac-dao', label: 'Ngày Hắc đạo', href: '/ngay-hac-dao' },
  { key: 'can-chi', label: 'Can Chi', href: '/can-chi' },
  { key: 'tiet-khi', label: 'Tiết khí', href: '/tiet-khi' },
  { key: 'xem-ngay', label: 'Xem ngày tốt theo việc', href: '/xem-ngay' }
];

export default function HubToolRelated({ exclude, title = 'Có thể bạn quan tâm:' }) {
  const tools = ALL_TOOLS.filter((t) => t.key !== exclude);
  return (
    <div>
      <p className="text-sm text-moon mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <Link key={t.key} href={t.href} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
