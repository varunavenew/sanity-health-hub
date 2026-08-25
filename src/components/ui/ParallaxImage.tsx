"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AssetImg } from "@/components/AssetImg";
import { cn } from "@/lib/utils";

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

/** Scroll offset for Ken Burns / split-hero media. */
export function useParallaxOffset(speed: number) {
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

  return { ref, offset, reduced };
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  objectPosition?: string;
  children?: ReactNode;
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
  const { ref, offset, reduced } = useParallaxOffset(speed);

  const imageStyle: CSSProperties = {
    objectPosition,
    transform: reduced ? undefined : `translate3d(0, ${offset}px, 0) scale(1.16)`,
  };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <AssetImg
        src={src}
        alt={alt}
        preset="hero"
        loading={loading}
        className={cn(
          "absolute inset-0 h-full w-full object-cover will-change-transform",
          imgClassName,
        )}
        style={imageStyle}
      />
      {children}
    </div>
  );
};
