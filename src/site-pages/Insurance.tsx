import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ArrowRight, Phone, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@/lib/router";
import insuranceHero from "@/assets/hero/insurance-woman-phone.webp";
import { useInsurancePage } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { SplitHero } from "@/components/layout/SplitHero";
import { useTranslation } from "react-i18next";

interface PageProps { isChatOpen: boolean }

const Insurance = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: page } = useInsurancePage();

  const title = page?.title || t("insurance.title");
  const subtitle = page?.subtitle || t("insurance.subtitle");
  const heroImage = page?.heroImage || insuranceHero;
  const companies = page?.companies || [];
  const steps = page?.steps || [];
  const benefits = page?.benefits || [];

  useEffect(() => {
    document.title = "Forsikring | CMedical - Behandling med forsikring";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={page?.seo?.metaTitle || "Helseforsikring – Bruk forsikringen din hos CMedical"}
        description={page?.seo?.metaDescription || "CMedical har avtale med alle store forsikringsselskaper. Ingen utlegg – vi fakturerer forsikringen direkte. Kort ventetid og ledende spesialister."}
        canonical="/forsikring"
        breadcrumbs={[
          { name: t("pricing.breadcrumbHome"), path: "/" },
          { name: t("nav.insurance"), path: "/forsikring" },
        ]}
      />
      <SplitHero
        eyebrow={t("insurance.subtitle")}
        title={title}
        description={subtitle}
        image={heroImage}
        imageAlt="Forsikring hos CMedical"
        primaryCta={{ label: t("nav.bookAppointment"), to: "/booking" }}
        secondaryCta={{ label: t("cta.contactUs"), to: "/kontakt" }}
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full mb-6">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-light">{t("insurance.partners")}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-foreground">{t("insurance.agreementTitle")}</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {companies.map((company: any) => (
                <div key={company.name} className="px-5 py-3 bg-muted/30 rounded-full border border-border text-foreground font-light hover:border-foreground/30 transition-colors">{company.name}</div>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-muted-foreground font-light">
              {t("insurance.notFound")} <Link to="/kontakt" className="underline hover:no-underline">{t("insurance.contactUsHelp")}</Link> {t("insurance.weHelp")}
            </p>

            <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-border text-center">
              <h3 className="font-normal text-foreground mb-2">{t("insurance.insuranceQuestion")}</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {t("insurance.insuranceAnswer")}
              </p>
              <p className="text-sm text-muted-foreground font-light mt-2">
                {t("insurance.b2b")} <a href="mailto:post@cmedical.no" className="underline hover:no-underline">post@cmedical.no</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-12 text-center">{t("insurance.howTo")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
              {steps.map((step: any, index: number) => (
                <div key={step.num || index} className="relative text-center">
                  {index < steps.length - 1 && <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-border" />}
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-lg font-medium">{step.num || String(index + 1)}</span>
                  </div>
                  <h3 className="font-normal text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {benefits.length > 0 && (
      <section className="py-16 md:py-24 bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit: any) => (
                <div key={benefit.title} className="p-6">
                  <h3 className="font-normal text-white mb-3 text-lg inline-flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent" strokeWidth={2} aria-hidden="true" />
                    {benefit.title}
                  </h3>
                  <p className="text-white/60 font-light leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-dark" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className="text-foreground font-normal">{t("insurance.needHelp")}</p>
                <p className="text-muted-foreground text-sm font-light">{t("insurance.weGuide")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-foreground/20 hover:bg-muted" asChild>
                <Link to="/kontakt">{t("cta.contactUs")}</Link>
              </Button>
              <Button className="bg-brand-dark text-white hover:bg-brand-dark/90" onClick={() => navigate('/booking')}>
                {t("nav.bookAppointment")}<ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Insurance;