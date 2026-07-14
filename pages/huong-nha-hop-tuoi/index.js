import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Compass } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import HubContentPreview from '../../components/HubContentPreview';
import FaqSection from '../../components/FaqSection';
import { getHubContentPreview } from '../../lib/sanity';

const FAQ = [
  {
    q: 'Cung Mệnh (Bát Trạch) là gì?',
    a: 'Là 1 trong 8 cung (Khảm, Ly, Chấn, Tốn, Càn, Đoài, Cấn, Khôn) được tính từ năm sinh và giới tính, chia thành 2 nhóm: Đông Tứ Mệnh và Tây Tứ Mệnh, mỗi nhóm hợp với 4 hướng nhà riêng.'
  },
  {
    q: 'Vì sao nam và nữ cùng năm sinh lại khác Cung Mệnh?',
    a: 'Công thức tính Cung Mệnh trong Bát Trạch dùng 2 cách tính khác nhau cho nam và nữ, nên người nam và người nữ sinh cùng năm thường thuộc 2 cung khác nhau.'
  },
  {
    q: 'Không ở được nhà hướng hợp mệnh thì sao?',
    a: 'Có thể hóa giải bằng cách bố trí nội thất, cửa chính, hoặc bàn làm việc theo hướng hợp mệnh dù nhà xây theo hướng khác — đây là giải pháp thường được áp dụng trong thực tế.'
  }
];

export async function getStaticProps() {
  const preview = await getHubContentPreview('menh-phong-thuy');
  return { props: preview, revalidate: 86400 };
}

export default function HuongNhaForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear() - 30);
  const [gender, setGender] = useState('nam');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(`/huong-nha-hop-tuoi/${gender}-${year}`), 1800);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang lập Cung Mệnh Bát Trạch..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Hướng Nhà Hợp Tuổi — TriMenh</title>
        <meta name="description" content="Tra cứu hướng nhà hợp tuổi theo Cung Mệnh Bát Trạch (Đông Tứ Mệnh / Tây Tứ Mệnh)." />
      </Head>
      <Header />
      <main className="max-w-md mx-auto px-5 py-10 sm:py-14">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Compass size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Hướng Nhà Hợp Tuổi</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Nhập năm sinh và giới tính để xem hướng nhà hợp mệnh</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setGender('nam')}
              className={`flex-1 py-2 rounded-lg text-sm ${gender === 'nam' ? 'bg-gold text-ink font-semibold' : 'text-moon border border-ink-line'}`}>
              Nam
            </button>
            <button type="button" onClick={() => setGender('nu')}
              className={`flex-1 py-2 rounded-lg text-sm ${gender === 'nu' ? 'bg-gold text-ink font-semibold' : 'text-moon border border-ink-line'}`}>
              Nữ
            </button>
          </div>
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
          <FaqSection faqs={FAQ} />
          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
