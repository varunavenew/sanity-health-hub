"use client";

import { useMemo } from "react";
import { useParams, Link, useRouteSlug } from "@/lib/router";
import { PageLayout } from "@/components/layout/PageLayout";
import { useJobListing, useCareersPage } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { optionLabel, optionLabelMap } from "@/lib/sanity/option-labels";
import {
  MapPin,
  Clock,
  Briefcase,
  Mail,
  Phone,
  User,
  ArrowLeft,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useCareersListingPath } from "@/lib/routing/careers-listing-path";

interface KarriereDetailProps {
  isChatOpen?: boolean;
}

const KarriereDetail = ({ isChatOpen = false }: KarriereDetailProps) => {
  const { i18n } = useTranslation();
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = useRouteSlug() || paramSlug || "";
  const { data: sanityJob, isLoading, isError } = useJobListing(slug || "");
  const { data: page } = useCareersPage();

  const departmentLabels = useMemo(
    () => optionLabelMap(page?.departmentOptions),
    [page?.departmentOptions],
  );
  const employmentTypeLabels = useMemo(
    () => optionLabelMap(page?.employmentTypeOptions),
    [page?.employmentTypeOptions],
  );

  const job = sanityJob && !isError ? sanityJob : undefined;
  const dateLocale = i18n.language === "en" ? "en-GB" : "nb-NO";
  const listingPath = useCareersListingPath();
  const deptLabel = job?.department ? optionLabel(departmentLabels, job.department) : "";
  const empLabel = job?.employmentType
    ? optionLabel(employmentTypeLabels, job.employmentType)
    : "";
  const applyEmail = job?.contactEmail?.trim() || page?.spontaneousEmail?.trim();

  if (isLoading) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="pt-32 pb-20 container mx-auto px-6 md:px-16 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-40 bg-muted rounded mt-8" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!job) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="pt-32 pb-20 container mx-auto px-6 md:px-16 text-center">
          {page?.notFoundTitle?.trim() ? (
            <h1 className="text-2xl font-bold text-foreground mb-4">{page.notFoundTitle}</h1>
          ) : null}
          {page?.notFoundDescription?.trim() ? (
            <p className="text-muted-foreground mb-6">{page.notFoundDescription}</p>
          ) : null}
          {page?.backToJobsLabel?.trim() && listingPath ? (
            <Link to={listingPath}>
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {page.backToJobsLabel}
              </Button>
            </Link>
          ) : null}
        </div>
      </PageLayout>
    );
  }

  const renderBody = (body: unknown[]) => {
    return body
      .filter((block: any) => block._type === "block")
      .map((block: any, i: number) => {
        const text = (block.children || [])
          .map((child: any) => child.text)
          .join("");
        if (!text.trim()) return null;

        if (block.style === "h2")
          return (
            <h2 key={i} className="text-xl font-semibold text-foreground mt-8 mb-3">
              {text}
            </h2>
          );
        if (block.style === "h3")
          return (
            <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">
              {text}
            </h3>
          );
        if (block.listItem === "bullet")
          return (
            <li key={i} className="text-muted-foreground ml-6 list-disc">
              {text}
            </li>
          );
        if (block.listItem === "number")
          return (
            <li key={i} className="text-muted-foreground ml-6 list-decimal">
              {text}
            </li>
          );
        return (
          <p key={i} className="text-muted-foreground leading-relaxed mb-3">
            {text}
          </p>
        );
      });
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <div className="pt-28 pb-20 container mx-auto px-6 md:px-16">
        {page?.backLinkLabel?.trim() && listingPath ? (
          <Link
            to={listingPath}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {page.backLinkLabel}
          </Link>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              {job.location ? (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
              ) : null}
              {deptLabel ? (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {deptLabel}
                </span>
              ) : null}
              {empLabel ? (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {empLabel}
                </span>
              ) : null}
              {(job.deadline || page?.ongoingDeadlineLabel?.trim()) && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {job.deadline && page?.deadlineLabel?.trim()
                    ? `${page.deadlineLabel} ${new Date(job.deadline).toLocaleDateString(dateLocale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}`
                    : page?.ongoingDeadlineLabel?.trim() || ""}
                </span>
              )}
            </div>

            {job.body && job.body.length > 0 ? (
              <div className="prose max-w-none">{renderBody(job.body)}</div>
            ) : job.excerpt ? (
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg">{job.excerpt}</p>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {(page?.applyCardTitle?.trim() ||
                page?.applyExternalLabel?.trim() ||
                page?.applyEmailLabel?.trim()) && (
                <div className="bg-card border border-border rounded-xl p-6">
                  {page?.applyCardTitle?.trim() ? (
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {page.applyCardTitle}
                    </h3>
                  ) : null}
                  {job.applyUrl && page?.applyExternalLabel?.trim() ? (
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="cta" className="w-full" size="lg">
                        {page.applyExternalLabel}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  ) : page?.applyEmailLabel?.trim() && applyEmail ? (
                    <a
                      href={`mailto:${applyEmail}?subject=Søknad: ${job.title}`}
                    >
                      <Button variant="cta" className="w-full" size="lg">
                        {page.applyEmailLabel}
                        <Mail className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  ) : null}
                </div>
              )}

              {(job.contactName || job.contactEmail || job.contactPhone) &&
              page?.contactCardTitle?.trim() ? (
                <div className="bg-muted/50 border border-border rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    {page.contactCardTitle}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {job.contactName ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {job.contactName}
                      </div>
                    ) : null}
                    {job.contactEmail ? (
                      <a
                        href={`mailto:${job.contactEmail}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {job.contactEmail}
                      </a>
                    ) : null}
                    {job.contactPhone ? (
                      <a
                        href={`tel:${job.contactPhone.replace(/\s/g, "")}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {job.contactPhone}
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <PageSectionsRenderer sections={sanityJob?.pageSections ?? page?.pageSections} />
    </PageLayout>
  );
};

export default KarriereDetail;
