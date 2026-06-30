import { Phone, HeartHandshake } from "lucide-react";

interface FriendlyEmptyProps {
  title?: string;
  message: string;
  phone?: string;
  phoneLabel?: string;
}

/**
 * Friendly empty/error state with a clear "call us" fallback.
 * Used inside the booking flow whenever a step has no data to show
 * (no clinics, no available slots, etc.) so users always have a way forward.
 */
export const FriendlyEmpty = ({
  title = "Vi finner ikke akkurat dette her",
  message,
  phone = "22 60 00 50",
  phoneLabel = "Ring oss så hjelper vi deg",
}: FriendlyEmptyProps) => {
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;
  return (
    <div className="p-6 bg-white rounded-lg text-center space-y-4">
      <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
        <HeartHandshake className="w-5 h-5 text-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-normal text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground font-light">{message}</p>
      </div>
      <a
        href={telHref}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-2xl text-sm hover:bg-foreground/90 transition-colors"
      >
        <Phone className="w-4 h-4" aria-hidden="true" />
        <span>{phoneLabel} · {phone}</span>
      </a>
    </div>
  );
};
