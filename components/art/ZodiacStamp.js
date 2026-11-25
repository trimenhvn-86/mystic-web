import Link from 'next/link';

export const HAN = { 'Tý': '子', 'Sửu': '丑', 'Dần': '寅', 'Mão': '卯', 'Thìn': '辰', 'Tỵ': '巳', 'Ngọ': '午', 'Mùi': '未', 'Thân': '申', 'Dậu': '酉', 'Tuất': '戌', 'Hợi': '亥' };

/** Con dấu chữ Hán cho 12 địa chi: hình ảnh nhẹ, không cần vẽ con vật. */
export default function ZodiacStamp({ chi, href }) {
  const inner = (
    <>
      <span className="w-12 h-12 flex items-center justify-center border-2 border-lich rounded-md text-lich text-2xl leading-none bg-white" style={{ fontFamily: '"Noto Serif CJK SC","Noto Serif SC","Songti SC","SimSun",serif', fontWeight: 700 }} aria-hidden="true">{HAN[chi] || '?'}</span>
      <span className="text-sm text-parchment mt-1.5">{chi}</span>
    </>
  );
  return href ? (
    <Link href={href} className="flex flex-col items-center group hover:opacity-80 transition-opacity">{inner}</Link>
  ) : <span className="flex flex-col items-center">{inner}</span>;
}
