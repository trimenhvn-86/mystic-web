import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqSection({ faqs, title = 'Câu hỏi thường gặp' }) {
  const [openIndex, setOpenIndex] = useState(null);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };

  return (
    <div>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className="font-display text-xl text-parchment mb-4">{title}</h2>
      <div className="mystic-card divide-y divide-ink-line">
        {faqs.map((item, i) => (
          <div key={item.q} className="p-4">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between text-left gap-3"
            >
              <span className="text-parchment font-medium">{item.q}</span>
              <ChevronDown size={18} className={`text-gold flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && <p className="text-sm text-moon mt-3 leading-relaxed">{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
