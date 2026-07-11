const THU_VN = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function getThuVN(dd, mm, yyyy) {
  const d = new Date(yyyy, mm - 1, dd);
  return THU_VN[d.getDay()];
}

/**
 * Hình tờ lịch kiểu truyền thống (lịch bóc hằng ngày của Việt Nam).
 * props: dd, mm, yyyy, lunar ({day,month,year,leap}), canChiNgay, isGoodDay
 */
export default function CalendarSheet({ dd, mm, yyyy, lunar, canChiNgay, isGoodDay }) {
  const thu = getThuVN(dd, mm, yyyy);
  const isSunday = thu === 'Chủ Nhật';

  return (
    <div className="w-full max-w-[240px] mx-auto select-none">
      <div className="relative bg-parchment rounded-lg shadow-xl -rotate-1 pt-5 pb-5 px-4 border border-black/5">
        {/* Lỗ treo lịch */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-ink border-4 border-parchment shadow" />

        {/* Băng đỏ ngày trong tuần */}
        <div className={`-mx-4 -mt-5 mb-3 py-1.5 text-center text-xs font-semibold tracking-wide uppercase rounded-t-lg ${isSunday ? 'bg-vermilion text-white' : 'bg-ink text-gold-soft'}`}>
          {thu}
        </div>

        {/* Số ngày lớn */}
        <div className="text-center">
          <p className={`font-display leading-none text-7xl font-bold ${isSunday ? 'text-vermilion' : 'text-ink'}`}>
            {String(dd).padStart(2, '0')}
          </p>
          <p className="text-ink/70 text-sm mt-1">Tháng {mm} - {yyyy}</p>
        </div>

        {/* Đường đục lỗ */}
        <div className="border-t border-dashed border-ink/25 my-3" />

        {/* Am lich + Can Chi */}
        <div className="text-center space-y-1">
          <p className="text-ink/80 text-sm">
            Âm lịch: <strong>{lunar.day}/{lunar.month}{lunar.leap ? 'n' : ''}</strong>
          </p>
          <p className="text-ink/80 text-sm">Ngày {canChiNgay}</p>
          <span className={`inline-block mt-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
            isGoodDay ? 'bg-jade/15 text-jade' : 'bg-vermilion/15 text-vermilion'
          }`}>
            {isGoodDay ? 'Ngày Hoàng Đạo' : 'Ngày Hắc Đạo'}
          </span>
        </div>
      </div>
    </div>
  );
}
