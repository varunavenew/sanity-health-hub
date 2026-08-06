/**
 * Server-side Sanity lookups for Contact form email delivery.
 */
import "server-only";

import { sanityClient } from "@/lib/sanityClient";

export type ContactEmailSettings = {
  enableContactEmails: boolean;
  senderName: string;
  senderEmail: string;
  fallbackEmail: string;
  /** Legacy clinic subject — used when clinicEmailTemplate.subject is empty. */
  contactFormSubject: string;
  clinicEmailTemplate: {
    subject: string;
    body: string;
  };
  confirmationEmail: {
    enabled: boolean;
    subject: string;
    body: string;
  };
};

export type ResolvedClinic = {
  _id: string;
  label: string;
  email: string;
};

type SiteSettingsRow = {
  email?: string | null;
  emailSettings?: {
    enableContactEmails?: boolean | null;
    senderName?: string | null;
    senderEmail?: string | null;
    fallbackEmail?: string | null;
    contactFormSubject?: string | null;
    clinicEmailTemplate?: {
      subject?: string | null;
      body?: string | null;
    } | null;
    confirmationEmail?: {
      enabled?: boolean | null;
      subject?: string | null;
      body?: string | null;
    } | null;
  } | null;
};

type ClinicRow = {
  _id: string;
  email?: string | null;
  label?: string | null;
};

function asEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function asText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function fetchContactEmailSettings(): Promise<ContactEmailSettings> {
  const row = await sanityClient.fetch<SiteSettingsRow | null>(
    `*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{
      email,
      emailSettings{
        enableContactEmails,
        senderName,
        senderEmail,
        fallbackEmail,
        contactFormSubject,
        clinicEmailTemplate{
          subject,
          body
        },
        confirmationEmail{
          enabled,
          subject,
          body
        }
      }
    }`,
  );

  const settings = row?.emailSettings;
  const generalEmail = asEmail(row?.email);
  const fallback = asEmail(settings?.fallbackEmail) || generalEmail;

  return {
    enableContactEmails: settings?.enableContactEmails !== false,
    senderName: (settings?.senderName || "CMedical").trim() || "CMedical",
    senderEmail: asEmail(settings?.senderEmail),
    fallbackEmail: fallback,
    contactFormSubject:
      (settings?.contactFormSubject || "New Contact Form Submission").trim() ||
      "New Contact Form Submission",
    clinicEmailTemplate: {
      subject: asText(settings?.clinicEmailTemplate?.subject),
      body: asText(settings?.clinicEmailTemplate?.body),
    },
    confirmationEmail: {
      enabled: settings?.confirmationEmail?.enabled === true,
      subject: asText(settings?.confirmationEmail?.subject),
      body: asText(settings?.confirmationEmail?.body),
    },
  };
}

/**
 * Resolve clinic by form value (clinic id/slug from the select, or document _id).
 */
export async function resolveClinicForContact(
  clinicKey: string,
): Promise<ResolvedClinic | null> {
  const key = clinicKey.trim();
  if (!key) return null;

  const row = await sanityClient.fetch<ClinicRow | null>(
    `*[
      _type == "clinicPage" &&
      !(_id in path("drafts.**")) &&
      (
        _id == $key ||
        slug.current == $key ||
        slug[language == "no"][0].value.current == $key ||
        slug[language == "en"][0].value.current == $key ||
        slug[0].value.current == $key
      )
    ][0]{
      _id,
      email,
      "label": coalesce(
        title[language == "no"][0].value,
        title[_key == "no"][0].value,
        title[0].value,
        title
      )
    }`,
    { key },
  );

  if (!row?._id) return null;

  return {
    _id: row._id,
    label: (row.label || key).trim(),
    email: asEmail(row.email),
  };
}
