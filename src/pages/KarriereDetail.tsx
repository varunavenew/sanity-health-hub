import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { useJobListing } from "@/hooks/useSanity";
import {
  staticJobListings,
  departmentLabels,
  employmentTypeLabels,
} from "@/data/jobListings";
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

interface KarriereDetailProps {
  isChatOpen?: boolean;
}

const KarriereDetail = ({ isChatOpen = false }: KarriereDetailProps) => {
  const { slug } = useParams<{ slug: string }>();
  const { data: sanityJob, isLoading } = useJobListing(slug || "");

  // Fallback to static
  const staticJob = staticJobListings.find((j) => j.slug === slug);
  const job = sanityJob || staticJob;

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
          <h1 className="text-2xl font-bold text-foreground mb-4">Stillingen ble ikke funnet</h1>
          <p className="text-muted-foreground mb-6">
            Denne stillingen finnes ikke lenger eller lenken er feil.
          </p>
          <Link to="/karriere">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake til ledige stillinger
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Render Portable Text body simply (blocks only)
  const renderBody = (body: any[]) => {
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
        <Link
          to="/karriere"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Alle ledige stillinger
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                {departmentLabels[job.department] || job.department}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {employmentTypeLabels[job.employmentType] || job.employmentType}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {job.deadline
                  ? `Frist: ${new Date(job.deadline).toLocaleDateString("nb-NO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}`
                  : "Løpende søknadsfrist"}
              </span>
            </div>

            {/* Body */}
            {job.body && job.body.length > 0 ? (
              <div className="prose max-w-none">{renderBody(job.body)}</div>
            ) : (
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  {job.excerpt}
                </p>
                <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Om stillingen</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Vi ser etter deg som er engasjert, faglig sterk og trives i et tverrfaglig
                  miljø. Hos CMedical legger vi vekt på kvalitet, samarbeid og kontinuerlig
                  utvikling.
                </p>
                <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Vi tilbyr</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="list-disc ml-6">Konkurransedyktig lønn og gode pensjonsordninger</li>
                  <li className="list-disc ml-6">Moderne fasiliteter og utstyr</li>
                  <li className="list-disc ml-6">Faglig utvikling og kurs</li>
                  <li className="list-disc ml-6">Et godt og inkluderende arbeidsmiljø</li>
                  <li className="list-disc ml-6">Fleksible arbeidsordninger</li>
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Apply card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Søk på stillingen</h3>
                {job.applyUrl ? (
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full rounded-full" size="lg">
                      Søk her
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                ) : (
                  <a href={`mailto:${job.contactEmail || "jobb@cmedical.no"}?subject=Søknad: ${job.title}`}>
                    <Button className="w-full rounded-full" size="lg">
                      Send søknad på e-post
                      <Mail className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                )}
              </div>

              {/* Contact card */}
              {(job.contactName || job.contactEmail || job.contactPhone) && (
                <div className="bg-muted/50 border border-border rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Kontaktperson</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {job.contactName && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {job.contactName}
                      </div>
                    )}
                    {job.contactEmail && (
                      <a
                        href={`mailto:${job.contactEmail}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {job.contactEmail}
                      </a>
                    )}
                    {job.contactPhone && (
                      <a
                        href={`tel:${job.contactPhone.replace(/\s/g, "")}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {job.contactPhone}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default KarriereDetail;
