import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Hash, Layers, Users, Sun, CircleDot, Sparkle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HUBS, getAllActiveTools } from '../content/hubs';

const HUB_ICONS = { CalendarDays, Hash, Layers, Users, Sun, CircleDot };

export default function GioiThieu() {
  const popularTools = getAllActiveTools().slice(0, 8);

  return (
    <>
      <Head>
        <title>Giới thiệu TriMenh — Khám phá vận mệnh, kiến tạo tương lai.</title>
        <meta
          name="description"
          content="TriMenh là nền tảng tra cứu và khám phá bản thân dành cho người Việt: thần số học, tử vi, phong thủy, lịch âm dương, ngũ hành, tarot, cung hoàng đạo."
        />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-14">
        <div className="text-center mb-8">
          <Image src="/brand/trimenh-logo.png" alt="TriMenh" width={96} height={96} className="mx-auto mb-4" />
          <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1">TriMenh — Khám phá vận mệnh, kiến tạo tương lai.</h1>
          <p className="text-gold-soft text-sm">Hiểu mình để sống tốt hơn</p>
        </div>

        <div className="mystic-card p-6 sm:p-8 space-y-5 leading-relaxed text-parchment/90">
          <p>
            TriMenh được xây dựng với mong muốn trở thành nền tảng tra cứu và khám phá bản thân hàng đầu dành cho người Việt.
          </p>
          <p>
            Chúng tôi tin rằng mỗi người đều có một hành trình riêng. Việc hiểu rõ bản thân, tính cách, điểm mạnh, điểm cần
            cải thiện và những chu kỳ của cuộc sống sẽ giúp mỗi người đưa ra những quyết định sáng suốt hơn trong công việc,
            tình yêu, tài chính và định hướng tương lai.
          </p>
          <p>
            TriMenh kết hợp các hệ thống tri thức đã được nghiên cứu và lưu truyền qua nhiều thế hệ như thần số học, tử vi,
            phong thủy, lịch âm dương, ngũ hành, tarot, cung hoàng đạo cùng nhiều công cụ tra cứu hiện đại để mang đến những
            góc nhìn đa chiều về mỗi cá nhân.
          </p>
          <p>
            Mỗi kết quả tại TriMenh đều được xây dựng từ hệ thống quy tắc, dữ liệu và phương pháp luận riêng, giúp người
            dùng không chỉ nhận được một lời luận giải mà còn có thêm những gợi ý để ứng dụng vào cuộc sống hằng ngày.
          </p>
          <div className="mystic-divider pt-5">
            <p className="text-moon/90">
              TriMenh không khuyến khích mê tín hay phụ thuộc vào dự đoán. Chúng tôi mong muốn mỗi công cụ trở thành một
              nguồn tham khảo hữu ích, giúp bạn hiểu mình rõ hơn, nhận diện cơ hội, chuẩn bị cho thử thách và sống chủ động hơn.
            </p>
          </div>
        </div>

        {/* Triet ly cai ten "Tri Menh" */}
        <div className="mystic-card p-6 sm:p-8 mt-8 border-gold/20">
          <h2 className="font-display text-xl text-parchment mb-4 text-center">Vì sao là &quot;Tri Mệnh&quot;?</h2>
          <div className="space-y-4 text-parchment/85 leading-relaxed text-[15px]">
            <p>
              Trong Kinh Dịch có câu: &quot;Lạc Thiên tri mệnh, cố bất ưu&quot; – nghĩa là thuận theo lẽ trời, thấu hiểu số mệnh,
              thì lòng chẳng còn lo âu. Quan niệm về &quot;mệnh&quot; từ lâu đã ăn sâu trong tư tưởng cổ nhân. Mạnh Tử từng nói:
              &quot;Không làm mà thành là Thiên ý, không cầu mà nên là số mệnh&quot;. Đổng Trọng Thư, nhà Nho thời Tây Hán, cũng
              định nghĩa: &quot;Trời lệnh thực thi thì gọi là mệnh&quot;. Như vậy, trong nhận thức xưa, mệnh không tách rời khỏi
              Trời, vì thế mới có các khái niệm như &quot;Thiên mệnh&quot; hay &quot;mệnh trời&quot;. Người xưa kính Trời, tin mệnh,
              nên cho rằng &quot;sinh tử hữu mệnh, phú quý tại Thiên&quot; – sống chết do mệnh, giàu sang do Trời; hay &quot;đắc chi
              ngã hạnh, thất chi ngã mệnh&quot; – được là may, mất là mệnh.
            </p>
            <p>
              Vũ trụ vận hành theo những quy luật riêng, người xưa gọi là Luật, là Pháp, là Đạo. Nếu nhìn dưới lăng kính hiện
              đại, từ những thiên hà, hệ Mặt Trời, hố đen cho đến các vì sao, tất cả đều vận động theo quỹ đạo có thể tiên đoán.
              Ở cấp độ vi mô, phân tử, nguyên tử, proton, electron cũng vận hành theo những nguyên tắc có thể tính toán. Con
              người, dù nhỏ bé trong vũ trụ bao la, hẳn cũng không nằm ngoài khả năng tri nhận ấy. Ngày nay, với đầy đủ dữ
              liệu về một cá nhân, các hệ thống tính toán phức tạp hoàn toàn có thể dự đoán hành vi tiếp theo của người đó.
              Điều đó chứng tỏ sự tồn tại của &quot;mệnh&quot; và tính khả tri của nó.
            </p>
            <p>
              Cũng bởi vậy, văn hóa truyền thống luôn coi trọng việc thấu hiểu vận mệnh – gọi là &quot;tri mệnh&quot; (biết mệnh
              trời). Luận Ngữ khẳng định: &quot;Bất tri mệnh, vô dĩ vi quân tử dã&quot; – không biết mệnh thì không thể làm bậc
              quân tử. Hiểu mệnh không phải để cam chịu, mà để sống thuận theo lẽ trời, an nhiên trước biến đổi. Đó cũng là cốt
              cách của người quân tử xưa.
            </p>
          </div>
        </div>

        {/* 6 Hub */}
        <div className="mt-8">
          <h2 className="font-display text-xl text-parchment mb-4 text-center">6 Hub tri thức của TriMenh</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {HUBS.map((h) => {
              const Icon = HUB_ICONS[h.icon] || Layers;
              return (
                <Link key={h.slug} href={`/${h.slug}`} className="mystic-card p-4 hover:border-gold/40 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-ink-soft border border-ink-line flex items-center justify-center mb-2">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <p className="text-gold-soft font-medium text-sm mb-1">{h.name}</p>
                  <p className="text-xs text-moon/70">{h.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Cong cu pho bien */}
        <div className="mt-10">
          <h2 className="font-display text-xl text-parchment mb-4 text-center">Công cụ miễn phí tại TriMenh</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {popularTools.map((t) => (
              <Link key={t.href} href={t.href} className="flex items-start gap-2.5 bg-ink-soft border border-ink-line rounded-lg px-4 py-3 text-sm text-parchment/85 hover:border-gold/40 transition-colors">
                <Sparkle size={14} className="text-gold mt-0.5 flex-shrink-0" />
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
