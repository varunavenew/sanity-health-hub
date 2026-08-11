import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Subtle parallax image: the image moves slower than the page while scrolling.
 * Respects prefers-reduced-motion (no transform at all).
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** How much slower the image moves. 0.2 = subtle, 0.35 = article hero. */
  speed?: number;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  /** object-position, e.g. "50% 30%" */
  objectPosition?: string;
  children?: React.ReactNode;
}

export const ParallaxImage = ({
  src,
  alt,
  speed = 0.18,
  className,
  imgClassName,
  loading = "lazy",
  objectPosition,
  children,
}: ParallaxImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setOffset(0);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      if (rect.bottom < -200 || rect.top > viewport + 200) return;
      // distance of element centre from viewport centre, normalised
      const delta = rect.top + rect.height / 2 - viewport / 2;
      setOffset(-delta * speed);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [speed, reduced]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={cn(
          "absolute inset-0 w-full h-full object-cover will-change-transform",
          imgClassName
        )}
        style={{
          objectPosition,
          transform: reduced ? undefined : `translate3d(0, ${offset}px, 0) scale(1.16)`,
        }}
      />
      {children}
    </div>
  );
};
