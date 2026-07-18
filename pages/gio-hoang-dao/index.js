import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import MiniCalendar from '../../components/MiniCalendar';
import HubContentPreview from '../../components/HubContentPreview';
import FaqSection from '../../components/FaqSection';
import { getHubContentPreview } from '../../lib/sanity';
import HubToolBreadcrumb from '../../components/HubToolBreadcrumb';
import HubToolRelated from '../../components/HubToolRelated';

function pad(n) {
  return String(n).padStart(2, '0');
}

const FAQ = [
  { q: 'Giờ Hoàng Đạo là gì?', a: 'Giờ Hoàng Đạo là các khung giờ tốt trong ngày (thường 6 trong 12 giờ), được xác định dựa trên Chi của ngày, phù hợp cho xuất hành, khai trương, ký kết.' },
  { q: 'Giờ Hoàng Đạo có cố định mỗi ngày không?', a: 'Không. Giờ Hoàng Đạo thay đổi theo Chi của từng ngày cụ thể, không cố định qua các ngày khác nhau.' },
  { q: 'Nên chọn giờ Hoàng Đạo hay ngày Hoàng Đạo?', a: 'Tốt nhất nên kết hợp cả hai — chọn ngày Hoàng Đạo trước, sau đó chọn giờ Hoàng Đạo trong chính ngày đó để tối ưu.' }
];

export async function getStaticProps() {
  const preview = await getHubContentPreview('lich-ngay-tot');
  return { props: preview, revalidate: 86400 };
}

export default function GioHoangDaoForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const today = new Date();
  const [date, setDate] = useState({ dd: today.getDate(), mm: today.getMonth() + 1, yyyy: today.getFullYear() });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const slug = `ngay-${pad(date.dd)}-thang-${pad(date.mm)}-nam-${date.yyyy}`;
    setTimeout(() => router.push(`/gio-hoang-dao/${slug}`), 2000);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang lập bảng giờ Hoàng đạo..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Xem Giờ Hoàng Đạo — TriMenh</title>
        <meta name="description" content="Tra cứu giờ Hoàng đạo tốt trong ngày để chọn thời điểm xuất hành, khai trương, ký kết." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-10 sm:py-14">
        <HubToolBreadcrumb current="Giờ hoàng đạo" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Xem Giờ Hoàng Đạo</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Chọn ngày để xem 6 giờ tốt trong ngày</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
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

        <div className="mt-10 space-y-8">
          <div>
            <p className="text-sm text-moon mb-3">Tra cứu phổ biến:</p>
            <div className="flex flex-wrap gap-2">
              <Link href={`/gio-hoang-dao/ngay-${pad(today.getDate())}-thang-${pad(today.getMonth() + 1)}-nam-${today.getFullYear()}`} className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Giờ hoàng đạo hôm nay</Link>
              <Link href="/xem-ngay" className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Xem ngày tốt theo việc</Link>
            </div>
          </div>

          <HubToolRelated exclude="gio-hoang-dao" />

          <MiniCalendar dd={date.dd} mm={Number(date.mm)} yyyy={Number(date.yyyy)} basePath="/gio-hoang-dao" showQuality />

          <FaqSection faqs={FAQ} />

          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
