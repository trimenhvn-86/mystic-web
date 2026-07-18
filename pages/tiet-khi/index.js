import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import MiniCalendar from '../../components/MiniCalendar';
import FaqSection from '../../components/FaqSection';
import HubToolBreadcrumb from '../../components/HubToolBreadcrumb';
import HubToolRelated from '../../components/HubToolRelated';

function pad(n) { return String(n).padStart(2, '0'); }

const FAQ = [
  { q: 'Tiết Khí là gì?', a: 'Tiết Khí là 24 mốc thời gian trong năm Dương lịch, chia đều theo vị trí biểu kiến của Mặt Trời trên đường hoàng đạo (mỗi tiết cách nhau 15 độ), phản ánh sự thay đổi của thời tiết và mùa vụ.' },
  { q: 'Tiết Khí khác Âm lịch thế nào?', a: 'Tiết Khí được tính theo vị trí Mặt Trời (giống lịch Dương, cố định theo mùa), trong khi Âm lịch tính theo chu kỳ Mặt Trăng. Đây là lý do ngày Tiết Khí gần như cố định qua các năm Dương lịch, khác với ngày Âm lịch.' },
  { q: 'Tiết Khí có chính xác tuyệt đối không?', a: 'Công cụ tính theo công thức thiên văn xấp xỉ, lấy mẫu tại một thời điểm cố định trong ngày — ở đúng ngày chuyển tiết có thể lệch 1 ngày so với nguồn chính thức tính chính xác đến giờ/phút.' }
];

export default function TietKhiForm() {
  const router = useRouter();
  const today = new Date();
  const [date, setDate] = useState({ dd: today.getDate(), mm: today.getMonth() + 1, yyyy: today.getFullYear() });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const slug = `ngay-${pad(date.dd)}-thang-${pad(date.mm)}-nam-${date.yyyy}`;
    setTimeout(() => router.push(`/tiet-khi/${slug}`), 1800);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang xác định vị trí Mặt Trời..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Tra Cứu Tiết Khí — TriMenh</title>
        <meta name="description" content="Tra cứu Tiết Khí theo ngày Dương lịch. Xem 24 Tiết Khí trong năm và ý nghĩa." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-10 sm:py-14">
        <HubToolBreadcrumb current="Tiết khí" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Tra Cứu Tiết Khí</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Xem ngày hôm nay thuộc Tiết Khí nào trong 24 Tiết Khí.</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">Ngày
              <input type="number" min="1" max="31" required value={date.dd}
                onChange={(e) => setDate({ ...date, dd: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">Tháng
              <input type="number" min="1" max="12" required value={date.mm}
                onChange={(e) => setDate({ ...date, mm: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">Năm
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
              <Link href={`/tiet-khi/ngay-${pad(today.getDate())}-thang-${pad(today.getMonth() + 1)}-nam-${today.getFullYear()}`} className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Tiết khí hôm nay</Link>
              <Link href="/xem-ngay" className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Xem ngày tốt theo việc</Link>
            </div>
          </div>

          <HubToolRelated exclude="tiet-khi" />

          <MiniCalendar dd={date.dd} mm={Number(date.mm)} yyyy={Number(date.yyyy)} basePath="/tiet-khi" showQuality />

          <div className="mystic-divider pt-8 space-y-6 text-parchment/85 leading-relaxed">
            <section>
              <h2 className="font-display text-xl text-parchment mb-3">24 Tiết Khí là gì?</h2>
              <p>24 Tiết Khí là hệ thống chia năm Dương lịch thành 24 mốc theo vị trí Mặt Trời, mỗi mốc cách nhau khoảng 15 ngày, phản ánh sự chuyển mùa (Lập Xuân, Xuân Phân, Hạ Chí, Thu Phân, Đông Chí...). Đây là công cụ quan trọng trong nông nghiệp truyền thống và phong thủy.</p>
            </section>
          </div>

          <FaqSection faqs={FAQ} />
        </div>
      </main>
      <Footer />
    </>
  );
}
