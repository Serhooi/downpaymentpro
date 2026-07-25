import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BookingSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(60).optional().default(""),
  bestTime: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
});

export const sendBookingEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BookingSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const { sendTemplateEmail } = await import(
        "@/lib/email-templates/send-email"
      );
      const result = await sendTemplateEmail(
        "booking-request",
        "info@downpaymentpro.ca",
        {
          templateData: data,
          replyTo: data.email,
          idempotencyKey: `booking-${data.email}-${Date.now()}`,
        },
      );
      if ("sent" in result && result.sent === false) {
        return { ok: false, error: "Email temporarily unavailable. Please call (416) 786-1774." };
      }
      return { ok: true };
    } catch (err) {
      console.error("[sendBookingEmail]", err);
      return {
        ok: false,
        error: "Could not send right now. Please call (416) 786-1774 or email info@downpaymentpro.ca.",
      };
    }
  });
