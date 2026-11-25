import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import AdSlot from './AdSlot';
import SidebarTools from './SidebarTools';
import Footer from './Footer';

export const PER_PAGE = 12;
const pageHref = (n) => (n <= 1 ? '/cam-nang' : `/cam-nang/trang/${n}`);

function pageList(page, total) {
  const set = new Set([1, total, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push('…');
    out.push(n);
  });
  return out;
}

export default function CamNangList({ posts, page, totalPages }) {
  const desc = 'Hướng dẫn thực tế: cách xem ngày tốt, chọn màu hợp mệnh, xem giờ hoàng đạo và nhiều chủ đề huyền học khác.';
  const title = page > 1 ? `Cẩm nang — Trang ${page} — TriMenh` : 'Cẩm nang — TriMenh';
  const cell = 'min-w-[2.75rem] h-11 px-3 inline-flex items-center justify-center rounded-md border text-sm';
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <link rel="canonical" href={`https://trimenh.com${pageHref(page)}`} />
        {page > 1 && <link rel="prev" href={`https://trimenh.com${pageHref(page - 1)}`} />}
        {page < totalPages && <link rel="next" href={`https://trimenh.com${pageHref(page + 1)}`} />}
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0">
          <Breadcrumb trail={page > 1 ? [{ label: 'Cẩm nang', href: '/cam-nang' }] : []} current={page > 1 ? `Trang ${page}` : 'Cẩm nang'} />
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-parchment mb-2">Cẩm nang</h1>
          <p className="text-moon max-w-xl mb-8">
            Hướng dẫn thực tế, từ chọn ngày cưới đến xem hướng nhà. Mỗi bài có ví dụ cụ thể để bạn làm theo được ngay.
          </p>

          {posts.length > 0 ? (
            <div className="divide-y divide-ink-line border-t border-ink-line">
              {posts.map((p) => (
                <Link key={p.slug} href={`/cam-nang/${p.slug}`} className="flex gap-4 py-5 group">
                  {p.featuredImageUrl && (
                    <div className="relative w-28 sm:w-44 aspect-[1200/630] flex-shrink-0 rounded-md overflow-hidden border border-ink-line self-start">
                      <Image src={p.featuredImageUrl} alt="" fill className="object-cover" sizes="176px" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-display font-bold text-lg text-parchment group-hover:text-lich transition-colors leading-snug">{p.title}</p>
                    <p className="text-sm text-moon mt-1 line-clamp-2">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mystic-card p-8 text-center"><p className="text-moon">Chưa có bài cẩm nang nào.</p></div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Phân trang" className="mt-8 flex flex-wrap items-center gap-2">
              {page > 1 && <Link href={pageHref(page - 1)} rel="prev" className={`${cell} border-ink-line bg-white text-parchment hover:border-parchment`}>Trước</Link>}
              {pageList(page, totalPages).map((n, i) => n === '…'
                ? <span key={`d${i}`} className="px-1 text-moon">…</span>
                : n === page
                  ? <span key={n} aria-current="page" className={`${cell} bg-lich border-lich text-white font-semibold`}>{n}</span>
                  : <Link key={n} href={pageHref(n)} className={`${cell} border-ink-line bg-white text-parchment hover:border-parchment`}>{n}</Link>)}
              {page < totalPages && <Link href={pageHref(page + 1)} rel="next" className={`${cell} border-ink-line bg-white text-parchment hover:border-parchment`}>Sau</Link>}
            </nav>
          )}
          <AdSlot label="cam-nang-muc-luc" className="mt-8" />
        </main>
        <SidebarTools seed="cam-nang-ds" />
      </div>
      <Footer />
    </>
  );
}
