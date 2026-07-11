import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Briefcase } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import HubContentPreview from '../../components/HubContentPreview';
import { getHubContentPreview } from '../../lib/sanity';

export async function getStaticProps() {
  const preview = await getHubContentPreview('tuoi-tuong-hop');
  return { props: preview, revalidate: 3600 };
}

export default function XemTuoiLamAnForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [yearA, setYearA] = useState(currentYear - 30);
  const [yearB, setYearB] = useState(currentYear - 33);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(`/xem-tuoi-lam-an/doi-tac-${yearA}-va-${yearB}`), 1800);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang đối chiếu Can Chi và Ngũ hành..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Xem Tuổi Làm Ăn — TriMenh</title>
        <meta name="description" content="Xem tuổi hợp tác làm ăn, kinh doanh có hợp nhau không theo Can Chi, Ngũ hành. Tính điểm tương hợp và lời khuyên hợp tác." />
      </Head>
      <Header />
      <main className="max-w-lg mx-auto px-5 py-10 sm:py-14">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Briefcase size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Xem Tuổi Làm Ăn</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Nhập năm sinh 2 người để xem mức độ hợp tác kinh doanh</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-moon">
              Năm sinh Đối tác 1
              <input type="number" min="1900" max="2100" required value={yearA}
                onChange={(e) => setYearA(e.target.value)}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon">
              Năm sinh Đối tác 2
              <input type="number" min="1900" max="2100" required value={yearB}
                onChange={(e) => setYearB(e.target.value)}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
          </div>
          <button type="submit" className="btn-gold py-3.5 text-base font-semibold mt-2">Xem kết quả</button>
        </form>

        <div className="mt-10 space-y-8">
          <div>
            <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/tuoi-hop" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tuổi hợp theo năm sinh</Link>
              <Link href="/xem-ngay-tot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày khai trương tốt</Link>
            </div>
          </div>

          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
