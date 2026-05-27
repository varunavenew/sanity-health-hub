"use client";

import type { PageSection } from "@/lib/sanity/page-sections";
import { PageSectionArticlesBlock } from "./PageSectionArticlesBlock";
import { PageSectionSpecialistsBlock } from "./PageSectionSpecialistsBlock";

type Props = {
  sections?: PageSection[] | null;
};

export function PageSectionsRenderer({ sections }: Props) {
  if (!sections?.length) return null;

  return (
    <>
      {sections.map((section) => {
        const key = section._key ?? section._type;

        if (section._type === "pageSectionSpecialists") {
          return <PageSectionSpecialistsBlock key={key} config={section} />;
        }

        if (section._type === "pageSectionArticles") {
          return <PageSectionArticlesBlock key={key} config={section} />;
        }

        return null;
      })}
    </>
  );
}
