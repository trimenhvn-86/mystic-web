import { ImageResponse } from 'next/og';
import qrcode from 'qrcode-generator';
import { convertSolar2Lunar, getCanChiNam, getCanChiNgay, getCanChiThang } from '../../lib/lunar';
import { getTruc, getSao28, getSuggestedActivities } from '../../lib/dayQuality';
import { getDayRating } from '../../lib/dayRating';
import { getGioHoangDao } from '../../lib/gioHoangDao';
import { getNgayKhongMinh } from '../../lib/khongMinh';

export const config = { runtime: 'edge' };

const THU_VN = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];

const LEVEL_COLOR = {
  5: '#34D399',
  4: '#A3E635',
  3: '#FBBF24',
  2: '#FB923C',
  1: '#F87171'
};

const CREAM = '#F3EEE1';
const GOLD = '#E0B45C';
const MUTED = '#8D96B8';
const GREEN = '#34D399';
const RED = '#F87171';

function pad(n) {
  return String(n).padStart(2, '0');
}

function LogoMark() {
  return (
    <div
      style={{
        display: 'flex',
        width: 42,
        height: 42,
        borderRadius: '50%',
        border: `2.5px solid ${GOLD}`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
      }}
    >
      <span style={{ display: 'flex', fontSize: 17, fontWeight: 800, color: GOLD }}>TM</span>
    </div>
  );
}

function MiniCheck({ color = GREEN, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'flex', marginRight: 7 }}>
      <path d="M4 12.5l5 5 11-11" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MiniX({ color = RED, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'flex', marginRight: 7 }}>
      <path d="M5 5l14 14M19 5L5 19" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

function CheckChip({ text }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '7px 16px',
        borderRadius: 999,
        background: 'rgba(52,211,153,0.14)',
        border: '1px solid rgba(52,211,153,0.4)',
        color: GREEN,
        fontSize: 17,
        fontWeight: 600,
        marginRight: 10,
        marginBottom: 10
      }}
    >
      <MiniCheck /> {text}
    </div>
  );
}

function XChip({ text }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '7px 16px',
        borderRadius: 999,
        background: 'rgba(248,113,113,0.14)',
        border: '1px solid rgba(248,113,113,0.4)',
        color: RED,
        fontSize: 17,
        fontWeight: 600,
        marginRight: 10,
        marginBottom: 10
      }}
    >
      <MiniX /> {text}
    </div>
  );
}

