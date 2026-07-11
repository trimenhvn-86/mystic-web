/**
 * lib/tarot.js
 * Logic dùng chung cho 3 tool Tarot (Hôm nay / Rút 1 lá / Yes-No).
 * Tarot hôm nay dùng seed xác định (deterministic) theo ngày — mọi người cùng
 * xem 1 lá trong ngày đó. Rút 1 lá và Yes/No dùng random thật (client-side).
 */
const cards = require('../content/tarot-cards.json');

const YES_NO_LABEL = {
  yes: 'CÓ',
  leaning_yes: 'NGHIÊNG VỀ CÓ',
  uncertain: 'CHƯA RÕ',
  leaning_no: 'NGHIÊNG VỀ KHÔNG',
  no: 'KHÔNG'
};

function pad(n) {
  return String(n).padStart(2, '0');
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getDailyCard(dd, mm, yyyy) {
  const dateStr = `${yyyy}-${pad(mm)}-${pad(dd)}`;
  const cardHash = hashString(dateStr);
  const cardIndex = cardHash % cards.length;
  const orientationHash = hashString(dateStr + '-orientation');
  const upright = orientationHash % 100 < 70;
  return { card: cards[cardIndex], upright };
}

function getRandomCard() {
  const cardIndex = Math.floor(Math.random() * cards.length);
  const upright = Math.random() < 0.7;
  return { card: cards[cardIndex], upright };
}

// Rut N la khong trung nhau (dung cho trai bai nhieu la)
function getUniqueCardSpread(count = 3) {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((card) => ({ card, upright: Math.random() < 0.7 }));
}

function getYesNoResult(card, upright) {
  const key = upright ? card.yesNoUpright : card.yesNoReversed;
  return { key, label: YES_NO_LABEL[key] };
}

function getCardBySlug(slug) {
  return cards.find((c) => c.slug === slug) || null;
}

// Lay cac la khac cung nhom (cung arcana major, hoac cung suit) de lam internal link
function getRelatedCards(card, count = 6) {
  const sameGroup = cards.filter((c) => {
    if (c.slug === card.slug) return false;
    if (card.arcana === 'major') return c.arcana === 'major';
    return c.suit === card.suit;
  });
  return sameGroup.sort((a, b) => a.number - b.number).slice(0, count);
}

module.exports = { cards, getDailyCard, getRandomCard, getUniqueCardSpread, getYesNoResult, getCardBySlug, getRelatedCards, YES_NO_LABEL };
