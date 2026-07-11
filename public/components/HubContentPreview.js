import Link from 'next/link';

export default function HubContentPreview({ dictionaryPreview = [], guidePreview = [] }) {
  if (dictionaryPreview.length === 0 && guidePreview.length === 0) return null;

  return (
    <div className="space-y-8">
      {dictionaryPreview.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-lg text-parchment">Từ điển liên quan</h2>
            <Link href="/tu-dien" className="text-xs text-gold-soft hover:underline">Xem tất cả →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {dictionaryPreview.map((t) => (
              <Link key={t.slug} href={`/tu-dien/${t.slug}`} className="mystic-card px-4 py-3 hover:border-gold/40 transition-colors">
                <p className="text-gold-soft text-sm font-medium">{t.title}</p>
                <p className="text-xs text-moon/70 line-clamp-1">{t.shortDefinition}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      {guidePreview.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-lg text-parchment">Cẩm nang liên quan</h2>
            <Link href="/cam-nang" className="text-xs text-gold-soft hover:underline">Xem tất cả →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {guidePreview.map((g) => (
              <Link key={g.slug} href={`/cam-nang/${g.slug}`} className="mystic-card px-4 py-3 hover:border-gold/40 transition-colors">
                <p className="text-gold-soft text-sm font-medium">{g.title}</p>
                <p className="text-xs text-moon/70 line-clamp-2">{g.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
