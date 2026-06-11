import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { CTASection } from "@/components/layout/CTASection";
import { useJobListings } from "@/hooks/useSanity";
import {
  staticJobListings,
  departmentLabels,
  employmentTypeLabels,
  type JobListing,
} from "@/data/jobListings";
import { MapPin, Clock, Briefcase, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface KarriereProps {
  isChatOpen?: boolean;
}

const Karriere = ({ isChatOpen = false }: KarriereProps) => {
  const { data: sanityJobs } = useJobListings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("alle");

  const jobs: JobListing[] =
    sanityJobs && sanityJobs.length > 0 ? sanityJobs : staticJobListings;

  const departments = Array.from(new Set(jobs.map((j) => j.department)));

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

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Karriere – Bli en del av CMedical"
        description="Se ledige stillinger hos CMedical. Vi søker dyktige fagfolk som brenner for god pasientbehandling. Konkurransedyktige betingelser og godt fagmiljø."
        canonical="/karriere"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Karriere", path: "/karriere" },
        ]}
      />

      {/* Editorial header */}
      <header className="bg-brand-warm pt-20 md:pt-24 pb-6 md:pb-8">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl">
            <p className="text-muted-foreground text-xs mb-2">Karriere hos CMedical</p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-brand-dark mb-3">
              Bygg karrieren der pasienten alltid kommer først
            </h1>
            <p className="text-brand-dark/75 text-sm md:text-base font-light leading-relaxed max-w-2xl">
              Hos CMedical jobber du i et inspirerende fagmiljø med dyktige kolleger,
              moderne utstyr og en kultur der pasientens beste alltid står i sentrum.
              Vi tilbyr konkurransedyktige betingelser og gode utviklingsmuligheter.
            </p>
          </div>
        </div>
      </header>

      {/* Listings */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-5xl">
            <div className="flex items-baseline justify-between gap-4 mb-8 pb-4 border-b border-brand-dark/10">
              <h2 className="text-xl md:text-2xl font-light text-brand-dark">
                Ledige stillinger
              </h2>
              <span className="text-xs text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "stilling" : "stillinger"}
              </span>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 mb-10">
              <div className="relative max-w-md">
                <label htmlFor="karriere-search" className="sr-only">
                  Søk etter stilling eller sted
                </label>
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="karriere-search"
                  placeholder="Søk etter stilling, sted..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Søk etter stilling eller sted"
                  className="pl-10 rounded-sm border-brand-dark/15 bg-background font-light"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDepartment("alle")}
                  className={`px-4 py-1.5 text-sm font-light rounded-sm border transition-colors ${
                    selectedDepartment === "alle"
                      ? "bg-brand-dark text-white border-brand-dark"
                      : "bg-transparent text-brand-dark border-brand-dark/15 hover:border-brand-dark/40"
                  }`}
                >
                  Alle
                </button>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-1.5 text-sm font-light rounded-sm border transition-colors ${
                      selectedDepartment === dept
                        ? "bg-brand-dark text-white border-brand-dark"
                        : "bg-transparent text-brand-dark border-brand-dark/15 hover:border-brand-dark/40"
                    }`}
                  >
                    {departmentLabels[dept] || dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Job listings */}
            {filtered.length === 0 ? (
              <div className="py-16 border-t border-brand-dark/10">
                <p className="text-base text-brand-dark/80 font-light mb-2">
                  Ingen ledige stillinger matcher søket ditt.
                </p>
                <p className="text-sm text-muted-foreground font-light">
                  Prøv å endre filtrene, eller{" "}
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDepartment("alle");
                    }}
                    className="text-brand-dark underline underline-offset-4 hover:no-underline"
                  >
                    vis alle stillinger
                  </button>
                  .
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-brand-dark/10 border-t border-brand-dark/10">
                {filtered.map((job) => (
                  <li key={job.id || job.slug}>
                    <Link
                      to={`/karriere/${job.slug}`}
                      className="group block py-6 md:py-7 transition-colors hover:bg-brand-warm/40 -mx-4 px-4 md:-mx-6 md:px-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-light text-brand-dark mb-2 group-hover:underline underline-offset-4 decoration-brand-dark/30">
                            {job.title}
                          </h3>
                          <p className="text-sm text-brand-dark/70 font-light leading-relaxed line-clamp-2 mb-3 max-w-2xl">
                            {job.excerpt}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-light">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                              {job.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                              {departmentLabels[job.department] || job.department}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              {employmentTypeLabels[job.employmentType] || job.employmentType}
                            </span>
                          </div>
                        </div>
                        <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 shrink-0 md:text-right">
                          <span className="text-xs text-muted-foreground font-light whitespace-nowrap">
                            {job.deadline
                              ? `Frist ${new Date(job.deadline).toLocaleDateString("nb-NO", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}`
                              : "Løpende"}
                          </span>
                          <ArrowRight
                            className="h-4 w-4 text-brand-dark/50 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Spontansøknad */}
      <section className="bg-brand-warm py-14 md:py-20 border-t border-brand-dark/5">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl">
            <p className="text-muted-foreground text-xs mb-3">Spontansøknad</p>
            <h2 className="text-2xl md:text-3xl font-light text-brand-dark mb-4">
              Finner du ikke stillingen du ser etter?
            </h2>
            <p className="text-brand-dark/75 text-base font-light leading-relaxed max-w-2xl mb-6">
              Vi er alltid interessert i å høre fra dyktige fagfolk som ønsker å bli en
              del av CMedical. Send oss noen ord om deg selv og hva du brenner for, så
              tar vi kontakt når en passende stilling dukker opp.
            </p>
            <a
              href="mailto:jobb@cmedical.no"
              className="inline-flex items-center gap-2 bg-brand-dark text-white hover:bg-brand-dark/90 rounded-sm px-6 h-11 font-light text-sm transition-colors"
            >
              Send spontansøknad
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </PageLayout>
  );
};

export default Karriere;
