import { NextResponse } from "next/server";
import { z } from "zod";

import {
  fetchContactEmailSettings,
  resolveClinicForContact,
  type ResolvedClinic,
} from "@/lib/email/contact-settings";
import {
  logContactSendAttempt,
  logContactSendFailure,
  logSanityQueryFailure,
} from "@/lib/email/contact-diagnostics";
import {
  buildClinicEmailContent,
  buildConfirmationEmailContent,
} from "@/lib/email/contact-template";
import { checkContactRateLimit } from "@/lib/email/rate-limit";
import { getSmtpConfig, sendContactEmail } from "@/lib/email/smtp";
import { siteUrl } from "@/lib/env";

export const runtime = "nodejs";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(4).max(30),
  clinic: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(120),
  timing: z.enum(["snarest", "specific"]),
  day: z.string().trim().max(50).optional().default(""),
  details: z.string().trim().max(1000).optional().default(""),
});

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return `contact-request:${ip}`;
}

function formatTiming(timing: "snarest" | "specific", day: string): string {
  if (timing === "snarest") return "As soon as possible";
  return day ? `Preferred day: ${day}` : "Preferred day (not specified)";
}

export async function POST(request: Request) {
  const smtpConfig = getSmtpConfig();
  const limit = checkContactRateLimit(clientKey(request));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: limit.retryAfterSec
          ? { "Retry-After": String(limit.retryAfterSec) }
          : undefined,
      },
    );
  }

  if (!smtpConfig) {
    console.error("[contact-request] SMTP environment variables are not configured");
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const data = parsed.data;
  let clinic: ResolvedClinic | null = null;
  let to: string | undefined;
  let fromEmail: string | undefined;
  let fromName: string | undefined;

  try {
    let settings;
    try {
      settings = await fetchContactEmailSettings();
    } catch (err) {
      logSanityQueryFailure("fetchContactEmailSettings", err);
      throw err;
    }

    if (!settings.enableContactEmails) {
      return NextResponse.json({ ok: false, error: "disabled" }, { status: 503 });
    }

    try {
      clinic = await resolveClinicForContact(data.clinic);
    } catch (err) {
      logSanityQueryFailure("resolveClinicForContact", err);
      throw err;
    }

    if (!clinic) {
      return NextResponse.json({ ok: false, error: "clinic_not_found" }, { status: 400 });
    }

    to = clinic.email || settings.fallbackEmail;
    if (!to) {
      console.error("[contact-request] No clinic email and no fallback email configured", {
        clinicId: clinic._id,
      });
      return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
    }

    const smtpUser = process.env.SMTP_USER?.trim() || "";
    fromEmail = settings.senderEmail || smtpUser;
    fromName = settings.senderName;

    if (!fromEmail) {
      console.error("[contact-request] No sender email configured");
      return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
    }

    const submittedAt = new Date();
    const timing = formatTiming(data.timing, data.day);
    const message = [
      `Callback request`,
      `Specialty: ${data.category}`,
      `When: ${timing}`,
      "",
      data.details || "No additional details.",
    ].join("\n");

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      clinicLabel: clinic.label,
      subject: `Callback request — ${data.category}`,
      message,
      submittedAt,
      senderName: settings.senderName,
      website: siteUrl(),
    };

    const clinicContent = buildClinicEmailContent(payload, {
      subject: settings.clinicEmailTemplate.subject,
      body: settings.clinicEmailTemplate.body,
      legacySubject: settings.contactFormSubject,
    });

    const clinicMail = {
      to,
      fromName: settings.senderName,
      fromEmail,
      replyTo: data.email,
      subject: clinicContent.subject,
      html: clinicContent.html,
      text: clinicContent.text,
    };

    logContactSendAttempt({
      phase: "clinic_email",
      smtpConfig,
      fromEmail,
      fromName,
      to,
      replyTo: clinicMail.replyTo,
      clinic,
      mail: clinicContent,
    });

    await sendContactEmail(clinicMail);

    const confirmation = buildConfirmationEmailContent(payload, {
      enabled: true,
      subject: settings.confirmationEmail.subject,
      body: settings.confirmationEmail.body,
    });

    if (confirmation) {
      const confirmationMail = {
        to: data.email,
        fromName: settings.senderName,
        fromEmail,
        replyTo: to,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      };

      try {
        logContactSendAttempt({
          phase: "confirmation_email",
          smtpConfig,
          fromEmail,
          fromName,
          to: confirmationMail.to,
          replyTo: confirmationMail.replyTo,
          clinic,
          mail: confirmation,
        });

        await sendContactEmail(confirmationMail);
      } catch (confirmErr) {
        logContactSendFailure(
          {
            phase: "confirmation_email",
            smtpConfig,
            fromEmail,
            fromName,
            to: confirmationMail.to,
            replyTo: confirmationMail.replyTo,
            clinic,
            mail: confirmation,
          },
          confirmErr,
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    logContactSendFailure(
      {
        phase: "clinic_email",
        smtpConfig,
        fromEmail,
        fromName,
        to,
        replyTo: data.email,
        clinic,
      },
      err,
    );
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
