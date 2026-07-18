import Head from 'next/head';
import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TuoiHopLinks from '../../components/TuoiHopLinks';
import { compareTuoi } from '../../lib/tuoiHop';

const SLUG_RE = /^nam-(\d{4})-va-nam-(\d{4})$/;

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
  return { props: { result }, revalidate: 2592000 };
}

const RELATION_LABEL = {
  'tam-hop': 'Tam hợp', 'luc-hop': 'Lục hợp', 'dong-tuoi': 'Cùng tuổi',
  'luc-hai': 'Lục hại', 'tu-hanh-xung': 'Tứ hành xung', 'binh-thuong': 'Bình thường'
};

export default function SoSanhTuoiResult({ result }) {
  const { yearA, yearB, canChiA, canChiB, menhA, menhB, chiRelation, hanhRelation, score, label, notes } = result;
  const title = `Tuổi ${yearA} và ${yearB} có hợp nhau không? — Điểm tương hợp ${score}/100`;
  const desc = `Tuổi ${yearA} (${canChiA}) và ${yearB} (${canChiB}): điểm tương hợp ${score}/100 — ${label}. Quan hệ Địa Chi: ${RELATION_LABEL[chiRelation]}.`;

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
        <Breadcrumb trail={[{ label: 'Tuổi & Tương Hợp', href: '/tuoi-tuong-hop' }, { label: 'So sánh tuổi 2 người', href: '/so-sanh-tuoi' }]} current="Kết quả" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-8 text-center">{title}</h1>

        <div className="mystic-card p-6 text-center mb-6">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div>
              <p className="font-display text-2xl text-gold-soft">{yearA}</p>
              <p className="text-xs text-moon mt-1">{canChiA}</p>
            </div>
            <span className="text-2xl">❤️</span>
            <div>
              <p className="font-display text-2xl text-gold-soft">{yearB}</p>
              <p className="text-xs text-moon mt-1">{canChiB}</p>
            </div>
          </div>
          <p className={`font-display text-4xl ${scoreColor}`}>{score}/100</p>
          <p className={`text-lg mt-1 ${scoreColor}`}>{label}</p>
          <p className="text-[11px] text-moon/50 mt-2">* Điểm đánh giá riêng của TriMenh, không phải quy chuẩn phong thủy truyền thống.</p>
        </div>

        <div className="mystic-card p-6 mb-6">
          <h2 className="font-display text-lg text-parchment mb-3">Phân tích chi tiết</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            <p className="text-moon">Quan hệ Địa Chi: <strong className="text-parchment">{RELATION_LABEL[chiRelation]}</strong></p>
            <p className="text-moon">Quan hệ Ngũ hành: <strong className="text-parchment">{menhA.hanh} - {menhB.hanh} ({hanhRelation === 'sinh' ? 'Tương sinh' : hanhRelation === 'khac' ? 'Tương khắc' : hanhRelation === 'dong-hanh' ? 'Cùng hành' : 'Bình thường'})</strong></p>
          </div>
          <ul className="text-sm text-parchment/85 space-y-1.5">
            {notes.map((n) => <li key={n}>• {n}</li>)}
          </ul>
        </div>

        <AdSlot label="Ad slot — so sánh tuổi" className="mb-6" />

        <div>
          <p className="text-sm text-moon mb-3">Xem thêm:</p>
          <div className="flex flex-wrap gap-2">
            <Link href={`/${yearA}-menh-gi`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Mệnh tuổi {yearA}</Link>
            <Link href={`/${yearB}-menh-gi`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Mệnh tuổi {yearB}</Link>
            <Link href={`/${yearA}-hop-tuoi-nao`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Danh sách tuổi hợp {yearA}</Link>
          </div>
        </div>

        <TuoiHopLinks exclude="so-sanh-tuoi" />

        <p className="text-xs text-moon/50 mt-6 text-center">
          Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
        </p>
      </main>
      <Footer />
    </>
  );
}
