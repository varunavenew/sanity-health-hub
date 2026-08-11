import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/components/ui/ParallaxImage";

interface SplitHeroMediaProps {
  /** Image source (also used as video poster when video is provided) */
  src?: string;
  /** Optional video source — takes precedence over the image */
  video?: string;
  alt: string;
  className?: string;
  mediaClassName?: string;
  objectPosition?: string;
  /** Parallax strength. 0 disables. */
  speed?: number;
  loading?: "lazy" | "eager";
}

/**
 * Shared media slot for the split-screen category heroes.
 * Adds the same subtle parallax used on the clinic pages (desktop + mobile),
 * and respects prefers-reduced-motion.
 */
export const SplitHeroMedia = ({
  src,
  video,
  alt,
  className,
  mediaClassName,
  objectPosition,
  speed = 0.14,
  loading = "eager",
}: SplitHeroMediaProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !speed) {
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

  const style: React.CSSProperties = {
    objectPosition,
    transform: reduced ? undefined : `translate3d(0, ${offset}px, 0) scale(1.14)`,
  };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {video ? (
        <video
          src={video}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          aria-label={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover will-change-transform",
            mediaClassName
          )}
          style={style}
        />
      ) : src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={cn(
            "absolute inset-0 w-full h-full object-cover will-change-transform",
            mediaClassName
          )}
          style={style}
        />
      ) : null}
    </div>
  );
};
