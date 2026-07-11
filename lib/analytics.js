/**
 * lib/analytics.js
 * Helper gửi custom event lên Google Analytics (GA4) — dùng cho các tool tính kết quả
 * ngay trên trang (không đổi URL) nên GA4 không tự đếm được qua page_view thông thường.
 */
export function trackEvent(action, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', action, params);
}

// Goi khi 1 tool cho ra ket qua (dung chung 1 ten su kien "tool_used", phan biet qua tool_name)
export function trackToolUse(toolName, extra = {}) {
  trackEvent('tool_used', { tool_name: toolName, ...extra });
}
