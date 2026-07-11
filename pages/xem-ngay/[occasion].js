import Head from 'next/head';
import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import { getBestAndWorstDays } from '../../lib/periodRating';
import occasions from '../../content/occasions.json';

function pad(n) { return String(n).padStart(2, '0'); }

export async function getStaticPaths() {
  return { paths: occasions.map((o) => ({ params: { occasion: o.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const occasion = occasions.find((o) => o.slug === params.occasion);
  if (!occasion) return { notFound: true };

  const today = new Date();
  const dates = [];
  for (let i = 0; i <= 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push({ dd: d.getDate(), mm: d.getMonth() + 1, yyyy: d.getFullYear() });
  }
  const { best } = getBestAndWorstDays(dates, 10, 0);

  return {
    props: { occasion, bestDays: best, monthLabel: `${today.getMonth() + 1}/${today.getFullYear()}` },
    revalidate: 86400
  };
}

export default function XemNgayOccasion({ occasion, bestDays, monthLabel }) {
  const title = `Xem Ngày Tốt ${occasion.label} Tháng ${monthLabel} — TriMenh`;
  const desc = `Danh sách ngày Hoàng đạo tốt để ${occasion.label.toLowerCase()} trong 60 ngày tới, cập nhật theo ngày hiện tại.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <CalendarCheck size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Xem Ngày Tốt {occasion.label}</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Danh sách ngày Hoàng đạo tốt trong 60 ngày tới</p>

        <div className="mystic-card p-6 mb-6">
          <p className="text-sm text-parchment/85">{occasion.tip}</p>
        </div>

        <div className="space-y-2 mb-6">
          {bestDays.length > 0 ? bestDays.map((d) => (
            <Link
              key={`${d.dd}-${d.mm}-${d.yyyy}`}
              href={`/xem-ngay-tot/ngay-${pad(d.dd)}-thang-${pad(d.mm)}-nam-${d.yyyy}`}
              className="flex items-center justify-between mystic-card px-4 py-3 hover:border-gold/40 transition-colors"
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
              <Link key={o.slug} href={`/xem-ngay/${o.slug}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">
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
      <Footer />
    </>
  );
}
