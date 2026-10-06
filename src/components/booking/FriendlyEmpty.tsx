import { getIcon } from "@/lib/icons";
import { isBookingIconNone } from "@/lib/sanity/booking-empty-icon";
import { bookingSupportTelHref } from "@/lib/sanity/booking-page-copy";

interface FriendlyEmptyProps {
  title?: string;
  message: string;
  phone?: string;
  phoneLabel?: string;
  /** Registry key from Sanity (`emptyStateIconKey`). Use `none` to hide. */
  iconKey?: string | null;
  /** Optional uploaded icon from Sanity; wins over `iconKey`. */
  iconUrl?: string | null;
  /** Icon on the call button (`emptyStateCallButtonIconKey`). Use `none` to hide. */
  callButtonIconKey?: string | null;
  /** Optional second CTA (e.g. book another service). */
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
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
  iconKey,
  iconUrl,
  callButtonIconKey,
  secondaryLabel,
  onSecondaryClick,
}: FriendlyEmptyProps) => {
  const telHref = bookingSupportTelHref(phone);
  const trimmedIconUrl = iconUrl?.trim();
  const topIconKey = isBookingIconNone(iconKey)
    ? null
    : iconKey?.trim() || "heart-handshake";
  const showTopIcon = Boolean(trimmedIconUrl) || topIconKey != null;
  const TopIcon = topIconKey ? getIcon(topIconKey) : null;

  const showCallButtonIcon = !isBookingIconNone(callButtonIconKey);
  const callKey = callButtonIconKey?.trim() || "phone";
  const CallButtonIcon = showCallButtonIcon ? getIcon(callKey) : null;

  return (
    <div className="p-6 bg-white rounded-lg text-center space-y-4">
      {showTopIcon ? (
        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mx-auto overflow-hidden">
          {trimmedIconUrl ? (
            <img
              src={trimmedIconUrl}
              alt=""
              className="h-6 w-6 object-contain"
              aria-hidden="true"
            />
          ) : TopIcon ? (
            <TopIcon className="w-5 h-5 text-foreground" aria-hidden="true" />
          ) : null}
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="text-base font-normal text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground font-light">{message}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        <a
          href={telHref}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-full text-sm hover:bg-foreground/90 transition-colors"
        >
          {CallButtonIcon ? (
            <CallButtonIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
          ) : null}
          <span>
            {phoneLabel} · {phone}
          </span>
        </a>
        {secondaryLabel && onSecondaryClick ? (
          <button
            type="button"
            onClick={onSecondaryClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-foreground/20 bg-background text-foreground rounded-full text-sm hover:bg-muted/40 transition-colors"
          >
            {secondaryLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
};
