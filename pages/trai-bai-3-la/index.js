import Head from 'next/head';
import Link from 'next/link';
import { Layers3 } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import spreads from '../../content/tarot-spreads.json';

export default function TraiBaiIndex() {
  return (
    <>
      <Head>
        <title>Trải Bài Tarot 3 Lá — Tổng Quát, Tình Yêu, Công Việc, Tài Chính — TriMenh</title>
        <meta name="description" content="Trải bài Tarot 3 lá miễn phí theo 4 chủ đề: tổng quát, tình yêu, công việc, tài chính. Dùng đủ bộ 78 lá." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Layers3 size={26} className="text-gold" />
        </div>
        <Breadcrumb trail={[{ label: 'Tarot', href: '/tarot' }]} current="Trải bài 3 lá" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Trải Bài 3 Lá</h1>
        <p className="text-moon/70 text-sm text-center mb-10">Chọn chủ đề bạn muốn xem</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {spreads.map((s) => (
            <Link key={s.slug} href={`/trai-bai-3-la/${s.slug}`} className="mystic-card p-5 hover:border-gold/40 transition-colors">
              <p className="font-display text-lg text-gold-soft mb-1">{s.label}</p>
              <p className="text-sm text-moon">{s.desc}</p>
              <p className="text-xs text-moon/60 mt-2">{s.positions.join(' → ')}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
