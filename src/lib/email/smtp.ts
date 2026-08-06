/**
 * Contact form email — SMTP2GO via Nodemailer.
 * Credentials come only from environment variables.
 */
import "server-only";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
};

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const portRaw = process.env.SMTP_PORT?.trim() || "465";
  const secureRaw = process.env.SMTP_SECURE?.trim();

  if (!host || !user || !pass) return null;

  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0) return null;

  const secure =
    secureRaw === undefined || secureRaw === ""
      ? port === 465
      : secureRaw === "1" || secureRaw.toLowerCase() === "true";

  return { host, port, secure, user, pass };
}

let cachedTransporter: Transporter | null = null;

export function getMailTransporter(): Transporter {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured");
  }
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }
  return cachedTransporter;
}

export type SendContactEmailInput = {
  to: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendContactEmail(input: SendContactEmailInput): Promise<void> {
  const transporter = getMailTransporter();
  await transporter.sendMail({
    from: `"${input.fromName.replace(/"/g, "")}" <${input.fromEmail}>`,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}
