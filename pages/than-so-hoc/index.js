import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Share2, RotateCcw } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';
import ResultTabs from '../../components/ResultTabs';
import NumerologyChart from '../../components/NumerologyChart';
import HubContentPreview from '../../components/HubContentPreview';
import FaqSection from '../../components/FaqSection';
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

const FAQ_RESULT = [
  { q: 'Số Chủ Đạo có thay đổi không?', a: 'Không. Số Chủ Đạo được tính từ ngày sinh — một dữ liệu cố định suốt đời, nên Số Chủ Đạo không bao giờ thay đổi.' },
  { q: 'Tên có ảnh hưởng thần số học không?', a: 'Có. Họ tên đầy đủ dùng để tính Số Sứ Mệnh, Số Linh Hồn và Số Biểu Đạt — khác với Số Chủ Đạo chỉ dựa trên ngày sinh.' },
  { q: 'Có nên đổi tên theo thần số học không?', a: 'Đây là lựa chọn cá nhân. Thần số học mang tính tham khảo, chiêm nghiệm — không có cơ sở khoa học chứng minh việc đổi tên sẽ thay đổi vận mệnh.' },
  { q: 'Có cần giờ sinh không?', a: 'Không cần. Thần số học theo hệ Pythagoras chỉ dùng ngày/tháng/năm sinh và họ tên đầy đủ, không cần giờ sinh chính xác như Tử vi.' }
];

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
    const { dd, mm, yyyy, hoTen } = router.query;
    if (dd && mm && yyyy && hoTen) {
      setForm({ hoTen: String(hoTen), dd: Number(dd), mm: Number(mm), yyyy: Number(yyyy) });
      computeResult(String(hoTen), Number(dd), Number(mm), Number(yyyy));
    } else if (dd && mm && yyyy) {
      setForm((f) => ({ ...f, dd: Number(dd), mm: Number(mm), yyyy: Number(yyyy) }));
    }
  }, [router.query]);

  function computeResult(hoTen, dd, mm, yyyy) {
    setStep('loading');
    setTimeout(() => {
      const today = new Date();
      const lifePath = calcLifePathNumber(dd, mm, yyyy);
      const destiny = calcDestinyNumber(hoTen);
      const soul = calcSoulUrgeNumber(hoTen);
      const personality = calcPersonalityNumber(hoTen);
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

  function handleSubmit(e) {
    e.preventDefault();
    computeResult(form.hoTen, Number(form.dd), Number(form.mm), Number(form.yyyy));
  }

  function handleShare() {
    const shareText = `Số Chủ Đạo của tôi là ${result.lifePath} — xem thần số học miễn phí tại TriMenh: https://trimenh.com/than-so-hoc`;
    if (navigator.share) {
      navigator.share({ title: 'Thần Số Học TriMenh', text: shareText }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      alert('Đã sao chép nội dung chia sẻ vào clipboard!');
    }
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
    const summary = `Bạn thuộc Số Chủ Đạo ${result.lifePath}${info?.ten ? ` — ${info.ten.replace(`Số Chủ Đạo ${result.lifePath} - `, '')}` : ''}. Điểm mạnh nổi bật là ${(info?.diemManh || []).slice(0, 2).join(', ').toLowerCase()}, trong khi cần lưu ý khắc phục ${(info?.diemYeu || []).slice(0, 1).join('').toLowerCase()}.`;

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
              ].map(([label, val]) => {
                const hasPage = Boolean(dictionary[String(val)]);
                const Wrapper = hasPage ? Link : 'div';
                const wrapperProps = hasPage ? { href: `/than-so-hoc/so-chu-dao-${val}` } : {};
                return (
                  <Wrapper key={label} {...wrapperProps} className={`bg-ink-soft rounded-lg border border-ink-line px-2 py-3 ${hasPage ? 'hover:border-gold/40 transition-colors cursor-pointer' : ''}`}>
                    <p className="text-2xl font-display text-gold-soft">{val}</p>
                    <p className="text-[11px] text-moon mt-1">{label}</p>
                  </Wrapper>
                );
              })}
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
        key: 'nghe-nghiep',
        label: 'Nghề nghiệp phù hợp',
        content: <p className="text-sm text-parchment/90">{info?.conDuong}</p>
      },
      {
        key: 'tinh-yeu',
        label: 'Tình yêu',
        content: <p className="text-sm text-parchment/90">{info?.tinhDuyen}</p>
      },
      {
        key: 'diem-manh',
        label: 'Điểm mạnh',
        content: (
          <div className="flex flex-wrap gap-2">
            {(info?.diemManh || []).map((d) => (
              <span key={d} className="px-3 py-1.5 rounded-full bg-jade/10 border border-jade/30 text-jade text-sm">{d}</span>
            ))}
          </div>
        )
      },
      {
        key: 'diem-yeu',
        label: 'Điểm yếu',
        content: (
          <div className="flex flex-wrap gap-2">
            {(info?.diemYeu || []).map((d) => (
              <span key={d} className="px-3 py-1.5 rounded-full bg-vermilion/10 border border-vermilion/30 text-vermilion text-sm">{d}</span>
            ))}
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

    const otherNumbers = CORE_NUMBERS.filter((n) => n !== result.lifePath).slice(0, 5);

    return (
      <>
        <Head>
          <title>Kết quả Thần Số Học của {form.hoTen || 'bạn'} — Số Chủ Đạo {result.lifePath}</title>
          <meta name="description" content={summary} />
        </Head>
        <Header />
        <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
          <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-4 text-center">
            Bản đồ Thần Số Học của {form.hoTen}
          </h1>
          <p className="text-moon/80 text-center max-w-xl mx-auto mb-8 leading-relaxed">{summary}</p>

          <ResultTabs tabs={tabs} />

          <div className="mt-8">
            <p className="text-sm text-moon mb-3">Đọc thêm về Số Chủ Đạo {result.lifePath}:</p>
            <div className="flex flex-wrap gap-2">
              <Link href={`/than-so-hoc/so-chu-dao-${result.lifePath}`} className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">
                Ý nghĩa đầy đủ Số {result.lifePath} →
              </Link>
              {otherNumbers.map((n) => (
                <Link key={n} href={`/than-so-hoc/so-chu-dao-${n}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">
                  Số {n}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/con-so-may-man" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Con số may mắn</Link>
            </div>
          </div>

          <div className="mt-8">
            <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
          </div>

          <div className="mt-8">
            <FaqSection faqs={FAQ_RESULT} />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => { setStep('form'); setResult(null); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
            >
              <RotateCcw size={15} /> Tra cứu người khác
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-ink text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Share2 size={15} /> Chia sẻ kết quả
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Lập Biểu Đồ Ngày Sinh (Birth Chart) Miễn Phí — TriMenh</title>
        <meta name="description" content="Lập biểu đồ ngày sinh (Birth Chart) miễn phí: tính Số Chủ Đạo, Số Sứ Mệnh, Số Linh Hồn, Số Biểu Đạt, Số Trưởng Thành theo hệ Pythagoras." />
      </Head>
      <Header />
      <main className="max-w-md mx-auto px-5 py-10 sm:py-14">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-moon mb-6">
          <Link href="/" className="hover:text-gold-soft transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/than-so-hoc-hub" className="hover:text-gold-soft transition-colors">Thần Số Học</Link>
          <span>/</span>
          <span className="text-parchment/70">Lập biểu đồ ngày sinh</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Lập Biểu Đồ Ngày Sinh (Birth Chart)</h1>
        <p className="text-moon/70 text-sm text-center mb-4">Khám phá bản thân qua ngày sinh và họ tên</p>

        <div className="mystic-card p-5 mb-6 text-sm">
          <p className="text-moon mb-2">Biểu đồ ngày sinh sẽ tính:</p>
          <ul className="space-y-1 text-parchment/85">
            <li>• Số Chủ Đạo</li>
            <li>• Số Biểu Đạt</li>
            <li>• Số Linh Hồn</li>
            <li>• Số Trưởng Thành</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
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
          <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
            Họ và tên đầy đủ
            <input
              type="text" required
              value={form.hoTen}
              onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
              className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
              placeholder="Nhập họ và tên đầy đủ"
            />
          </label>
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
            </div>
          </div>

          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
