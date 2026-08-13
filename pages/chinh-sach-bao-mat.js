import Head from 'next/head';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';

export default function ChinhSachBaoMat() {
  return (
    <>
      <Head>
        <title>Chính Sách Bảo Mật — TriMenh</title>
        <meta name="description" content="Chính sách bảo mật của TriMenh.com: cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn khi sử dụng website." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-14">
        <Breadcrumb trail={[]} current="Chính sách bảo mật" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Chính Sách Bảo Mật</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Cập nhật lần cuối: tháng 8/2026</p>

        <div className="mystic-card p-6 sm:p-8 space-y-6 leading-relaxed text-parchment/90 text-[15px]">
          <p>
            TriMenh.com (&quot;chúng tôi&quot;) tôn trọng quyền riêng tư của người dùng (&quot;bạn&quot;). Chính sách này giải
            thích chúng tôi thu thập, sử dụng và bảo vệ thông tin như thế nào khi bạn truy cập và sử dụng website.
            Bằng việc sử dụng TriMenh.com, bạn đồng ý với các nội dung trong chính sách này.
          </p>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">1. Thông tin chúng tôi thu thập</h2>
            <p className="mb-3">TriMenh.com <strong>không yêu cầu đăng ký tài khoản</strong> để sử dụng các công cụ tra cứu. Chúng tôi thu thập một số thông tin sau:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Dữ liệu bạn tự nhập vào công cụ</strong> (ngày sinh, họ tên, giới tính...) để tính toán kết quả
                (thần số học, tử vi, phong thủy, tuổi hợp, Tarot...). Dữ liệu này được xử lý ngay trên trình duyệt hoặc
                máy chủ để trả kết quả, <strong>không được lưu trữ lâu dài hay gắn với danh tính của bạn</strong>, trừ
                trường hợp bạn tự chọn lưu (VD: một số kết quả rút bài Tarot có thể lưu tạm trong bộ nhớ trình duyệt
                của chính bạn — sessionStorage — để tiện xem lại, dữ liệu này chỉ nằm trên máy bạn và tự xóa khi đóng
                trình duyệt).
              </li>
              <li>
                <strong>Thông tin khi bạn liên hệ</strong> qua form Liên hệ (họ tên, email, nội dung tin nhắn) — dùng để
                phản hồi yêu cầu của bạn, không dùng cho mục đích khác.
              </li>
              <li>
                <strong>Dữ liệu sử dụng ẩn danh</strong> qua Google Analytics: trang bạn truy cập, thời gian ở lại,
                thiết bị/trình duyệt, khu vực địa lý gần đúng (thành phố/quốc gia). Dữ liệu này <strong>không xác định
                danh tính cá nhân của bạn</strong>, chỉ giúp chúng tôi hiểu người dùng đang tương tác với công cụ nào để
                cải thiện website.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">2. Cookie</h2>
            <p>
              Website sử dụng cookie của Google Analytics để phân tích lượt truy cập. Bạn có thể chặn cookie này bất kỳ
              lúc nào qua cài đặt trình duyệt (thường ở mục Quyền riêng tư/Privacy) hoặc dùng tiện ích chặn theo dõi —
              việc chặn không ảnh hưởng đến khả năng sử dụng các công cụ tra cứu trên TriMenh.com.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">3. Chia sẻ thông tin với bên thứ ba</h2>
            <p className="mb-3">Chúng tôi <strong>không bán</strong> thông tin của bạn cho bất kỳ ai. Thông tin chỉ được chia sẻ với các bên cung cấp dịch vụ cần thiết để vận hành website:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Google Analytics</strong> — đo lường lượt truy cập ẩn danh.</li>
              <li><strong>Đơn vị lưu trữ (Vercel)</strong> — hạ tầng chạy website.</li>
              <li><strong>Dịch vụ gửi form liên hệ (Web3Forms)</strong> — chuyển tiếp nội dung bạn gửi qua form Liên hệ tới email của chúng tôi.</li>
            </ul>
            <p className="mt-3">Các bên trên có chính sách bảo mật riêng, chỉ xử lý dữ liệu theo đúng phạm vi dịch vụ cung cấp cho chúng tôi.</p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">4. Quảng cáo</h2>
            <p>
              TriMenh.com có thể hiển thị quảng cáo trong tương lai để duy trì vận hành miễn phí cho người dùng. Nếu có,
              đơn vị quảng cáo (VD: Google AdSense) có thể sử dụng cookie riêng của họ để cá nhân hóa quảng cáo — bạn có
              thể tắt quảng cáo cá nhân hóa qua{' '}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-gold-soft underline">
                Cài đặt quảng cáo của Google
              </a>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">5. Bảo mật dữ liệu</h2>
            <p>
              Website sử dụng kết nối HTTPS mã hóa cho mọi lượt truy cập. Vì không yêu cầu tài khoản/mật khẩu, TriMenh.com
              không lưu trữ thông tin đăng nhập hay dữ liệu nhạy cảm (thông tin tài chính, giấy tờ tùy thân...) của người dùng.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">6. Quyền của bạn</h2>
            <p>
              Vì TriMenh.com không lưu trữ dữ liệu cá nhân gắn với tài khoản, phần lớn thông tin bạn nhập vào công cụ
              không được lưu lại sau khi rời trang. Nếu bạn từng gửi thông tin qua form Liên hệ và muốn yêu cầu xóa, vui
              lòng liên hệ theo thông tin ở mục 8 bên dưới.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">7. Trẻ em</h2>
            <p>
              TriMenh.com không hướng đến đối tượng trẻ em dưới 13 tuổi và không chủ đích thu thập thông tin từ nhóm
              tuổi này. Nếu phát hiện có thu thập ngoài ý muốn, chúng tôi sẽ xóa ngay khi được thông báo.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">8. Liên hệ</h2>
            <p>
              Nếu có thắc mắc về Chính sách bảo mật này, vui lòng liên hệ qua trang{' '}
              <a href="/lien-he" className="text-gold-soft underline">Liên hệ</a> của website.
            </p>
          </div>

          <div className="mystic-divider pt-5">
            <p className="text-xs text-moon/60">
              Chính sách này có thể được cập nhật theo thời gian để phản ánh đúng thực tế vận hành của website. Phiên
              bản mới nhất luôn được đăng tại trang này.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
