export default function SeoContent() {
  return (
    <div className="space-y-8 text-parchment/85 leading-relaxed">
      <section>
        <h2 className="font-display text-xl text-parchment mb-3">Lịch âm là gì?</h2>
        <p>
          Lịch Âm (hay Âm lịch) là hệ thống lịch được tính dựa trên chu kỳ vận hành của Mặt Trăng quanh Trái Đất, khác với
          lịch Dương (Dương lịch) mà chúng ta dùng hằng ngày dựa trên chu kỳ Trái Đất quay quanh Mặt Trời. Một tháng Âm
          lịch kéo dài khoảng 29 đến 30 ngày, tương ứng với một chu kỳ trăng tròn - trăng khuyết trọn vẹn. Tại Việt Nam,
          lịch Âm gắn liền với đời sống văn hóa, tín ngưỡng và các dịp lễ truyền thống như Tết Nguyên Đán, Rằm tháng Giêng,
          Vu Lan, Trung Thu — vì vậy nhu cầu tra cứu, đổi lịch Âm Dương luôn ở mức cao quanh năm.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-parchment mb-3">Cách chuyển đổi Âm Dương lịch</h2>
        <p>
          Việc chuyển đổi giữa lịch Dương và lịch Âm không đơn giản là phép cộng trừ ngày cố định, bởi độ dài tháng Âm lịch
          thay đổi (29 hoặc 30 ngày) và có thêm tháng nhuận theo chu kỳ nhiều năm. Công cụ tại TriMenh sử dụng thuật toán
          thiên văn học để xác định chính xác thời điểm trăng non (Sóc) — mốc bắt đầu mỗi tháng Âm lịch — dựa trên múi giờ
          Việt Nam (UTC+7), từ đó suy ra ngày, tháng, năm Âm lịch tương ứng với bất kỳ ngày Dương lịch nào, và ngược lại.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-parchment mb-3">Can Chi được tính thế nào?</h2>
        <p>
          Hệ thống Can Chi gồm 10 Thiên Can (Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý) kết hợp với 12 Địa Chi
          (Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi) tạo thành chu kỳ 60 tổ hợp không lặp lại, gọi là
          Lục Thập Hoa Giáp. Chu kỳ này áp dụng cho cả năm, tháng, ngày và giờ — đây cũng là cơ sở để tính ra Ngũ Hành Nạp
          Âm (Kim, Mộc, Thủy, Hỏa, Thổ) đặc trưng cho từng năm hoặc từng ngày sinh.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-parchment mb-3">Khi nào cần dùng lịch âm?</h2>
        <p>
          Lịch Âm thường được dùng để xác định các ngày lễ truyền thống, ngày giỗ, ngày cúng kiếng theo phong tục, cũng như
          làm cơ sở để tra cứu tuổi Can Chi, mệnh Ngũ hành, ngày Hoàng đạo - Hắc đạo cho các việc quan trọng như cưới hỏi,
          khai trương, động thổ, xuất hành. Ngoài ra, nhiều người cũng dùng lịch Âm để tính tuổi mụ (tuổi Âm) khi xem tử vi
          hoặc thần số học truyền thống.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-parchment mb-3">Lịch âm trong phong thủy</h2>
        <p>
          Trong phong thủy, ngày Âm lịch là nền tảng để xác định Trực (một trong 12 Trực của chu kỳ Kiến Trừ), Sao (một
          trong Nhị Thập Bát Tú), từ đó suy ra ngày Hoàng đạo hay Hắc đạo, giờ tốt trong ngày, và hướng xuất hành hợp
          tuổi. Đây là những yếu tố truyền thống được nhiều người tham khảo trước khi quyết định thời điểm cho các công
          việc quan trọng.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-parchment mb-3">Lịch âm trong cưới hỏi</h2>
        <p>
          Khi chọn ngày cưới, nhiều gia đình Việt vẫn ưu tiên xem ngày Âm lịch thuộc Trực và Sao tốt, tránh các ngày xung
          khắc với tuổi của cô dâu chú rể (theo Tam Hợp - Tứ Hành Xung), đồng thời chọn giờ Hoàng đạo để làm lễ nhằm cầu
          mong hôn nhân thuận hòa, may mắn.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-parchment mb-3">Lịch âm trong xây nhà</h2>
        <p>
          Tương tự cưới hỏi, việc động thổ hay khởi công xây nhà cũng thường được chọn vào ngày Âm lịch tốt, hợp mệnh Ngũ
          hành và tuổi của gia chủ, tránh các ngày Tam Nương, Nguyệt Kỵ hoặc ngày xung khắc, với mong muốn công trình diễn
          ra suôn sẻ và mang lại may mắn về sau cho gia đình.
        </p>
      </section>
    </div>
  );
}
