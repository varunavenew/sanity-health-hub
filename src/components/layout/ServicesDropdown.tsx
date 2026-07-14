"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, useLocaleParam } from "@/lib/router";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { useTranslation } from "react-i18next";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { siteNavMenuTriggerStyle } from "@/lib/navigation/site-nav-trigger-style";
import { cn } from "@/lib/utils";

export const ServicesNavMenuItem = () => {
  const { categories } = useServiceCategories();
  const { t } = useTranslation();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const locale = useLocaleParam();

  const currentCategory = categories
    .filter((c) => c.path && (location.pathname === c.path || location.pathname.startsWith(c.path + "/")))
    .sort((a, b) => b.path.length - a.path.length)[0];

  const handleNavigate = (path: string) => {
    navigate(path);
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  const activeCategoryData =
    categories.find((c) => c.id === activeCategory) ?? categories[0];

  const activeSubcategoryData =
    activeCategoryData && activeSubcategory
      ? activeCategoryData.subcategories.find(
          (s) => s.id === activeSubcategory || s.label === activeSubcategory,
        )
      : null;

  useEffect(() => {
    if (categories.length === 0) return;
    const valid =
      activeCategory && categories.some((c) => c.id === activeCategory);
    if (!valid) {
      setActiveCategory(currentCategory?.id ?? categories[0].id);
      setActiveSubcategory(null);
    }
  }, [categories, activeCategory, currentCategory?.id]);

  useEffect(() => {
    setActiveSubcategory(null);
  }, [locale, categories]);

  if (categories.length === 0) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className={siteNavMenuTriggerStyle()}>
          {t("nav.services")}
        </NavigationMenuTrigger>
        <NavigationMenuContent />
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={siteNavMenuTriggerStyle()}>
        {t("nav.services")}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="p-0">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-brand-dark shadow-2xl">
          <div className="flex">
            {/* Column 1: Main Categories */}
            <div className="w-[190px] border-r border-white/10 p-4">
              <h3 className="mb-3 px-2 text-[11px] font-normal uppercase tracking-wider text-white/40">
                {t("nav.services")}
              </h3>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onMouseEnter={() => {
                      setActiveCategory(category.id);
                      setActiveSubcategory(null);
                    }}
                    onClick={() => handleNavigate(category.path)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[14px] font-light transition-all",
                      activeCategory === category.id
                        ? "bg-white/10 text-white font-normal shadow-sm"
                        : "text-white/80 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <span>{category.label}</span>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 text-white/50 transition-transform",
                        activeCategory === category.id && "translate-x-0.5 text-white",
                      )}
                    />
                  </button>
                ))}
              </nav>
            </div>

            {/* Column 2: Subcategories (Treatments) */}
            <div className="max-h-[420px] w-[240px] overflow-y-auto border-r border-white/10 bg-white/[0.02] p-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
              <h3 className="mb-3 px-2 text-[11px] font-normal uppercase tracking-wider text-white/40">
                {activeCategoryData.label}
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategoryData.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.12 }}
                >
                  <nav className="grid grid-cols-1 gap-1">
                    {(activeCategoryData.subcategories ?? []).map((sub) => (
                      <button
                        key={sub.id ?? sub.label}
                        type="button"
                        onMouseEnter={() => setActiveSubcategory(sub.id ?? sub.label)}
                        onClick={() => handleNavigate(sub.path)}
                        className={cn(
                          "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[14px] font-light transition-colors",
                          activeSubcategory === (sub.id ?? sub.label)
                            ? "bg-white/10 text-white font-normal"
                            : "text-white/80 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <span>{sub.label}</span>
                        {sub.items && sub.items.length > 0 && (
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 text-white/50 transition-all",
                              activeSubcategory === (sub.id ?? sub.label)
                                ? "translate-x-0.5 text-white opacity-100"
                                : "opacity-40 group-hover:opacity-100",
                            )}
                          />
                        )}
                      </button>
                    ))}
                  </nav>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Column 3: Items/Anchors (if present) */}
            <AnimatePresence>
              {activeSubcategoryData?.items && activeSubcategoryData.items.length > 0 && (
                <motion.div
                  key="third-column"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 220 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-[420px] w-[220px] overflow-y-auto bg-white/[0.04] p-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
                    <h3 className="mb-3 px-2 text-[11px] font-normal uppercase tracking-wider text-white/40">
                      {activeSubcategoryData.label}
                    </h3>
                    <nav className="grid grid-cols-1 gap-1">
                      {activeSubcategoryData.items.map((item, index) => (
                        <button
                          key={`${item.label}-${item.anchor ?? index}`}
                          type="button"
                          onClick={() => {
                            if (item.path) {
                              handleNavigate(item.path);
                            } else {
                              const anchor =
                                item.anchor ||
                                item.label
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")
                                  .replace(/[æ]/g, "ae")
                                  .replace(/[ø]/g, "o")
                                  .replace(/[å]/g, "a");
                              handleNavigate(`${activeSubcategoryData.path}#${anchor}`);
                            }
                          }}
                          className="w-full rounded-lg px-3 py-1.5 text-left text-[13px] font-light text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

/** @deprecated Use ServicesNavMenuItem inside NavigationMenu */
export const ServicesDropdown = ServicesNavMenuItem;
