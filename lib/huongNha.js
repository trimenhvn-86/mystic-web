/**
 * lib/huongNha.js
 * Tính Cung Mệnh (Bát Trạch - Đông Tứ Mệnh / Tây Tứ Mệnh) theo năm sinh + giới tính,
 * từ đó suy ra 4 hướng nhà hợp và 4 hướng nên tránh.
 *
 * ⚠️ LƯU Ý: Công thức Cung Phi dưới đây là công thức phổ biến trong Bát Trạch Minh Cảnh,
 * cần chuyên gia phong thủy kiểm duyệt lại trước khi công bố chính thức. Ngoài ra, bản đầy
 * đủ của Bát Trạch còn gán riêng 1 trong 8 "sao Du Niên" (Sinh Khí, Diên Niên, Thiên Y,
 * Phục Vị, Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại) cho TỪNG hướng cụ thể theo TỪNG cung —
 * mức chi tiết này KHÔNG được triển khai ở đây để tránh sai sót, chỉ dừng ở mức nhóm
 * hướng tốt/xấu theo Đông Tứ Mệnh - Tây Tứ Mệnh (mức phổ biến, đủ tin cậy hơn).
 */

const CUNG_MAP = {
  1: { ten: 'Khảm', nhom: 'Đông Tứ Mệnh' },
  2: { ten: 'Khôn', nhom: 'Tây Tứ Mệnh' },
  3: { ten: 'Chấn', nhom: 'Đông Tứ Mệnh' },
  4: { ten: 'Tốn', nhom: 'Đông Tứ Mệnh' },
  6: { ten: 'Càn', nhom: 'Tây Tứ Mệnh' },
  7: { ten: 'Đoài', nhom: 'Tây Tứ Mệnh' },
  8: { ten: 'Cấn', nhom: 'Tây Tứ Mệnh' },
  9: { ten: 'Ly', nhom: 'Đông Tứ Mệnh' }
};

const NHOM_HUONG = {
  'Đông Tứ Mệnh': { tot: ['Bắc', 'Nam', 'Đông', 'Đông Nam'], xau: ['Tây Bắc', 'Tây Nam', 'Đông Bắc', 'Tây'] },
  'Tây Tứ Mệnh': { tot: ['Tây Bắc', 'Tây Nam', 'Đông Bắc', 'Tây'], xau: ['Bắc', 'Nam', 'Đông', 'Đông Nam'] }
};

function reduceToSingleDigit(n) {
  let x = n;
  while (x > 9) {
    x = String(x).split('').reduce((s, d) => s + Number(d), 0);
  }
  return x;
}

/**
 * gender: 'nam' | 'nu'
 */
function getCungMenh(year, gender) {
  const last2 = year % 100;
  let reduced = reduceToSingleDigit(last2);
  if (reduced === 0) reduced = 9;

  let cungSo;
  if (gender === 'nam') {
    cungSo = 11 - reduced;
    if (cungSo <= 0) cungSo += 9;
    if (cungSo > 9) cungSo -= 9;
    if (cungSo === 5) cungSo = 2; // Nam cung 5 quy về Khôn
  } else {
    cungSo = reduced + 4;
    if (cungSo > 9) cungSo -= 9;
    if (cungSo === 0) cungSo = 9;
    if (cungSo === 5) cungSo = 8; // Nữ cung 5 quy về Cấn
  }

  const info = CUNG_MAP[cungSo];
  return { cungSo, ten: info.ten, nhom: info.nhom };
}

function getHuongNha(cungMenh) {
  return NHOM_HUONG[cungMenh.nhom];
}

module.exports = { getCungMenh, getHuongNha, CUNG_MAP, NHOM_HUONG };
