import { InlineCTA } from './PromoBanner';

/**
 * Hiển thị nội dung HTML của bài và chèn một banner giữa bài (sau khoảng 2 mục lớn),
 * để người đọc gặp CTA đúng lúc đã có hứng thú, không phải kéo xuống cuối.
 */
export default function ArticleBody({ html, seed = '' }) {
  if (!html) return null;
  const h2 = [];
  const re = /<h2[\s>]/gi;
  let m;
  while ((m = re.exec(html)) !== null) h2.push(m.index);

  let cut = -1;
  if (h2.length >= 3) cut = h2[2];
  else if (h2.length === 2) cut = h2[1];
  else {
    const ps = [...html.matchAll(/<\/p>/gi)];
    if (ps.length >= 4) cut = ps[3].index + 4;
  }

  if (cut < 0) {
    // Bài quá ngắn: không chèn giữa bài, banner ở cuối bài do trang lo.
    // eslint-disable-next-line react/no-danger
    return <div className="cam-nang-html" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <div className="cam-nang-html" dangerouslySetInnerHTML={{ __html: html.slice(0, cut) }} />
      <div className="my-8"><InlineCTA seed={`${seed}-giua`} /></div>
      {/* eslint-disable-next-line react/no-danger */}
      <div className="cam-nang-html" dangerouslySetInnerHTML={{ __html: html.slice(cut) }} />
    </>
  );
}
