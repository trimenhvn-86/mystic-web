/**
 * lib/dayQuality.js
 * Tính toán các chỉ số ngày tốt/xấu theo Lịch Vạn Niên:
 * - 12 Trực (Thập Nhị Kiến Trừ)
 * - 28 Sao (Nhị Thập Bát Tú)
 * - Phân loại việc nên làm / nên tránh theo mục đích
 *
 * ⚠️ LƯU Ý QUAN TRỌNG:
 * Bảng tra cứu và công thức dưới đây là công thức tham khảo phổ biến trong
 * Lịch Vạn Niên dân gian. TRƯỚC KHI ĐƯA VÀO PRODUCTION, cần một chuyên gia
 * phong thủy / Ngọc Hạp Thông Thư kiểm duyệt lại độ chính xác, vì đây là
 * nội dung tín ngưỡng nhạy cảm — sai sót có thể ảnh hưởng đến uy tín site.
 */

const { jdFromDate, CHI } = require('./lunar');

// 12 Trực theo thứ tự cố định
const TRUC = [
  'Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp',
  'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'
];

// Phân loại tốt/xấu tổng quát của từng Trực (tham khảo phổ biến — cần kiểm duyệt lại)
const TRUC_TOT = new Set(['Trừ', 'Định', 'Chấp', 'Thành', 'Khai', 'Nguy']);

// 28 Sao (Nhị Thập Bát Tú) — thứ tự cố định, lặp theo chu kỳ 28 ngày
const SAO_28 = [
  'Giác', 'Cang', 'Đê', 'Phòng', 'Tâm', 'Vĩ', 'Cơ',
  'Đẩu', 'Ngưu', 'Nữ', 'Hư', 'Nguy', 'Thất', 'Bích',
  'Khuê', 'Lâu', 'Vị', 'Mão', 'Tất', 'Chủy', 'Sâm',
  'Tỉnh', 'Quỷ', 'Liễu', 'Tinh', 'Trương', 'Dực', 'Chẩn'
];

// Sao tốt / xấu (tham khảo phổ biến — cần kiểm duyệt lại)
const SAO_TOT = new Set([
  'Giác', 'Phòng', 'Tâm', 'Cơ', 'Ngưu', 'Thất', 'Bích',
  'Vị', 'Tất', 'Sâm', 'Tỉnh', 'Trương', 'Chẩn'
]);

// Mốc tham chiếu Julian Day cho sao đầu tiên trong chu kỳ (cần hiệu chỉnh lại theo nguồn chuẩn)
const SAO_ANCHOR_JD = 2415021; // mốc tham khảo, CẦN kiểm chứng lại với chuyên gia

function getTruc(dd, mm, yy, lunarMonth) {
  const jd = jdFromDate(dd, mm, yy);
  const chiNgay = (jd + 1) % 12; // chỉ số Chi của ngày
  const chiThang = (lunarMonth + 1) % 12; // xấp xỉ Chi tháng âm lịch
  const idx = ((chiNgay - chiThang) % 12 + 12) % 12;
  return TRUC[idx];
}

function getSao28(dd, mm, yy) {
  const jd = jdFromDate(dd, mm, yy);
  const idx = ((jd - SAO_ANCHOR_JD) % 28 + 28) % 28;
  return SAO_28[idx];
}

// Việc nên làm / nên tránh — map theo Trực (rule-based đơn giản, dữ liệu chi tiết nằm ở data/*.json)
// Tro ly quyet dinh hom nay - tong hop tu ket qua Hoang dao + Khong Minh da co san,
// khong bia them du lieu moi (vi du huong xuat hanh chua co nguon dang tin cay).
function getSuggestedActivities(truc) {
  const good = TRUC_TOT.has(truc);
  return {
    isGoodDay: good,
    nenLam: good
      ? ['Cưới hỏi', 'Khai trương', 'Ký kết hợp đồng', 'Xuất hành']
      : ['Việc nhẹ trong nhà', 'Dọn dẹp', 'Nghỉ ngơi'],
    kiengKy: good
      ? ['Tránh việc quá gấp gáp']
      : ['Cưới hỏi', 'Khai trương', 'Động thổ', 'Xuất hành xa']
  };
}

function getDecisionAssistant(isGoodDay, khongMinhTot, firstGioHoangDao) {
  return [
    { label: 'Mua xe', decision: isGoodDay ? 'Nên' : 'Không nên', good: isGoodDay },
    { label: 'Động thổ', decision: isGoodDay ? 'Nên' : 'Không nên', good: isGoodDay },
    {
      label: 'Ký hợp đồng',
      decision: isGoodDay ? `Nên${firstGioHoangDao ? ` (ưu tiên giờ ${firstGioHoangDao})` : ''}` : 'Không nên',
      good: isGoodDay
    },
    {
      label: 'Xuất hành',
      decision: isGoodDay && khongMinhTot ? 'Nên' : isGoodDay || khongMinhTot ? 'Có thể, nên chọn giờ đẹp' : 'Không nên',
      good: isGoodDay && khongMinhTot
    },
    { label: 'Cưới hỏi', decision: isGoodDay ? 'Nên, nên đối chiếu thêm tuổi' : 'Nên chọn ngày khác', good: isGoodDay }
  ];
}

// Nhóm Tứ Tượng của 28 Sao (7 sao/nhóm, theo đúng thứ tự SAO_28 - cần kiểm duyệt lại)
function getLoaiNgay(sao) {
  const idx = SAO_28.indexOf(sao);
  if (idx < 0) return null;
  if (idx < 7) return 'Thanh Long';
  if (idx < 14) return 'Huyền Vũ';
  if (idx < 21) return 'Bạch Hổ';
  return 'Chu Tước';
}

module.exports = {
  TRUC,
  SAO_28,
  getTruc,
  getSao28,
  getSuggestedActivities,
  getLoaiNgay,
  getDecisionAssistant
};
