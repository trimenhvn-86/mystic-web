/** Gửi email qua SMTP2GO (HTTP API). Cần biến SMTP2GO_API_KEY và SMTP2GO_SENDER. */
export const mailerConfigured = () => !!process.env.SMTP2GO_API_KEY;
const sender = () => process.env.SMTP2GO_SENDER || 'TriMenh <lich@trimenh.com>';

export async function sendMail({ to, subject, html, text, unsubscribeUrl }) {
  const body = {
    sender: sender(),
    to: [to],
    subject,
    html_body: html,
    text_body: text
  };
  if (unsubscribeUrl) {
    body.custom_headers = [
      { header: 'List-Unsubscribe', value: `<${unsubscribeUrl}>` },
      { header: 'List-Unsubscribe-Post', value: 'List-Unsubscribe=One-Click' }
    ];
  }
  const res = await fetch((process.env.SMTP2GO_API_URL || 'https://api.smtp2go.com/v3/email/send'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Smtp2go-Api-Key': process.env.SMTP2GO_API_KEY },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || (data.data && data.data.error)) {
    throw new Error((data.data && (data.data.error || data.data.error_code)) || `SMTP2GO lỗi ${res.status}`);
  }
  return true;
}
