/** True when the hash target is sitting just below the sticky header. */
function isHashTargetInView(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.top <= 180 && rect.bottom > 64;
}

/**
 * Scroll to `window.location.hash` once the target exists in the DOM.
 * Keeps re-applying briefly so Next.js route scroll-to-top cannot win the race.
 */
export function scrollToHashId(
  hash = typeof window !== "undefined" ? window.location.hash : "",
  options?: { behavior?: ScrollBehavior; attempts?: number; intervalMs?: number },
): () => void {
  const id = hash.replace(/^#/, "").trim();
  if (!id || typeof window === "undefined") return () => {};

  const behavior = options?.behavior ?? "instant";
  const attempts = options?.attempts ?? 60;
  const intervalMs = options?.intervalMs ?? 50;
  let cancelled = false;
  let remaining = attempts;
  let holdAfterFind = 24;
  let found = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const tick = () => {
    if (cancelled) return;
    const el = document.getElementById(id);
    if (el) {
      if (!isHashTargetInView(el)) {
        el.scrollIntoView({ behavior: found ? "instant" : behavior, block: "start" });
      }
      found = true;
      holdAfterFind -= 1;
      if (holdAfterFind <= 0) return;
    } else {
      remaining -= 1;
      if (remaining <= 0) return;
    }
    timer = setTimeout(tick, intervalMs);
  };

  tick();
  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
  };
}
