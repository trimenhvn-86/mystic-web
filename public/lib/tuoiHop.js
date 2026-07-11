/**
 * lib/tuoiHop.js
 * Xác định các Chi hợp/xung với 1 Chi cho trước (dùng cho tool Tuổi hợp).
 */
const { CHI } = require('./lunar');
const data = require('../content/phong-thuy/tuoi-hop/tam-hop-tu-hanh-xung.json');

function getChiFromYear(year) {
  return CHI[(year + 8) % 12];
}

function getTuoiHop(chi) {
  const tamHopGroup = data.tamHop.find((g) => g.includes(chi));
  const tuHanhXungGroup = data.tuHanhXung.find((g) => g.includes(chi));
  const hopTuoi = tamHopGroup ? tamHopGroup.filter((c) => c !== chi) : [];
  const xungTuoi = tuHanhXungGroup ? tuHanhXungGroup.filter((c) => c !== chi) : [];
  const hai = data.lucHai[chi];
  return { chi, hopTuoi, xungTuoi, hai };
}

function getChiRelation(chiA, chiB) {
  if (chiA === chiB) return 'dong-tuoi';
  const tamHop = data.tamHop.find((g) => g.includes(chiA) && g.includes(chiB));
  if (tamHop) return 'tam-hop';
  const lucHop = data.lucHop.find((g) => g.includes(chiA) && g.includes(chiB));
  if (lucHop) return 'luc-hop';
  const tuHanhXung = data.tuHanhXung.find((g) => g.includes(chiA) && g.includes(chiB));
  if (tuHanhXung) return 'tu-hanh-xung';
  if (data.lucHai[chiA] === chiB) return 'luc-hai';
  return 'binh-thuong';
}

function isThienCanHop(canA, canB) {
  return data.nguHopThienCan.some((g) => g.includes(canA) && g.includes(canB));
}

/**
 * "TriMenh Compatibility Score" — chỉ số nội bộ của TriMenh (KHÔNG phải quy chuẩn
 * phong thủy truyền thống), tổng hợp từ nhiều yếu tố: quan hệ Địa Chi, Ngũ hành,
 * Thiên Can. Điểm neo ở mức 50 (trung tính), cộng/trừ theo từng tiêu chí.
 */
function compareTuoi(yearA, yearB) {
  const { getCanChiFromYear, getMenhNguHanh, getNguHanhRelation } = require('./nguHanh');

  const canChiA = getCanChiFromYear(yearA);
  const canChiB = getCanChiFromYear(yearB);
  const [canA, chiA] = canChiA.split(' ');
  const [canB, chiB] = canChiB.split(' ');
  const menhA = getMenhNguHanh(yearA);
  const menhB = getMenhNguHanh(yearB);

  const chiRelation = getChiRelation(chiA, chiB);
  const hanhRelation = getNguHanhRelation(menhA.hanh, menhB.hanh);
  const thienCanHop = isThienCanHop(canA, canB);

  let score = 50;
  const notes = [];

  switch (chiRelation) {
    case 'tam-hop': score += 30; notes.push('Địa Chi Tam hợp — rất thuận lợi cho hợp tác lâu dài.'); break;
    case 'luc-hop': score += 22; notes.push('Địa Chi Lục hợp — hòa hợp, dễ thấu hiểu nhau.'); break;
    case 'dong-tuoi': score += 10; notes.push('Cùng tuổi — tính cách tương đồng, dễ đồng cảm.'); break;
    case 'luc-hai': score -= 12; notes.push('Địa Chi Lục hại — nên chú ý giao tiếp để tránh hiểu lầm.'); break;
    case 'tu-hanh-xung': score -= 28; notes.push('Địa Chi Tứ hành xung — dễ bất đồng quan điểm, cần khéo léo dung hòa.'); break;
    default: notes.push('Địa Chi không xung khắc rõ rệt.');
  }

  switch (hanhRelation) {
    case 'sinh': score += 18; notes.push('Ngũ hành Tương sinh — hỗ trợ tốt cho nhau.'); break;
    case 'dong-hanh': score += 8; notes.push('Cùng hành — chí hướng tương đồng.'); break;
    case 'khac': score -= 18; notes.push('Ngũ hành Tương khắc — cần dung hòa quan điểm khi hợp tác.'); break;
    default: break;
  }

  if (thienCanHop) {
    score += 10;
    notes.push('Thiên Can Ngũ hợp — có sự tương trợ về mặt tinh thần, chí hướng.');
  }

  score = Math.max(5, Math.min(98, score));

  let label;
  if (score >= 85) label = 'Rất hợp';
  else if (score >= 68) label = 'Khá hợp';
  else if (score >= 50) label = 'Trung bình';
  else label = 'Không nên';

  return {
    yearA, yearB, canChiA, canChiB, menhA, menhB,
    chiRelation, hanhRelation, thienCanHop,
    score, label, notes
  };
}

/**
 * Tìm các năm sinh cụ thể mang Chi cho trước, gần với năm tham chiếu nhất
 * (mỗi Chi lặp lại theo chu kỳ 12 năm). Dùng để minh họa "Tuổi Tý (1984, 1996, 2008...)".
 */
function getYearsForChi(chi, aroundYear, count = 3) {
  const candidates = [];
  for (let y = aroundYear - 48; y <= aroundYear + 48; y++) {
    if (y !== aroundYear && getChiFromYear(y) === chi) candidates.push(y);
  }
  candidates.sort((a, b) => Math.abs(a - aroundYear) - Math.abs(b - aroundYear));
  return candidates.slice(0, count).sort((a, b) => a - b);
}

function getMarriageAdvice(score) {
  if (score >= 85) return 'Rất hợp — nền tảng Can Chi và Ngũ hành tương hỗ tốt, thuận lợi cho hôn nhân lâu dài, ít xung đột.';
  if (score >= 68) return 'Khá hợp — hôn nhân có thể thuận lợi nếu cả hai biết dung hòa khác biệt, nên chú ý giao tiếp cởi mở.';
  if (score >= 50) return 'Trung bình — không có yếu tố xung khắc rõ rệt, sự hòa hợp phụ thuộc nhiều vào tính cách và sự thấu hiểu thực tế hơn là tuổi tác.';
  return 'Cần cân nhắc — theo tuổi tác có một số điểm xung khắc, nên tìm hiểu kỹ và có thể tham khảo thêm cách hóa giải truyền thống (chọn ngày cưới tốt) nếu vẫn quyết định tiến tới.';
}

function getBusinessAdvice(score) {
  if (score >= 85) return 'Rất hợp tác tốt — hai bên có sự tương hỗ Ngũ hành và Địa Chi thuận lợi, dễ đồng lòng trong công việc chung.';
  if (score >= 68) return 'Khá hợp — có thể hợp tác tốt nếu phân định rõ vai trò và trách nhiệm ngay từ đầu.';
  if (score >= 50) return 'Trung bình — không có yếu tố cản trở rõ rệt, mức độ thành công phụ thuộc nhiều vào năng lực và cách quản trị hơn là tuổi tác.';
  return 'Cần thận trọng — có một số điểm xung khắc về tuổi tác, nên có hợp đồng rõ ràng và cơ chế giải quyết bất đồng khi hợp tác.';
}

module.exports = { getChiFromYear, getTuoiHop, getChiRelation, compareTuoi, getYearsForChi, getMarriageAdvice, getBusinessAdvice };
