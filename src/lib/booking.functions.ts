import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";

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
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      await supabaseAdmin.from("bookings").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        best_time: data.bestTime || null,
        message: data.message || null,
      });
    } catch (err) {
      console.error("[sendBookingEmail] db insert failed", err);
    }

    try {
      const result = await sendTemplateEmail("booking-request", "", {
        templateData: data,
        replyTo: data.email,
      });
      if (result.sent === false) {
        console.warn("[sendBookingEmail] not sent:", result.reason);
      }
    } catch (err) {
      console.error("[sendBookingEmail] email send failed", err);
    }

    return { ok: true };
  });
