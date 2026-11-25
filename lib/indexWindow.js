/**
 * Khoảng ngày được phép index: từ 3 tháng trước đến 12 tháng sau hôm nay (giờ VN).
 * Ngoài khoảng này trang vẫn mở được nhưng gắn noindex để Google không phải lập chỉ mục vô hạn trang theo ngày.
 */
const { getVietnamNow } = require('./vnDate');

function isOutsideIndexWindow(dd, mm, yyyy) {
  const now = getVietnamNow();
  const d = new Date(yyyy, mm - 1, dd);
  const from = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  const to = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  return d < from || d > to;
}

module.exports = { isOutsideIndexWindow };
