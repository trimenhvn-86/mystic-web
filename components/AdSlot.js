/**
 * components/AdSlot.js
 * Placeholder cho 1 khối quảng cáo Google AdSense.
 * Trước khi lên production:
 * 1. Thay `data-ad-client` bằng mã publisher thật (ca-pub-xxxxxxxxxx)
 * 2. Thay `data-ad-slot` bằng slot ID tạo trong AdSense dashboard
 * 3. Nạp script AdSense 1 lần duy nhất ở _document.js hoặc _app.js
 *
 * ⚠️ LƯU Ý CHÍNH SÁCH ADSENSE:
 * Google AdSense có chính sách riêng về "ad refresh" — việc load quảng cáo mới
 * mỗi khi người dùng bấm đổi Tab (không phải chuyển trang thật) có thể vi phạm
 * chính sách "valid traffic" / ad refresh nếu không tuân đúng điều kiện của Google
 * (ví dụ: quảng cáo chỉ refresh khi có thay đổi nội dung đáng kể + không tự động
 * lặp nhanh). Trước khi triển khai chiến lược "đổi Tab -> load Ads mới" ở quy mô
 * lớn, nên đọc kỹ: Google AdSense Program Policies > Ad Placement, để tránh bị
 * khóa tài khoản.
 */
export default function AdSlot({ label = 'Quảng cáo', className = '' }) {
  return (
    <div
      className={`w-full min-h-[100px] flex items-center justify-center border border-dashed border-ink-line rounded-lg text-xs text-moon/40 bg-ink-soft/40 ${className}`}
    >
      {label}
      {/* TODO: thay bằng <ins class="adsbygoogle" ...></ins> thật */}
    </div>
  );
}
