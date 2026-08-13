import Head from 'next/head';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';

export default function DieuKhoanSuDung() {
  return (
    <>
      <Head>
        <title>Điều Khoản Sử Dụng — TriMenh</title>
        <meta name="description" content="Điều khoản sử dụng website TriMenh.com — quy định về việc sử dụng nội dung, công cụ tra cứu và trách nhiệm của các bên." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-14">
        <Breadcrumb trail={[]} current="Điều khoản sử dụng" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Điều Khoản Sử Dụng</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Cập nhật lần cuối: tháng 8/2026</p>

        <div className="mystic-card p-6 sm:p-8 space-y-6 leading-relaxed text-parchment/90 text-[15px]">
          <p>
            Chào mừng bạn đến với TriMenh.com. Khi truy cập và sử dụng website, bạn đồng ý tuân thủ các điều khoản dưới
            đây. Vui lòng đọc kỹ trước khi sử dụng.
          </p>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">1. Bản chất nội dung — vui lòng đọc kỹ</h2>
            <p>
              Toàn bộ nội dung trên TriMenh.com (lịch âm dương, thần số học, tử vi, phong thủy, tuổi hợp, Tarot và các
              công cụ liên quan) được xây dựng dựa trên các hệ thống tri thức, chiêm nghiệm dân gian và phương pháp
              luận truyền thống. <strong>Đây là nội dung mang tính tham khảo, giải trí và chiêm nghiệm cá nhân — không
              phải lời khẳng định khoa học, không phải tư vấn y tế, tài chính, pháp lý hay tâm lý chuyên môn</strong>,
              và không đảm bảo tính chính xác tuyệt đối cho mọi trường hợp cá nhân.
            </p>
            <p className="mt-3">
              Bạn hoàn toàn chịu trách nhiệm về các quyết định của mình khi tham khảo nội dung trên website. TriMenh
              khuyến khích bạn tham khảo thêm ý kiến của chuyên gia phù hợp (bác sĩ, luật sư, chuyên viên tài chính...)
              trước khi đưa ra các quyết định quan trọng trong cuộc sống.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">2. Sử dụng công cụ và dữ liệu bạn nhập vào</h2>
            <p>
              Các công cụ tra cứu (thần số học, tử vi, phong thủy...) yêu cầu bạn nhập một số thông tin như ngày sinh,
              họ tên để tính toán. Bạn xác nhận thông tin nhập vào là chính xác trong khả năng của mình và chịu trách
              nhiệm về việc chia sẻ thông tin đó (đặc biệt khi tra cứu hộ người khác, nên có sự đồng ý của họ).
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">3. Quyền sở hữu trí tuệ</h2>
            <p>
              Toàn bộ nội dung, giao diện, mã nguồn, logo và thương hiệu &quot;TriMenh&quot; thuộc quyền sở hữu của
              TriMenh.com, trừ khi có ghi chú khác. Bạn có thể đọc, chia sẻ liên kết tới nội dung cho mục đích cá nhân,
              phi thương mại. <strong>Không được sao chép, phân phối lại toàn bộ hoặc một phần lớn nội dung, hoặc sử
              dụng cho mục đích thương mại</strong> mà không có sự cho phép bằng văn bản từ TriMenh.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">4. Hành vi bị cấm</h2>
            <p className="mb-3">Khi sử dụng TriMenh.com, bạn đồng ý không:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Sử dụng công cụ tự động (bot, crawler...) để khai thác dữ liệu hàng loạt trái phép.</li>
              <li>Thực hiện các hành vi gây quá tải, tấn công hoặc phá hoại hệ thống của website.</li>
              <li>Sao chép nội dung để xây dựng sản phẩm/dịch vụ cạnh tranh mà không có sự cho phép.</li>
              <li>Sử dụng website cho mục đích vi phạm pháp luật hiện hành.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">5. Miễn trừ trách nhiệm</h2>
            <p>
              TriMenh.com cố gắng đảm bảo tính chính xác của các phép tính (lịch âm dương, Can Chi, thần số học...) dựa
              trên các công thức và thuật toán đã được kiểm chứng. Tuy nhiên, chúng tôi <strong>không cam kết website
              hoạt động liên tục, không lỗi, hoặc mọi thông tin đều tuyệt đối chính xác trong mọi trường hợp</strong>.
              Website được cung cấp ở trạng thái &quot;nguyên trạng&quot; (as-is), không kèm bảo đảm dưới bất kỳ hình
              thức nào.
            </p>
            <p className="mt-3">
              TriMenh không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp hay gián tiếp nào phát sinh từ việc bạn sử
              dụng hoặc dựa vào nội dung trên website để đưa ra quyết định.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">6. Liên kết tới website khác</h2>
            <p>
              TriMenh.com có thể chứa liên kết tới website của bên thứ ba (mạng xã hội, đối tác...). Chúng tôi không
              chịu trách nhiệm về nội dung hoặc chính sách bảo mật của các website đó.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">7. Thay đổi điều khoản</h2>
            <p>
              TriMenh có thể cập nhật Điều khoản sử dụng này theo thời gian để phù hợp với thực tế vận hành. Phiên bản
              mới nhất luôn được đăng tại trang này; việc bạn tiếp tục sử dụng website sau khi điều khoản được cập nhật
              đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-gold-soft mb-3">8. Liên hệ</h2>
            <p>
              Nếu có thắc mắc về Điều khoản sử dụng này, vui lòng liên hệ qua trang{' '}
              <a href="/lien-he" className="text-gold-soft underline">Liên hệ</a> của website.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
