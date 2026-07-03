"use client";

import { useState } from "react";
import { ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type {
  ServiceCategory,
  SubCategory,
} from "@/lib/sanity/service-category-types";

type MobileNavMenuContentProps = {
  moreItems: { label: string; path: string }[];
  onNavigate: (path: string) => void;
  phone: string;
  address: string;
  contactPath: string;
  ctaLabel: string;
  ctaPath: string;
};

function subItemPath(sub: SubCategory, item: { label: string; anchor?: string; path?: string }) {
  if (item.path) return item.path;
  const anchor =
    item.anchor ||
    item.label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/æ/g, "ae")
      .replace(/ø/g, "o")
      .replace(/å/g, "a");
  return `${sub.path}#${anchor}`;
}

function ServiceCategoryRow({
  category,
  isExpanded,
  onToggle,
  onNavigate,
}: {
  category: ServiceCategory;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
}) {
  const { t } = useTranslation();
  const hasChildren = category.subcategories.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-dark/15 bg-white">
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => onNavigate(category.path)}
          className="min-h-[48px] flex-1 px-4 py-3 text-left text-[15px] font-normal text-brand-dark"
        >
          {category.label}
        </button>
        {hasChildren ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-label={t("nav.expandCategory", { category: category.label })}
            className={cn(
              "flex min-h-[48px] items-center justify-center border-l border-brand-dark/10 bg-transparent px-4 text-brand-dark/60 transition-colors hover:bg-brand-dark/5",
              isExpanded && "bg-brand-dark/5",
            )}
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
              aria-hidden="true"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate(category.path)}
            aria-label={t("nav.expandCategory", { category: category.label })}
            className="flex min-h-[48px] items-center justify-center border-l border-brand-dark/10 bg-transparent px-4 text-brand-dark/60 transition-colors hover:bg-brand-dark/5"
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="border-t border-brand-dark/10 px-4 py-2">
          <ul className="space-y-0.5">
            {category.subcategories.map((sub) => (
              <li key={sub.id ?? sub.path}>
                <button
                  type="button"
                  onClick={() => onNavigate(sub.path)}
                  className="w-full py-2.5 text-left text-sm font-normal text-brand-dark/80 hover:text-brand-dark"
                >
                  {sub.label}
                </button>
                {sub.items?.map((item, index) => (
                  <button
                    key={`${sub.path}-${item.label}-${index}`}
                    type="button"
                    onClick={() => onNavigate(subItemPath(sub, item))}
                    className="block w-full py-1.5 pl-3 text-left text-xs font-light text-brand-dark/60 hover:text-brand-dark"
                  >
                    {item.label}
                  </button>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function MobileNavMenuContent({
  moreItems,
  onNavigate,
  phone,
  address,
  contactPath,
  ctaLabel,
  ctaPath,
}: MobileNavMenuContentProps) {
  const { t } = useTranslation();
  const { categories } = useServiceCategories();
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <div className="p-5 pb-[calc(96px+env(safe-area-inset-bottom))]">
      <div className="mb-6">
        <h3 className="mb-3 px-1 text-xs uppercase text-foreground/50">{t("nav.services")}</h3>
        <nav aria-label={t("nav.allServices")} className="space-y-2">
          {categories.map((category) => (
            <ServiceCategoryRow
              key={category.id}
              category={category}
              isExpanded={expandedCategoryId === category.id}
              onToggle={() =>
                setExpandedCategoryId((current) =>
                  current === category.id ? null : category.id,
                )
              }
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </div>

      {moreItems.length > 0 && (
        <div className="mt-10 border-t border-border pt-6">
          <h3 className="mb-2 text-xs uppercase tracking-normal text-foreground/50">{t("nav.more")}</h3>
          <nav className="space-y-0.5">
            {moreItems.map((item) => (
              <button
                key={item.path + item.label}
                type="button"
                onClick={() => onNavigate(item.path)}
                className="min-h-[44px] w-full py-3 text-left text-base text-foreground/80 transition-colors hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="mt-8 border-t border-border pt-6">
        <div className="space-y-3">
          <a
            href={telHref}
            className="flex items-center gap-3 text-base text-foreground/70 transition-colors hover:text-foreground"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            {phone}
          </a>
          <button
            type="button"
            onClick={() => onNavigate(contactPath)}
            className="flex items-center gap-3 text-base text-foreground/70 transition-colors hover:text-foreground"
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
            {t("nav.contactForm")}
          </button>
          <div className="flex items-center gap-3 text-base text-foreground/70">
            <MapPin className="h-5 w-5" aria-hidden="true" />
            {address}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => onNavigate(ctaPath)}
          className="w-full rounded-2xl bg-accent py-4 text-base font-normal text-accent-foreground transition-colors hover:bg-accent/90"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
