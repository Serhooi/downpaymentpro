import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const OWNER_EMAIL = process.env.RESEND_TO_EMAIL || "Downpaymentpro@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const SITE_URL = process.env.VITE_SITE_URL || "https://www.downpaymentpro.ca";

function ownerBookingHtml(data: Record<string, any>) {
  return `
    <div style="font-family:sans-serif;max-width:560px">
      <h2 style="color:#1a3a6b">New Session Booking 🏠</h2>
      <table style="font-size:15px;border-collapse:collapse;width:100%">
        <tr style="background:#f5f7fa"><td style="padding:8px 12px;font-weight:bold;width:140px">Name</td><td style="padding:8px 12px">${data.name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold">Email</td><td style="padding:8px 12px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.phone ? `<tr style="background:#f5f7fa"><td style="padding:8px 12px;font-weight:bold">Phone</td><td style="padding:8px 12px">${data.phone}</td></tr>` : ""}
        ${data.bestTime ? `<tr><td style="padding:8px 12px;font-weight:bold">Best time</td><td style="padding:8px 12px">${data.bestTime}</td></tr>` : ""}
        ${data.message ? `<tr style="background:#f5f7fa"><td style="padding:8px 12px;font-weight:bold;vertical-align:top">Message</td><td style="padding:8px 12px">${data.message}</td></tr>` : ""}
      </table>
    </div>
  `;
}

function userBookingConfirmationHtml(data: Record<string, any>) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#1a3a6b">Thanks for reaching out, ${data.name}!</h2>
      <p style="font-size:15px;color:#444">
        We've received your request for a <strong>free strategy session</strong> and will be in touch shortly.
      </p>
      <p style="font-size:15px;color:#444">Here's what you submitted:</p>
      <table style="font-size:14px;border-collapse:collapse;width:100%;background:#f5f7fa;border-radius:8px">
        ${data.phone ? `<tr><td style="padding:8px 12px;font-weight:bold;width:130px">Phone</td><td style="padding:8px 12px">${data.phone}</td></tr>` : ""}
        ${data.bestTime ? `<tr><td style="padding:8px 12px;font-weight:bold">Best time</td><td style="padding:8px 12px">${data.bestTime}</td></tr>` : ""}
        ${data.message ? `<tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top">Your message</td><td style="padding:8px 12px">${data.message}</td></tr>` : ""}
      </table>
      <p style="font-size:15px;color:#444;margin-top:20px">
        In the meantime, feel free to reach us directly:<br>
        📞 Serice Lee — (416) 786-1774<br>
        📞 Eric Lai — 416-725-8123
      </p>
      <p style="font-size:14px;color:#999;margin-top:24px">— The Downpayment Pro Team</p>
    </div>
  `;
}

function ownerLeadHtml(data: Record<string, any>) {
  return `
    <div style="font-family:sans-serif;max-width:560px">
      <h2 style="color:#1a3a6b">New Guide Request 📄</h2>
      <table style="font-size:15px;border-collapse:collapse;width:100%">
        <tr style="background:#f5f7fa"><td style="padding:8px 12px;font-weight:bold;width:140px">Name</td><td style="padding:8px 12px">${data.name || "—"}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold">Email</td><td style="padding:8px 12px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.message ? `<tr style="background:#f5f7fa"><td style="padding:8px 12px;font-weight:bold">Note</td><td style="padding:8px 12px">${data.message}</td></tr>` : ""}
      </table>
    </div>
  `;
}

function guideDeliveryHtml(data: Record<string, any>) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#1a3a6b">Your free guide is ready, ${data.name || "there"}! 🏠</h2>
      <p style="font-size:15px;color:#444">
        Thanks for your interest in the <strong>Fast Track Program</strong>.<br>
        Click below to download the guide — it breaks down FHSA, RRSP Home Buyers' Plan, and the 7-pillar savings framework.
      </p>
      <div style="text-align:center;margin:32px 0">
        <a href="${SITE_URL}/fast-track-guide.pdf"
           style="background:#1a3a6b;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:bold;display:inline-block">
          Download Your Free Guide (PDF)
        </a>
      </div>
      <p style="font-size:15px;color:#444">
        Want a personalized plan? Book your free strategy session:<br>
        📞 Serice Lee — (416) 786-1774<br>
        📞 Eric Lai — 416-725-8123
      </p>
      <p style="font-size:14px;color:#999;margin-top:24px">— The Downpayment Pro Team</p>
    </div>
  `;
}

async function send(to: string, subject: string, html: string, replyTo?: string) {
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

  if (template === "booking-request") {
    // 1. Notify owner
    await send(OWNER_EMAIL, `New session booking from ${templateData.name}`, ownerBookingHtml(templateData), templateData.email);
    // 2. Confirm to user
    await send(templateData.email, "We received your booking — Downpayment Pro", userBookingConfirmationHtml(templateData));
    return { sent: true };
  }

  if (template === "guide-request") {
    await send(OWNER_EMAIL, `New guide request from ${templateData.email}`, ownerLeadHtml(templateData), templateData.email);
    return { sent: true };
  }

  if (template === "guide-delivery") {
    // 1. Notify owner
    await send(OWNER_EMAIL, `New guide request from ${templateData.email}`, ownerLeadHtml(templateData));
    // 2. Send guide to user
    await send(to, "Your free Ontario first-home guide — Downpayment Pro", guideDeliveryHtml(templateData), OWNER_EMAIL);
    return { sent: true };
  }

  return { sent: false, reason: `Unknown template: ${template}` };
}
