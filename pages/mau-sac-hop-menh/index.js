import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import HubContentPreview from '../../components/HubContentPreview';
import FaqSection from '../../components/FaqSection';
import { getHubContentPreview } from '../../lib/sanity';
import { FAQ_MAU_MENH } from '../../content/faq-data';

export async function getStaticProps() {
  const preview = await getHubContentPreview('menh-phong-thuy');
  return { props: preview, revalidate: 86400 };
}

export default function MauSacHopMenhForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear() - 30);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(`/${year}-hop-mau-gi`), 1800);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang đối chiếu Ngũ hành và màu sắc..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Màu Sắc Hợp Mệnh Theo Năm Sinh — TriMenh</title>
        <meta name="description" content="Tra cứu màu sắc hợp mệnh và màu nên tránh theo năm sinh, dựa trên Ngũ hành Nạp âm." />
      </Head>
      <Header />
      <main className="max-w-md mx-auto px-5 py-10 sm:py-14">
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Màu Sắc Hợp Mệnh</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Nhập năm sinh Dương lịch để xem màu hợp và màu nên tránh.</p>
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
            <h2 className="font-display text-xl text-parchment mb-3">Vì sao màu sắc lại hợp/kỵ với mệnh?</h2>
            <p>
              Theo Ngũ hành, mỗi mệnh (Kim, Mộc, Thủy, Hỏa, Thổ) đều có màu sắc tương ứng và màu tương sinh (hỗ trợ).
              Ngược lại, màu thuộc hành khắc chế mệnh của bạn nên hạn chế sử dụng trong trang phục, xe cộ, không gian
              làm việc quan trọng để tránh xung khắc năng lượng.
            </p>
          </div>

          <FaqSection faqs={FAQ_MAU_MENH} />

          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
