"use client";

import { useState, useEffect } from "react";
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
  const { categories: serviceCategories } = useServiceCategories();
  const { t } = useTranslation();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const locale = useLocaleParam();

  const currentCategory = serviceCategories
    .filter((c) => c.path && (location.pathname === c.path || location.pathname.startsWith(c.path + "/")))
    .sort((a, b) => b.path.length - a.path.length)[0];

  const handleNavigate = (path: string) => {
    navigate(path);
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  const activeCategoryData =
    serviceCategories.find((c) => c.id === activeCategory) ?? serviceCategories[0];

  const activeSubcategoryData =
    activeCategoryData && activeSubcategory
      ? activeCategoryData.subcategories.find(
          (s) => s.id === activeSubcategory || s.label === activeSubcategory,
        )
      : null;

  useEffect(() => {
    if (serviceCategories.length === 0) return;
    const valid =
      activeCategory && serviceCategories.some((c) => c.id === activeCategory);
    if (!valid) {
      setActiveCategory(currentCategory?.id ?? serviceCategories[0].id);
      setActiveSubcategory(null);
    }
  }, [serviceCategories, activeCategory, currentCategory?.id]);

  useEffect(() => {
    setActiveSubcategory(null);
  }, [locale, serviceCategories]);

  if (serviceCategories.length === 0) {
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
            <div className="w-[180px] border-r border-white/10 p-4">
              <h3 className="mb-2 px-2 text-sm font-light tracking-wider text-white/50">
                {t("nav.services")}
              </h3>
              <nav className="space-y-0">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onMouseEnter={() => {
                      setActiveCategory(category.id);
                      setActiveSubcategory(null);
                    }}
                    onClick={() => handleNavigate(category.path)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-[13px] font-light transition-all",
                      activeCategory === category.id
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {category.label}
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        activeCategory === category.id && "translate-x-1",
                      )}
                    />
                  </button>
                ))}
              </nav>
            </div>

            <div className="max-h-[calc(100vh-140px)] w-[220px] overflow-y-auto border-r border-white/10 bg-white/5 p-4">
              <h3 className="mb-2 px-2 text-sm font-light tracking-wider text-white/50">
                {activeCategoryData.label}
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategoryData.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.12 }}
                >
                  <nav className="grid grid-cols-1 gap-0">
                    {(activeCategoryData.subcategories ?? []).map((sub) => (
                      <button
                        key={sub.id ?? sub.label}
                        type="button"
                        onMouseEnter={() => setActiveSubcategory(sub.id ?? sub.label)}
                        onClick={() => handleNavigate(sub.path)}
                        className={cn(
                          "group flex w-full items-center justify-between rounded px-2 py-2 text-left text-[13px] font-light transition-colors",
                          activeSubcategory === (sub.id ?? sub.label)
                            ? "bg-white/10 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        <span>{sub.label}</span>
                        {sub.items && sub.items.length > 0 && (
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 transition-all",
                              activeSubcategory === (sub.id ?? sub.label)
                                ? "translate-x-1 opacity-100"
                                : "opacity-50",
                            )}
                          />
                        )}
                      </button>
                    ))}
                  </nav>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {activeSubcategoryData?.items && activeSubcategoryData.items.length > 0 && (
                <motion.div
                  key="third-column"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 200 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-[calc(100vh-140px)] w-[200px] overflow-y-auto bg-white/[0.03] p-4">
                    <h3 className="mb-2 px-2 text-sm font-light tracking-wider text-white/50">
                      {activeSubcategoryData.label}
                    </h3>
                    <nav className="grid grid-cols-1 gap-0">
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
                          className="w-full rounded px-2 py-1.5 text-left text-[12px] font-light text-white/60 transition-colors hover:bg-white/10 hover:text-white"
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
