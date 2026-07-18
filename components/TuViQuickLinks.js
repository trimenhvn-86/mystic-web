import Link from 'next/link';
import { CHI_SLUG } from '../lib/chiSlug';

export default function TuViQuickLinks() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-moon mb-3">Tra cứu theo thời gian:</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/tu-vi-hom-nay" className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Tử vi hôm nay</Link>
          <Link href="/tu-vi-tuan" className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Tử vi tuần này</Link>
          <Link href="/tu-vi-thang" className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Tử vi tháng này</Link>
        </div>
      </div>
      <div>
        <p className="text-sm text-moon mb-3">Tra cứu theo 12 con giáp (tử vi hôm nay):</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CHI_SLUG).map(([chi, slug]) => (
            <Link key={slug} href={`/tu-vi-hom-nay/${slug}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">
              Tuổi {chi}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
