export default function HeroRing() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 w-full h-full opacity-40 pointer-events-none select-none"
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="180" fill="none" stroke="#C9A24B" strokeWidth="0.6" strokeDasharray="1 5" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="#3E8E7E" strokeWidth="0.6" strokeDasharray="1 4" />
      <circle cx="200" cy="200" r="100" fill="none" stroke="#C9A24B" strokeWidth="0.5" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 200 + 100 * Math.cos(angle);
        const y1 = 200 + 100 * Math.sin(angle);
        const x2 = 200 + 140 * Math.cos(angle);
        const y2 = 200 + 140 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A24B" strokeWidth="0.4" />;
      })}
    </svg>
  );
}
