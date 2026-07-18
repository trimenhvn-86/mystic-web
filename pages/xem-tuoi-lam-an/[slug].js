import Head from 'next/head';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TuoiHopLinks from '../../components/TuoiHopLinks';
import { compareTuoi, getBusinessAdvice } from '../../lib/tuoiHop';

const SLUG_RE = /^doi-tac-(\d{4})-va-(\d{4})$/;

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
  const yearA = Number(m[1]);
  const yearB = Number(m[2]);
  if (yearA < 1900 || yearA > 2100 || yearB < 1900 || yearB > 2100) return { notFound: true };

  const result = compareTuoi(yearA, yearB);
  const advice = getBusinessAdvice(result.score);
  return { props: { result, advice, yearA, yearB }, revalidate: 2592000 };
}

export default function XemTuoiLamAnResult({ result, advice, yearA, yearB }) {
  const { canChiA, canChiB, menhA, menhB, chiRelation, hanhRelation, score, label, notes } = result;
  const title = `Tuổi ${yearA} và ${yearB} có hợp làm ăn không? — ${score}/100`;
  const desc = `Đối tác ${yearA} (${canChiA}) và ${yearB} (${canChiB}): điểm tương hợp ${score}/100 — ${label}. ${advice}`;
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
          <Briefcase size={26} className="text-gold" />
        </div>
        <Breadcrumb trail={[{ label: 'Tuổi & Tương Hợp', href: '/tuoi-tuong-hop' }, { label: 'Xem tuổi làm ăn', href: '/xem-tuoi-lam-an' }]} current="Kết quả" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-8 text-center">{title}</h1>

        <div className="mystic-card p-6 text-center mb-6">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div>
              <p className="text-xs text-moon uppercase mb-1">Đối tác 1</p>
              <p className="font-display text-2xl text-gold-soft">{yearA}</p>
              <p className="text-xs text-moon mt-1">{canChiA}</p>
            </div>
            <span className="text-2xl">🤝</span>
            <div>
              <p className="text-xs text-moon uppercase mb-1">Đối tác 2</p>
              <p className="font-display text-2xl text-gold-soft">{yearB}</p>
              <p className="text-xs text-moon mt-1">{canChiB}</p>
            </div>
          </div>
          <p className={`font-display text-4xl mb-1 ${scoreColor}`}>{score}/100</p>
          <p className={`font-semibold ${scoreColor}`}>{label}</p>
        </div>

        <div className="mystic-card p-6 mb-6">
          <p className="text-gold-soft font-semibold mb-2">Lời khuyên khi hợp tác</p>
          <p className="text-parchment/85">{advice}</p>
        </div>

        <div className="mystic-card p-6 space-y-2 text-sm mb-6">
          <p className="text-moon">Mệnh: <strong className="text-parchment">{menhA.hanh}</strong> — <strong className="text-parchment">{menhB.hanh}</strong> ({RELATION_LABEL[hanhRelation] || 'Bình thường'})</p>
          <p className="text-moon">Quan hệ Địa Chi: <strong className="text-parchment">{RELATION_LABEL[chiRelation]}</strong></p>
          {notes.map((n) => <p key={n} className="text-parchment/70">• {n}</p>)}
        </div>

        <AdSlot label="Ad slot — xem tuổi làm ăn" className="mb-6" />

        <div>
          <p className="text-sm text-moon mb-3">Xem thêm:</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/xem-ngay-tot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày khai trương tốt</Link>
          </div>
        </div>

        <TuoiHopLinks exclude="xem-tuoi-lam-an" />

        <p className="text-xs text-moon/50 mt-8 text-center">
          Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
        </p>
      </main>
      <Footer />
    </>
  );
}
