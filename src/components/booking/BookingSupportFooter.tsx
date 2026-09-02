import {
  bookingSupportPhoneDisplay,
  bookingSupportTelHref,
  splitTemplateLink,
} from "@/lib/sanity/booking-page-copy";

interface BookingSupportFooterProps {
  text: string;
  phone: string;
}

/**
 * Centered “call us for help” block shown under every booking step,
 * matching the demo (under the time-slot grid, and on all other steps).
 */
export function BookingSupportFooter({ text, phone }: BookingSupportFooterProps) {
  const display = bookingSupportPhoneDisplay(phone);
  const href = bookingSupportTelHref(phone);
  const hasToken = text.includes("{{phone}}");
  const [before, after] = splitTemplateLink(text, "{{phone}}");

  return (
    <p className="mt-10 mx-auto max-w-md text-center text-sm font-light leading-relaxed text-brand-dark/55 whitespace-pre-line">
      {hasToken ? (
        <>
          {before}
          <a
            href={href}
            data-phone-location="booking_flow"
            className="whitespace-nowrap text-brand-dark underline underline-offset-4 hover:text-brand-dark/70"
          >
            {display}
          </a>
          {after}
        </>
      ) : (
        <>
          {text}{" "}
          <a
            href={href}
            data-phone-location="booking_flow"
            className="whitespace-nowrap text-brand-dark underline underline-offset-4 hover:text-brand-dark/70"
          >
            {display}
          </a>
        </>
      )}
    </p>
  );
}
