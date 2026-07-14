import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getGuidePosts, isConfigured } from '../../lib/sanity';

export async function getStaticProps() {
  const posts = await getGuidePosts();
  return { props: { posts, cmsConfigured: isConfigured }, revalidate: 86400 };
}

export default function CamNangIndex({ posts, cmsConfigured }) {
  return (
    <>
      <Head>
        <title>Cẩm nang — TriMenh</title>
        <meta name="description" content="Hướng dẫn thực tế: cách xem ngày tốt, chọn màu hợp mệnh, xem giờ hoàng đạo và nhiều chủ đề huyền học khác." />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-16 h-16 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <BookOpen size={30} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Cẩm Nang</h1>
        <p className="text-moon/80 text-center max-w-lg mx-auto mb-10">
          Hướng dẫn thực tế trả lời đúng nhu cầu của bạn — từ chọn ngày cưới đến xem hướng nhà.
        </p>

        {posts.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {posts.map((p) => (
              <Link key={p.slug} href={`/cam-nang/${p.slug}`} className="mystic-card overflow-hidden hover:border-gold/40 transition-colors">
                {p.featuredImageUrl && (
                  <div className="relative w-full aspect-[16/9]">
                    <Image src={p.featuredImageUrl} alt={p.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-gold-soft font-display text-lg mb-1">{p.title}</p>
                  <p className="text-sm text-moon/70 line-clamp-2">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mystic-card p-8 text-center">
            <p className="text-moon">
              {cmsConfigured
                ? 'Chưa có bài cẩm nang nào được thêm. Vào Sanity Studio để đăng bài đầu tiên.'
                : 'Cẩm nang chưa được kết nối CMS. Xem hướng dẫn thiết lập trong SANITY_SETUP.md để bắt đầu đăng bài.'}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
