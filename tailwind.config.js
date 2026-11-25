/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Giao diện "tờ lịch bloc": giấy sáng, mực đen xanh, đỏ lịch.
        // Giữ nguyên TÊN token cũ để mọi trang tự đổi theo: ink = nền giấy, parchment = chữ mực.
        ink: {
          DEFAULT: '#F7F6F1',   // nền giấy lịch
          soft: '#EDEBE2',      // nền khối phụ (mặt giấy đậm hơn một chút)
          line: '#D3CFC0'       // đường kẻ, viền
        },
        gold: {
          DEFAULT: '#C42B1C',   // nhấn chính = đỏ lịch (tên 'gold' giữ lại để các trang cũ tự đổi màu)
          soft: '#8E1F15'       // đỏ sẫm — chữ nhấn mạnh, liên kết
        },
        lich: {
          DEFAULT: '#C42B1C',   // đỏ lịch — số ngày, nút chính, dải trên tờ lịch
          deep: '#9E1F14'
        },
        jade: '#1F7A5C',        // ngày tốt / Hoàng đạo
        vermilion: '#A8231B',   // ngày xấu / Hắc đạo, cảnh báo
        moon: '#55555F',        // chữ phụ
        parchment: '#1B1B24'    // chữ chính — mực đen xanh
      },
      fontFamily: {
        display: ['"Be Vietnam Pro"', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
        read: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
    }
  },
  plugins: []
};
