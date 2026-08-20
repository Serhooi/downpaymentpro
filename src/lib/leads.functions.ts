import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";

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
      await sendTemplateEmail("guide-request", "", {
        templateData: {
          name: data.name || "New lead",
          email: data.email,
          message:
            data.source === "score"
              ? `Readiness score: ${data.score ?? "n/a"}/100`
              : "Requested the free Ontario first-home guide.",
        },
        replyTo: data.email,
      });

      if (data.source === "guide") {
        await sendTemplateEmail("guide-delivery", data.email, {
          templateData: { name: data.name || "there" },
        });
      }
    } catch (err) {
      console.error("[saveLead] email send failed", err);
    }

    return { ok: true };
  });
