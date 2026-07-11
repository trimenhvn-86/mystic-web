import Link from 'next/link';

export default function ToolCard({ href, title, desc, active = true, icon: Icon, badge }) {
  const Wrapper = active ? Link : 'div';
  const props = active ? { href } : {};
  return (
    <Wrapper
      {...props}
      className={`mystic-card p-5 flex flex-col gap-2 transition-transform relative ${
        active ? 'hover:-translate-y-1 hover:border-gold/40 cursor-pointer' : 'opacity-55 cursor-default'
      }`}
    >
      {badge && (
        <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wide text-moon/60 bg-ink-soft border border-ink-line rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-ink-soft border border-ink-line flex items-center justify-center mb-1">
          <Icon size={20} className="text-gold" />
        </div>
      )}
      <h3 className="font-display text-xl text-gold-soft">{title}</h3>
      <p className="text-sm text-moon/80">{desc}</p>
      {!active && <span className="text-xs text-vermilion mt-1">Sắp ra mắt</span>}
    </Wrapper>
  );
}
