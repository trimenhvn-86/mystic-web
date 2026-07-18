import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import MiniCalendar from '../../components/MiniCalendar';
import SeoContentNgayTot from '../../components/SeoContentNgayTot';
import FaqSection from '../../components/FaqSection';
import HubContentPreview from '../../components/HubContentPreview';
import { FAQ_NGAY_TOT } from '../../content/faq-data';
import { getHubContentPreview } from '../../lib/sanity';
import HubToolBreadcrumb from '../../components/HubToolBreadcrumb';
import HubToolRelated from '../../components/HubToolRelated';

function pad(n) {
  return String(n).padStart(2, '0');
}

export async function getStaticProps() {
  const preview = await getHubContentPreview('lich-ngay-tot');
  return { props: preview, revalidate: 86400 };
}

export default function XemNgayTotForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const today = new Date();
  const [date, setDate] = useState({
    dd: today.getDate(),
    mm: today.getMonth() + 1,
    yyyy: today.getFullYear()
  });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const slug = `ngay-${pad(date.dd)}-thang-${pad(date.mm)}-nam-${date.yyyy}`;
    // Bước 2 (Virtual Loading): giữ hiệu ứng loading 2-3s trước khi chuyển trang kết quả
    setTimeout(() => {
      router.push(`/xem-ngay-tot/${slug}`);
    }, 2200);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang đối chiếu ngũ hành, lập dữ liệu vận trình..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Xem Ngày Tốt Xấu — Tra cứu Lịch Vạn Niên</title>
        <meta name="description" content="Tra cứu ngày Hoàng đạo, Hắc đạo, giờ tốt xấu theo ngày tháng năm sinh." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-10 sm:py-14">
        <HubToolBreadcrumb current="Xem ngày tốt" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Xem Ngày Tốt Xấu</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Tra cứu ngày tốt, giờ hoàng đạo, lịch âm, Can Chi, Ngũ hành và việc nên làm.</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Ngày
              <input
                type="number" min="1" max="31" required
                value={date.dd}
                onChange={(e) => setDate({ ...date, dd: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Tháng
              <input
                type="number" min="1" max="12" required
                value={date.mm}
                onChange={(e) => setDate({ ...date, mm: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Năm
              <input
                type="number" min="1900" max="2100" required
                value={date.yyyy}
                onChange={(e) => setDate({ ...date, yyyy: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
              />
            </label>
          </div>
          <button type="submit" className="btn-gold py-3.5 text-base font-semibold mt-2">Xem kết quả</button>
        </form>
        <p className="text-xs text-moon/60 text-center mt-3">
          ✓ Chính xác theo lịch Âm Việt Nam &nbsp;·&nbsp; ✓ Cập nhật đến năm 2100 &nbsp;·&nbsp; ✓ Miễn phí
        </p>

        <div className="mt-10 space-y-8">
          <div>
            <p className="text-sm text-moon mb-3">Tra cứu phổ biến:</p>
            <div className="flex flex-wrap gap-2">
              <Link href={`/xem-ngay-tot/ngay-${pad(today.getDate())}-thang-${pad(today.getMonth() + 1)}-nam-${today.getFullYear()}`} className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Xem ngày tốt hôm nay</Link>
              <Link href="/xem-ngay" className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Xem ngày tốt theo việc</Link>
            </div>
          </div>

          <HubToolRelated exclude="xem-ngay-tot" />

          <MiniCalendar dd={date.dd} mm={Number(date.mm)} yyyy={Number(date.yyyy)} basePath="/xem-ngay-tot" showQuality />

          <div className="mystic-divider pt-8">
            <SeoContentNgayTot />
          </div>

          <FaqSection faqs={FAQ_NGAY_TOT} />

          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
