"use client";

import { Fragment, type ReactNode } from "react";
import type { PageSection } from "@/lib/sanity/page-sections";
import {
  ensurePageSectionKeys,
  filterMeaningfulPageSections,
  hasPageSection,
} from "@/lib/sanity/section-visibility";
import { PageSectionArticlesBlock } from "./PageSectionArticlesBlock";
import { PageSectionBookingCtaBlock } from "./PageSectionBookingCtaBlock";
import { PageSectionSpecialistsBlock } from "./PageSectionSpecialistsBlock";
import { PageSectionInsuranceBlock } from "./PageSectionInsuranceBlock";

type Props = {
  sections?: PageSection[] | null;
  /** Rendered immediately after the specialists block (e.g. patient journey). */
  afterSpecialists?: ReactNode;
  /** Rendered immediately before the first booking CTA block (e.g. related services carousel). */
  beforeBookingCta?: ReactNode;
  /**
   * Skip these section `_type` values (e.g. when specialists were already
   * rendered mid-page via `landingPage.sectionOrder`). Omit for default behaviour.
   */
  excludeTypes?: Array<PageSection["_type"]>;
  /** Passed through to specialists carousel (category landings use flush cards). */
  specialistsLayoutVariant?: "default" | "category";
};

export function PageSectionsRenderer({
  sections,
  afterSpecialists,
  beforeBookingCta,
  excludeTypes,
  specialistsLayoutVariant = "default",
}: Props) {
  if (!sections?.length) {
    return (
      <>
        {afterSpecialists}
        {beforeBookingCta}
      </>
    );
  }

  const excluded = new Set(excludeTypes ?? []);
  const filtered = filterMeaningfulPageSections(
    excluded.size
      ? sections.filter((section) => !excluded.has(section._type))
      : sections,
  );

  if (!filtered.length) {
    return (
      <>
        {afterSpecialists}
        {beforeBookingCta}
      </>
    );
  }

  // Keep specialists first when present; otherwise preserve CMS pageSections order
  // (e.g. Graviditet: CTA → Insurance; Ortopedi: Insurance → CTA).
  const sortedSections = ensurePageSectionKeys(
    [...filtered].sort((a, b) => {
      const rank = (section: PageSection) =>
        section._type === "pageSectionSpecialists" ? 0 : 1;
      return rank(a) - rank(b);
    }),
  );

  let insertedAfterSpecialists = false;
  let insertedBeforeBooking = false;
  const hasSpecialists = sortedSections.some((s) => s._type === "pageSectionSpecialists");

  return (
    <>
      {sortedSections.map((section) => {
        const key = section._key;

        if (section._type === "pageSectionSpecialists") {
          insertedAfterSpecialists = true;
          return (
            <Fragment key={key}>
              <PageSectionSpecialistsBlock
                config={section}
                layoutVariant={specialistsLayoutVariant}
              />
              {afterSpecialists}
            </Fragment>
          );
        }

        if (section._type === "pageSectionArticles") {
          return <PageSectionArticlesBlock key={key} config={section} />;
        }

        if (section._type === "pageSectionInsurance") {
          return <PageSectionInsuranceBlock key={key} config={section} />;
        }

        if (section._type === "pageSectionBookingCta") {
          if (!hasPageSection(section)) return null;
          if (!insertedBeforeBooking && beforeBookingCta) {
            insertedBeforeBooking = true;
            return (
              <Fragment key={key}>
                {beforeBookingCta}
                <PageSectionBookingCtaBlock config={section} />
              </Fragment>
            );
          }
          return <PageSectionBookingCtaBlock key={key} config={section} />;
        }

        return null;
      })}
      {!hasSpecialists && !insertedAfterSpecialists && afterSpecialists}
      {!insertedBeforeBooking && beforeBookingCta}
    </>
  );
}
