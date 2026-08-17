"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AssetImg } from "@/components/AssetImg";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  objectPosition?: string;
  loading?: "lazy" | "eager";
  children?: ReactNode;
};

/** Image band with subtle scroll parallax — used on clinic hero and gallery rows. */
export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.12,
  objectPosition = "50% 50%",
  loading = "lazy",
  children,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      setOffset((rect.top / vh) * speed * 120);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [speed]);

  const imageStyle: CSSProperties = {
    transform: `translate3d(0, ${offset}px, 0)`,
    objectPosition,
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <AssetImg
        src={src}
        alt={alt}
        preset="hero"
        loading={loading}
        className="absolute inset-0 h-[115%] w-full object-cover will-change-transform"
        style={imageStyle}
      />
      {children}
    </div>
  );
}
