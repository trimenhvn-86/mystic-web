/**
 * lib/nguHanh.js
 * Tính Mệnh Ngũ Hành (Nạp Âm) theo năm sinh Dương lịch.
 */
const { CAN, CHI } = require('./lunar');
const napAmData = require('../content/phong-thuy/menh/nap-am.json');

function getAmDuongCan(canChi) {
  const can = canChi.split(' ')[0];
  const idx = CAN.indexOf(can);
  if (idx < 0) return null;
  return idx % 2 === 0 ? 'Dương' : 'Âm';
}

function getCanChiFromYear(year) {
  return `${CAN[(year + 6) % 10]} ${CHI[(year + 8) % 12]}`;
}

function getNapAmByCanChi(canChi) {
  const entry = napAmData.napAm.find((e) => e.canChi.includes(canChi));
  if (!entry) return null;
  return { canChi, napAm: entry.ten, hanh: entry.hanh, moTa: napAmData.ngHanhMota[entry.hanh], mauHop: napAmData.mauHopMenh[entry.hanh] };
}

// Chu kỳ Tương Sinh: Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim
const SINH_CYCLE = { Kim: 'Thủy', Thủy: 'Mộc', Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim' };
// Chu kỳ Tương Khắc: Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim
const KHAC_CYCLE = { Kim: 'Mộc', Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim' };

// Quan hệ giữa 2 hành: 'dong-hanh' | 'sinh' (A sinh B hoặc B sinh A) | 'khac' (A khắc B hoặc B khắc A)
function getNguHanhRelation(hanhA, hanhB) {
  if (hanhA === hanhB) return 'dong-hanh';
  if (SINH_CYCLE[hanhA] === hanhB || SINH_CYCLE[hanhB] === hanhA) return 'sinh';
  if (KHAC_CYCLE[hanhA] === hanhB || KHAC_CYCLE[hanhB] === hanhA) return 'khac';
  return 'binh-thuong';
}

function getNguHanhExtra(hanh) {
  return {
    huong: napAmData.huongTheoNguHanh?.[hanh] || [],
    ngheNghiep: napAmData.ngheNghiep?.[hanh] || [],
    vatPham: napAmData.vatPhamPhongThuy?.[hanh] || [],
    sinhRa: SINH_CYCLE[hanh],
    khacBoi: Object.keys(KHAC_CYCLE).find((k) => KHAC_CYCLE[k] === hanh),
    khac: KHAC_CYCLE[hanh],
    duocSinhBoi: Object.keys(SINH_CYCLE).find((k) => SINH_CYCLE[k] === hanh)
  };
}

function getMenhNguHanh(year) {
  const canChi = getCanChiFromYear(year);
  return getNapAmByCanChi(canChi);
}

module.exports = { getCanChiFromYear, getMenhNguHanh, getNapAmByCanChi, getNguHanhRelation, getNguHanhExtra, getAmDuongCan };
