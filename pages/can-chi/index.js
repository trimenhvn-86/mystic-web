import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import FaqSection from '../../components/FaqSection';

function pad(n) { return String(n).padStart(2, '0'); }

const FAQ = [
  { q: 'Can Chi là gì?', a: 'Can Chi là hệ thống kết hợp 10 Thiên Can (Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý) và 12 Địa Chi (Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi) tạo thành chu kỳ 60 tổ hợp gọi là Lục Thập Hoa Giáp.' },
  { q: 'Can Chi dùng để làm gì?', a: 'Can Chi dùng để định danh năm, tháng, ngày, giờ theo lịch Âm — là nền tảng để tính Ngũ hành Nạp âm, Trực, tuổi xung hợp, và nhiều hệ thống huyền học khác.' },
  { q: 'Thiên Can và Địa Chi khác nhau thế nào?', a: 'Thiên Can gồm 10 yếu tố mang tính chất Âm/Dương và Ngũ hành. Địa Chi gồm 12 yếu tố tương ứng 12 con giáp, cũng mang thuộc tính Ngũ hành riêng. Kết hợp 1 Can + 1 Chi tạo thành 1 tổ hợp Can Chi.' }
];

export default function CanChiForm() {
  const router = useRouter();
  const today = new Date();
  const [date, setDate] = useState({ dd: today.getDate(), mm: today.getMonth() + 1, yyyy: today.getFullYear() });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const slug = `ngay-${pad(date.dd)}-thang-${pad(date.mm)}-nam-${date.yyyy}`;
    setTimeout(() => router.push(`/can-chi/${slug}`), 1800);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang lập Can Chi ngày, tháng, năm..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Tra Cứu Can Chi Ngày Tháng Năm — TriMenh</title>
        <meta name="description" content="Tra cứu Can Chi của ngày, tháng, năm theo lịch Âm. Xem Thiên Can, Địa Chi và ý nghĩa." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-10 sm:py-14">
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Tra Cứu Can Chi</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Xem Can Chi Ngày - Tháng - Năm theo lịch Âm.</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1 text-xs text-moon">Ngày
              <input type="number" min="1" max="31" required value={date.dd}
                onChange={(e) => setDate({ ...date, dd: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon">Tháng
              <input type="number" min="1" max="12" required value={date.mm}
                onChange={(e) => setDate({ ...date, mm: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon">Năm
              <input type="number" min="1900" max="2100" required value={date.yyyy}
                onChange={(e) => setDate({ ...date, yyyy: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
          </div>
          <button type="submit" className="btn-gold py-3.5 text-base font-semibold mt-2">Xem kết quả</button>
        </form>

        <div className="mt-10 space-y-8">
          <div>
            <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/xem-ngay-tot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt</Link>
              <Link href="/menh-ngu-hanh" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Mệnh ngũ hành</Link>
              <Link href="/tiet-khi" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tiết khí</Link>
            </div>
          </div>

          <div className="mystic-divider pt-8 space-y-6 text-parchment/85 leading-relaxed">
            <section>
              <h2 className="font-display text-xl text-parchment mb-3">Can Chi được tính như thế nào?</h2>
              <p>Mỗi ngày, tháng, năm Âm lịch đều mang 1 tổ hợp Can Chi riêng, lặp lại theo chu kỳ 60 (Lục Thập Hoa Giáp). TriMenh tính Can Chi Ngày dựa trên số ngày Julius đã trôi qua, Can Chi Năm dựa trên năm Âm lịch, và Can Chi Tháng theo công thức Ngũ Hổ Độn (Can tháng Giêng phụ thuộc Can của năm, các tháng sau tăng dần).</p>
            </section>
          </div>

          <FaqSection faqs={FAQ} />
        </div>
      </main>
      <Footer />
    </>
  );
}
