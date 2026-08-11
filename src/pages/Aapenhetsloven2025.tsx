import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { SpecialistFAQ } from "@/components/specialist/SpecialistFAQ";

interface Aapenhetsloven2025Props {
  isChatOpen?: boolean;
}

const Aapenhetsloven2025 = ({ isChatOpen = false }: Aapenhetsloven2025Props) => {
  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Åpenhetsloven 2025 | CMedical"
        description="Redgjørelse rapporteringsåret 2025. Aktsomhetsvurderinger for bærekraftig forretningspraksis for CMedical Group AS."
        canonical="/aapenhetsloven-2025"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Åpenhetsloven 2025", path: "/aapenhetsloven-2025" },
        ]}
      />

      <header className="bg-brand-warm">
        <div className="container mx-auto px-6 md:px-16 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] max-w-3xl">
            Åpenhetsloven 2025
          </h1>
          <p className="mt-6 text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl">
            Redgjørelse rapporteringsåret 2025. Aktsomhetsvurderinger for
            bærekraftig forretningspraksis for CMedical Group AS.
          </p>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <div className="space-y-4 text-foreground/70 font-light leading-relaxed">
            <p>
              CMedical er Nordens ledende klinikk for kvinnen og mannens underliv
              med flere spesialistklinikker i Norge og Sverige. Selskapet har
              blant annet bygget opp egne fertilitetsklinikker i Stockholm,
              Uppsala og Oslo, og kjøpte senest opp Livio i Oslo. CMedical kjøpte
              også opp den kjente kvinnehelsetjenesten HerCare i Sverige.
              CMedical har ellers store fagmiljøer på gynekologi, ortopedi og
              urologi.
            </p>
          </div>
        </div>
      </section>

      <SpecialistFAQ />
    </PageLayout>
  );
};

export default Aapenhetsloven2025;
