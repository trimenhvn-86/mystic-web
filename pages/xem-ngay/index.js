import Head from 'next/head';
import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import occasions from '../../content/occasions.json';

export default function XemNgayIndex() {
  return (
    <>
      <Head>
        <title>Xem Ngày Tốt Theo Việc Cụ Thể — Khai Trương, Cưới Hỏi, Động Thổ... — TriMenh</title>
        <meta name="description" content="Xem ngày tốt theo từng việc cụ thể: khai trương, cưới hỏi, động thổ, mua xe, chuyển nhà, ký hợp đồng và nhiều việc khác." />
        <meta property="og:title" content={"Xem Ngày Tốt Theo Việc Cụ Thể — Khai Trương, Cưới Hỏi, Động Thổ... — TriMenh"} />
        <meta property="og:description" content="Xem ngày tốt theo từng việc cụ thể: khai trương, cưới hỏi, động thổ, mua xe, chuyển nhà, ký hợp đồng và nhiều việc khác." />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[{ label: 'Lịch & Ngày Tốt', href: '/lich-ngay-tot' }]} current="Xem ngày tốt theo việc" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-2">Xem Ngày Tốt Theo Việc</h1>
        <p className="text-moon/70 text-sm mb-8">Chọn đúng việc bạn đang cần xem ngày</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {occasions.map((o) => (
            <Link key={o.slug} href={`/xem-ngay/${o.slug}`} className="mystic-card px-4 py-3.5 flex items-center justify-between hover:border-lich transition-colors">
              <span className="text-parchment">{o.label}</span>
            </Link>
          ))}
        </div>

        <p className="text-xs text-moon/50 mt-8 text-center">
          Danh sách dựa trên đánh giá Hoàng đạo/Hắc đạo chung, mang tính tham khảo.
        </p>
      </main>
        <SidebarTools seed="xem-ngay-index" />
      </div>
      <Footer />
    </>
  );
}
