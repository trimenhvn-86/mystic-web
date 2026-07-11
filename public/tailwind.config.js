/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Token màu — Mystic Đông-Tây: đêm sao phương Tây + son-triện phương Đông
        ink: {
          DEFAULT: '#0B0E1A',   // nền chính, xanh đen sâu như trời đêm
          soft: '#141830',      // nền panel/card
          line: '#232A4D'       // viền, chia khối
        },
        gold: {
          DEFAULT: '#C9A24B',   // vàng kim — điểm nhấn chính, không chói
          soft: '#E4C97A'
        },
        jade: '#3E8E7E',        // ngũ hành Thủy/Mộc — dùng cho trạng thái tốt/hoàng đạo
        vermilion: '#B5473E',   // son triện — dùng cho cảnh báo/hắc đạo
        moon: '#C7CEEA',        // ánh trăng — text phụ, đường viền sao
        parchment: '#EDE9E0'    // giấy cổ — text chính trên nền tối
      },
      fontFamily: {
        display: ['"Be Vietnam Pro"', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backgroundImage: {
        'constellation': "radial-gradient(circle at 20% 20%, rgba(201,162,75,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 60%, rgba(62,142,126,0.08) 0%, transparent 45%)"
      }
    }
  },
  plugins: []
};
