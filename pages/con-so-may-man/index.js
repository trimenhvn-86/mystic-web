import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import { getLuckyNumbers } from '../../lib/luckyNumber';

export default function ConSoMayMan() {
  const [form, setForm] = useState({ dd: 1, mm: 1, yyyy: 1990 });
  const [step, setStep] = useState('form');
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setStep('loading');
    setTimeout(() => {
      setResult(getLuckyNumbers(Number(form.dd), Number(form.mm), Number(form.yyyy)));
      setStep('result');
    }, 2000);
  }

  if (step === 'loading') {
    return (
      <>
        <Header />
        <MysticLoader label="Đang đối chiếu ngũ hành và con số..." />
        <Footer />
      </>
    );
  }

  if (step === 'result' && result) {
    return (
      <>
        <Head><title>Con Số May Mắn Của Bạn — TriMenh</title></Head>
        <Header />
        <main className="max-w-md mx-auto px-5 py-10 sm:py-14">
          <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">Con Số May Mắn</h1>
          <div className="mystic-card p-6 text-center space-y-4">
            <p className="text-moon text-sm">Số Chủ Đạo: <strong className="text-parchment">{result.lifePath}</strong> — Mệnh: <strong className="text-parchment">{result.hanh}</strong></p>
            <div className="flex justify-center gap-3 flex-wrap pt-2">
              {result.luckyNumbers.map((n) => (
                <span key={n} className="w-12 h-12 rounded-full bg-gold text-ink font-display text-xl flex items-center justify-center">{n}</span>
              ))}
            </div>
          </div>
          <button onClick={() => setStep('form')} className="mt-6 text-sm text-moon hover:text-gold-soft underline block mx-auto">← Tra cứu lại</button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Con Số May Mắn Theo Ngày Sinh — TriMenh</title>
        <meta name="description" content="Tìm con số may mắn hợp với bản mệnh dựa trên ngày sinh, kết hợp Thần số học và Ngũ hành." />
      </Head>
      <Header />
      <main className="max-w-md mx-auto px-5 py-10 sm:py-14">
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Con Số May Mắn</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Nhập ngày sinh để tìm con số hợp mệnh</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1 text-xs text-moon">
              Ngày
              <input type="number" min="1" max="31" required value={form.dd}
                onChange={(e) => setForm({ ...form, dd: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon">
              Tháng
              <input type="number" min="1" max="12" required value={form.mm}
                onChange={(e) => setForm({ ...form, mm: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon">
              Năm
              <input type="number" min="1900" max="2100" required value={form.yyyy}
                onChange={(e) => setForm({ ...form, yyyy: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
          </div>
          <button type="submit" className="btn-gold py-3.5 text-base font-semibold mt-2">Xem kết quả</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
