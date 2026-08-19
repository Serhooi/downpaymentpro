import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL =
  process.env.RESEND_TO_EMAIL || "marlon@downpayment.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

function bookingRequestHtml(data: Record<string, any>) {
  return `
    <h2 style="font-family:sans-serif">New Booking Request</h2>
    <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
      <tr><td style="padding:6px 12px;font-weight:bold">Name</td><td style="padding:6px 12px">${data.name}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px">${data.email}</td></tr>
      ${data.phone ? `<tr><td style="padding:6px 12px;font-weight:bold">Phone</td><td style="padding:6px 12px">${data.phone}</td></tr>` : ""}
      ${data.bestTime ? `<tr><td style="padding:6px 12px;font-weight:bold">Best time</td><td style="padding:6px 12px">${data.bestTime}</td></tr>` : ""}
      ${data.message ? `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Message</td><td style="padding:6px 12px">${data.message}</td></tr>` : ""}
    </table>
  `;
}

function guideDeliveryHtml(data: Record<string, any>) {
  const siteUrl = process.env.VITE_SITE_URL || "https://www.downpaymentpro.com";
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <p style="font-size:16px">Hi ${data.name},</p>
      <p style="font-size:15px;color:#444">
        Thanks for your interest in the <strong>Fast Track Program</strong>!
        Your free guide is ready — click the button below to download it.
      </p>
      <div style="text-align:center;margin:32px 0">
        <a href="${siteUrl}/fast-track-guide.pdf"
           style="background:#1a3a6b;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:bold;display:inline-block">
          Download Your Free Guide (PDF)
        </a>
      </div>
      <p style="font-size:14px;color:#666">
        Have questions? Reply to this email or contact us:<br>
        Serice Lee — (416) 786-1774<br>
        Eric Lai — 416-725-8123
      </p>
      <p style="font-size:14px;color:#999">— The Downpayment Pro Team</p>
    </div>
  `;
}

export async function sendTemplateEmail(
  template: string,
  to: string,
  options: {
    templateData: Record<string, any>;
    replyTo?: string;
    idempotencyKey?: string;
  },
) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY not set" };
  }

  const { templateData, replyTo } = options;

  let subject: string;
  let html: string;

  if (template === "booking-request") {
    subject = `New booking from ${templateData.name}`;
    html = bookingRequestHtml(templateData);
    to = TO_EMAIL;
  } else if (template === "guide-delivery") {
    subject = "Your free Ontario first-home guide";
    html = guideDeliveryHtml(templateData);
  } else {
    return { sent: false, reason: `Unknown template: ${template}` };
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    console.error("[send-email] Resend error:", error);
    return { sent: false, reason: error.message };
  }

  return { sent: true, id: data?.id };
}
