"use client";

import { Fragment, type ReactNode } from "react";
import type { PageSection } from "@/lib/sanity/page-sections";
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
};

export function PageSectionsRenderer({
  sections,
  afterSpecialists,
  beforeBookingCta,
  excludeTypes,
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
  const filtered = excluded.size
    ? sections.filter((section) => !excluded.has(section._type))
    : sections;

  if (!filtered.length) {
    return (
      <>
        {afterSpecialists}
        {beforeBookingCta}
      </>
    );
  }

  const sortedSections = [...filtered].sort((a, b) => {
    const order: Record<string, number> = {
      pageSectionSpecialists: 1,
      pageSectionInsurance: 2,
      pageSectionArticles: 3,
      pageSectionBookingCta: 4,
    };
    return (order[a._type] ?? 99) - (order[b._type] ?? 99);
  });

  let insertedAfterSpecialists = false;
  let insertedBeforeBooking = false;
  const hasSpecialists = sortedSections.some((s) => s._type === "pageSectionSpecialists");

  return (
    <>
      {sortedSections.map((section) => {
        const key = section._key ?? section._type;

        if (section._type === "pageSectionSpecialists") {
          insertedAfterSpecialists = true;
          return (
            <Fragment key={key}>
              <PageSectionSpecialistsBlock config={section} />
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
