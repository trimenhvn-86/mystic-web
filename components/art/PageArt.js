import { useRouter } from 'next/router';
import HubArt, { hubFromPath } from './HubArt';

/** Dải minh họa dưới tiêu đề trang công cụ: chọn tranh theo chuyên mục của địa chỉ trang. */
export default function PageArt({ hub, className = '' }) {
  const { asPath } = useRouter();
  const h = hub || hubFromPath(asPath);
  return (
    <div className={`rounded-md overflow-hidden border border-ink-line h-[88px] sm:h-[120px] mb-6 ${className}`} aria-hidden="true">
      <HubArt hub={h} variant="banner" />
    </div>
  );
}
