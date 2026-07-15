"use client";

import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { ArrowRight, Calendar, Shield, Phone, Mail, MessageCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PageLayout } from "@/components/layout/PageLayout";
import { ClinicGrid } from "@/components/ClinicGrid";
import { ContactRequestDialog } from "@/components/ContactRequestDialog";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { useClinics, useContactPage } from "@/hooks/useSanity";
import { SplitHero } from "@/components/layout/SplitHero";
import { GeoPageEnhancements } from "@/components/seo/GeoPageEnhancements";
import { coercePath } from "@/lib/navigation/coerce-path";
import { useParams } from "@/lib/router";
import { useTranslation } from "react-i18next";

interface ContactProps {
  isChatOpen: boolean;
}

const Contact = ({ isChatOpen }: ContactProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const { data: sanityClinics } = useClinics();
  const { data: contactPage } = useContactPage();
  const clinics = sanityClinics || [];
  const ctaCards = contactPage?.ctaCards ?? [];
  const pageSections = contactPage?.pageSections;
  const heroTitle = contactPage?.title?.trim() || "";
  const heroDescription = contactPage?.introText?.trim() || "";
  const heroImage = contactPage?.heroImage;
  const hasHeroContent = Boolean(heroTitle || heroDescription || heroImage);
  const { toast } = useToast();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    clinic: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("contact.toast.title"),
      description: t("contact.toast.description"),
    });
    setFormData({ name: "", email: "", phone: "", clinic: "", subject: "", message: "" });
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {hasHeroContent ? (
        <SplitHero
          eyebrow={heroTitle || undefined}
          title={heroTitle || undefined}
          description={heroDescription || undefined}
          image={heroImage}
          imageAlt="Kontakt CMedical"
          primaryCta={{ label: t("nav.bookAppointment"), to: "/booking" }}
          secondaryCta={
            contactPage?.secondaryCtaLabel && contactPage?.secondaryCtaPath
              ? {
                  label: contactPage.secondaryCtaLabel,
                  to: contactPage.secondaryCtaPath,
                }
              : undefined
          }
        />
      ) : (
        <div className="bg-brand-warm pt-20 pb-8">
          <div className="container mx-auto px-6 md:px-16">
            <Button
              variant="cta"
              size="lg"
              onClick={() => navigate("/booking")}
            >
              {t("nav.bookAppointment")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 md:px-16 py-6">
        <GeoPageEnhancements
          name={heroTitle || t("nav.contact", "Kontakt")}
          geoSummary={contactPage?.geoSummary}
          fallbackDescription={heroDescription}
          path="/kontakt"
          locale={locale}
          className="max-w-3xl"
        />
      </div>

      <ClinicGrid />

      {ctaCards.length > 0 && (
        <section className="py-16 md:py-24 bg-brand-dark">
          <div className="container mx-auto px-6 md:px-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {ctaCards.map((card, i) => {
                const iconMap: Record<string, LucideIcon> = {
                  Calendar, Shield, Phone, Mail, MessageCircle,
                };
                const Icon = iconMap[card.icon] || Calendar;
                const isOutline = card.variant === "outline";
                const ctaLink = coercePath(card.ctaLink);
                const handleClick = () => {
                  if (card.ctaAction === "openContactDialog") {
                    setContactDialogOpen(true);
                  } else if (ctaLink) {
                    if (ctaLink.startsWith("http")) {
                      window.open(ctaLink, "_blank", "noopener,noreferrer");
                    } else {
                      navigate(ctaLink);
                    }
                  }
                };
                return (
                  <div key={i} className="p-8 rounded-sm bg-white/5 border border-white/10 flex flex-col">
                    <Icon className="w-8 h-8 text-white/70 mb-6" strokeWidth={1.5} />
                    <h3 className="font-normal text-xl text-white mb-3">{card.title}</h3>
                    <p className="text-white/70 leading-relaxed mb-6 text-base font-light flex-1">
                      {card.description}
                    </p>
                    <Button
                      className={
                        isOutline
                          ? "rounded-full w-full border border-white/30 bg-transparent text-white hover:bg-white hover:text-brand-dark font-light"
                          : "bg-white text-brand-dark hover:bg-white/90 rounded-full w-full font-light"
                      }
                      onClick={handleClick}
                    >
                      {card.ctaText}
                      {!isOutline && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-brand-warm">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light mb-3 text-brand-dark text-center">
              {t("contact.sendMessage")}
            </h2>
            <p className="text-brand-dark/60 text-center font-light mb-10">
              {t("contact.responseTime")}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="text-sm font-medium mb-2 block text-brand-dark">{t("contact.form.name")}</label>
                  <Input
                    id="contact-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("contact.form.namePlaceholder")}
                    required
                    className="h-12 rounded-sm border-brand-dark/20 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="text-sm font-medium mb-2 block text-brand-dark">{t("contact.form.phone")}</label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+47 000 00 000"
                    className="h-12 rounded-sm border-brand-dark/20 bg-white"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="text-sm font-medium mb-2 block text-brand-dark">{t("contact.form.email")}</label>
                <Input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t("contact.form.emailPlaceholder")}
                  required
                  className="h-12 rounded-sm border-brand-dark/20 bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-brand-dark">{t("contact.form.clinic")}</label>
                <Select value={formData.clinic} onValueChange={(value) => setFormData({ ...formData, clinic: value })}>
                  <SelectTrigger className="h-12 rounded-sm border-brand-dark/20 bg-white">
                    <SelectValue placeholder={t("contact.form.clinicPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {clinics.map((clinic) => (
                      <SelectItem key={clinic.id} value={clinic.id}>
                        CMedical {clinic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="contact-subject" className="text-sm font-medium mb-2 block text-brand-dark">{t("contact.form.subject")}</label>
                <Input
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={t("contact.form.subjectPlaceholder")}
                  required
                  className="h-12 rounded-sm border-brand-dark/20 bg-white"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-sm font-medium mb-2 block text-brand-dark">{t("contact.form.message")}</label>
                <Textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t("contact.form.messagePlaceholder")}
                  rows={6}
                  required
                  className="rounded-sm border-brand-dark/20 bg-white"
                />
              </div>
              <div className="text-center">
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-full px-8 font-light"
                >
                  {t("contact.form.submit")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {pageSections?.length ? <PageSectionsRenderer sections={pageSections} /> : null}

      <ContactRequestDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />
    </PageLayout>
  );
};

export default Contact;
