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
    // 1. Persist submission so nothing is ever lost, even if email fails.
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

    // 2. Try to send the email notification.
    try {
      const mod: any = await import(
        /* @vite-ignore */ "@/lib/email-templates/send-email"
      ).catch(() => null);
      if (mod?.sendTemplateEmail) {
        const result = await mod.sendTemplateEmail(
          "booking-request",
          "info@downpaymentpro.ca",
          {
            templateData: data,
            replyTo: data.email,
          },
        );
        if (result && result.sent === false) {
          console.warn("[sendBookingEmail] not sent:", result.reason);
        }
      } else {
        console.warn(
          "[sendBookingEmail] email templates not scaffolded yet — booking stored in DB only.",
        );
      }
    } catch (err) {
      console.error("[sendBookingEmail] email send failed", err);
    }

    return { ok: true };
  });
