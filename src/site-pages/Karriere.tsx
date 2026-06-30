"use client";

import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { GeoPageEnhancements } from "@/components/seo/GeoPageEnhancements";
import { useJobListings, useCareersPage } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { optionLabel, optionLabelMap } from "@/lib/sanity/option-labels";
import type { JobListing } from "@/data/jobListings";
import { MapPin, Clock, Briefcase, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useParams } from "@/lib/router";
import { useCareersListingPath } from "@/lib/routing/careers-listing-path";

interface KarriereProps {
  isChatOpen?: boolean;
}

const Karriere = ({ isChatOpen = false }: KarriereProps) => {
  const { i18n } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const listingPath = useCareersListingPath();
  const careersGeoPath = listingPath || "/karriere";
  const { data: sanityJobs } = useJobListings();
  const { data: page } = useCareersPage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("alle");

  const departmentLabels = useMemo(
    () => optionLabelMap(page?.departmentOptions),
    [page?.departmentOptions],
  );
  const employmentTypeLabels = useMemo(
    () => optionLabelMap(page?.employmentTypeOptions),
    [page?.employmentTypeOptions],
  );

  const jobs: JobListing[] = sanityJobs || [];
  const departments = Array.from(new Set(jobs.map((j) => j.department).filter(Boolean)));

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDepartment === "alle" || job.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const dateLocale = i18n.language === "en" ? "en-GB" : "nb-NO";
  const heroTitle = page?.title?.trim() || "";
  const heroSubtitle = page?.heroSubtitle?.trim() || "";
  const hasHero = Boolean(heroTitle || heroSubtitle);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {hasHero ? (
        <PageHero title={heroTitle} subtitle={heroSubtitle} showCTA={false} />
      ) : null}

      <GeoPageEnhancements
        name={heroTitle || page?.title?.trim() || "Karriere"}
        geoSummary={page?.geoSummary}
        fallbackDescription={heroSubtitle || page?.introText?.trim()}
        path={careersGeoPath}
        locale={locale}
        className="container mx-auto px-6 md:px-16 pt-8 max-w-3xl"
      />

      <section className="container mx-auto px-6 md:px-16 py-16">
        {(page?.jobsSectionTitle?.trim() || page?.introText?.trim()) && (
          <div className="max-w-3xl mb-12">
            {page?.jobsSectionTitle?.trim() ? (
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {page.jobsSectionTitle}
              </h2>
            ) : null}
            {page?.introText?.trim() ? (
              <p className="text-muted-foreground leading-relaxed">{page.introText}</p>
            ) : null}
          </div>
        )}

        {(page?.searchPlaceholder?.trim() || page?.filterAllLabel?.trim() || departments.length > 0) && (
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {page?.searchPlaceholder?.trim() ? (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={page.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            ) : null}
            {(page?.filterAllLabel?.trim() || departments.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {page?.filterAllLabel?.trim() ? (
                  <button
                    type="button"
                    onClick={() => setSelectedDepartment("alle")}
                    className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                      selectedDepartment === "alle"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {page.filterAllLabel}
                  </button>
                ) : null}
                {departments
                  .map((dept) => ({
                    dept,
                    label: optionLabel(departmentLabels, dept),
                  }))
                  .filter(({ label }) => Boolean(label))
                  .map(({ dept, label }) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                      selectedDepartment === dept
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {filtered.length === 0 ? (
          (page?.emptyResultsMessage?.trim() ||
            page?.emptyResultsResetHint?.trim() ||
            page?.emptyResultsResetLabel?.trim()) && (
            <div className="text-center py-20">
              {page?.emptyResultsMessage?.trim() ? (
                <p className="text-lg text-muted-foreground mb-2">{page.emptyResultsMessage}</p>
              ) : null}
              {(page?.emptyResultsResetHint?.trim() || page?.emptyResultsResetLabel?.trim()) && (
                <p className="text-sm text-muted-foreground">
                  {page?.emptyResultsResetHint?.trim() ? `${page.emptyResultsResetHint} ` : null}
                  {page?.emptyResultsResetLabel?.trim() ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedDepartment("alle");
                      }}
                      className="text-primary underline hover:no-underline"
                    >
                      {page.emptyResultsResetLabel}
                    </button>
                  ) : null}
                  .
                </p>
              )}
            </div>
          )
        ) : (
          <div className="grid gap-4">
            {filtered.map((job) => {
              const deptLabel = job.department
                ? optionLabel(departmentLabels, job.department)
                : "";
              const empLabel = job.employmentType
                ? optionLabel(employmentTypeLabels, job.employmentType)
                : "";
              const card = (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {job.location ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                      ) : null}
                      {deptLabel ? (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {deptLabel}
                        </span>
                      ) : null}
                      {empLabel ? (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {empLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {(page?.deadlineLabel?.trim() || page?.ongoingLabel?.trim()) && (
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {job.deadline && page?.deadlineLabel?.trim()
                          ? `${page.deadlineLabel} ${new Date(job.deadline).toLocaleDateString(dateLocale, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}`
                          : page?.ongoingLabel?.trim() || ""}
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  )}
                </div>
              );

              if (!listingPath) {
                return (
                  <div
                    key={job.id || job.slug}
                    className="block bg-card border border-border rounded-xl p-6"
                  >
                    {card}
                  </div>
                );
              }

              return (
                <Link
                  key={job.id || job.slug}
                  to={`${listingPath}/${job.slug}`}
                  className="group block bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        )}

        {(page?.spontaneousTitle?.trim() ||
          page?.spontaneousText?.trim() ||
          (page?.spontaneousButtonLabel?.trim() && page?.spontaneousEmail?.trim())) && (
          <div className="mt-16 bg-muted/50 border border-border rounded-2xl p-8 md:p-12 text-center">
            {page?.spontaneousTitle?.trim() ? (
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                {page.spontaneousTitle}
              </h3>
            ) : null}
            {page?.spontaneousText?.trim() ? (
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">{page.spontaneousText}</p>
            ) : null}
            {page?.spontaneousButtonLabel?.trim() && page?.spontaneousEmail?.trim() ? (
              <a href={`mailto:${page.spontaneousEmail}`}>
                <Button variant="cta" size="lg">
                  {page.spontaneousButtonLabel}
                </Button>
              </a>
            ) : null}
          </div>
        )}
      </section>
      <PageSectionsRenderer sections={page?.pageSections} />
    </PageLayout>
  );
};

export default Karriere;
