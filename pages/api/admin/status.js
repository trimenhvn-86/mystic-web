import { isAdmin, adminConfigured } from '../../../lib/adminAuth';
import { redisConfigured } from '../../../lib/redis';
import { mailerConfigured } from '../../../lib/mailer';

export default function handler(req, res) {
  res.status(200).json({
    loggedIn: isAdmin(req),
    adminConfigured: adminConfigured(),
    // Chỉ tiết lộ tình trạng cài đặt cho người đã đăng nhập
    ...(isAdmin(req) ? { redis: redisConfigured(), smtp: mailerConfigured(), sender: process.env.SMTP2GO_SENDER || 'chưa đặt (mặc định lich@trimenh.com)', autoSend: process.env.AUTO_SEND_EMAIL === 'true' } : {})
  });
}
