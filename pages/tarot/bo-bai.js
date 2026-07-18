import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import TarotCardArt from '../../components/TarotCardArt';
import { cards } from '../../lib/tarot';

const SUIT_LABEL = {
  wands: 'Gậy (Wands) — Hành động, nhiệt huyết',
  cups: 'Cốc (Cups) — Cảm xúc, tình cảm',
  swords: 'Kiếm (Swords) — Tư duy, thử thách',
  pentacles: 'Tiền (Pentacles) — Vật chất, sự nghiệp'
};
const SUIT_ORDER = ['wands', 'cups', 'swords', 'pentacles'];

export async function getStaticProps() {
  const major = cards.filter((c) => c.arcana === 'major').sort((a, b) => a.number - b.number);
  const minorBySuit = SUIT_ORDER.map((suit) => ({
    suit,
    label: SUIT_LABEL[suit],
    cards: cards.filter((c) => c.suit === suit).sort((a, b) => a.number - b.number)
  }));
  return { props: { major, minorBySuit }, revalidate: 2592000 };
}

function CardGridItem({ card }) {
  return (
    <Link href={`/tarot/${card.slug}`} className="flex flex-col items-center group">
      <div className="scale-[0.55] origin-top -mb-10 sm:-mb-6 group-hover:scale-[0.6] transition-transform">
        <TarotCardArt card={card} upright={true} size={140} />
      </div>
      <p className="text-xs text-center text-moon group-hover:text-gold-soft transition-colors px-1">{card.nameVi}</p>
    </Link>
  );
}

export default function TarotBoBai({ major, minorBySuit }) {
  return (
    <>
      <Head>
        <title>Bộ Bài Tarot 78 Lá Đầy Đủ — Ý Nghĩa Từng Lá — TriMenh</title>
        <meta name="description" content="Tra cứu ý nghĩa đầy đủ 78 lá Tarot: 22 lá Ẩn Chính (Major Arcana) và 56 lá Ẩn Phụ (Minor Arcana) gồm Gậy, Cốc, Kiếm, Tiền." />
      </Head>
      <Header />
      <main className="max-w-5xl mx-auto px-5 py-8 sm:py-12">
        <Breadcrumb trail={[{ label: 'Tarot', href: '/tarot' }]} current="Bộ bài 78 lá" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Bộ Bài Tarot 78 Lá</h1>
        <p className="text-moon/70 text-sm text-center mb-10">Bấm vào từng lá để xem ý nghĩa xuôi và ngược đầy đủ</p>

        <section className="mb-12">
          <h2 className="font-display text-xl text-gold-soft mb-1">Ẩn Chính — Major Arcana (22 lá)</h2>
          <p className="text-xs text-moon/60 mb-5">Các bài học lớn, bước ngoặt cuộc đời</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-8 gap-x-2">
            {major.map((c) => <CardGridItem key={c.slug} card={c} />)}
          </div>
        </section>

        {minorBySuit.map((group) => (
          <section key={group.suit} className="mb-12">
            <h2 className="font-display text-xl text-gold-soft mb-1">{group.label}</h2>
            <p className="text-xs text-moon/60 mb-5">14 lá — Át đến 10, Thị Đồng, Kỵ Sĩ, Hoàng Hậu, Vua</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-8 gap-x-2">
              {group.cards.map((c) => <CardGridItem key={c.slug} card={c} />)}
            </div>
          </section>
        ))}

        <div className="flex flex-wrap justify-center gap-2 mt-10">
          <Link href="/tarot-hom-nay" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tarot hôm nay</Link>
          <Link href="/rut-la-tarot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Rút 1 lá bài</Link>
          <Link href="/tarot-yes-no" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tarot Yes/No</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
