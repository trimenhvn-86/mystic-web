import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import AdSlot from '../../components/AdSlot';
import SidebarTools from '../../components/SidebarTools';
import Footer from '../../components/Footer';
import { getGuidePosts, isConfigured } from '../../lib/content';

import { coverFor } from '../../lib/cover';

export async function getStaticProps() {
  const posts = await getGuidePosts();
  const withCover = posts.map((p) => ({ ...p, featuredImageUrl: coverFor(p.slug, p.featuredImageUrl) }));
  return { props: { posts: withCover, cmsConfigured: isConfigured }, revalidate: posts.length === 0 ? 300 : 3600 };
}

export default function CamNangIndex({ posts, cmsConfigured }) {
  return (
    <>
      <Head>
        <title>Cẩm nang — TriMenh</title>
        <meta name="description" content="Hướng dẫn thực tế: cách xem ngày tốt, chọn màu hợp mệnh, xem giờ hoàng đạo và nhiều chủ đề huyền học khác." />
        <meta property="og:title" content={"Cẩm nang — TriMenh"} />
        <meta property="og:description" content="Hướng dẫn thực tế: cách xem ngày tốt, chọn màu hợp mệnh, xem giờ hoàng đạo và nhiều chủ đề huyền học khác." />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0">
          <Breadcrumb trail={[]} current="Cẩm nang" />
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-parchment mb-2">Cẩm nang</h1>
          <p className="text-moon max-w-xl mb-8">
            Hướng dẫn thực tế, từ chọn ngày cưới đến xem hướng nhà. Mỗi bài có ví dụ cụ thể để bạn làm theo được ngay.
          </p>

          {posts.length > 0 ? (
            <div className="divide-y divide-ink-line border-t-2 border-parchment">
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
            <div className="mystic-card p-8 text-center">
              <p className="text-moon">Chưa có bài cẩm nang nào.</p>
            </div>
          )}
          <AdSlot label="cam-nang-muc-luc" className="mt-8" />
        </main>
        <SidebarTools seed="cam-nang-ds" />
      </div>
      <Footer />
    </>
  );
}
