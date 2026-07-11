import Head from 'next/head';
import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TuoiHopLinks from '../../components/TuoiHopLinks';
import { compareTuoi, getMarriageAdvice } from '../../lib/tuoiHop';

const SLUG_RE = /^co-dau-(\d{4})-chu-re-(\d{4})$/;

const RELATION_LABEL = {
  'tam-hop': 'Tam hợp', 'luc-hop': 'Lục hợp', 'dong-tuoi': 'Cùng tuổi',
  'luc-hai': 'Lục hại', 'tu-hanh-xung': 'Tứ hành xung', 'binh-thuong': 'Bình thường'
};

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const m = params.slug.match(SLUG_RE);
  if (!m) return { notFound: true };
  const yearBride = Number(m[1]);
  const yearGroom = Number(m[2]);
  if (yearBride < 1900 || yearBride > 2100 || yearGroom < 1900 || yearGroom > 2100) return { notFound: true };

  const result = compareTuoi(yearBride, yearGroom);
  const advice = getMarriageAdvice(result.score);
  return { props: { result, advice, yearBride, yearGroom }, revalidate: 604800 };
}

export default function XemTuoiKetHonResult({ result, advice, yearBride, yearGroom }) {
  const { canChiA: canChiBride, canChiB: canChiGroom, menhA: menhBride, menhB: menhGroom, chiRelation, hanhRelation, score, label, notes } = result;
  const title = `Cô dâu ${yearBride} và Chú rể ${yearGroom} có hợp kết hôn không? — ${score}/100`;
  const desc = `Cô dâu ${yearBride} (${canChiBride}) và Chú rể ${yearGroom} (${canChiGroom}): điểm tương hợp ${score}/100 — ${label}. ${advice}`;
  const scoreColor = score >= 85 ? 'text-jade' : score >= 68 ? 'text-gold-soft' : score >= 50 ? 'text-moon' : 'text-vermilion';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <HeartHandshake size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-8 text-center">{title}</h1>

        <div className="mystic-card p-6 text-center mb-6">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div>
              <p className="text-xs text-moon uppercase mb-1">Cô dâu</p>
              <p className="font-display text-2xl text-gold-soft">{yearBride}</p>
              <p className="text-xs text-moon mt-1">{canChiBride}</p>
            </div>
            <span className="text-2xl">💍</span>
            <div>
              <p className="text-xs text-moon uppercase mb-1">Chú rể</p>
              <p className="font-display text-2xl text-gold-soft">{yearGroom}</p>
              <p className="text-xs text-moon mt-1">{canChiGroom}</p>
            </div>
          </div>
          <p className={`font-display text-4xl mb-1 ${scoreColor}`}>{score}/100</p>
          <p className={`font-semibold ${scoreColor}`}>{label}</p>
        </div>

        <div className="mystic-card p-6 mb-6">
          <p className="text-gold-soft font-semibold mb-2">Lời khuyên cho hôn nhân</p>
          <p className="text-parchment/85">{advice}</p>
        </div>

        <div className="mystic-card p-6 space-y-2 text-sm mb-6">
          <p className="text-moon">Mệnh: <strong className="text-parchment">{menhBride.hanh}</strong> — <strong className="text-parchment">{menhGroom.hanh}</strong> ({RELATION_LABEL[hanhRelation] || 'Bình thường'})</p>
          <p className="text-moon">Quan hệ Địa Chi: <strong className="text-parchment">{RELATION_LABEL[chiRelation]}</strong></p>
          {notes.map((n) => <p key={n} className="text-parchment/70">• {n}</p>)}
        </div>

        <AdSlot label="Ad slot — xem tuổi kết hôn" className="mb-6" />

        <div>
          <p className="text-sm text-moon mb-3">Xem thêm:</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/xem-ngay-tot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày cưới tốt</Link>
          </div>
        </div>

        <TuoiHopLinks exclude="xem-tuoi-ket-hon" />

        <p className="text-xs text-moon/50 mt-8 text-center">
          Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
        </p>
      </main>
      <Footer />
    </>
  );
}
