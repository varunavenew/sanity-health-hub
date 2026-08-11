import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { ListPageHero } from "@/components/layout/ListPageHero";
import { SpecialistCard } from "@/components/specialists/SpecialistCarousel";


interface SpecialistsProps {
  isChatOpen: boolean;
}

const categoryLabels: Record<string, string> = {
  alle: "Alle",
  gynekologi: "Gynekologi",
  fertilitet: "Fertilitet",
  urologi: "Urologi",
  ortopedi: "Ortopedi",
  annet: "Flere tjenester",
};

// Normalize for resilient string comparison (case + whitespace tolerant)
const norm = (v: unknown): string =>
  typeof v === "string" ? v.trim().toLowerCase() : "";

const Specialists = ({ isChatOpen }: SpecialistsProps) => {
  const [activeFilter, setActiveFilter] = useState("alle");
  const [activeClinic, setActiveClinic] = useState("alle");
  const { sorted: specialists, allClinics } = useSpecialistsData();
  const clinicNames = allClinics();
  const [navTop, setNavTop] = useState(0);

  useEffect(() => {
    document.title = "Våre spesialister | CMedical";
  }, []);

  // Sync sticky filter offset with the auto-hiding header (same as /priser)
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setNavTop(Math.max(0, header.getBoundingClientRect().bottom));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  // Combined AND filter: a specialist must match BOTH the selected category
  // and the selected clinic (when either is set to something other than "alle").
  const filtered = useMemo(() => {
    const wantCategory = norm(activeFilter);
    const wantClinic = norm(activeClinic);

    return specialists.filter((s) => {
      const categoryMatch =
        wantCategory === "alle" || norm(s.category) === wantCategory;
      if (!categoryMatch) return false;

      if (wantClinic === "alle") return true;
      const clinics = Array.isArray(s.clinics) ? s.clinics : [];
      return clinics.some((c) => norm(c) === wantClinic);
    });
  }, [specialists, activeFilter, activeClinic]);


  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Våre spesialister – Ledende eksperter samlet på ett sted"
        description="Møt CMedicals spesialister innen gynekologi, fertilitet, urologi og ortopedi. Erfaring, spisskompetanse og moderne teknologi – ingen henvisning nødvendig."
        canonical="/spesialister"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Spesialister", path: "/spesialister" },
        ]}
      />
      {/* Hero — felles liste-hero (skin-tekstur, samme høyde og H1-linje overalt) */}
      <ListPageHero
        title="Våre spesialister"
        description="Erfaring, spisskompetanse og moderne teknologi samlet på ett sted."
      />


      {/* Mobile filters — same pattern as /priser: sticky, horizontally scrollable pill rows */}
      <div
        className="md:hidden sticky z-30 bg-background border-b border-brand-mid/30 shadow-sm"
        style={{ top: `${navTop}px` }}
      >
        {[
          {
            key: "kategori",
            items: Object.entries(categoryLabels).map(([id, label]) => ({ id, label })),
            active: activeFilter,
            onSelect: setActiveFilter,
            withIcon: false,
          },
          {
            key: "klinikk",
            items: [{ id: "alle", label: "Alle klinikker" }, ...clinicNames.map((c) => ({ id: c, label: c }))],
            active: activeClinic,
            onSelect: setActiveClinic,
            withIcon: true,
          },
        ].map((row) => (
          <div key={row.key} className="relative">
            <div
              className="flex gap-2 overflow-x-auto overflow-y-visible px-4 pr-10 py-2 scrollbar-hide [scroll-behavior:smooth] [-webkit-overflow-scrolling:touch] [overscroll-behavior-x:contain]"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", touchAction: "pan-x pan-y" }}
            >
              {row.items.map((item) => {
                const isActive = row.active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => row.onSelect(item.id)}
                    className="chip-filter chip-filter-light min-h-[36px] rounded-2xl whitespace-nowrap"
                    data-active={isActive}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {row.withIcon && <MapPin className="w-3 h-3" aria-hidden="true" />}
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent" />
          </div>
        ))}
      </div>

      <section className="bg-background py-6 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          {/* Desktop filters live here, on the light band with the result count */}
          <div className="hidden md:flex md:flex-wrap md:items-center md:gap-2 mb-6">
            {Object.entries(categoryLabels).map(([key, label]) => {
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className="chip-filter chip-filter-light"
                  data-active={isActive}
                  aria-current={isActive ? "true" : undefined}
                >
                  {label}
                </button>
              );
            })}
            <span className="mx-1 h-5 w-px bg-brand-mid/50" aria-hidden="true" />
            {[{ id: "alle", label: "Alle klinikker" }, ...clinicNames.map((c) => ({ id: c, label: c }))].map((clinic) => {
              const isActive = activeClinic === clinic.id;
              return (
                <button
                  key={clinic.id}
                  onClick={() => setActiveClinic(clinic.id)}
                  className="chip-filter chip-filter-light"
                  data-active={isActive}
                  aria-current={isActive ? "true" : undefined}
                >
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {clinic.label}
                </button>
              );
            })}
            <p className="text-sm text-muted-foreground md:ml-auto">{filtered.length} spesialister</p>
          </div>
          <p className="md:hidden text-sm text-muted-foreground mb-4">{filtered.length} spesialister</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((specialist) => (
              <SpecialistCard key={specialist.slug} sp={specialist} />
            ))}
          </div>
        </div>
      </section>

    </PageLayout>
  );
};

export default Specialists;
