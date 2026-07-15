"use client";

import { Fragment, type ReactNode } from "react";
import type { PageSection } from "@/lib/sanity/page-sections";
import { PageSectionArticlesBlock } from "./PageSectionArticlesBlock";
import { PageSectionBookingCtaBlock } from "./PageSectionBookingCtaBlock";
import { PageSectionSpecialistsBlock } from "./PageSectionSpecialistsBlock";
import { PageSectionInsuranceBlock } from "./PageSectionInsuranceBlock";

type Props = {
  sections?: PageSection[] | null;
  /** Rendered immediately before the first booking CTA block (e.g. related services carousel). */
  beforeBookingCta?: ReactNode;
};

export function PageSectionsRenderer({ sections, beforeBookingCta }: Props) {
  if (!sections?.length) {
    return beforeBookingCta ? <>{beforeBookingCta}</> : null;
  }

  const sortedSections = [...sections].sort((a, b) => {
    const order: Record<string, number> = {
      pageSectionSpecialists: 1,
      pageSectionInsurance: 2,
      pageSectionArticles: 3,
      pageSectionBookingCta: 4,
    };
    return (order[a._type] ?? 99) - (order[b._type] ?? 99);
  });

  let insertedBeforeBooking = false;

  return (
    <>
      {sortedSections.map((section) => {
        const key = section._key ?? section._type;

        if (section._type === "pageSectionSpecialists") {
          return <PageSectionSpecialistsBlock key={key} config={section} />;
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
      {!insertedBeforeBooking && beforeBookingCta}
    </>
  );
}
