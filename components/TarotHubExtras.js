import Link from 'next/link';
import { Sparkles, CircleDot, HelpCircle } from 'lucide-react';

const GROUPS = [
  {
    title: 'Hàng ngày',
    items: [{ href: '/tarot-hom-nay', label: 'Tarot hôm nay' }]
  },
  {
    title: 'Rút bài',
    items: [
      { href: '/rut-la-tarot', label: 'Rút 1 lá' },
      { href: '/trai-bai-3-la', label: 'Trải bài 3 lá' },
      { href: '/tarot-yes-no', label: 'Yes / No' }
    ]
  },
  {
    title: 'Tra cứu',
    items: [{ href: '/tarot/bo-bai', label: 'Bộ bài 78 lá' }]
  }
];

export function TarotHeroCTA() {
  return (
    <div className="mb-10">
      <p className="text-moon/80 text-center mb-4">Chọn cách trải bài phù hợp với câu hỏi của bạn:</p>
      <div className="grid sm:grid-cols-3 gap-3">
        <Link href="/tarot-hom-nay" className="flex flex-col items-center gap-2 mystic-card p-5 hover:border-gold/40 transition-colors">
          <Sparkles size={22} className="text-gold" />
          <span className="text-parchment text-sm font-medium">Tarot hôm nay</span>
        </Link>
        <Link href="/rut-la-tarot" className="flex flex-col items-center gap-2 mystic-card p-5 hover:border-gold/40 transition-colors">
          <CircleDot size={22} className="text-gold" />
          <span className="text-parchment text-sm font-medium">Rút 1 lá</span>
        </Link>
        <Link href="/tarot-yes-no" className="flex flex-col items-center gap-2 mystic-card p-5 hover:border-gold/40 transition-colors">
          <HelpCircle size={22} className="text-gold" />
          <span className="text-parchment text-sm font-medium">Yes / No</span>
        </Link>
      </div>
    </div>
  );
}

export default function TarotToolGroups() {
  return (
    <div className="space-y-8">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="text-xs text-moon uppercase tracking-wide mb-3">{group.title}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {group.items.map((tool) => (
              <Link key={tool.href} href={tool.href} className="mystic-card px-4 py-3.5 flex items-center justify-between hover:border-gold/40 transition-colors">
                <span className="text-parchment">{tool.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
