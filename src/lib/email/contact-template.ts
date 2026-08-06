/**
 * Contact form email templates (clinic + optional visitor confirmation).
 * CMS bodies/subjects support {{placeholders}}; empty CMS values keep built-in defaults.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type ContactEmailPayload = {
  name: string;
  email: string;
  phone: string;
  clinicLabel: string;
  subject: string;
  message: string;
  submittedAt: Date;
  senderName: string;
  website: string;
};

export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

export type PlaceholderValues = {
  name: string;
  email: string;
  phone: string;
  clinic: string;
  subject: string;
  message: string;
  date: string;
  website: string;
  senderName: string;
};

const PLACEHOLDER_KEYS = [
  "name",
  "email",
  "phone",
  "clinic",
  "subject",
  "message",
  "date",
  "website",
  "senderName",
] as const;

const PLACEHOLDER_PATTERN = /\{\{\s*(name|email|phone|clinic|subject|message|date|website|senderName)\s*\}\}/gi;

export function formatContactDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("nb-NO", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Europe/Oslo",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export function buildPlaceholderValues(payload: ContactEmailPayload): PlaceholderValues {
  return {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "—",
    clinic: payload.clinicLabel,
    subject: payload.subject,
    message: payload.message,
    date: formatContactDate(payload.submittedAt),
    website: payload.website,
    senderName: payload.senderName,
  };
}

/**
 * Replace {{placeholders}} in a CMS template string.
 */
export function applyPlaceholders(template: string, values: PlaceholderValues): string {
  return template.replace(PLACEHOLDER_PATTERN, (_match, key: string) => {
    const normalized = key as (typeof PLACEHOLDER_KEYS)[number];
    return values[normalized] ?? "";
  });
}

function plainTextToHtml(text: string): string {
  return escapeHtml(text).replace(/\r\n|\r|\n/g, "<br>\n");
}

function wrapPlainEmailHtml(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4efe9;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:4px;overflow:hidden;border:1px solid #e8e0d8;">
          <tr>
            <td style="padding:28px;color:#2c241f;font-size:15px;line-height:1.55;">
              ${bodyHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function contentFromCmsTemplate(
  subjectTemplate: string,
  bodyTemplate: string,
  values: PlaceholderValues,
): EmailContent {
  const subject = applyPlaceholders(subjectTemplate, values).trim() || subjectTemplate.trim();
  const text = applyPlaceholders(bodyTemplate, values);
  const html = wrapPlainEmailHtml(subject, plainTextToHtml(text));
  return { subject, html, text };
}

/** Built-in clinic plain-text body (used when CMS body is empty). */
export function buildContactEmailText(payload: ContactEmailPayload): string {
  return [
    "New Contact Form Submission",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "—"}`,
    `Clinic: ${payload.clinicLabel}`,
    `Subject: ${payload.subject}`,
    "",
    "Message:",
    payload.message,
    "",
    `Submitted: ${formatContactDate(payload.submittedAt)}`,
  ].join("\n");
}

/** Built-in clinic HTML body (used when CMS body is empty). */
export function buildContactEmailHtml(payload: ContactEmailPayload): string {
  const rows: Array<[string, string]> = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Phone", payload.phone || "—"],
    ["Selected clinic", payload.clinicLabel],
    ["Subject", payload.subject],
    ["Submitted", formatContactDate(payload.submittedAt)],
  ];

  const detailRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e0d8;color:#6b5c52;font-size:13px;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e0d8;color:#2c241f;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background:#f4efe9;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:4px;overflow:hidden;border:1px solid #e8e0d8;">
          <tr>
            <td style="background:#41322a;padding:24px 28px;">
              <p style="margin:0;color:#ffffff;font-size:20px;letter-spacing:0.02em;">${escapeHtml(payload.senderName || "CMedical")}</p>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;font-family:Arial,Helvetica,sans-serif;">New Contact Form Submission</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 16px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${detailRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;">
              <p style="margin:0 0 8px;color:#6b5c52;font-size:13px;font-family:Arial,Helvetica,sans-serif;">Message</p>
              <div style="padding:16px;background:#f9f5f0;border-radius:4px;color:#2c241f;font-size:15px;line-height:1.55;white-space:pre-wrap;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(payload.message)}</div>
              <p style="margin:20px 0 0;color:#9a8b80;font-size:12px;font-family:Arial,Helvetica,sans-serif;">
                Reply to this email to respond directly to the visitor (${escapeHtml(payload.email)}).
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const DEFAULT_CLINIC_SUBJECT = "New Contact Form Submission";

const DEFAULT_CONFIRMATION_SUBJECT = "We received your message";

const DEFAULT_CONFIRMATION_BODY = `Hi {{name}},

Thank you for contacting {{senderName}}.

We have received your message regarding "{{subject}}" and will get back to you as soon as possible.

Selected clinic: {{clinic}}

{{senderName}}
{{website}}`;

export type ClinicTemplateInput = {
  /** CMS clinic template subject (optional). */
  subject?: string;
  /** CMS clinic template body (optional). */
  body?: string;
  /** Legacy siteSettings.emailSettings.contactFormSubject */
  legacySubject?: string;
};

export type ConfirmationTemplateInput = {
  enabled: boolean;
  subject?: string;
  body?: string;
};

export function buildClinicEmailContent(
  payload: ContactEmailPayload,
  template: ClinicTemplateInput = {},
): EmailContent {
  const values = buildPlaceholderValues(payload);
  const subjectTemplate =
    template.subject?.trim() ||
    template.legacySubject?.trim() ||
    DEFAULT_CLINIC_SUBJECT;
  const bodyTemplate = template.body?.trim();

  if (!bodyTemplate) {
    const subject = applyPlaceholders(subjectTemplate, values).trim() || DEFAULT_CLINIC_SUBJECT;
    return {
      subject,
      html: buildContactEmailHtml(payload),
      text: buildContactEmailText(payload),
    };
  }

  return contentFromCmsTemplate(subjectTemplate, bodyTemplate, values);
}

export function buildConfirmationEmailContent(
  payload: ContactEmailPayload,
  template: ConfirmationTemplateInput,
): EmailContent | null {
  if (!template.enabled) return null;

  const values = buildPlaceholderValues(payload);
  const subjectTemplate = template.subject?.trim() || DEFAULT_CONFIRMATION_SUBJECT;
  const bodyTemplate = template.body?.trim() || DEFAULT_CONFIRMATION_BODY;

  return contentFromCmsTemplate(subjectTemplate, bodyTemplate, values);
}
