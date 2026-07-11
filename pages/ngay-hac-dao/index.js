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
  return { props: preview, revalidate: 3600 };
}

const FAQ = [
  { q: 'Ngày Hắc Đạo là gì?', a: 'Ngày Hắc Đạo là ngày mang Trực không thuộc nhóm cát tinh trong chu kỳ 12 Trực, dân gian cho là nên hạn chế làm việc lớn trong ngày này.' },
  { q: 'Ngày Hắc Đạo có xấu tuyệt đối không?', a: 'Không. Ngày Hắc Đạo chỉ kém thuận lợi hơn cho việc trọng đại, vẫn có thể làm việc thường ngày bình thường. Nhiều việc nhỏ không bị ảnh hưởng.' },
  { q: 'Nên làm gì vào ngày Hắc Đạo?', a: 'Nên ưu tiên việc nhẹ nhàng, dọn dẹp, nghỉ ngơi; tránh khởi sự việc lớn như cưới hỏi, khai trương, động thổ nếu có thể dời sang ngày khác.' },
  { q: 'Làm sao biết ngày nào là Hắc Đạo?', a: 'Nhập ngày tháng năm cần xem, TriMenh sẽ tự tính Trực và cho biết ngày đó thuộc Hoàng Đạo hay Hắc Đạo.' }
];

export default function NgayHacDaoForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const today = new Date();
  const [date, setDate] = useState({ dd: today.getDate(), mm: today.getMonth() + 1, yyyy: today.getFullYear() });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const slug = `ngay-${pad(date.dd)}-thang-${pad(date.mm)}-nam-${date.yyyy}`;
    setTimeout(() => router.push(`/ngay-hac-dao/${slug}`), 2000);
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
        <title>Ngày Hắc Đạo Hôm Nay — Tra Cứu Theo Ngày, Tháng, Năm</title>
        <meta name="description" content="Tra cứu ngày Hắc đạo — ngày nên hạn chế làm việc lớn. Xem việc nên tránh và gợi ý ngày thay thế." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-10 sm:py-14">
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Ngày Hắc Đạo</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Kiểm tra xem ngày bạn định làm việc lớn có phải Hắc Đạo không.</p>
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
              <Link href="/ngay-hoang-dao" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Ngày Hoàng đạo</Link>
              <Link href="/xem-ngay-tot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt</Link>
            </div>
          </div>

          <MiniCalendar dd={date.dd} mm={Number(date.mm)} yyyy={Number(date.yyyy)} basePath="/ngay-hac-dao" showQuality />

          <div className="mystic-divider pt-8 space-y-6 text-parchment/85 leading-relaxed">
            <section>
              <h2 className="font-display text-xl text-parchment mb-3">Ngày Hắc Đạo là gì?</h2>
              <p>Ngày Hắc Đạo là ngày mang Trực không thuộc nhóm cát tinh trong chu kỳ 12 Trực (Thập Nhị Kiến Trừ) — đối lập với ngày Hoàng Đạo. Dân gian cho rằng nên hạn chế khởi sự việc lớn trong những ngày này.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-parchment mb-3">Có nên kiêng hoàn toàn không?</h2>
              <p>Không cần thiết. Ngày Hắc Đạo vẫn phù hợp cho các công việc thường ngày, chỉ nên cân nhắc dời các việc trọng đại (cưới hỏi, khai trương, động thổ) sang ngày Hoàng Đạo gần nhất nếu có thể sắp xếp được.</p>
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
