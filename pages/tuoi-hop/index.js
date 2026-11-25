import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import NamSinhGrid from '../../components/NamSinhGrid';
import MysticLoader from '../../components/MysticLoader';
import HubContentPreview from '../../components/HubContentPreview';
import { getHubContentPreview } from '../../lib/content';

export async function getStaticProps() {
  const preview = await getHubContentPreview('tuoi-tuong-hop');
  return { props: preview, revalidate: 86400 };
}

export default function TuoiHopForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear() - 30);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(`/${year}-hop-tuoi-nao`), 1800);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang đối chiếu Tam hợp, Tứ hành xung..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Tra Cứu Tuổi Hợp Theo Năm Sinh — TriMenh</title>
        <meta name="description" content="Tra cứu tuổi hợp theo năm sinh: Tam hợp, Tứ hành xung, Lục hại. Xem tuổi nào hợp làm ăn, kết hôn với bạn." />
        <meta property="og:title" content={"Tra Cứu Tuổi Hợp Theo Năm Sinh — TriMenh"} />
        <meta property="og:description" content="Tra cứu tuổi hợp theo năm sinh: Tam hợp, Tứ hành xung, Lục hại. Xem tuổi nào hợp làm ăn, kết hôn với bạn." />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[{ label: 'Tuổi & Tương Hợp', href: '/tuoi-tuong-hop' }]} current="Tra cứu tuổi" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-2">Tra Cứu Tuổi Hợp</h1>
        <p className="text-moon/70 text-sm mb-8">Nhập năm sinh Dương lịch để xem tuổi hợp với bạn.</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
            Năm sinh
            <input
              type="number" min="1900" max="2100" required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-ink-soft border border-ink-line rounded-md px-3 py-3 text-parchment text-base"
            />
          </label>
          <button type="submit" className="btn-gold py-3.5 text-base font-semibold mt-2">Xem kết quả</button>
        </form>

        <div className="mt-6">
          <Link href="/so-sanh-tuoi" className="text-sm text-gold-soft hover:underline">
            Muốn so sánh tuổi giữa 2 người? →
          </Link>
        </div>

        <div className="mt-10 space-y-8">
          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      <NamSinhGrid kind="hop-tuoi-nao" />
      </main>
        <SidebarTools seed="tuoi-hop-index" />
      </div>
      <Footer />
    </>
  );
}
