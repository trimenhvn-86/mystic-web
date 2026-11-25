import CamNangList, { PER_PAGE } from '../../../components/CamNangList';
import { getGuidePosts } from '../../../lib/content';
import { coverFor } from '../../../lib/cover';

export async function getStaticPaths() {
  const all = await getGuidePosts();
  const total = Math.ceil(all.length / PER_PAGE);
  const paths = [];
  for (let n = 2; n <= total; n++) paths.push({ params: { page: String(n) } });
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const page = parseInt(params.page, 10);
  const all = await getGuidePosts();
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  if (!page || page < 2 || page > totalPages) return { notFound: true, revalidate: 300 };
  const posts = all.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) => ({ ...p, featuredImageUrl: coverFor(p.slug, p.featuredImageUrl) }));
  return { props: { posts, page, totalPages }, revalidate: 3600 };
}

export default CamNangList;
