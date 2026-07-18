import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import MiniCalendar from '../../components/MiniCalendar';
import SeoContent from '../../components/SeoContent';
import FaqSection from '../../components/FaqSection';
import HubContentPreview from '../../components/HubContentPreview';
import { FAQ_DOI_LICH } from '../../content/faq-data';
import { getHubContentPreview } from '../../lib/sanity';

function pad(n) {
  return String(n).padStart(2, '0');
}

export async function getStaticProps() {
  const preview = await getHubContentPreview('lich-ngay-tot');
  return { props: preview, revalidate: 86400 };
}

export default function DoiLichForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const today = new Date();
  const [mode, setMode] = useState('duong'); // duong | am
  const [date, setDate] = useState({ dd: today.getDate(), mm: today.getMonth() + 1, yyyy: today.getFullYear() });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const prefix = mode === 'duong' ? 'ngay' : 'am-ngay';
    const slug = `${prefix}-${pad(date.dd)}-thang-${pad(date.mm)}-nam-${date.yyyy}`;
    setTimeout(() => {
      router.push(`/doi-lich-am-duong/${slug}`);
    }, 2000);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang đối chiếu lịch Âm - Dương..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Đổi Lịch Âm Dương — TriMenh</title>
        <meta name="description" content="Chuyển đổi ngày Dương lịch sang Âm lịch và ngược lại, chính xác theo múi giờ Việt Nam." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-10 sm:py-14">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-moon mb-6">
          <Link href="/" className="hover:text-gold-soft transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/lich-ngay-tot" className="hover:text-gold-soft transition-colors">Lịch &amp; Ngày Tốt</Link>
          <span>/</span>
          <span className="text-parchment/70">Đổi lịch âm dương</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Đổi Lịch Âm Dương</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Chuyển đổi 2 chiều Dương ⇄ Âm lịch</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <div className="flex gap-2 mb-1">
            <button type="button" onClick={() => setMode('duong')}
              className={`flex-1 py-2 rounded-lg text-sm ${mode === 'duong' ? 'bg-gold text-ink font-semibold' : 'text-moon border border-ink-line'}`}>
              Dương → Âm
            </button>
            <button type="button" onClick={() => setMode('am')}
              className={`flex-1 py-2 rounded-lg text-sm ${mode === 'am' ? 'bg-gold text-ink font-semibold' : 'text-moon border border-ink-line'}`}>
              Âm → Dương
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Ngày
              <input type="number" min="1" max="31" required value={date.dd}
                onChange={(e) => setDate({ ...date, dd: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Tháng
              <input type="number" min="1" max="12" required value={date.mm}
                onChange={(e) => setDate({ ...date, mm: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Năm
              <input type="number" min="1900" max="2100" required value={date.yyyy}
                onChange={(e) => setDate({ ...date, yyyy: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
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
              <Link href={`/doi-lich-am-duong/ngay-${pad(today.getDate())}-thang-${pad(today.getMonth() + 1)}-nam-${today.getFullYear()}`} className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Đổi lịch hôm nay</Link>
              <Link href="/xem-ngay" className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Xem ngày tốt theo việc</Link>
            </div>
          </div>

          <div>
            <p className="text-sm text-moon mb-3">Có thể bạn quan tâm:</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/xem-ngay-tot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt</Link>
              <Link href="/gio-hoang-dao" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Giờ hoàng đạo</Link>
              <Link href="/ngay-hoang-dao" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Ngày Hoàng đạo</Link>
              <Link href="/ngay-hac-dao" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Ngày Hắc đạo</Link>
              <Link href="/can-chi" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Can Chi</Link>
              <Link href="/tiet-khi" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tiết khí</Link>
              <Link href="/xem-ngay" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt theo việc</Link>
            </div>
          </div>

          <MiniCalendar dd={date.dd} mm={Number(date.mm)} yyyy={Number(date.yyyy)} basePath="/doi-lich-am-duong" showQuality />

          <div className="mystic-divider pt-8">
            <SeoContent />
          </div>

          <FaqSection faqs={FAQ_DOI_LICH} />

          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
