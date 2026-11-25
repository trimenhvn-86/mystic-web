import fs from 'fs';
import path from 'path';

/** Ảnh đại diện bài viết nằm ở public/cam-nang-img/<slug>.jpg (tạo sẵn). Trả về null nếu chưa có. */
export function coverFor(slug, featuredImageUrl) {
  if (featuredImageUrl) return featuredImageUrl;
  const rel = `/cam-nang-img/${slug}.jpg`;
  return fs.existsSync(path.join(process.cwd(), 'public', rel)) ? rel : null;
}
