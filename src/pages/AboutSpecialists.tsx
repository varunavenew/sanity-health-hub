import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { useSpecialistsPage } from "@/hooks/useSanity";
import { PortableText } from "@portabletext/react";

interface AboutSpecialistsProps {
  isChatOpen: boolean;
}

const AboutSpecialists = ({ isChatOpen }: AboutSpecialistsProps) => {
  const { data: pageData } = useSpecialistsPage();

  useEffect(() => {
    document.title = pageData?.seo?.metaTitle || "Om våre spesialister | CMedical";
  }, [pageData]);

  const title = pageData?.title || "Om våre spesialister";
  const subtitle =
    pageData?.subtitle ||
    "Hos CMedical møter du Nordens fremste spesialister innen gynekologi, fertilitet, urologi og ortopedi. Våre leger kombinerer lang erfaring med moderne teknologi for å gi deg trygg og presis behandling.";

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={pageData?.seo?.metaTitle || "Om våre spesialister – Erfaring og spisskompetanse"}
        description={
          pageData?.seo?.metaDescription ||
          "Les om CMedicals spesialistteam. Ledende eksperter innen gynekologi, fertilitet, urologi og ortopedi – samlet på ett sted."
        }
        canonical="/om-spesialister"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Spesialister", path: "/spesialister" },
          { name: "Om våre spesialister", path: "/om-spesialister" },
        ]}
      />

      {/* Hero */}
      <section className="bg-brand-dark pt-24 pb-14 md:pt-28 md:pb-20">
        <div className="container mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-white/60 text-xs mb-2">Vårt team</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
              {title}
            </h1>
            <p className="text-white/70 font-light text-base md:text-lg leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Body content */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl space-y-6"
          >
            {pageData?.body ? (
              <div className="prose prose-lg max-w-none text-foreground/80 font-light leading-[1.85]">
                <PortableText value={pageData.body} />
              </div>
            ) : (
              <>
                <p className="text-base md:text-lg text-foreground/80 font-light leading-[1.85]">
                  Vårt team består av ledende spesialister som deler en felles ambisjon: å gi deg den beste behandlingen tilgjengelig. Hver spesialist hos CMedical er nøye utvalgt basert på sin kompetanse, erfaring og engasjement for pasientbehandling.
                </p>
                <p className="text-base md:text-lg text-foreground/80 font-light leading-[1.85]">
                  Vi tror på verdien av tverrfaglig samarbeid. Når våre spesialister samarbeider på tvers av fagfelt, sikrer vi helhetlig og koordinert behandling tilpasset nettopp dine behov.
                </p>
              </>
            )}

            <Link
              to="/spesialister"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors mt-8"
            >
              Se alle våre spesialister
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AboutSpecialists;
