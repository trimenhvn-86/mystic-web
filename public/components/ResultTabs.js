import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AdSlot from './AdSlot';

/**
 * tabs: [{ key, label, content: ReactNode }]
 * Hiển thị dạng accordion xổ dọc (thay vì tab ngang) - dễ dùng trên mobile,
 * không bị thanh cuộn ngang, và vẫn giữ được việc mỗi mục có 1 AdSlot riêng
 * khi mở ra (giữ đúng chiến lược "mở mục mới -> load ad mới").
 */
export default function ResultTabs({ tabs }) {
  const [openKey, setOpenKey] = useState(tabs[0]?.key);

  return (
    <div className="mystic-card divide-y divide-ink-line overflow-hidden">
      {tabs.map((t) => {
        const isOpen = openKey === t.key;
        return (
          <div key={t.key}>
            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : t.key)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className={`font-medium ${isOpen ? 'text-gold-soft' : 'text-parchment'}`}>{t.label}</span>
              <ChevronDown size={18} className={`text-gold flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-parchment leading-relaxed">
                {t.content}
                <AdSlot label={`Ad slot — ${t.label}`} className="mt-4" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
