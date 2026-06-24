import { cn } from "@/lib/utils";

type BookingStepLoaderProps = {
  message: string;
  /** Skeleton layout: list rows (clinics/services) or grid tiles (specialists). */
  variant?: "list" | "grid";
  skeletonCount?: number;
  className?: string;
};

export function BookingStepLoader({
  message,
  variant = "list",
  skeletonCount,
  className,
}: BookingStepLoaderProps) {
  const count = skeletonCount ?? (variant === "grid" ? 6 : 3);

  return (
    <div
      className={cn("space-y-4", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-brand-dark/10 border-t-brand-dark animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-brand-dark/60 font-light text-center">{message}</p>
      </div>

      {variant === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-brand-beige/40 animate-pulse border border-brand-dark/5"
              style={{ animationDelay: `${i * 80}ms` }}
              aria-hidden="true"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="h-[72px] rounded-2xl bg-brand-beige/40 animate-pulse border border-brand-dark/5"
              style={{ animationDelay: `${i * 100}ms` }}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
    </div>
  );
}
