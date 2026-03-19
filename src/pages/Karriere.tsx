import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { PageSEO } from "@/components/seo/PageSEO";
import { useJobListings } from "@/hooks/useSanity";
import {
  staticJobListings,
  departmentLabels,
  employmentTypeLabels,
  type JobListing,
} from "@/data/jobListings";
import { MapPin, Clock, Briefcase, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface KarriereProps {
  isChatOpen?: boolean;
}

const Karriere = ({ isChatOpen = false }: KarriereProps) => {
  const { data: sanityJobs } = useJobListings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("alle");

  const jobs: JobListing[] =
    sanityJobs && sanityJobs.length > 0 ? sanityJobs : staticJobListings;

  // Unique departments for filter
  const departments = Array.from(new Set(jobs.map((j) => j.department)));

  // Filter
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
      <PageHero
        title="Karriere"
        subtitle="Bli en del av CMedical – Norges ledende private helsekonsern. Vi søker dyktige fagfolk som brenner for god pasientbehandling."
        showCTA={false}
      />

      <section className="container mx-auto px-6 md:px-16 py-16">
        {/* Intro */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ledige stillinger
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Hos CMedical jobber du i et inspirerende fagmiljø med dyktige kolleger, moderne utstyr
            og en kultur der pasientens beste alltid står i sentrum. Vi tilbyr konkurransedyktige
            betingelser og gode utviklingsmuligheter.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Søk etter stilling, sted..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDepartment("alle")}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                selectedDepartment === "alle"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              Alle
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  selectedDepartment === dept
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {departmentLabels[dept] || dept}
              </button>
            ))}
          </div>
        </div>

        {/* Job listings */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-2">
              Ingen ledige stillinger matcher søket ditt.
            </p>
            <p className="text-sm text-muted-foreground">
              Prøv å endre filtrene, eller{" "}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDepartment("alle");
                }}
                className="text-primary underline hover:no-underline"
              >
                vis alle stillinger
              </button>
              .
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((job) => (
              <Link
                key={job.id || job.slug}
                to={`/karriere/${job.slug}`}
                className="group block bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {job.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {departmentLabels[job.department] || job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {employmentTypeLabels[job.employmentType] || job.employmentType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                      {job.deadline
                        ? `Frist: ${new Date(job.deadline).toLocaleDateString("nb-NO", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}`
                        : "Løpende"}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Spontan søknad */}
        <div className="mt-16 bg-muted/50 border border-border rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
            Finner du ikke stillingen du ser etter?
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Send oss en spontansøknad! Vi er alltid interessert i å høre fra dyktige fagfolk som
            ønsker å bli en del av CMedical-familien.
          </p>
          <a href="mailto:jobb@cmedical.no">
            <Button size="lg" className="rounded-full px-8">
              Send spontansøknad
            </Button>
          </a>
        </div>
      </section>
    </PageLayout>
  );
};

export default Karriere;
