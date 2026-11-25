import Link from 'next/link';

/**
 * Breadcrumb dung chung toan site.
 * trail: mang cac { label, href } trung gian (khong bao gom "Trang chu" va muc hien tai)
 * current: nhan cua trang hien tai (khong co href, khong the bam)
 *
 * Vi du:
 * <Breadcrumb trail={[{ label: 'Mệnh & Phong Thủy', href: '/menh-phong-thuy-hub' }]} current="Tra cứu mệnh" />
 * => Trang chủ / Mệnh & Phong Thủy / Tra cứu mệnh
 */
export default function Breadcrumb({ trail = [], current }) {
  const items = [{ label: 'Trang chủ', href: '/' }, ...trail, { label: current }];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://trimenh.com${item.href === '/' ? '' : item.href}` } : {})
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-moon mb-6">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="hover:text-gold-soft transition-colors">{item.label}</Link>
            ) : (
              <span className="text-parchment/70">{item.label}</span>
            )}
            {i < items.length - 1 && <span>/</span>}
          </span>
        ))}
      </div>
    </>
  );
}
