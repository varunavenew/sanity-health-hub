"use client";

import { useEffect, useRef } from "react";
import blurSkinMid from "@/assets/blur-skin-mid.jpg";
import { assetSrc } from "@/lib/media";
import { optimizeBackgroundImageUrl } from "@/lib/sanity/image-url";

type StatsSkinBackgroundProps = {
  /** Parallax intensity — 0 disables motion. */
  speed?: number;
};

/**
 * Shared stats-band background: blur-skin texture with optional scroll parallax,
 * matching the list-page hero / category results band treatment.
 */
export function StatsSkinBackground({ speed = 0.14 }: StatsSkinBackgroundProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || speed <= 0) return;

    const section = layer.closest("section");
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const y = centerOffset * speed;
      layer.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [speed]);

  if (speed <= 0) return null;

  const backgroundImage = optimizeBackgroundImageUrl(assetSrc(blurSkinMid));

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        ref={layerRef}
        className="absolute inset-x-0 -top-24 -bottom-24 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-brand-terracotta/35 mix-blend-multiply" />
    </div>
  );
}
