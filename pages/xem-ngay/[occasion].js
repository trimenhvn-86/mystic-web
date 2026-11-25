import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import AdSlot from '../../components/AdSlot';
import MysticLoader from '../../components/MysticLoader';
import { getBestAndWorstDays } from '../../lib/periodRating';
import occasions from '../../content/occasions.json';
import { getVietnamNow } from '../../lib/vnDate';

function pad(n) { return String(n).padStart(2, '0'); }

// Tính danh sách ngày tốt 60 ngày tới kể từ ngày `start` (dùng chung cho server và trình duyệt)
function computeBestDays(start) {
  const dates = [];
  for (let i = 0; i <= 60; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push({ dd: d.getDate(), mm: d.getMonth() + 1, yyyy: d.getFullYear() });
  }
  const { best } = getBestAndWorstDays(dates, 10, 0);
  return { bestDays: best, monthLabel: `${start.getMonth() + 1}/${start.getFullYear()}` };
}

export async function getStaticPaths() {
  return { paths: occasions.map((o) => ({ params: { occasion: o.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const occasion = occasions.find((o) => o.slug === params.occasion);
  if (!occasion) return { notFound: true };
  // Dựng sẵn ở server (giờ Việt Nam) để HTML gốc có đủ danh sách ngày tốt cho Google
  const initial = computeBestDays(getVietnamNow());
  return { props: { occasion, initial }, revalidate: 3600 };
}

export default function XemNgayOccasion({ occasion, initial }) {
  const [result, setResult] = useState(initial || null);

  useEffect(() => {
    // Sau khi tải, tính lại theo ngày thật của máy người xem
    setResult(computeBestDays(new Date()));
  }, []);

  if (!result) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang tìm ngày tốt sắp tới..." />
        <Footer />
      </>
    );
  }

  const { bestDays, monthLabel } = result;
  const title = `Xem Ngày Tốt ${occasion.label} Tháng ${monthLabel} — TriMenh`;
  const desc = `Danh sách ngày Hoàng đạo tốt để ${occasion.label.toLowerCase()} trong 60 ngày tới, cập nhật theo ngày hiện tại.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[{ label: 'Lịch & Ngày Tốt', href: '/lich-ngay-tot' }, { label: 'Xem ngày tốt theo việc', href: '/xem-ngay' }]} current={occasion.label} />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-2">Xem Ngày Tốt {occasion.label}</h1>
        <p className="text-moon/70 text-sm mb-8">Danh sách ngày Hoàng đạo tốt trong 60 ngày tới</p>

        <div className="mystic-card p-6 mb-6">
          <p className="text-sm text-parchment/85">{occasion.tip}</p>
        </div>

        <div className="space-y-2 mb-6">
          {bestDays.length > 0 ? bestDays.map((d) => (
            <Link
              key={`${d.dd}-${d.mm}-${d.yyyy}`}
              href={`/xem-ngay-tot/ngay-${pad(d.dd)}-thang-${pad(d.mm)}-nam-${d.yyyy}`}
              className="flex items-center justify-between mystic-card px-4 py-3 hover:border-lich transition-colors"
            >
              <span className="text-parchment">{d.thu}, {pad(d.dd)}/{pad(d.mm)}/{d.yyyy}</span>
              <span className="text-gold">{'★'.repeat(d.stars)}</span>
            </Link>
          )) : (
            <p className="text-sm text-moon/60 text-center">Chưa tìm thấy ngày nổi bật trong 60 ngày tới, thử xem thêm tại Xem ngày tốt.</p>
          )}
        </div>

        <AdSlot label={`Ad slot — xem ngay ${occasion.slug}`} className="mb-6" />

        <div className="mb-6">
          <p className="text-sm text-moon mb-3">Việc khác:</p>
          <div className="flex flex-wrap gap-2">
            {occasions.filter((o) => o.slug !== occasion.slug).map((o) => (
              <Link key={o.slug} href={`/xem-ngay/${o.slug}`} className="px-3 py-1.5 rounded border border-ink-line text-sm text-moon hover:border-lich hover:text-gold-soft transition-colors">
                {o.label}
              </Link>
            ))}
          </div>
        </div>

        <Link href="/xem-ngay-tot" className="block text-center text-sm text-gold-soft hover:underline">
          Xem chi tiết đầy đủ 1 ngày cụ thể →
        </Link>

        <p className="text-xs text-moon/50 mt-8 text-center">
          Danh sách dựa trên đánh giá Hoàng đạo/Hắc đạo chung — chưa tính riêng đặc thù từng việc theo trường phái chuyên sâu, mang tính tham khảo.
        </p>
      </main>
        <SidebarTools seed="xem-ngay-occasion" />
      </div>
      <Footer />
    </>
  );
}
