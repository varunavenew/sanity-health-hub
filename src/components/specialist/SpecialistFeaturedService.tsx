import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { AssetImg } from "@/components/AssetImg";
import type { Specialist } from "@/lib/sanity/specialist-types";

function featuredServiceHref(categoryId: string, slug: string): string {
  if (categoryId === "flere-fagomrader") return "/tjenester";
  return `/behandlinger/${slug}`;
}

interface SpecialistFeaturedServiceProps {
  specialist: Specialist;
}

export const SpecialistFeaturedService = ({ specialist }: SpecialistFeaturedServiceProps) => {
  const category = specialist.sanityCategories?.[0];
  if (!category?.title) return null;

  const href = featuredServiceHref(category.categoryId, category.slug);
  const hasContent = Boolean(category.title) && Boolean(category.heroImage);
  if (!hasContent) return null;

  return (
    <section className="bg-brand-light py-16 md:py-24 border-t border-foreground/10">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] mb-5">
              {category.title}
            </h2>
            <Link
              to={href}
              className="inline-flex items-center gap-2 text-sm font-normal text-foreground border-b border-foreground pb-1 hover:gap-3 transition-all"
            >
              Se hele tjenesten
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>

          {category.heroImage ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] overflow-hidden rounded-sm"
            >
              <AssetImg
                src={category.heroImage}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
