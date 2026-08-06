/**
 * Server-side diagnostics for Contact form email delivery.
 * Logging only — no business logic.
 */
import "server-only";

import type { ResolvedClinic } from "@/lib/email/contact-settings";
import type { SendContactEmailInput, SmtpConfig } from "@/lib/email/smtp";

const EXPECTED_SMTP = {
  host: "mail-eu.smtp2go.com",
  port: 465,
  secure: true,
} as const;

type NodemailerLikeError = Error & {
  code?: string;
  responseCode?: number;
  command?: string;
  response?: string;
};

export function maskEmail(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const at = value.indexOf("@");
  if (at <= 0) return "***";
  const local = value.slice(0, at);
  const domain = value.slice(at);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***${domain}`;
}

export function serializeError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    const e = err as NodemailerLikeError;
    return {
      name: e.name,
      message: e.message,
      code: e.code,
      responseCode: e.responseCode,
      command: e.command,
      response: e.response,
      stack: e.stack,
    };
  }
  return { value: String(err) };
}

function smtpConfigDiagnostics(config: SmtpConfig | null) {
  if (!config) {
    return { configured: false };
  }

  return {
    configured: true,
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: maskEmail(config.user),
    matchesExpected: {
      host: config.host === EXPECTED_SMTP.host,
      port: config.port === EXPECTED_SMTP.port,
      secure: config.secure === EXPECTED_SMTP.secure,
    },
    expected: EXPECTED_SMTP,
  };
}

export function logSanityQueryFailure(operation: string, err: unknown): void {
  console.error(`[contact] Sanity query failed: ${operation}`, {
    operation,
    error: serializeError(err),
  });
}

export type ContactSendLogContext = {
  phase: "clinic_email" | "confirmation_email";
  smtpConfig: SmtpConfig | null;
  fromEmail?: string;
  fromName?: string;
  to?: string;
  replyTo?: string;
  clinic?: ResolvedClinic | null;
  mail?: Pick<SendContactEmailInput, "subject" | "html" | "text">;
};

function mailDiagnostics(
  mail?: Pick<SendContactEmailInput, "subject" | "html" | "text">,
) {
  if (!mail) {
    return {
      subject: undefined,
      hasHtml: false,
      hasText: false,
      htmlLength: 0,
      textLength: 0,
    };
  }

  return {
    subject: mail.subject,
    hasHtml: Boolean(mail.html?.trim()),
    hasText: Boolean(mail.text?.trim()),
    htmlLength: mail.html?.length ?? 0,
    textLength: mail.text?.length ?? 0,
  };
}

export function logContactSendAttempt(ctx: ContactSendLogContext): void {
  const from =
    ctx.fromName && ctx.fromEmail
      ? `"${ctx.fromName.replace(/"/g, "")}" <${ctx.fromEmail}>`
      : ctx.fromEmail;

  console.info("[contact] Sending email", {
    phase: ctx.phase,
    smtp: smtpConfigDiagnostics(ctx.smtpConfig),
    from,
    fromEmail: ctx.fromEmail,
    fromEmailExpected: "hi@cmedical.no",
    fromEmailMatchesExpected: ctx.fromEmail === "hi@cmedical.no",
    to: ctx.to,
    replyTo: ctx.replyTo,
    clinic: ctx.clinic
      ? {
          id: ctx.clinic._id,
          label: ctx.clinic.label,
          email: ctx.clinic.email || null,
        }
      : null,
    mail: mailDiagnostics(ctx.mail),
  });
}

export function logContactSendFailure(ctx: ContactSendLogContext, err: unknown): void {
  const serialized = serializeError(err);
  const smtpAuthHints = [
    "EAUTH",
    "535",
    "Authentication failed",
    "Invalid login",
    "Sender rejected",
    "From address rejected",
    "TLS",
  ];
  const haystack = [
    serialized.message,
    serialized.code,
    serialized.response,
  ]
    .filter((v): v is string => typeof v === "string")
    .join(" ");

  const looksLikeSmtpAuth = smtpAuthHints.some((hint) =>
    haystack.toLowerCase().includes(hint.toLowerCase()),
  );

  console.error(`[contact] Failed to send email (${ctx.phase})`, {
    phase: ctx.phase,
    smtp: smtpConfigDiagnostics(ctx.smtpConfig),
    fromEmail: ctx.fromEmail,
    fromEmailExpected: "hi@cmedical.no",
    fromEmailMatchesExpected: ctx.fromEmail === "hi@cmedical.no",
    to: ctx.to,
    replyTo: ctx.replyTo,
    clinic: ctx.clinic
      ? {
          id: ctx.clinic._id,
          label: ctx.clinic.label,
          email: ctx.clinic.email || null,
        }
      : null,
    mail: mailDiagnostics(ctx.mail),
    nodemailer: serialized,
    smtpAuthFailureSuspected: looksLikeSmtpAuth,
    smtpResponse:
      typeof serialized.response === "string" ? serialized.response : undefined,
  });
}
