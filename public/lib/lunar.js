/**
 * lib/lunar.js
 * Chuyển đổi Dương lịch <-> Âm lịch Việt Nam.
 * Dựa trên thuật toán công bố công khai (public domain) của Hồ Ngọc Đức,
 * áp dụng cho múi giờ UTC+7 (Việt Nam).
 */

function INT(d) {
  return Math.floor(d);
}

function jdFromDate(dd, mm, yy) {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    INT((153 * m + 2) / 5) +
    365 * y +
    INT(y / 4) -
    INT(y / 100) +
    INT(y / 400) -
    32045;
  if (jd < 2299161) {
    jd =
      dd +
      INT((153 * m + 2) / 5) +
      365 * y +
      INT(y / 4) -
      32083;
  }
  return jd;
}

function jdToDate(jd) {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((146097 * b) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = 100 * b + d - 4800 + INT(m / 10);
  return [day, month, year];
}

function NewMoon(k) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 -= 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 += 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat =
      0.001 +
      0.000839 * T +
      0.0002261 * T2 -
      0.00000845 * T3 -
      0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  const JdNew = Jd1 + C1 - deltat;
  return JdNew;
}

function SunLongitude(jdn) {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL =
    (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL +=
    (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
    0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - Math.PI * 2 * INT(L / (Math.PI * 2));
  return L;
}

function getSunLongitude(dayNumber, timeZone) {
  return INT((SunLongitude(dayNumber - 0.5 - timeZone / 24) / Math.PI) * 6);
}

function getNewMoonDay(k, timeZone) {
  return INT(NewMoon(k) + 0.5 + timeZone / 24);
}

function getLunarMonth11(yy, timeZone) {
  const off = jdFromDate(31, 12, yy) - 2415021.076998695;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11, timeZone) {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Chuyển Dương lịch sang Âm lịch.
 * Trả về { day, month, year, leap } - leap=1 nếu là tháng nhuận.
 */
function convertSolar2Lunar(dd, mm, yy, timeZone = 7) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthOff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthOff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthOff) {
        lunarLeap = 1;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    leap: lunarLeap
  };
}

// --- Can Chi (Thiên Can - Địa Chi) ---
const CAN = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu',
  'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'
];
const CHI = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ',
  'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'
];

function getCanChiNam(lunarYear) {
  return `${CAN[(lunarYear + 6) % 10]} ${CHI[(lunarYear + 8) % 12]}`;
}

function getCanChiNgay(dd, mm, yy) {
  const jd = jdFromDate(dd, mm, yy);
  return `${CAN[(jd + 9) % 10]} ${CHI[(jd + 1) % 12]}`;
}

/**
 * Can Chi Tháng - theo công thức Ngũ Hổ Độn Nguyệt (truyền thống phổ biến, cần kiểm duyệt lại):
 * Chi tháng cố định theo số tháng Âm lịch (tháng Giêng = Dần...).
 * Can tháng Giêng phụ thuộc nhóm Can của năm, các tháng sau tăng dần.
 */
function getCanChiThang(lunarMonth, lunarYear) {
  const chiIdx = (lunarMonth + 1) % 12; // tháng 1 (Giêng) -> Dần (idx 2)
  const canNamIdx = (lunarYear + 6) % 10;
  const startCanIdx = (2 * (canNamIdx % 5) + 2) % 10; // Can của tháng Giêng
  const canIdx = (startCanIdx + (lunarMonth - 1)) % 10;
  return `${CAN[canIdx]} ${CHI[chiIdx]}`;
}

/**
 * Chuyển Âm lịch sang Dương lịch.
 * Dùng brute-force: dò quanh ngày ước lượng rồi xác nhận bằng convertSolar2Lunar
 * (đảm bảo chính xác 100% vì dùng lại đúng thuật toán chuyển đổi ở trên).
 */
function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap = 0, timeZone = 7) {
  // Quét toàn bộ ngày dương lịch trong khoảng lunarYear-1 đến lunarYear+1
  // (khoảng 3 năm dương) để tránh sai số ước lượng ở các tháng biên (11, 12 âm lịch).
  const startJD = jdFromDate(1, 1, lunarYear - 1);
  const endJD = jdFromDate(31, 12, lunarYear + 1);
  for (let jd = startJD; jd <= endJD; jd++) {
    const [dd, mm, yy] = jdToDate(jd);
    const result = convertSolar2Lunar(dd, mm, yy, timeZone);
    if (
      result.day === lunarDay &&
      result.month === lunarMonth &&
      result.year === lunarYear &&
      result.leap === lunarLeap
    ) {
      return { day: dd, month: mm, year: yy };
    }
  }
  return null;
}

/**
 * Tiết Khí - 24 tiết khí theo kinh độ Mặt Trời biểu kiến (mỗi tiết 15 độ).
 * ⚠️ LƯU Ý: Hàm lấy mẫu tại một thời điểm cố định trong ngày (theo múi giờ VN),
 * nên ở đúng ngày chuyển tiết khí có thể lệch 1 ngày so với các nguồn chính thức
 * (vốn tính chính xác đến giờ/phút). Với mục đích tra cứu tổng quát là đủ dùng;
 * nếu cần độ chính xác cao (nghi lễ, chọn giờ), nên đối chiếu thêm nguồn khác.
 */
const TIET_KHI = [
  'Xuân Phân', 'Thanh Minh', 'Cốc Vũ', 'Lập Hạ', 'Tiểu Mãn', 'Mang Chủng',
  'Hạ Chí', 'Tiểu Thử', 'Đại Thử', 'Lập Thu', 'Xử Thử', 'Bạch Lộ',
  'Thu Phân', 'Hàn Lộ', 'Sương Giáng', 'Lập Đông', 'Tiểu Tuyết', 'Đại Tuyết',
  'Đông Chí', 'Tiểu Hàn', 'Đại Hàn', 'Lập Xuân', 'Vũ Thủy', 'Kinh Trập'
];

function getSunLongitudeDeg(dd, mm, yy, timeZone = 7) {
  const jd = jdFromDate(dd, mm, yy);
  const rad = SunLongitude(jd - 0.5 - timeZone / 24);
  return ((rad * 180) / Math.PI + 360) % 360;
}

function getTietKhi(dd, mm, yy, timeZone = 7) {
  const deg = getSunLongitudeDeg(dd, mm, yy, timeZone);
  const idx = Math.floor(deg / 15) % 24;
  return TIET_KHI[idx];
}

module.exports = {
  jdFromDate,
  jdToDate,
  convertSolar2Lunar,
  convertLunar2Solar,
  getCanChiNam,
  getCanChiNgay,
  getCanChiThang,
  getTietKhi,
  TIET_KHI,
  CAN,
  CHI
};
