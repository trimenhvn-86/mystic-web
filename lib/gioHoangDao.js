/**
 * lib/gioHoangDao.js
 * Xác định 6 giờ Hoàng Đạo trong ngày, dựa trên Chi của ngày Dương lịch.
 */
const { jdFromDate, CHI } = require('./lunar');
const data = require('../content/lunar/gio-hoang-dao/bang-gio.json');

function getChiNgay(dd, mm, yy) {
  const jd = jdFromDate(dd, mm, yy);
  return CHI[(jd + 1) % 12];
}

function getGioHoangDao(dd, mm, yy) {
  const chiNgay = getChiNgay(dd, mm, yy);
  const group = data.nhomNgay.find((g) => g.chiNgay.includes(chiNgay));
  const gioList = group ? group.gioHoangDao : [];
  return gioList.map((chi) => ({ chi, khung: data.khungGio[chi] }));
}

// Gio can tranh (Hac dao) - 6 chi con lai trong 12 chi khong thuoc nhom Hoang dao cua ngay do
function getGioHacDao(dd, mm, yy) {
  const chiNgay = getChiNgay(dd, mm, yy);
  const group = data.nhomNgay.find((g) => g.chiNgay.includes(chiNgay));
  const gioTot = group ? group.gioHoangDao : [];
  return CHI.filter((chi) => !gioTot.includes(chi)).map((chi) => ({ chi, khung: data.khungGio[chi] }));
}

module.exports = { getChiNgay, getGioHoangDao, getGioHacDao };
