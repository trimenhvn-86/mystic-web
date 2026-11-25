import ArticleTool from './ArticleTools';

function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

/** Thêm id cho từng <h2> và gom danh sách mục lục. */
function prepare(html) {
  const toc = [];
  const used = {};
  const out = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (m, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let id = slugify(text) || `muc-${toc.length + 1}`;
    used[id] = (used[id] || 0) + 1;
    if (used[id] > 1) id = `${id}-${used[id]}`;
    toc.push({ id, text });
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

/**
 * Nội dung bài: mục lục (từ 3 mục trở lên), khối công cụ đúng ngữ cảnh trước mục thứ 3 (hoặc thứ 2).
 */
export default function ArticleBody({ html, seed = '', hub = '' }) {
  if (!html) return null;
  const { html: h, toc } = prepare(html);
  const h2 = [];
  const re = /<h2[\s>]/gi;
  let m;
  while ((m = re.exec(h)) !== null) h2.push(m.index);

  let cut = -1;
  if (h2.length >= 3) cut = h2[2];
  else if (h2.length === 2) cut = h2[1];
  else {
    const ps = [...h.matchAll(/<\/p>/gi)];
    if (ps.length >= 4) cut = ps[3].index + 4;
  }

  const tocEl = toc.length >= 3 ? (
    <nav aria-label="Mục lục" className="mystic-card p-5 mb-8">
      <p className="font-display font-bold text-parchment mb-2">Trong bài này</p>
      <ol className="space-y-1.5 text-[0.95rem]">
        {toc.map((t, i) => (
          <li key={t.id}><a href={`#${t.id}`} className="text-moon hover:text-lich"><span className="text-moon/60 mr-2">{i + 1}.</span>{t.text}</a></li>
        ))}
      </ol>
    </nav>
  ) : null;

  if (cut < 0) {
    return <>{tocEl}{/* eslint-disable-next-line react/no-danger */}<div className="cam-nang-html" dangerouslySetInnerHTML={{ __html: h }} /></>;
  }
  return (
    <>
      {tocEl}
      {/* eslint-disable-next-line react/no-danger */}
      <div className="cam-nang-html" dangerouslySetInnerHTML={{ __html: h.slice(0, cut) }} />
      <div className="my-9"><ArticleTool hub={hub} slug={seed} /></div>
      {/* eslint-disable-next-line react/no-danger */}
      <div className="cam-nang-html" dangerouslySetInnerHTML={{ __html: h.slice(cut) }} />
    </>
  );
}
