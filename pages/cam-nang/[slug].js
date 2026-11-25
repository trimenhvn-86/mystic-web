import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import ArticleBody from '../../components/ArticleBody';
import SidebarTools from '../../components/SidebarTools';
import { InlineCTA } from '../../components/PromoBanner';
import { getGuidePosts, getGuidePostBySlug } from '../../lib/content';

const ptComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    normal: ({ children }) => <p>{children}</p>
  }
};

export async function getStaticPaths() {
  // Nếu Sanity lỗi lúc build thì không dựng trước trang nào; fallback 'blocking' sẽ dựng khi có người truy cập.
  let posts = [];
  try { posts = await getGuidePosts(); } catch (e) { posts = []; }
  return { paths: posts.map((p) => ({ params: { slug: p.slug } })), fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const post = await getGuidePostBySlug(params.slug);
  // Sanity lỗi => getGuidePostBySlug ném lỗi => ISR giữ bản cũ. Chỉ khi Sanity trả null (không có bài) mới 404.
  if (!post) return { notFound: true, revalidate: 300 };
  // Bài liên quan: cùng chuyên mục trước, rồi bài mới nhất (tối đa 4) để tăng liên kết nội bộ
  let related = [];
  try {
    const all = await getGuidePosts();
    const others = all.filter((p) => p.slug !== post.slug);
    related = [...others.filter((p) => p.hub === post.hub), ...others.filter((p) => p.hub !== post.hub)]
      .slice(0, 4)
      .map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt || '' }));
  } catch (e) { related = []; }
  return { props: { post, related }, revalidate: 3600 };
}

export default function CamNangDetail({ post, related = [] }) {
  const seoTitle = post.seoTitle || `${post.title} — Cẩm nang TriMenh`;
  const seoDescription = post.seoDescription || post.excerpt;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: seoDescription,
    inLanguage: 'vi-VN',
    mainEntityOfPage: `https://trimenh.com/cam-nang/${post.slug}`,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt || post.publishedAt || undefined,
    ...(post.featuredImageUrl ? { image: post.featuredImageUrl } : {}),
    author: { '@type': 'Organization', name: 'Ban biên soạn TriMenh', url: 'https://trimenh.com/ban-bien-soan' },
    publisher: { '@type': 'Organization', name: 'TriMenh', url: 'https://trimenh.com/' }
  };

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {post.featuredImageUrl && <meta property="og:image" content={post.featuredImageUrl} />}
        <meta property="og:type" content="article" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0">
          <Breadcrumb trail={[{ label: 'Cẩm nang', href: '/cam-nang' }]} current={post.title} />
          <article className="max-w-[44rem]">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-4">{post.title}</h1>
            <p className="text-sm text-moon mb-6 pb-5 border-b border-ink-line">
              Biên soạn bởi <Link href="/ban-bien-soan" className="text-parchment font-medium underline underline-offset-4 decoration-lich">Ban biên soạn TriMenh</Link>
              {post.publishedAt ? `, ${new Date(post.publishedAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}` : ''}
              {'. '}<Link href="/phuong-phap-tinh" className="underline underline-offset-4">Phương pháp tính</Link>
            </p>
            {post.featuredImageUrl && (
              <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden mb-8">
                <Image
                  src={post.featuredImageUrl}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 704px"
                  priority
                />
              </div>
            )}
            {post.htmlContent ? (
              <ArticleBody html={post.htmlContent} seed={post.slug} />
            ) : post.body ? (
              <div className="cam-nang-html"><PortableText value={post.body} components={ptComponents} /></div>
            ) : (
              <p className="text-moon">{post.excerpt}</p>
            )}
            <p className="mt-8 text-xs text-moon leading-relaxed">
              Nội dung chỉ mang tính tham khảo và chiêm nghiệm, không thay thế lời khuyên chuyên môn về sức khỏe, tài chính hay pháp lý.
            </p>
          </article>

          <div className="max-w-[44rem] mt-10"><InlineCTA seed={`${post.slug}-cuoi`} /></div>

          {related.length > 0 && (
            <section className="mt-12 max-w-[44rem]">
              <h2 className="font-display font-bold text-xl text-parchment mb-2 pb-2 border-b-2 border-parchment">Đọc tiếp</h2>
              <div className="divide-y divide-ink-line">
                {related.map((r) => (
                  <Link key={r.slug} href={`/cam-nang/${r.slug}`} className="block py-4 group">
                    <p className="font-display font-semibold text-parchment group-hover:text-lich transition-colors">{r.title}</p>
                    {r.excerpt && <p className="text-sm text-moon mt-1 line-clamp-2">{r.excerpt}</p>}
                  </Link>
                ))}
              </div>
            </section>
          )}
          <AdSlot label="cam-nang-cuoi-bai" className="mt-8 max-w-[44rem]" />
        </main>
        <SidebarTools seed={post.slug} />
      </div>
      <Footer />
    </>
  );
}
