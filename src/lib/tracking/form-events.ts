import { track } from "@/lib/tracking";

export function trackCallbackRequest(input: { form_location?: string | null }) {
  track("callback_request", {
    form_location: input.form_location ?? "contact_page",
  });
}

export function trackContactMessage(input: { form_location?: string | null }) {
  track("contact_message", {
    form_location: input.form_location ?? "contact_page",
  });
}

export function trackFormStart(input: {
  form_name: string;
  form_location: string;
}) {
  track("form_start", {
    form_name: input.form_name,
    form_location: input.form_location,
  });
}

export function trackFormSubmit(input: {
  form_name: string;
  form_location: string;
}) {
  track("form_submit", {
    form_name: input.form_name,
    form_location: input.form_location,
  });
}

export function trackClickEmail(input: {
  link_location: string;
  email_type?: string | null;
}) {
  track("click_email", {
    link_location: input.link_location,
    email_type: input.email_type ?? null,
  });
}

export function trackSpecialistView(input: {
  specialist_name: string;
  specialty?: string | null;
  clinic?: string | null;
}) {
  track("specialist_view", {
    specialist_name: input.specialist_name,
    specialty: input.specialty ?? null,
    clinic: input.clinic ?? null,
  });
}

export function trackInsuranceProviderClick(input: { provider_name: string }) {
  track("insurance_provider_click", {
    provider_name: input.provider_name,
  });
}
