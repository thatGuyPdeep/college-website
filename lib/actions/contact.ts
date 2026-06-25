"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { RESEND_FROM } from "@/lib/email/resend-config";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { notifyStaff } from "@/lib/actions/staff-notifications";
import type { ActionResult } from "@/lib/supabase/types";
import { z } from "zod";

const enquirySchema = z.object({
  full_name: z.string().min(2),
  email:     z.string().email(),
  phone:     z.string().optional(),
  subject:   z.string().min(3),
  message:   z.string().min(10),
  website:   z.string().optional(),
  dpdp_consent: z.literal(true, { message: "You must accept the privacy consent to continue" }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adminClient = _adminClient as any;

async function clientIpFromHeaders(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
}

export async function submitContactEnquiry(data: unknown): Promise<ActionResult<void>> {
  try {
    const parsed = enquirySchema.parse(data);

    if (parsed.website) {
      return { ok: true, data: undefined };
    }

    const ip = await clientIpFromHeaders();
    const limited = await checkRateLimit(`contact:${ip}`, 5, 3_600_000);
    if (!limited.allowed) {
      return { ok: false, error: "Too many messages. Please try again in an hour." };
    }

    const { error } = await adminClient.from("contact_enquiries").insert({
      full_name: parsed.full_name,
      email:     parsed.email,
      phone:     parsed.phone ?? null,
      subject:   parsed.subject,
      message:   parsed.message,
      dpdp_consent_at: new Date().toISOString(),
    });

    if (error) throw error;

    await notifyStaff({
      type:        "contact_enquiry",
      title:       `New enquiry: ${parsed.subject}`,
      href:        "/admin/contact?status=new",
      target_role: "admissions_staff",
    });

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from:    RESEND_FROM,
        to:      "rkm.narainpur@gmail.com",
        replyTo: parsed.email,
        subject: `[Website Enquiry] ${parsed.subject}`,
        html: `
          <p><strong>From:</strong> ${parsed.full_name} (${parsed.email})</p>
          <p><strong>Phone:</strong> ${parsed.phone ?? "—"}</p>
          <p><strong>Subject:</strong> ${parsed.subject}</p>
          <hr/>
          <p>${parsed.message.replace(/\n/g, "<br/>")}</p>
        `,
      }).catch(() => {/* non-blocking */});
    }

    return { ok: true, data: undefined };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues[0]?.message ?? "Invalid form data" };
    }
    return { ok: false, error: err instanceof Error ? err.message : "Failed to send message" };
  }
}
