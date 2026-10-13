"use client";

import { FileText, Mic, Play, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ARTICLE_CONTENT_FORMAT_LABELS,
  resolveArticleContentFormat,
  type ArticleContentFormat,
} from "@/lib/news/content-format";
import { cn } from "@/lib/utils";

const FORMAT_ICONS: Record<ArticleContentFormat, LucideIcon> = {
  article: FileText,
  podcast: Mic,
  video: Play,
};

/** Top-right content-type badge on article cards. Parent must be `relative`. */
export function ArticleFormatBadge({
  format,
  className,
}: {
  format?: string | null;
  className?: string;
}) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "nb").toLowerCase().startsWith("en") ? "en" : "no";
  const resolved = resolveArticleContentFormat(format);
  const Icon = FORMAT_ICONS[resolved];
  const label = ARTICLE_CONTENT_FORMAT_LABELS[resolved][lang];

  return (
    <div
      className={cn(
        "absolute top-3 right-3 w-8 h-8 rounded-full bg-brand-dark/80 backdrop-blur-sm text-white flex items-center justify-center",
        className,
      )}
      role="img"
      aria-label={label}
      title={label}
      data-content-format={resolved}
    >
      <Icon className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
