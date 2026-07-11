export default function MysticLoader({ label = 'Hệ thống Tri Mệnh đang phân tích...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative w-28 h-28">
        {/* Vòng ngoài - 12 cung hoàng đạo (Tây) */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 spin-slow">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#C9A24B" strokeWidth="1" strokeDasharray="2 6" />
        </svg>
        {/* Vòng trong - Bát quái (Đông) */}
        <svg viewBox="0 0 100 100" className="absolute inset-3 spin-reverse">
          <circle cx="50" cy="50" r="34" fill="none" stroke="#3E8E7E" strokeWidth="1.5" strokeDasharray="1 4" />
        </svg>
        {/* Tâm điểm */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(201,162,75,0.6)]" />
        </div>
      </div>
      <p className="text-moon text-sm tracking-wide">{label}</p>
    </div>
  );
}
