import type { ReviewSource } from "@/data/googleReviews";

type MarkProps = {
  className?: string;
};

/** Official-style Google "G" mark used in review badges. */
export function GoogleReviewMark({ className = "w-4 h-4" }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        fill="#FFC107"
      />
      <path
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        fill="#FF3D00"
      />
      <path
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        fill="#4CAF50"
      />
      <path
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        fill="#1976D2"
      />
    </svg>
  );
}

/**
 * Legelisten mark matching avenewdemo: teal circle + white person silhouette.
 */
export function LegelistenReviewMark({ className = "w-4 h-4" }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        fill="#0A7E8C"
      />
      <path
        d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.7 0-5.8 1.29-6 2h12c-.2-.71-3.3-2-6-2z"
        fill="white"
      />
      <path
        d="M12 13c-2 0-6 1-6 3v1h12v-1c0-2-4-3-6-3z"
        fill="white"
      />
    </svg>
  );
}

export function ReviewSourceBadge({
  source = "google",
  className = "flex items-center gap-1.5 text-xs text-brand-dark/50",
}: {
  source?: ReviewSource | string | null;
  className?: string;
}) {
  const resolved = normalizeReviewSource(source);
  const isLegelisten = resolved === "legelisten";
  return (
    <div className={className}>
      {isLegelisten ? (
        <LegelistenReviewMark className="w-4 h-4 shrink-0" />
      ) : (
        <GoogleReviewMark className="w-4 h-4 shrink-0" />
      )}
      <span>{isLegelisten ? "Legelisten" : "Google"}</span>
    </div>
  );
}

export function normalizeReviewSource(value: unknown): ReviewSource {
  return value === "legelisten" ? "legelisten" : "google";
}
