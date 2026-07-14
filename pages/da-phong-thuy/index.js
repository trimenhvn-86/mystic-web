import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Gem } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import HubContentPreview from '../../components/HubContentPreview';
import FaqSection from '../../components/FaqSection';
import { getHubContentPreview } from '../../lib/sanity';

const FAQ = [
  {
    q: 'Đá phong thủy hợp mệnh được xác định như thế nào?',
    a: 'Dựa trên Ngũ hành Nạp âm của năm sinh (Kim, Mộc, Thủy, Hỏa, Thổ). Mỗi mệnh có nhóm đá màu sắc tương ứng và tương sinh phù hợp để hỗ trợ năng lượng bản mệnh.'
  },
  {
    q: 'Đeo đá phong thủy có tác dụng chữa bệnh không?',
    a: 'Không. Đá phong thủy mang tính chất tham khảo văn hóa, hỗ trợ tinh thần và thẩm mỹ — không thay thế cho khám chữa bệnh hay điều trị y tế.'
  },
  {
    q: 'Nên đeo đá phong thủy ở đâu?',
    a: 'Phổ biến nhất là đeo tay, đeo cổ, hoặc đặt tại bàn làm việc/không gian sống. Kích thước và cách đeo tùy theo sở thích cá nhân.'
  }
];

export async function getStaticProps() {
  const preview = await getHubContentPreview('menh-phong-thuy');
  return { props: preview, revalidate: 86400 };
}

export default function DaPhongThuyForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear() - 30);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(`/${year}-hop-da-gi`), 1800);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang đối chiếu Ngũ hành và đá phong thủy..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Đá Phong Thủy Hợp Mệnh Theo Năm Sinh — TriMenh</title>
        <meta name="description" content="Tra cứu đá phong thủy hợp mệnh theo năm sinh, dựa trên Ngũ hành Nạp âm." />
      </Head>
      <Header />
      <main className="max-w-md mx-auto px-5 py-10 sm:py-14">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Gem size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Vật Phẩm Phong Thủy — Đá Hợp Mệnh</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Nhập năm sinh Dương lịch để xem đá hợp mệnh.</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
            Năm sinh
            <input
              type="number" min="1900" max="2100" required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
            />
          </label>
          <button type="submit" className="btn-gold py-3.5 text-base font-semibold mt-2">Xem kết quả</button>
        </form>

        <div className="mt-10 space-y-8">
          <div className="text-parchment/85 leading-relaxed">
            <h2 className="font-display text-xl text-parchment mb-3">Vì sao mỗi mệnh hợp đá khác nhau?</h2>
            <p>
              Theo Ngũ hành, mỗi mệnh có màu sắc và tính chất năng lượng riêng. Đá phong thủy được chọn theo màu sắc và
              nguồn gốc hình thành tương ứng với hành đó (hoặc hành tương sinh), giúp cân bằng năng lượng cho người đeo
              theo quan niệm phong thủy truyền thống.
            </p>
          </div>

          <FaqSection faqs={FAQ} />

          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
