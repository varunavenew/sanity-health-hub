import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { AssetImg } from "@/components/AssetImg";

export type TreatmentAreaCardProps = {
  href: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  readMoreLabel: string;
};

/** Same card as treatment pages (SubTreatmentLayout expert areas). */
export function TreatmentAreaCard({
  href,
  title,
  description,
  image,
  imageAlt,
  readMoreLabel,
}: TreatmentAreaCardProps) {
  return (
    <Link
      to={href}
      className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden h-full"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
        {image ? (
          <AssetImg
            src={image}
            alt={imageAlt || title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-secondary" aria-hidden="true" />
        )}
      </div>
      <div className="p-7 flex flex-col flex-1">
        <h3 className="text-lg font-normal text-foreground mb-3">{title}</h3>
        {description ? (
          <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">
            {description}
          </p>
        ) : (
          <div className="flex-1 mb-6" />
        )}
        <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
          {readMoreLabel}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
