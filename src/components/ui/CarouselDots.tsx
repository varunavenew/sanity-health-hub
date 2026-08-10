/**
 * CarouselDots — felles prikke-indikator for de få stedene prikker gir mening.
 *
 * Regel: aldri mer enn 5–6 synlige prikker. Ved flere enn det komprimeres
 * raden (à la iOS): et vindu på maks 5 prikker rundt aktiv indeks, og de
 * ytterste prikkene i vinduet vises mindre for å indikere at det er flere.
 *
 * Foretrukket navigasjon er `ScrollArrows` (fremdriftslinje + teller + piler).
 * Bruk denne kun der prikker allerede er en del av designet.
 */
interface CarouselDotsProps {
  count: number;
  active: number;
  onSelect?: (index: number) => void;
  className?: string;
  /** Lys variant for bruk over mørke bilder. */
  tone?: "dark" | "light";
  labelFor?: (index: number) => string;
}

const MAX_VISIBLE = 5;

export const CarouselDots = ({
  count,
  active,
  onSelect,
  className = "",
  tone = "dark",
  labelFor,
}: CarouselDotsProps) => {
  if (count <= 1) return null;

  // Vindu på maks 5 prikker rundt aktiv indeks
  let start = 0;
  if (count > MAX_VISIBLE) {
    start = Math.min(
      Math.max(0, active - Math.floor(MAX_VISIBLE / 2)),
      count - MAX_VISIBLE,
    );
  }
  const end = Math.min(count, start + MAX_VISIBLE);
  const visible = Array.from({ length: end - start }, (_, i) => start + i);

  const baseColor = tone === "light" ? "bg-white" : "bg-brand-dark";
  const mutedColor = tone === "light" ? "bg-white/40" : "bg-brand-dark/25";

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {visible.map((i) => {
        const isActive = i === active;
        // De ytterste prikkene krymper når det finnes flere utenfor vinduet
        const edgeLeft = i === start && start > 0;
        const edgeRight = i === end - 1 && end < count;
        const size = isActive
          ? "w-2 h-2"
          : edgeLeft || edgeRight
          ? "w-1 h-1"
          : "w-1.5 h-1.5";

        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect?.(i)}
            aria-label={labelFor ? labelFor(i) : `Gå til ${i + 1} av ${count}`}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-full transition-all ${size} ${
              isActive ? baseColor : mutedColor
            } ${onSelect ? "cursor-pointer" : "cursor-default"}`}
          />
        );
      })}
    </div>
  );
};
