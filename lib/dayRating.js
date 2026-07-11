/**
 * lib/dayRating.js
 * Quy đổi Trực thành điểm sao (1-5) cho box "Hôm nay có tốt không?".
 * Đây là lớp đánh giá UI bổ sung, tách riêng khỏi lib/dayQuality.js (vốn dùng
 * để phân loại nên làm/kiêng kỵ) — cần kiểm duyệt lại cùng chuyên gia phong thủy.
 */
const STARS_BY_TRUC = {
  'Trừ': 5, 'Định': 5, 'Thành': 5,
  'Chấp': 4, 'Khai': 4, 'Nguy': 4,
  'Kiến': 3, 'Mãn': 3, 'Bình': 3,
  'Thu': 2,
  'Phá': 1, 'Bế': 1
};

const LABEL_BY_STARS = {
  5: 'Ngày rất tốt',
  4: 'Ngày khá tốt',
  3: 'Ngày bình thường',
  2: 'Ngày cần thận trọng',
  1: 'Ngày xấu'
};

function getDayRating(truc) {
  const stars = STARS_BY_TRUC[truc] ?? 3;
  return { stars, label: LABEL_BY_STARS[stars], score: stars * 20 };
}

function getDayIndexScores(seed) {
  // Tao 5 chi so 55-96% deterministic tu seed, lech nhau de khong giong nhau tram lan
  function scoreFrom(offset) {
    return 55 + ((seed + offset * 13) % 42);
  }
  return {
    congViec: scoreFrom(1),
    taiChinh: scoreFrom(2),
    tinhCam: scoreFrom(3),
    suckKhoe: scoreFrom(4),
    mayMan: scoreFrom(5)
  };
}

module.exports = { getDayRating, getDayIndexScores };
