"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { AssetImg } from "@/components/AssetImg";
import { Link } from "@/lib/router";
import type { ImageRef } from "@/lib/media";

export type SpecialtyAreaCard = {
  title: string;
  href: string;
  image?: ImageRef | string;
  imageAlt?: string;
};

type SpecialtyAreaGridProps = {
  title: string;
  cards: SpecialtyAreaCard[];
};

/** Image-card grid — same pattern as homepage HeroCompact category cards. */
export function SpecialtyAreaGrid({ title, cards }: SpecialtyAreaGridProps) {
  const visible = cards.filter((c) => c.title?.trim() && c.href?.trim() && c.image);
  if (visible.length === 0) return null;

  return (
    <section className="py-12 md:py-16 border-t border-brand-dark/10">
      <h2 className="text-2xl md:text-3xl font-light text-brand-dark mb-8 md:mb-10">
        {title}
      </h2>
      <div className="grid w-full gap-0 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {visible.map((card, index) => (
          <motion.div
            key={`${card.href}-${index}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
          >
            <Link
              to={card.href}
              className="group relative block overflow-hidden aspect-[3/4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/40"
            >
              <AssetImg
                src={card.image!}
                alt={card.imageAlt?.trim() || card.title}
                preset="card"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/15 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <div className="flex items-end justify-between gap-2">
                  <span className="text-white text-sm md:text-base font-light leading-snug">
                    {card.title}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
