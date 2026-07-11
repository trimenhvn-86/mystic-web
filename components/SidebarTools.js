import Link from 'next/link';
import { Sparkles, Hash, Users, Layers } from 'lucide-react';

const ITEMS = [
  { href: '/xem-ngay-tot', label: 'Xem ngày tốt', icon: Sparkles },
  { href: '/than-so-hoc', label: 'Thần số học', icon: Hash },
  { href: '/con-so-may-man', label: 'Con số may mắn', icon: Layers },
  { href: '/tu-vi-hom-nay', label: 'Tử vi hôm nay', icon: Users }
];

export default function SidebarTools({ year }) {
  return (
    <aside className="hidden lg:block sticky top-20 space-y-4">
      <div className="mystic-card p-5">
        <p className="text-xs text-moon uppercase mb-3">Công cụ phổ biến</p>
        <div className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-2.5 py-2 text-sm text-parchment/85 hover:text-gold-soft transition-colors">
                <Icon size={16} className="text-gold" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      {year && (
        <div className="mystic-card p-5">
          <p className="text-xs text-moon uppercase mb-3">Bạn sinh năm {year}?</p>
          <div className="flex flex-col gap-1">
            <Link href={`/${year}-menh-gi`} className="text-sm text-parchment/85 hover:text-gold-soft transition-colors py-1">→ Xem mệnh</Link>
            <Link href={`/${year}-hop-tuoi-nao`} className="text-sm text-parchment/85 hover:text-gold-soft transition-colors py-1">→ Xem tuổi hợp</Link>
          </div>
        </div>
      )}
    </aside>
  );
}
