import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LeadSchema = z.object({
  email: z.string().trim().email().max(255),
  name: z.string().trim().max(120).optional().default(""),
  source: z.enum(["guide", "score"]).default("guide"),
  score: z.number().int().min(0).max(100).optional(),
});

export const saveLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      await supabaseAdmin.from("leads").insert({
        email: data.email,
        name: data.name || null,
        source: data.source,
        score: data.score ?? null,
      });
    } catch (err) {
      console.error("[saveLead] db insert failed", err);
    }

    try {
      const modulePath = "@/lib/email-templates/send-email";
      const mod: any = await import(/* @vite-ignore */ modulePath).catch(
        () => null,
      );
      if (mod?.sendTemplateEmail) {
        await mod.sendTemplateEmail("booking-request", "info@downpaymentpro.ca", {
          templateData: {
            name: data.name || "New lead",
            email: data.email,
            message:
              data.source === "score"
                ? `Readiness score: ${data.score ?? "n/a"}/100`
                : "Downloaded the free Ontario first-home guide.",
          },
          replyTo: data.email,
        });
      }
    } catch (err) {
      console.error("[saveLead] email send failed", err);
    }

    return { ok: true };
  });
