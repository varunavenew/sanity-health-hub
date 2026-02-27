import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Globe, GraduationCap, Briefcase, Calendar, Phone, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSpecialist, useSpecialists } from "@/hooks/useSanity";
import { specialists as staticSpecialists, getSpecialistsByCategory } from "@/data/specialists";
import { serviceCategories } from "@/data/serviceCategories";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface SpecialistProfileProps {
  isChatOpen: boolean;
}

const categoryLabels: Record<string, string> = {
  gynekologi: "Gynekologi", fertilitet: "Fertilitet", urologi: "Urologi", ortopedi: "Ortopedi", annet: "Flere fagområder",
};

const categoryPaths: Record<string, string> = {
  gynekologi: "/gynekologi", fertilitet: "/fertilitet", urologi: "/urologi", ortopedi: "/ortopedi", annet: "/flere-fagomrader",
};

const categoryBookingMap: Record<string, string> = {
  gynekologi: "gynekolog", fertilitet: "fertilitet", urologi: "urolog", ortopedi: "ortoped", annet: "",
};

const SpecialistProfile = ({ isChatOpen }: SpecialistProfileProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: sanitySpecialist, isLoading } = useSpecialist(slug || "");
  const { data: allSanitySpecialists } = useSpecialists();

  // Fallback to static
  const staticSpecialist = staticSpecialists.find((s) => s.slug === slug);
  const specialist = sanitySpecialist || staticSpecialist;

  if (isLoading) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="bg-brand-dark pt-24 pb-12">
          <div className="container mx-auto px-6 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Skeleton className="aspect-[3/4] max-h-[420px] rounded-sm" />
              <div className="py-6 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!specialist) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light text-foreground mb-4">Spesialist ikke funnet</h1>
            <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 w-4 h-4" /> Gå tilbake
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Related specialists
  const allSpecialists = allSanitySpecialists?.length ? allSanitySpecialists : staticSpecialists;
  const relatedSpecialists = allSpecialists
    .filter((s: any) => s.category === specialist.category && s.slug !== specialist.slug)
    .slice(0, 4);

  const categoryConfig = serviceCategories.find(
    (c) => c.id === specialist.category || (specialist.category === "annet" && c.id === "flere")
  );
  const relatedTreatments = categoryConfig?.subcategories.slice(0, 6) || [];
  const bookingUrl = `/booking?kategori=${categoryBookingMap[specialist.category] || specialist.category}`;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Breadcrumb */}
      <div className="bg-brand-dark pt-20 pb-0">
        <div className="container mx-auto px-6 md:px-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 font-light py-4">
            <Link to="/" className="hover:text-white/80 transition-colors">Hjem</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={categoryPaths[specialist.category] || "/"} className="hover:text-white/80 transition-colors">
              {categoryLabels[specialist.category]}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">{specialist.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-brand-dark pb-8 md:pb-12">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="aspect-[3/4] max-h-[420px] rounded-sm overflow-hidden">
                <img src={specialist.image} alt={specialist.name} className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="flex flex-col justify-center py-4 md:py-6">
              <h1 className="text-3xl md:text-4xl font-light text-white mb-2">{specialist.name}</h1>
              <p className="text-lg md:text-xl text-white/60 font-light mb-8">{specialist.title}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {specialist.languages && specialist.languages.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Språk</p>
                      <p className="text-sm text-white/90 font-light">{specialist.languages.join(", ")}</p>
                    </div>
                  </div>
                )}
                {specialist.clinics && specialist.clinics.length > 0 && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Klinikker</p>
                      <p className="text-sm text-white/90 font-light">{specialist.clinics.join(", ")}</p>
                    </div>
                  </div>
                )}
                {specialist.education && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Utdanning</p>
                      <p className="text-sm text-white/90 font-light">{specialist.education}</p>
                    </div>
                  </div>
                )}
                {specialist.experience && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Erfaring</p>
                      <p className="text-sm text-white/90 font-light">{specialist.experience}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-8 font-normal" onClick={() => navigate(bookingUrl)}>
                  <Calendar className="mr-2 w-4 h-4" />Bestill time
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-md px-6 font-normal" onClick={() => navigate("/kontakt")}>
                  <Phone className="mr-2 w-4 h-4" />Kontakt oss
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio */}
      {specialist.bio && (
        <section className="py-10 md:py-16 bg-background">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">Om {specialist.name.split(" ")[0]}</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">{specialist.bio}</p>
            </div>
          </div>
        </section>
      )}

      {/* Related Treatments */}
      {relatedTreatments.length > 0 && (
        <section className="py-10 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-6 md:px-16">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">Behandlinger innen {categoryLabels[specialist.category]?.toLowerCase()}</h2>
            <p className="text-muted-foreground font-light mb-8 max-w-2xl">Utforsk behandlingene {specialist.name.split(" ")[0]} og teamet tilbyr.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTreatments.map((treatment) => (
                <Link key={treatment.path} to={treatment.path} className="group flex items-center justify-between p-4 rounded-sm bg-background border border-border/50 hover:border-brand-dark/30 hover:shadow-sm transition-all">
                  <span className="text-sm font-light text-foreground group-hover:text-brand-dark transition-colors">{treatment.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-dark transition-colors" />
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Button variant="outline" className="rounded-full font-light" onClick={() => navigate(categoryPaths[specialist.category] || "/")}>
                Se alle behandlinger<ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Booking CTA */}
      <section className="py-10 md:py-16 bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-white mb-3">Bestill time hos {specialist.name.split(" ")[0]}</h2>
          <p className="text-white/60 font-light mb-8 max-w-xl mx-auto">Rask og enkel timebestilling. Du får bekreftelse på SMS.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-8 font-normal" onClick={() => navigate(bookingUrl)}>
              <Calendar className="mr-2 w-4 h-4" />Bestill time nå
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-md px-6 font-normal" onClick={() => navigate("/kontakt")}>
              <Phone className="mr-2 w-4 h-4" />Ring for konsultasjon
            </Button>
          </div>
        </div>
      </section>

      {/* Related Specialists */}
      {relatedSpecialists.length > 0 && (
        <section className="py-10 md:py-16 bg-background">
          <div className="container mx-auto px-6 md:px-16">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">Andre spesialister innen {categoryLabels[specialist.category]?.toLowerCase()}</h2>
            <p className="text-muted-foreground font-light mb-8">Vårt team av erfarne spesialister står klare til å hjelpe deg.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedSpecialists.map((s: any) => (
                <Link key={s.slug} to={`/spesialister/${s.slug}`} className="group">
                  <div className="aspect-[3/4] rounded-sm overflow-hidden mb-2">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">{s.name}</h3>
                  <p className="text-xs text-muted-foreground font-light">{s.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default SpecialistProfile;
