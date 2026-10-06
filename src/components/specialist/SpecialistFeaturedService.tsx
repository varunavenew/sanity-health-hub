import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { AssetImg } from "@/components/AssetImg";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { useSpecialistProfileUi } from "@/components/specialist/SpecialistProfileUiContext";
import type { Specialist } from "@/lib/sanity/specialist-types";
import "./specialist-profile-demo.css";

function featuredServiceHref(
  categoryId: string,
  slug: string,
  servicesPath: string,
): string {
  if (categoryId === "flere-fagomrader") return servicesPath;
  return `/${slug}`;
}

interface SpecialistFeaturedServiceProps {
  specialist: Specialist;
}

export const SpecialistFeaturedService = ({ specialist }: SpecialistFeaturedServiceProps) => {
  const ui = useSpecialistProfileUi();
  const servicesPath = useNavCmsPath("services");
  const category = specialist.featuredCategory ?? specialist.sanityCategories?.[0];
  if (!category?.title) return null;
  if (!specialist.featuredCategory && !(specialist.profileTreatments?.length)) {
    return null;
  }

  const href = featuredServiceHref(category.categoryId, category.slug, servicesPath);
  const hasContent = Boolean(category.title) && Boolean(category.heroImage);
  if (!hasContent) return null;

  return (
    <section className="area-block">
      <div className="area-block__grid">
        <div className="area-block__text">
          <div className="area-block__text-inner">
            <h2 className="area-block__title">{category.title}</h2>
            {category.description ? (
              <p className="area-block__description">{category.description}</p>
            ) : null}
            <Link to={href} className="area-block__link">
              {ui.featuredServiceCtaLabel}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {category.heroImage ? (
          <div className="split-media area-block__image">
            <AssetImg src={category.heroImage} alt={category.title} loading="lazy" />
          </div>
        ) : null}
      </div>
    </section>
  );
};
