import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layers3, RotateCcw } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TarotCardFlip from '../../components/TarotCardFlip';
import HubContentPreview from '../../components/HubContentPreview';
import { getUniqueCardSpread } from '../../lib/tarot';
import { trackToolUse } from '../../lib/analytics';
import { getHubContentPreview } from '../../lib/sanity';
import spreads from '../../content/tarot-spreads.json';

export async function getStaticPaths() {
  return { paths: spreads.map((s) => ({ params: { spread: s.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const spread = spreads.find((s) => s.slug === params.spread);
  if (!spread) return { notFound: true };
  const preview = await getHubContentPreview('tarot');
  return { props: { spread, ...preview }, revalidate: 86400 };
}

export default function TraiBai3La({ spread, dictionaryPreview, guidePreview }) {
  const [drawn, setDrawn] = useState(null);
  const [revealed, setRevealed] = useState(false);

  function handleDraw() {
    const result = getUniqueCardSpread(3);
    setDrawn(result);
    setTimeout(() => setRevealed(true), 100);
    trackToolUse('trai_bai_3_la', { spread_type: spread.slug });
  }

  function handleReset() {
    setDrawn(null);
    setRevealed(false);
  }

  return (
    <>
      <Head>
        <title>{spread.label} — TriMenh</title>
        <meta name="description" content={`${spread.desc} Trải bài Tarot 3 lá miễn phí, dùng đủ bộ 78 lá.`} />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Layers3 size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">{spread.label}</h1>
        <p className="text-moon/70 text-sm text-center mb-10">{spread.desc}</p>

        {!drawn && (
          <div className="flex justify-center">
            <button onClick={handleDraw} className="btn-gold px-8 py-3.5 text-base font-semibold">
              Trải bài
            </button>
          </div>
        )}

        {drawn && (
          <>
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
              {spread.positions.map((pos, i) => (
                <div key={pos} className="flex flex-col items-center">
                  <p className="text-xs sm:text-sm text-gold-soft font-semibold mb-3 text-center">{pos}</p>
                  <TarotCardFlip
                    card={drawn[i].card}
                    upright={drawn[i].upright}
                    flipped={revealed}
                    onFlip={() => {}}
                    size={100}
                  />
                </div>
              ))}
            </div>

            {revealed && (
              <div className="space-y-4 mb-8">
                {spread.positions.map((pos, i) => {
                  const { card, upright } = drawn[i];
                  const msg = upright ? card.dailyMessageUpright : card.dailyMessageReversed;
                  return (
                    <div key={pos} className="mystic-card p-5">
                      <p className="text-xs text-gold-soft uppercase mb-1">{pos}</p>
                      <p className="font-display text-lg text-parchment mb-1">{card.nameVi} — {upright ? 'Xuôi' : 'Ngược'}</p>
                      <p className="text-sm text-parchment/85">{msg}</p>
                      <Link href={`/tarot/${card.slug}`} className="inline-block text-xs text-gold-soft hover:underline mt-2">
                        Xem ý nghĩa đầy đủ →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            <AdSlot label={`Ad slot — trai bai ${spread.slug}`} className="mb-6" />

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
              >
                <RotateCcw size={15} /> Trải lại
              </button>
            </div>
          </>
        )}

        <div className="mt-10">
          <p className="text-sm text-moon mb-3 text-center">Kiểu trải khác:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {spreads.filter((s) => s.slug !== spread.slug).map((s) => (
              <Link key={s.slug} href={`/trai-bai-3-la/${s.slug}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">
                {s.label.replace('Trải Bài 3 Lá — ', '').replace('Trải Bài ', '')}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-moon mb-3 text-center">Công cụ liên quan:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/rut-la-tarot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Rút 1 lá bài</Link>
            <Link href="/tarot-yes-no" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tarot Yes/No</Link>
            <Link href="/tarot/bo-bai" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Bộ bài 78 lá</Link>
          </div>
        </div>

        <div className="mt-8">
          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>

        <p className="text-xs text-moon/50 mt-6 text-center">
          Tarot mang tính tham khảo, chiêm nghiệm — không thay thế quyết định cá nhân.
        </p>
      </main>
      <Footer />
    </>
  );
}
