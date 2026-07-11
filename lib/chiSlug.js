/**
 * lib/chiSlug.js
 * Map Chi (có dấu) <-> slug URL (không dấu, không trùng).
 * Không dùng hàm bỏ dấu tự động vì "Tý" và "Tỵ" sẽ trùng slug nếu chỉ bỏ dấu đơn giản.
 */
const CHI_SLUG = {
  'Tý': 'ty',
  'Sửu': 'suu',
  'Dần': 'dan',
  'Mão': 'mao',
  'Thìn': 'thin',
  'Tỵ': 'ti',
  'Ngọ': 'ngo',
  'Mùi': 'mui',
  'Thân': 'than',
  'Dậu': 'dau',
  'Tuất': 'tuat',
  'Hợi': 'hoi'
};

const SLUG_TO_CHI = Object.fromEntries(Object.entries(CHI_SLUG).map(([k, v]) => [v, k]));

module.exports = { CHI_SLUG, SLUG_TO_CHI };
