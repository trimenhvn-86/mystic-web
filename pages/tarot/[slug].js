import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TarotCardArt from '../../components/TarotCardArt';
import { cards, getCardBySlug } from '../../lib/tarot';

export async function getStaticPaths() {
  return { paths: cards.map((c) => ({ params: { slug: c.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const card = getCardBySlug(params.slug);
  if (!card) return { notFound: true };
  return { props: { card } };
}

export default function TarotCardDetail({ card }) {
  const title = `Ý Nghĩa Lá ${card.nameVi} (${card.nameEn}) Trong Tarot`;
  return (
    <>
      <Head>
        <title>{title} — TriMenh</title>
        <meta name="description" content={card.meaningUpright.slice(0, 155)} />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-8 text-center">{title}</h1>

        <div className="flex justify-center mb-8">
          <TarotCardArt card={card} upright={true} size={180} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="mystic-card p-5">
            <p className="text-jade font-semibold mb-2">Ý nghĩa xuôi</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {card.keywordsUpright.map((k) => (
                <span key={k} className="px-2.5 py-0.5 rounded-full bg-ink-soft border border-jade/30 text-xs">{k}</span>
              ))}
            </div>
            <p className="text-sm text-parchment/85">{card.meaningUpright}</p>
          </div>
          <div className="mystic-card p-5">
            <p className="text-vermilion font-semibold mb-2">Ý nghĩa ngược</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {card.keywordsReversed.map((k) => (
                <span key={k} className="px-2.5 py-0.5 rounded-full bg-ink-soft border border-vermilion/30 text-xs">{k}</span>
              ))}
            </div>
            <p className="text-sm text-parchment/85">{card.meaningReversed}</p>
          </div>
        </div>

        <div className="mystic-card p-5 mb-6">
          <p className="text-gold-soft font-semibold mb-2">Thông tin lá bài</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm text-moon">
            <p>Bộ bài: <strong className="text-parchment">{card.arcana === 'major' ? 'Ẩn chính (Major Arcana)' : 'Ẩn phụ (Minor Arcana)'}</strong></p>
            {card.suit && <p>Chất bài: <strong className="text-parchment">{card.suit === 'wands' ? 'Gậy (Wands)' : card.suit === 'cups' ? 'Cốc (Cups)' : card.suit === 'swords' ? 'Kiếm (Swords)' : 'Đồng tiền (Pentacles)'}</strong></p>}
          </div>
        </div>

        <AdSlot label="Ad slot — chi tiết lá tarot" className="mb-6" />

        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/tarot-hom-nay" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tarot hôm nay</Link>
          <Link href="/rut-la-tarot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Rút 1 lá bài</Link>
          <Link href="/tarot-yes-no" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tarot Yes/No</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
