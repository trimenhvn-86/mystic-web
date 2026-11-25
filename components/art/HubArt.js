/**
 * Bộ minh họa riêng của TriMenh: hình khối phẳng, ít màu như tranh in lịch.
 * Mỗi chuyên mục một tranh. Vùng chính nằm trong dải y 75 đến 285 để cắt thành banner ngang vẫn đủ hình.
 */
const INK = '#1B1B24';
const RED = '#C42B1C';
const REDD = '#9E1F14';
const PAPER = '#F7F6F1';
const SOFT = '#EDEBE2';
const JADE = '#1F7A5C';
const JADED = '#17614A';
const GOLD = '#E0A93B';
const STONE = '#9C998B';

function star4(cx, cy, r, fill, key) {
  const k = r * 0.18;
  const d = `M${cx} ${cy - r} Q${cx + k} ${cy - k} ${cx + r} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + r} Q${cx - k} ${cy + k} ${cx - r} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
  return <path key={key} d={d} fill={fill} />;
}
const polar = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

function Lich() {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const [x1, y1] = polar(500, 125, 50, i * 22.5);
    const [x2, y2] = polar(500, 125, i % 2 ? 62 : 70, i * 22.5);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth="6" strokeLinecap="round" />;
  });
  const cells = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
    const x = 197 + c * 24, y = 148 + r * 34;
    const hot = r === 1 && c === 3;
    const good = (r === 0 && c === 5) || (r === 2 && c === 1) || (r === 3 && c === 4);
    cells.push(hot
      ? <circle key={`${r}${c}`} cx={x + 9} cy={y + 9} r="13" fill={RED} />
      : <rect key={`${r}${c}`} x={x} y={y} width="18" height="18" rx="4" fill={good ? INK : SOFT} />);
  }
  return (
    <g>
      <rect width="640" height="360" fill={RED} />
      <circle cx="560" cy="360" r="210" fill={REDD} opacity="0.55" />
      <circle cx="40" cy="40" r="120" fill={REDD} opacity="0.35" />
      <circle cx="500" cy="125" r="44" fill={GOLD} />
      {rays}
      <g>
        <rect x="170" y="75" width="190" height="210" rx="10" fill={PAPER} />
        <path d="M170 85a10 10 0 0 1 10-10h170a10 10 0 0 1 10 10v36H170z" fill={INK} />
        <circle cx="215" cy="98" r="7" fill={RED} /><circle cx="315" cy="98" r="7" fill={RED} />
        {cells}
      </g>
      <circle cx="96" cy="250" r="34" fill={PAPER} /><circle cx="110" cy="240" r="30" fill={RED} />
      {star4(66, 140, 12, PAPER, 's1')}{star4(430, 270, 9, PAPER, 's2')}
    </g>
  );
}

function TuVi() {
  const pts = [[110, 120], [185, 175], [150, 255], [255, 275], [300, 195], [230, 100]];
  const lines = pts.map((p, i) => i < pts.length - 1 ? <line key={i} x1={p[0]} y1={p[1]} x2={pts[i + 1][0]} y2={pts[i + 1][1]} stroke={PAPER} strokeOpacity="0.55" strokeWidth="2" /> : null);
  const dots = [[40, 60], [70, 300], [350, 70], [380, 300], [420, 150], [590, 70], [600, 290], [540, 200], [350, 250], [60, 190]];
  return (
    <g>
      <rect width="640" height="360" fill={INK} />
      {[80, 130, 180].map((r) => <circle key={r} cx="330" cy="180" r={r} fill="none" stroke={PAPER} strokeOpacity="0.13" strokeWidth="2" />)}
      <circle cx="480" cy="165" r="70" fill={PAPER} /><circle cx="506" cy="145" r="62" fill={INK} />
      {lines}
      {pts.map((p, i) => star4(p[0], p[1], i % 2 ? 15 : 22, i === 0 ? RED : GOLD, `p${i}`))}
      {dots.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i % 3 ? 3 : 4.5} fill={PAPER} opacity="0.8" />)}
    </g>
  );
}

function Tarot() {
  return (
    <g>
      <rect width="640" height="360" fill={INK} />
      <circle cx="320" cy="180" r="150" fill="none" stroke={GOLD} strokeOpacity="0.2" strokeWidth="2" />
      <g transform="rotate(-13 255 180)"><rect x="190" y="82" width="125" height="196" rx="10" fill={RED} stroke={PAPER} strokeWidth="3" />
        <circle cx="252" cy="180" r="30" fill="none" stroke={PAPER} strokeWidth="3" opacity="0.8" /></g>
      <g transform="rotate(13 385 180)"><rect x="325" y="82" width="125" height="196" rx="10" fill={SOFT} stroke={GOLD} strokeWidth="3" />
        <path d="M387 130v100M345 180h84" stroke={INK} strokeWidth="3" opacity="0.5" /></g>
      <rect x="250" y="70" width="140" height="220" rx="12" fill={INK} stroke={GOLD} strokeWidth="5" />
      <rect x="262" y="82" width="116" height="196" rx="7" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="320" cy="180" r="42" fill="none" stroke={GOLD} strokeWidth="3" />
      {star4(320, 180, 38, GOLD, 'c')}{star4(320, 106, 9, GOLD, 't')}{star4(320, 254, 9, GOLD, 'b')}
      {star4(120, 110, 14, PAPER, 'a')}{star4(540, 250, 16, PAPER, 'd')}{star4(560, 100, 8, GOLD, 'e')}{star4(90, 260, 8, GOLD, 'f')}
    </g>
  );
}

function ThanSo() {
  const P = Array.from({ length: 9 }, (_, i) => polar(320, 180, 105, -90 + i * 40));
  const lines = P.map((p, i) => { const q = P[(i + 4) % 9]; return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={PAPER} strokeOpacity="0.8" strokeWidth="2.5" />; });
  return (
    <g>
      <rect width="640" height="360" fill={JADE} />
      <circle cx="560" cy="330" r="190" fill={JADED} opacity="0.7" /><circle cx="60" cy="40" r="110" fill={JADED} opacity="0.5" />
      <circle cx="320" cy="180" r="105" fill="none" stroke={PAPER} strokeWidth="3" />
      <circle cx="320" cy="180" r="70" fill="none" stroke={PAPER} strokeOpacity="0.4" strokeWidth="2" />
      {lines}
      {P.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r="12" fill={PAPER} /><circle cx={p[0]} cy={p[1]} r="5" fill={i === 0 ? RED : JADE} /></g>)}
      <circle cx="320" cy="180" r="30" fill={GOLD} />{star4(320, 180, 20, INK, 'k')}
      {star4(110, 120, 12, PAPER, 'a')}{star4(540, 240, 12, PAPER, 'b')}{star4(520, 110, 8, GOLD, 'c')}
    </g>
  );
}

function Menh() {
  const R = 80;
  const P = Array.from({ length: 5 }, (_, i) => polar(320, 180, R, -90 + i * 72));
  const cols = [JADE, RED, GOLD, STONE, INK];
  const ring = P.map((p, i) => { const q = P[(i + 1) % 5]; return <line key={`r${i}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={INK} strokeOpacity="0.28" strokeWidth="4" />; });
  const khac = P.map((p, i) => { const q = P[(i + 2) % 5]; return <line key={`k${i}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={RED} strokeOpacity="0.4" strokeWidth="2.5" strokeDasharray="6 6" />; });
  const glyph = (i, [x, y]) => {
    if (i === 0) return <ellipse cx={x} cy={y} rx="9" ry="15" fill={PAPER} transform={`rotate(35 ${x} ${y})`} />;
    if (i === 1) return <path d={`M${x} ${y - 15}L${x + 14} ${y + 11}H${x - 14}Z`} fill={PAPER} />;
    if (i === 2) return <rect x={x - 12} y={y - 12} width="24" height="24" fill={PAPER} />;
    if (i === 3) return <circle cx={x} cy={y} r="12" fill="none" stroke={PAPER} strokeWidth="5" />;
    return <path d={`M${x - 15} ${y - 4}q7.5-9 15 0t15 0M${x - 15} ${y + 8}q7.5-9 15 0t15 0`} fill="none" stroke={PAPER} strokeWidth="4" strokeLinecap="round" />;
  };
  return (
    <g>
      <rect width="640" height="360" fill={SOFT} />
      <circle cx="320" cy="180" r="140" fill="none" stroke={INK} strokeOpacity="0.1" strokeWidth="2" />
      <circle cx="320" cy="180" r="112" fill="none" stroke={INK} strokeOpacity="0.1" strokeWidth="2" strokeDasharray="3 9" />
      {ring}{khac}
      {P.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r="30" fill={cols[i]} />{glyph(i, p)}</g>)}
      {star4(110, 110, 14, RED, 'a')}{star4(540, 250, 14, RED, 'b')}{star4(530, 110, 8, INK, 'c')}{star4(100, 260, 8, INK, 'd')}
    </g>
  );
}

function TuoiHop() {
  const P = Array.from({ length: 12 }, (_, i) => polar(320, 180, 100, -90 + i * 30));
  const poly = (ids) => ids.map((i) => P[i].join(',')).join(' ');
  return (
    <g>
      <rect width="640" height="360" fill={RED} />
      <circle cx="40" cy="330" r="150" fill={REDD} opacity="0.45" /><circle cx="600" cy="50" r="120" fill={REDD} opacity="0.45" />
      <circle cx="320" cy="180" r="100" fill="none" stroke={PAPER} strokeWidth="3" />
      <polygon points={poly([0, 4, 8])} fill={PAPER} fillOpacity="0.16" stroke={PAPER} strokeWidth="4" strokeLinejoin="round" />
      <polygon points={poly([1, 5, 9])} fill={INK} fillOpacity="0.22" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {P.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="9" fill={i % 4 === 0 ? PAPER : i % 4 === 1 ? INK : PAPER} opacity={i % 4 === 0 || i % 4 === 1 ? 1 : 0.55} />)}
      <circle cx="320" cy="180" r="28" fill={INK} />{star4(320, 180, 19, GOLD, 'k')}
      {star4(120, 120, 12, PAPER, 'a')}{star4(530, 250, 12, PAPER, 'b')}
    </g>
  );
}

const ART = { 'lich-ngay-tot': Lich, 'tu-vi': TuVi, tarot: Tarot, 'than-so-hoc': ThanSo, 'than-so-hoc-hub': ThanSo, 'menh-phong-thuy': Menh, 'tuoi-tuong-hop': TuoiHop };

/** variant: 'cover' (16:9) hoặc 'banner' (dải ngang: ba bản thu nhỏ, bản giữa lật gương). */
export default function HubArt({ hub = 'lich-ngay-tot', variant = 'cover', label = '', className = '' }) {
  const Art = ART[hub] || Lich;
  const a11y = { role: label ? 'img' : undefined, 'aria-label': label || undefined, 'aria-hidden': label ? undefined : 'true' };
  if (variant === 'banner') {
    return (
      <svg viewBox="0 0 960 180" preserveAspectRatio="xMidYMid slice" {...a11y} className={`block w-full h-full ${className}`}>
        <g transform="scale(0.5)"><Art /></g>
        <g transform="translate(640 0) scale(-0.5 0.5)"><Art /></g>
        <g transform="translate(640 0) scale(0.5)"><Art /></g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" {...a11y} className={`block w-full h-full ${className}`}>
      <Art />
    </svg>
  );
}

/** Chọn tranh theo địa chỉ trang. */
export function hubFromPath(path = '') {
  const p = path.split('?')[0];
  if (/^\/(tu-vi|tu-vi-hom-nay|tu-vi-tuan|tu-vi-thang)/.test(p)) return 'tu-vi';
  if (/^\/(tarot|rut-la-tarot|trai-bai-3-la|tarot-hom-nay|tarot-yes-no)/.test(p)) return 'tarot';
  if (/^\/(than-so-hoc|con-so-may-man)/.test(p)) return 'than-so-hoc';
  if (/^\/(\d{4}-|menh-ngu-hanh|mau-sac-hop-menh|da-phong-thuy|menh-phong-thuy)/.test(p)) return 'menh-phong-thuy';
  if (/^\/(tuoi-hop|so-sanh-tuoi|xem-tuoi|luc-hop|tam-hop|tu-hanh-xung|huong-nha-hop-tuoi|tuoi-tuong-hop)/.test(p)) return 'tuoi-tuong-hop';
  return 'lich-ngay-tot';
}
