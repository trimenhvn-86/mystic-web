import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { HelpCircle, RotateCcw } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TarotCardFlip from '../../components/TarotCardFlip';
import HubContentPreview from '../../components/HubContentPreview';
import { getRandomCard, getYesNoResult } from '../../lib/tarot';
import { trackToolUse } from '../../lib/analytics';
import { getHubContentPreview } from '../../lib/sanity';

export async function getStaticProps() {
  const preview = await getHubContentPreview('tarot');
  return { props: preview, revalidate: 86400 };
}

const RESULT_COLOR = {
  yes: 'text-jade',
  leaning_yes: 'text-jade',
  uncertain: 'text-gold-soft',
  leaning_no: 'text-vermilion',
  no: 'text-vermilion'
};

export default function TarotYesNo({ dictionaryPreview, guidePreview }) {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [askedQuestion, setAskedQuestion] = useState('');

  function handleFlip() {
    const drawn = getRandomCard();
    const yesNo = getYesNoResult(drawn.card, drawn.upright);
    setResult({ ...drawn, yesNo });
    setAskedQuestion(question);
    setFlipped(true);
    trackToolUse('tarot_yes_no', { result: yesNo.key });
  }

  function handleReset() {
    setResult(null);
    setFlipped(false);
    setQuestion('');
  }

  return (
    <>
      <Head>
        <title>Tarot Yes/No — Bói Có Không — TriMenh</title>
        <meta name="description" content="Đặt câu hỏi Có/Không, rút 1 lá Tarot để nhận câu trả lời với 5 mức độ rõ ràng." />
      </Head>
      <Header />
      <main className="max-w-lg mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <HelpCircle size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1 text-center">Tarot Yes / No</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Đặt câu hỏi Có/Không rồi rút 1 lá để nhận câu trả lời</p>

        {!flipped && (
          <div className="mystic-card p-5 mb-6">
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Câu hỏi của bạn (không bắt buộc)
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="VD: Tôi có nên thay đổi công việc không?"
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
              />
            </label>
          </div>
        )}

        <TarotCardFlip
          card={result?.card}
          upright={result?.upright}
          flipped={flipped}
          onFlip={handleFlip}
          size={200}
        />

        {flipped && result && (
          <>
            {askedQuestion && (
              <p className="text-center text-sm text-moon mt-6">Câu hỏi: <span className="text-parchment/90">&ldquo;{askedQuestion}&rdquo;</span></p>
            )}

            <div className="mystic-card p-6 mt-4 text-center">
              <p className="text-xs text-moon uppercase mb-1">Kết quả</p>
              <p className={`font-display text-3xl font-bold ${RESULT_COLOR[result.yesNo.key]}`}>{result.yesNo.label}</p>
              <p className="text-sm text-moon mt-2">Lá bài: {result.card.nameVi} — {result.upright ? 'Xuôi' : 'Ngược'}</p>
            </div>

            <div className="mystic-card p-6 mt-4 space-y-4">
              <div>
                <p className="text-gold-soft font-semibold mb-1">Lý do</p>
                <p className="text-parchment/85 text-sm">{result.upright ? result.card.meaningUpright : result.card.meaningReversed}</p>
              </div>
              <div className="mystic-divider pt-4">
                <p className="text-gold-soft font-semibold mb-1">Điều kiện để kết quả thuận lợi hơn</p>
                <p className="text-parchment/85 text-sm">
                  {result.yesNo.key === 'yes' || result.yesNo.key === 'leaning_yes'
                    ? 'Tiếp tục giữ vững tinh thần và hành động chủ động theo hướng đã chọn.'
                    : result.yesNo.key === 'uncertain'
                    ? 'Cần thêm thời gian hoặc thông tin trước khi kết quả rõ ràng hơn — nên tránh quyết định vội vàng.'
                    : 'Nên xem xét lại cách tiếp cận hoặc thời điểm, thay vì cố ép kết quả theo ý muốn.'}
                </p>
              </div>
            </div>

            <AdSlot label="Ad slot — tarot yes no" className="mt-6" />

            <div className="flex justify-center mt-6">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
              >
                <RotateCcw size={15} /> Hỏi câu khác
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link href={`/tarot/${result.card.slug}`} className="text-sm text-gold-soft hover:underline">
                Xem ý nghĩa đầy đủ của lá {result.card.nameVi} →
              </Link>
            </div>
          </>
        )}

        <div className="mt-8">
          <p className="text-sm text-moon mb-3 text-center">Công cụ liên quan:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/tarot-hom-nay" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tarot hôm nay</Link>
            <Link href="/rut-la-tarot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Rút 1 lá bài</Link>
            <Link href="/tarot/bo-bai" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Bộ bài 78 lá</Link>
            <Link href="/trai-bai-3-la" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Trải bài 3 lá</Link>
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
