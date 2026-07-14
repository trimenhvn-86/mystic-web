import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import MiniCalendar from '../../components/MiniCalendar';
import FaqSection from '../../components/FaqSection';
import HubContentPreview from '../../components/HubContentPreview';
import { getHubContentPreview } from '../../lib/sanity';

function pad(n) { return String(n).padStart(2, '0'); }

export async function getStaticProps() {
  const preview = await getHubContentPreview('lich-ngay-tot');
  return { props: preview, revalidate: 86400 };
}

const FAQ = [
  { q: 'Ngày Hoàng Đạo là gì?', a: 'Ngày Hoàng Đạo là ngày mang Trực thuộc nhóm tốt trong chu kỳ 12 Trực (Thập Nhị Kiến Trừ), được xem là thuận lợi cho các việc quan trọng.' },
  { q: 'Ngày Hoàng Đạo có phải ngày tốt tuyệt đối không?', a: 'Không. Đây là 1 trong nhiều yếu tố tham khảo (cùng với Sao, Ngũ hành, tuổi bản mệnh). Một ngày Hoàng Đạo vẫn có thể không hợp với tuổi hoặc mục đích cụ thể của bạn.' },
  { q: 'Có nên cưới vào ngày Hoàng Đạo không?', a: 'Ngày Hoàng Đạo là điều kiện tốt, nhưng nên đối chiếu thêm tuổi cô dâu chú rể (Tam hợp - Tứ hành xung) trước khi quyết định.' },
  { q: 'Ngày Hoàng Đạo và Giờ Hoàng Đạo khác nhau thế nào?', a: 'Ngày Hoàng Đạo đánh giá cả ngày dựa trên Trực. Giờ Hoàng Đạo là 6 khung giờ tốt cụ thể trong ngày đó — nên kết hợp cả 2 để chọn thời điểm tối ưu.' }
];

export default function NgayHoangDaoForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const today = new Date();
  const [date, setDate] = useState({ dd: today.getDate(), mm: today.getMonth() + 1, yyyy: today.getFullYear() });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const slug = `ngay-${pad(date.dd)}-thang-${pad(date.mm)}-nam-${date.yyyy}`;
    setTimeout(() => router.push(`/ngay-hoang-dao/${slug}`), 2000);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang đối chiếu Trực và Sao..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Ngày Hoàng Đạo Hôm Nay — Tra Cứu Theo Ngày, Tháng, Năm</title>
        <meta name="description" content="Tra cứu ngày Hoàng đạo theo ngày tháng năm. Xem giờ hoàng đạo, việc nên làm, việc kiêng kỵ và luận giải chi tiết." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-10 sm:py-14">
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Ngày Hoàng Đạo</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Tra cứu ngày Hoàng đạo theo ngày, tháng, năm.</p>
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
            <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/xem-ngay-tot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt</Link>
              <Link href="/gio-hoang-dao" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Giờ hoàng đạo</Link>
              <Link href="/ngay-hac-dao" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Ngày Hắc đạo</Link>
              <Link href="/can-chi" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Can Chi</Link>
            </div>
          </div>

          <MiniCalendar dd={date.dd} mm={Number(date.mm)} yyyy={Number(date.yyyy)} basePath="/ngay-hoang-dao" showQuality />

          <div className="mystic-divider pt-8 space-y-6 text-parchment/85 leading-relaxed">
            <section>
              <h2 className="font-display text-xl text-parchment mb-3">Ngày Hoàng Đạo là gì?</h2>
              <p>Ngày Hoàng Đạo là ngày mang Trực thuộc nhóm cát tinh trong chu kỳ 12 Trực (Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế), được dân gian xem là thuận lợi cho các việc quan trọng như khai trương, cưới hỏi, xuất hành.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-parchment mb-3">Cách xác định ngày Hoàng Đạo</h2>
              <p>Trực của một ngày được tính dựa trên Chi của ngày đối chiếu với Chi của tháng Âm lịch, lặp lại theo chu kỳ cố định 12 ngày. TriMenh tự động tính Trực và đối chiếu thêm Sao (Nhị Thập Bát Tú) để đưa ra đánh giá tổng hợp.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-parchment mb-3">Ngày này phù hợp làm gì?</h2>
              <p>Ngày Hoàng Đạo thường phù hợp cho khai trương, ký hợp đồng, xuất hành, cầu tài. Tuy nhiên vẫn nên đối chiếu thêm tuổi bản mệnh và mục đích cụ thể trước khi quyết định.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-parchment mb-3">Những lưu ý khi chọn ngày</h2>
              <p>Không có ngày nào tốt tuyệt đối cho mọi người và mọi việc — nên xem đây là 1 kênh tham khảo bên cạnh các yếu tố thực tế khác.</p>
            </section>
          </div>

          <FaqSection faqs={FAQ} />

          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
