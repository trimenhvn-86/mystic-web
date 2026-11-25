import Head from 'next/head';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import { getDictionaryTerms, isConfigured } from '../../lib/content';

export async function getStaticProps() {
  const terms = await getDictionaryTerms();
  return { props: { terms, cmsConfigured: isConfigured }, revalidate: terms.length === 0 ? 300 : 3600 };
}

export default function TuDienIndex({ terms, cmsConfigured }) {
  return (
    <>
      <Head>
        <title>Từ điển huyền học — TriMenh</title>
        <meta name="description" content="Tra cứu định nghĩa các thuật ngữ huyền học: Can Chi, Ngũ Hành, Hoàng Đạo, Hắc Đạo, Tiết Khí và nhiều thuật ngữ khác." />
        <meta property="og:title" content={"Từ điển huyền học — TriMenh"} />
        <meta property="og:description" content="Tra cứu định nghĩa các thuật ngữ huyền học: Can Chi, Ngũ Hành, Hoàng Đạo, Hắc Đạo, Tiết Khí và nhiều thuật ngữ khác." />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl">
        <Breadcrumb trail={[]} current="Từ điển" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-2">Từ Điển Huyền Học</h1>
        <p className="text-moon/80 max-w-lg mb-10">
          Định nghĩa, nguồn gốc và ứng dụng của các thuật ngữ huyền học Đông - Tây.
        </p>

        {terms.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {terms.map((t) => (
              <Link key={t.slug} href={`/tu-dien/${t.slug}`} className="mystic-card p-4 hover:border-lich transition-colors">
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
        <SidebarTools seed="tu-dien-ds" />
      </div>
      <Footer />
    </>
  );
}
