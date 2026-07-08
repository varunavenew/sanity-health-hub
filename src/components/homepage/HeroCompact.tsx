"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "@/lib/router";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

export const HeroCompact = () => {
  const navigate = useNavigate();
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();

  const serviceCategories = (homepage?.categoryCards || []).filter(
    (c: { image?: string; title?: string }) => c?.image && c?.title,
  );

  const colMap: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  };
  const gridColsClass = colMap[serviceCategories.length] ?? "md:grid-cols-6";

  if (serviceCategories.length === 0) return null;

  return (
    <section className="pb-4 md:pb-6">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`grid grid-cols-2 ${gridColsClass} gap-0 w-full`}
      >
          {serviceCategories.map((category: any, index: number) => (
            <motion.button
              key={category.id}
              onClick={() => navigate(category.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
              className="group relative overflow-hidden aspect-[3/4] cursor-pointer text-left"
              aria-label={t("services.seeAllTreatments", { name: category.title })}
            >
              <img
                src={category.image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-transparent opacity-80 transition-opacity duration-300" aria-hidden="true" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-sm md:text-base font-light">
                    {category.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" aria-hidden="true" />
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
    </section>
  );
};
