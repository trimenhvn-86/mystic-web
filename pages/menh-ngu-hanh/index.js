import { useState } from 'react';
import Head from 'next/head';
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
  const preview = await getHubContentPreview('menh-phong-thuy');
  return { props: preview, revalidate: 86400 };
}

export default function MenhNguHanhForm({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear() - 30);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(`/${year}-menh-gi`), 1800);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang tra cứu Nạp Âm Ngũ Hành..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Tra Cứu Mệnh Ngũ Hành Theo Năm Sinh — TriMenh</title>
        <meta name="description" content="Tra cứu mệnh Ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ) theo năm sinh. Xem Nạp âm, đặc điểm và màu hợp mệnh." />
        <meta property="og:title" content={"Tra Cứu Mệnh Ngũ Hành Theo Năm Sinh — TriMenh"} />
        <meta property="og:description" content="Tra cứu mệnh Ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ) theo năm sinh. Xem Nạp âm, đặc điểm và màu hợp mệnh." />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[{ label: 'Mệnh & Phong Thủy', href: '/menh-phong-thuy' }]} current="Tra cứu mệnh" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-2">Tra Cứu Mệnh Ngũ Hành</h1>
        <p className="text-moon/70 text-sm mb-8">Nhập năm sinh Dương lịch để xem mệnh của bạn.</p>
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

        <div className="mt-10 space-y-8">
          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      <NamSinhGrid kind="menh-gi" />
      </main>
        <SidebarTools seed="menh-ngu-hanh-index" />
      </div>
      <Footer />
    </>
  );
}
