import Link from 'next/link';
import { CHI_SLUG } from '../lib/chiSlug';

export default function ConGiapLinks({ basePath, exclude }) {
  const entries = Object.entries(CHI_SLUG).filter(([, slug]) => slug !== exclude);

  return (
    <div className="mt-6">
      <p className="text-sm text-moon mb-3 text-center">Xem tuổi khác:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {entries.map(([chi, slug]) => (
          <Link
            key={slug}
            href={`${basePath}/${slug}`}
            className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
          >
            Tuổi {chi}
          </Link>
        ))}
      </div>
    </div>
  );
}
