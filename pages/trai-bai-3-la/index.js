import Head from 'next/head';
import Link from 'next/link';
import { Layers3 } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import spreads from '../../content/tarot-spreads.json';

export default function TraiBaiIndex() {
  return (
    <>
      <Head>
        <title>Trải Bài Tarot 3 Lá — Tổng Quát, Tình Yêu, Công Việc, Tài Chính — TriMenh</title>
        <meta name="description" content="Trải bài Tarot 3 lá miễn phí theo 4 chủ đề: tổng quát, tình yêu, công việc, tài chính. Dùng đủ bộ 78 lá." />
        <meta property="og:title" content={"Trải Bài Tarot 3 Lá — Tổng Quát, Tình Yêu, Công Việc, Tài Chính — TriMenh"} />
        <meta property="og:description" content="Trải bài Tarot 3 lá miễn phí theo 4 chủ đề: tổng quát, tình yêu, công việc, tài chính. Dùng đủ bộ 78 lá." />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[{ label: 'Tarot', href: '/tarot' }]} current="Trải bài 3 lá" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-2">Trải Bài 3 Lá</h1>
        <p className="text-moon/70 text-sm mb-10">Chọn chủ đề bạn muốn xem</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {spreads.map((s) => (
            <Link key={s.slug} href={`/trai-bai-3-la/${s.slug}`} className="mystic-card p-5 hover:border-lich transition-colors">
              <p className="font-display text-lg text-gold-soft mb-1">{s.label}</p>
              <p className="text-sm text-moon">{s.desc}</p>
              <p className="text-xs text-moon/60 mt-2">{s.positions.join(' → ')}</p>
            </Link>
          ))}
        </div>
      </main>
        <SidebarTools seed="trai-bai-3-la-index" />
      </div>
      <Footer />
    </>
  );
}
