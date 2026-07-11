import Head from 'next/head';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDictionaryTerms, isConfigured } from '../../lib/sanity';

export async function getStaticProps() {
  const terms = await getDictionaryTerms();
  return { props: { terms, cmsConfigured: isConfigured }, revalidate: 3600 };
}

export default function TuDienIndex({ terms, cmsConfigured }) {
  return (
    <>
      <Head>
        <title>Từ điển huyền học — TriMenh</title>
        <meta name="description" content="Tra cứu định nghĩa các thuật ngữ huyền học: Can Chi, Ngũ Hành, Hoàng Đạo, Hắc Đạo, Tiết Khí và nhiều thuật ngữ khác." />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-16 h-16 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <BookOpen size={30} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Từ Điển Huyền Học</h1>
        <p className="text-moon/80 text-center max-w-lg mx-auto mb-10">
          Định nghĩa, nguồn gốc và ứng dụng của các thuật ngữ huyền học Đông - Tây.
        </p>

        {terms.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {terms.map((t) => (
              <Link key={t.slug} href={`/tu-dien/${t.slug}`} className="mystic-card p-4 hover:border-gold/40 transition-colors">
                <p className="text-gold-soft font-medium mb-1">{t.title}</p>
                <p className="text-sm text-moon/70 line-clamp-2">{t.shortDefinition}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mystic-card p-8 text-center">
            <p className="text-moon">
              {cmsConfigured
                ? 'Chưa có thuật ngữ nào được thêm. Vào Sanity Studio để tạo nội dung Dictionary đầu tiên.'
                : 'Từ điển chưa được kết nối CMS. Xem hướng dẫn thiết lập trong SANITY_SETUP.md để bắt đầu thêm nội dung.'}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
