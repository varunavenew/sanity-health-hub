import { NextResponse } from "next/server";

import { z } from "zod";

import {

  fetchContactEmailSettings,

  resolveClinicForContact,

} from "@/lib/email/contact-settings";

import {

  buildClinicEmailContent,

  buildConfirmationEmailContent,

} from "@/lib/email/contact-template";

import { checkContactRateLimit } from "@/lib/email/rate-limit";

import { getSmtpConfig, sendContactEmail } from "@/lib/email/smtp";

import { siteUrl } from "@/lib/env";



export const runtime = "nodejs";



const contactBodySchema = z.object({

  name: z.string().trim().min(1).max(100),

  email: z.string().trim().email().max(200),

  phone: z.string().trim().max(40).optional().default(""),

  clinic: z.string().trim().min(1).max(120),

  subject: z.string().trim().min(1).max(200),

  message: z.string().trim().min(1).max(5000),

});



function clientKey(request: Request): string {

  const forwarded = request.headers.get("x-forwarded-for");

  const ip =

    forwarded?.split(",")[0]?.trim() ||

    request.headers.get("x-real-ip")?.trim() ||

    "unknown";

  return `contact:${ip}`;

}



export async function POST(request: Request) {

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



  if (!getSmtpConfig()) {

    console.error("[contact] SMTP environment variables are not configured");

    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  }



  let json: unknown;

  try {

    json = await request.json();

  } catch {

    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });

  }



  const parsed = contactBodySchema.safeParse(json);

  if (!parsed.success) {

    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });

  }



  const data = parsed.data;



  try {

    const settings = await fetchContactEmailSettings();

    if (!settings.enableContactEmails) {

      return NextResponse.json({ ok: false, error: "disabled" }, { status: 503 });

    }



    const clinic = await resolveClinicForContact(data.clinic);

    if (!clinic) {

      return NextResponse.json({ ok: false, error: "clinic_not_found" }, { status: 400 });

    }



    const to = clinic.email || settings.fallbackEmail;

    if (!to) {

      console.error("[contact] No clinic email and no fallback email configured", {

        clinicId: clinic._id,

      });

      return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

    }



    const smtpUser = process.env.SMTP_USER?.trim() || "";

    const fromEmail = settings.senderEmail || smtpUser;

    if (!fromEmail) {

      console.error("[contact] No sender email configured");

      return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

    }



    const submittedAt = new Date();

    const payload = {

      name: data.name,

      email: data.email,

      phone: data.phone,

      clinicLabel: clinic.label,

      subject: data.subject,

      message: data.message,

      submittedAt,

      senderName: settings.senderName,

      website: siteUrl(),

    };



    const clinicContent = buildClinicEmailContent(payload, {

      subject: settings.clinicEmailTemplate.subject,

      body: settings.clinicEmailTemplate.body,

      legacySubject: settings.contactFormSubject,

    });



    await sendContactEmail({

      to,

      fromName: settings.senderName,

      fromEmail,

      replyTo: data.email,

      subject: clinicContent.subject,

      html: clinicContent.html,

      text: clinicContent.text,

    });



    const confirmation = buildConfirmationEmailContent(payload, settings.confirmationEmail);

    if (confirmation) {

      try {

        await sendContactEmail({

          to: data.email,

          fromName: settings.senderName,

          fromEmail,

          // Visitor replies should reach the clinic/fallback inbox, not loop to themselves.

          replyTo: to,

          subject: confirmation.subject,

          html: confirmation.html,

          text: confirmation.text,

        });

      } catch (confirmErr) {

        // Clinic mail already succeeded — do not fail the form submission.

        console.error("[contact] Confirmation email failed", confirmErr);

      }

    }



    return NextResponse.json({ ok: true });

  } catch (err) {

    console.error("[contact] Failed to send email", err);

    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });

  }

}


