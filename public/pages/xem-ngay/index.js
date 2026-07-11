import Head from 'next/head';
import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import occasions from '../../content/occasions.json';

export default function XemNgayIndex() {
  return (
    <>
      <Head>
        <title>Xem Ngày Tốt Theo Việc Cụ Thể — Khai Trương, Cưới Hỏi, Động Thổ... — TriMenh</title>
        <meta name="description" content="Xem ngày tốt theo từng việc cụ thể: khai trương, cưới hỏi, động thổ, mua xe, chuyển nhà, ký hợp đồng và nhiều việc khác." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <CalendarCheck size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Xem Ngày Tốt Theo Việc</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Chọn đúng việc bạn đang cần xem ngày</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {occasions.map((o) => (
            <Link key={o.slug} href={`/xem-ngay/${o.slug}`} className="mystic-card px-4 py-3.5 flex items-center justify-between hover:border-gold/40 transition-colors">
              <span className="text-parchment">{o.label}</span>
            </Link>
          ))}
        </div>

        <p className="text-xs text-moon/50 mt-8 text-center">
          Danh sách dựa trên đánh giá Hoàng đạo/Hắc đạo chung, mang tính tham khảo.
        </p>
      </main>
      <Footer />
    </>
  );
}
