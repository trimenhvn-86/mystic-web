import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import ResultTabs from '../../components/ResultTabs';
import NumerologyChart from '../../components/NumerologyChart';
import HubContentPreview from '../../components/HubContentPreview';
import dictionary from '../../content/numerology/life-path.json';
import { getHubContentPreview } from '../../lib/sanity';
import { trackToolUse } from '../../lib/analytics';
import {
  calcLifePathNumber,
  calcDestinyNumber,
  calcSoulUrgeNumber,
  calcPersonalYearNumber,
  calcPersonalityNumber,
  calcMaturityNumber,
  calcPersonalMonthNumber,
  calcPersonalDayNumber,
  getMissingNumbers,
  getPowerArrows,
  getCompatibleNumbers
} from '../../lib/numerology';

const CORE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

export async function getStaticProps() {
  const preview = await getHubContentPreview('than-so-hoc');
  return { props: preview, revalidate: 86400 };
}

export default function ThanSoHoc({ dictionaryPreview, guidePreview }) {
  const router = useRouter();
  const [form, setForm] = useState({ hoTen: '', dd: 1, mm: 1, yyyy: 1990 });
  const [step, setStep] = useState('form');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const { dd, mm, yyyy } = router.query;
    if (dd && mm && yyyy) {
      setForm((f) => ({ ...f, dd: Number(dd), mm: Number(mm), yyyy: Number(yyyy) }));
    }
  }, [router.query]);

  function handleSubmit(e) {
    e.preventDefault();
    setStep('loading');
    setTimeout(() => {
      const dd = Number(form.dd), mm = Number(form.mm), yyyy = Number(form.yyyy);
      const today = new Date();
      const lifePath = calcLifePathNumber(dd, mm, yyyy);
      const destiny = calcDestinyNumber(form.hoTen);
      const soul = calcSoulUrgeNumber(form.hoTen);
      const personality = calcPersonalityNumber(form.hoTen);
      const maturity = calcMaturityNumber(lifePath, destiny);
      const personalYear = calcPersonalYearNumber(dd, mm, today.getFullYear());
      const personalMonth = calcPersonalMonthNumber(personalYear, today.getMonth() + 1);
      const personalDay = calcPersonalDayNumber(personalMonth, today.getDate());
      const missing = getMissingNumbers(dd, mm, yyyy);
      const compatible = getCompatibleNumbers(lifePath);
      const arrows = getPowerArrows(dd, mm, yyyy);
      setResult({ dd, mm, yyyy, lifePath, destiny, soul, personality, maturity, personalYear, personalMonth, personalDay, missing, compatible, arrows });
      trackToolUse('than_so_hoc');
      setStep('result');
    }, 2200);
  }

  if (step === 'loading') {
    return (
      <>
        <Header />
        <MysticLoader label="Đang lập dữ liệu vận trình, đối chiếu con số..." />
        <Footer />
      </>
    );
  }

  if (step === 'result' && result) {
    const info = dictionary[String(result.lifePath)];
    const tabs = [
      {
        key: 'tong-quan',
        label: 'Tổng quan',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              {[
                ['Chủ Đạo', result.lifePath], ['Sứ Mệnh', result.destiny], ['Linh Hồn', result.soul],
                ['Biểu Đạt', result.personality], ['Trưởng Thành', result.maturity], [`Năm ${new Date().getFullYear()}`, result.personalYear]
              ].map(([label, val]) => (
                <div key={label} className="bg-ink-soft rounded-lg border border-ink-line px-2 py-3">
                  <p className="text-2xl font-display text-gold-soft">{val}</p>
                  <p className="text-[11px] text-moon mt-1">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-parchment/85">{info?.tongQuan}</p>
          </div>
        )
      },
      {
        key: 'bieu-do',
        label: 'Biểu đồ ngày sinh',
        content: (
          <div>
            <NumerologyChart dd={result.dd} mm={result.mm} yyyy={result.yyyy} />
            {result.missing.length > 0 && (
              <p className="text-sm text-moon text-center mt-4">
                Số còn thiếu: <strong className="text-vermilion">{result.missing.join(', ')}</strong>
              </p>
            )}
            {result.arrows.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-xs text-moon uppercase text-center">Mũi tên sức mạnh</p>
                {result.arrows.map((a) => (
                  <div key={a.ten} className="bg-ink-soft rounded-lg px-4 py-3 border border-gold/20">
                    <p className="text-gold-soft font-display">{a.ten}</p>
                    <p className="text-sm text-parchment/80">{a.mota}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      },
      {
        key: 'con-duong',
        label: 'Sự nghiệp & Tình duyên',
        content: (
          <div className="space-y-2">
            <p><strong className="text-gold-soft">Sự nghiệp:</strong> {info?.conDuong}</p>
            <p><strong className="text-gold-soft">Tình duyên:</strong> {info?.tinhDuyen}</p>
          </div>
        )
      },
      {
        key: 'chu-ky',
        label: 'Năm - Tháng - Ngày cá nhân',
        content: (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-xs text-moon mb-1">Năm cá nhân</p><p className="text-xl font-display text-gold-soft">{result.personalYear}</p></div>
            <div><p className="text-xs text-moon mb-1">Tháng cá nhân</p><p className="text-xl font-display text-gold-soft">{result.personalMonth}</p></div>
            <div><p className="text-xs text-moon mb-1">Ngày cá nhân</p><p className="text-xl font-display text-gold-soft">{result.personalDay}</p></div>
          </div>
        )
      },
      {
        key: 'tuong-hop',
        label: 'Bạn hợp với số nào?',
        content: (
          <div>
            <p className="text-sm text-moon mb-3">Số Chủ Đạo {result.lifePath} thường hợp với:</p>
            <div className="flex gap-2 flex-wrap">
              {result.compatible.map((n) => (
                <span key={n} className="w-10 h-10 rounded-full bg-gold text-ink font-display text-lg flex items-center justify-center">{n}</span>
              ))}
            </div>
          </div>
        )
      }
    ];

    return (
      <>
        <Head>
          <title>Kết quả Thần Số Học của {form.hoTen || 'bạn'}</title>
        </Head>
        <Header />
        <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
          <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">
            Bản đồ Thần Số Học của {form.hoTen}
          </h1>
          <ResultTabs tabs={tabs} />
          <button
            onClick={() => setStep('form')}
            className="mt-6 text-sm text-moon hover:text-gold-soft underline block mx-auto"
          >
            ← Tra cứu lại
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Lập Biểu Đồ Thần Số Học Miễn Phí — Số Chủ Đạo, Số Sứ Mệnh</title>
        <meta name="description" content="Tính Số Chủ Đạo, Số Sứ Mệnh, Số Linh Hồn, Số Biểu Đạt, Số Trưởng Thành theo hệ Pythagoras từ họ tên và ngày sinh." />
      </Head>
      <Header />
      <main className="max-w-md mx-auto px-5 py-10 sm:py-14">
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Lập Biểu Đồ Thần Số Học</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Khám phá bản thân qua ngày sinh và họ tên</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
            Họ và tên (không dấu hoặc có dấu đều được)
            <input
              type="text" required
              value={form.hoTen}
              onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
              className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
              placeholder="Nguyễn Văn A"
            />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Ngày
              <input type="number" min="1" max="31" required value={form.dd}
                onChange={(e) => setForm({ ...form, dd: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Tháng
              <input type="number" min="1" max="12" required value={form.mm}
                onChange={(e) => setForm({ ...form, mm: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Năm
              <input type="number" min="1900" max="2100" required value={form.yyyy}
                onChange={(e) => setForm({ ...form, yyyy: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
          </div>
          <button type="submit" className="btn-gold py-3.5 text-base font-semibold mt-2">Tính ngay</button>
        </form>
        <p className="text-xs text-moon/60 text-center mt-3">
          Miễn phí · Chính xác theo hệ Pythagoras · Không lưu dữ liệu nếu chưa đăng nhập
        </p>

        <div className="mt-10 space-y-8">
          <div>
            <h2 className="text-moon text-sm mb-3">Tìm hiểu ý nghĩa từng con số:</h2>
            <div className="flex flex-wrap gap-2">
              {CORE_NUMBERS.map((n) => (
                <Link
                  key={n}
                  href={`/than-so-hoc/so-chu-dao-${n}`}
                  className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold hover:text-gold-soft transition-colors"
                >
                  Số {n}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/con-so-may-man" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Con số may mắn</Link>
              <Link href="/xem-ngay-tot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt</Link>
              <Link href="/tu-vi-hom-nay" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tử vi hôm nay</Link>
            </div>
          </div>

          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