function QRCodeSVG({ url, size = 92 }) {
  const qr = qrcode(0, 'M');
  qr.addData(url);
  qr.make();
  const count = qr.getModuleCount();
  const cell = size / count;
  const rects = [];
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        rects.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#0B0E1A" />);
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'flex' }}>
      <rect x="0" y="0" width={size} height={size} fill="#FFFFFF" rx="8" />
      {rects}
    </svg>
  );
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const dd = Number(searchParams.get('dd'));
  const mm = Number(searchParams.get('mm'));
  const yyyy = Number(searchParams.get('yyyy'));

  if (!dd || !mm || !yyyy) {
    return new Response('Thiếu tham số ngày', { status: 400 });
  }

  const lunar = convertSolar2Lunar(dd, mm, yyyy);
  const canChiNam = getCanChiNam(lunar.year);
  const canChiThang = getCanChiThang(lunar.month, lunar.year);
  const canChiNgay = getCanChiNgay(dd, mm, yyyy);
  const truc = getTruc(dd, mm, yyyy, lunar.month);
  const sao = getSao28(dd, mm, yyyy);
  const activities = getSuggestedActivities(truc);
  const rating = getDayRating(truc);
  const gioHoangDao = getGioHoangDao(dd, mm, yyyy).slice(0, 3);
  const khongMinh = getNgayKhongMinh(lunar.day, lunar.month);
  const dow = new Date(yyyy, mm - 1, dd).getDay();
  const thu = THU_VN[dow];
  const color = LEVEL_COLOR[rating.stars] || GOLD;
  const pageUrl = `https://trimenh.com/xem-ngay-tot/ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          background: 'linear-gradient(180deg, #0F1629 0%, #171F3B 100%)',
          padding: '22px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            border: `3px solid ${GOLD}`,
            borderRadius: 30,
            padding: '38px 50px',
            color: CREAM,
            fontFamily: 'sans-serif'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <LogoMark />
              <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: GOLD }}>
                TRI<span style={{ color: CREAM }}>MENH</span>
              </div>
            </div>
            <div style={{ display: 'flex', fontSize: 17, color: MUTED }}>trimenh.com</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', fontSize: 15, color: GOLD, letterSpacing: 4, marginTop: 6 }}>
            LỊCH VẠN NIÊN HÔM NAY
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
            <div style={{ display: 'flex', fontSize: 24, color: GOLD, letterSpacing: 6, fontWeight: 700 }}>{thu}</div>
            <div style={{ display: 'flex', fontSize: 178, fontWeight: 800, color: CREAM, lineHeight: 1 }}>{dd}</div>
            <div style={{ display: 'flex', fontSize: 26, color: CREAM, marginTop: 2 }}>
              THÁNG {mm} • {yyyy} <span style={{ color: MUTED, marginLeft: 10 }}>ÂM {lunar.day}/{lunar.month}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 26 }}>
            <div style={{ display: 'flex', width: 16, height: 16, borderRadius: '50%', background: color, marginRight: 12 }} />
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 800, color: color, marginRight: 12 }}>{rating.score}/100</div>
            <div style={{ display: 'flex', fontSize: 24, color: color, fontWeight: 700 }}>{rating.label.toUpperCase()}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}>
            <div style={{ display: 'flex', fontSize: 15, color: MUTED, marginBottom: 6 }}>Mức độ thuận lợi hôm nay</div>
            <div style={{ display: 'flex', width: '100%', height: 12, borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', width: `${rating.score}%`, height: 12, borderRadius: 999, background: color }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', width: 8, height: 8, borderRadius: '50%', background: GOLD, marginRight: 8 }} />
              <div style={{ display: 'flex', fontSize: 17, color: MUTED, marginRight: 6 }}>Năm</div>
              <div style={{ display: 'flex', fontSize: 17, color: CREAM, fontWeight: 700 }}>{canChiNam}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', width: 8, height: 8, borderRadius: '50%', background: GOLD, marginRight: 8 }} />
              <div style={{ display: 'flex', fontSize: 17, color: MUTED, marginRight: 6 }}>Tháng</div>
              <div style={{ display: 'flex', fontSize: 17, color: CREAM, fontWeight: 700 }}>{canChiThang}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', width: 8, height: 8, borderRadius: '50%', background: GOLD, marginRight: 8 }} />
              <div style={{ display: 'flex', fontSize: 17, color: MUTED, marginRight: 6 }}>Ngày</div>
              <div style={{ display: 'flex', fontSize: 17, color: CREAM, fontWeight: 700 }}>{canChiNgay}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 12, color: MUTED, letterSpacing: 2 }}>12 TRỰC</div>
              <div style={{ display: 'flex', fontSize: 19, color: GOLD, fontWeight: 700, marginTop: 2 }}>{truc.toUpperCase()}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 12, color: MUTED, letterSpacing: 2 }}>28 TÚ</div>
              <div style={{ display: 'flex', fontSize: 19, color: GOLD, fontWeight: 700, marginTop: 2 }}>{sao.toUpperCase()}</div>
            </div>
            {khongMinh && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', fontSize: 12, color: MUTED, letterSpacing: 2 }}>KHỔNG MINH</div>
                <div style={{ display: 'flex', fontSize: 19, color: GOLD, fontWeight: 700, marginTop: 2 }}>{khongMinh.ten.toUpperCase()}</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 24 }}>
            <div style={{ display: 'flex', fontSize: 15, color: GREEN, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>NÊN LÀM</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {activities.nenLam.slice(0, 4).map((item) => <CheckChip key={item} text={item} />)}
            </div>
            <div style={{ display: 'flex', fontSize: 15, color: RED, fontWeight: 700, marginBottom: 8, marginTop: 4, letterSpacing: 1 }}>CẦN TRÁNH</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {activities.kiengKy.slice(0, 3).map((item) => <XChip key={item} text={item} />)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
            <div style={{ display: 'flex', fontSize: 15, color: MUTED, marginBottom: 8 }}>Giờ đẹp</div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {gioHoangDao.map((g) => (
                <div
                  key={g.chi}
                  style={{
                    display: 'flex',
                    fontSize: 22,
                    color: GOLD,
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: 12,
                    background: 'rgba(224,180,92,0.1)'
                  }}
                >
                  {g.khung}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', paddingTop: 22 }}>
            <QRCodeSVG url={pageUrl} size={86} />
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 18 }}>
              <div style={{ display: 'flex', fontSize: 19, color: CREAM, fontWeight: 700 }}>Quét QR để xem chi tiết</div>
              <div style={{ display: 'flex', fontSize: 17, color: GOLD, marginTop: 2 }}>trimenh.com</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      headers: {
        'Cache-Control': 'no-store, must-revalidate'
      }
    }
  );
}
