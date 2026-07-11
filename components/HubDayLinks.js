import Link from 'next/link';

function pad(n) { return String(n).padStart(2, '0'); }

const ALL_TOOLS = [
  { key: 'doi-lich-am-duong', label: 'Đổi lịch âm dương', path: 'doi-lich-am-duong' },
  { key: 'xem-ngay-tot', label: 'Xem ngày tốt', path: 'xem-ngay-tot' },
  { key: 'gio-hoang-dao', label: 'Giờ hoàng đạo', path: 'gio-hoang-dao' },
  { key: 'ngay-hoang-dao', label: 'Ngày Hoàng đạo', path: 'ngay-hoang-dao' },
  { key: 'ngay-hac-dao', label: 'Ngày Hắc đạo', path: 'ngay-hac-dao' },
  { key: 'can-chi', label: 'Can Chi', path: 'can-chi' },
  { key: 'tiet-khi', label: 'Tiết khí', path: 'tiet-khi' }
];

export default function HubDayLinks({ dd, mm, yyyy, exclude }) {
  const slug = `ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`;
  const tools = ALL_TOOLS.filter((t) => t.key !== exclude);

  return (
    <div className="mt-6">
      <p className="text-sm text-moon mb-3">Xem thêm về ngày {pad(dd)}/{pad(mm)}/{yyyy}:</p>
      <div className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <Link
            key={t.key}
            href={`/${t.path}/${slug}`}
            className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
          >
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
