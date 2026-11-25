import CamNangList, { PER_PAGE } from '../../components/CamNangList';
import { getGuidePosts } from '../../lib/content';
import { coverFor } from '../../lib/cover';

export async function getStaticProps() {
  const all = await getGuidePosts();
  const posts = all.slice(0, PER_PAGE).map((p) => ({ ...p, featuredImageUrl: coverFor(p.slug, p.featuredImageUrl) }));
  return { props: { posts, page: 1, totalPages: Math.max(1, Math.ceil(all.length / PER_PAGE)) }, revalidate: all.length === 0 ? 300 : 3600 };
}

export default CamNangList;
