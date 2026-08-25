"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@/lib/router";
import { ArrowRight, Calendar, Check, Shield, Phone, Mail, MessageCircle, MapPin, type LucideIcon } from "lucide-react";
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
import { trackBookingMenuStartForPath } from "@/lib/tracking/seo-events";
import { trackContactMessage, trackFormSubmit } from "@/lib/tracking/form-events";
import { useFormTracking } from "@/lib/tracking/use-form-tracking";
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
  const formCopy = contactPage?.contactForm;
  const pick = (cms: string | undefined, fallback: string) =>
    cms?.trim() ? cms.trim() : fallback;
  const { toast } = useToast();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);
  const { onFieldInteraction: onContactFormStart } = useFormTracking(
    "contact_message",
    "contact_page",
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    clinic: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          clinic: formData.clinic,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      let payload: { ok?: boolean } = {};
      try {
        payload = (await res.json()) as { ok?: boolean };
      } catch {
        payload = {};
      }

      if (!res.ok || !payload.ok) {
        toast({
          title: pick(formCopy?.errorTitle, t("contact.toast.errorTitle")),
          description: pick(
            formCopy?.errorDescription,
            t("contact.toast.errorDescription"),
          ),
          variant: "destructive",
        });
        return;
      }

      trackFormSubmit({ form_name: "contact_message", form_location: "contact_page" });
      trackContactMessage({ form_location: "contact_page" });
      setFormData({ name: "", email: "", phone: "", clinic: "", subject: "", message: "" });
      setIsSubmitted(true);
    } catch {
      toast({
        title: pick(formCopy?.errorTitle, t("contact.toast.errorTitle")),
        description: pick(
          formCopy?.errorDescription,
          t("contact.toast.errorDescription"),
        ),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSubmitted) confirmationHeadingRef.current?.focus();
  }, [isSubmitted]);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {hasHeroContent ? (
        <SplitHero
          title={heroTitle || undefined}
          description={heroDescription || undefined}
          image={heroImage}
          imageAlt={t("contact.heroImageAlt")}
          primaryCta={{
            label: t("nav.bookAppointment"),
            to: "/booking",
            bookingEntryPoint: "contact_page",
          }}
          secondaryCta={{
            label: t("contact.viewClinics"),
            to: "/klinikker",
            icon: "mapPin",
          }}
        />
      ) : (
        <div className="bg-brand-warm pt-20 pb-8">
          <div className="container mx-auto px-6 md:px-16 flex flex-wrap gap-3">
            <Button
              variant="cta"
              size="lg"
              onClick={() => {
                trackBookingMenuStartForPath("/booking", "contact_page");
                navigate("/booking");
              }}
            >
              {t("nav.bookAppointment")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="contact-outline" size="lg" onClick={() => navigate("/klinikker")}>
              <MapPin strokeWidth={1.5} aria-hidden="true" />
              {t("contact.viewClinics")}
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 md:px-16 py-6">
        <GeoPageEnhancements
          name={heroTitle || t("nav.contact")}
          geoSummary={contactPage?.geoSummary}
          fallbackDescription={heroDescription}
          path="/kontakt"
          locale={locale}
          className="max-w-3xl"
        />
      </div>

      {contactPage?.clinicsSection?.showSection !== false ? (
        <ClinicGrid
          title={contactPage?.clinicsSection?.title}
          clinics={contactPage?.clinicsSection?.clinics}
        />
      ) : null}

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
                  <div
                    key={i}
                    className="p-8 rounded-md bg-white/5 border border-white/10 flex flex-col"
                  >
                    <Icon className="w-8 h-8 text-white/70 mb-6" strokeWidth={1.5} />
                    <h3 className="font-normal text-xl text-white mb-3">{card.title}</h3>
                    <p className="text-white/70 leading-relaxed mb-6 text-base font-light flex-1">
                      {card.description}
                    </p>
                    <Button
                      className={
                        isOutline
                          ? "rounded-lg w-full border border-white/30 bg-transparent text-white hover:bg-white hover:text-brand-dark font-light h-[42px]"
                          : "bg-white text-brand-dark hover:bg-white/90 rounded-lg w-full font-light h-[42px]"
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
            {isSubmitted ? (
              <div
                className="text-center py-8 md:py-16"
                role="status"
                aria-live="polite"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-dark flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h2
                  ref={confirmationHeadingRef}
                  tabIndex={-1}
                  className="text-3xl md:text-4xl font-light text-brand-dark outline-none"
                >
                  {t("contact.confirmationTitle")}
                </h2>
              </div>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-light mb-3 text-brand-dark text-center">
                  {pick(formCopy?.title, t("contact.sendMessage"))}
                </h2>
                <p className="text-brand-dark/60 text-center font-light mb-10">
                  {pick(formCopy?.subtitle, t("contact.responseTime"))}
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="text-sm font-medium mb-2 block text-brand-dark">
                    {pick(formCopy?.nameLabel, t("contact.form.name"))}
                  </label>
                  <Input
                    id="contact-name"
                    value={formData.name}
                    onFocus={onContactFormStart}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={pick(formCopy?.namePlaceholder, t("contact.form.namePlaceholder"))}
                    required
                    className="h-12 rounded-sm border-brand-dark/20 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="text-sm font-medium mb-2 block text-brand-dark">
                    {pick(formCopy?.phoneLabel, t("contact.form.phone"))}
                  </label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={pick(formCopy?.phonePlaceholder, "+47 000 00 000")}
                    className="h-12 rounded-sm border-brand-dark/20 bg-white"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="text-sm font-medium mb-2 block text-brand-dark">
                  {pick(formCopy?.emailLabel, t("contact.form.email"))}
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={pick(formCopy?.emailPlaceholder, t("contact.form.emailPlaceholder"))}
                  required
                  className="h-12 rounded-sm border-brand-dark/20 bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-brand-dark">
                  {pick(formCopy?.clinicLabel, t("contact.form.clinic"))}
                </label>
                <Select value={formData.clinic} onValueChange={(value) => setFormData({ ...formData, clinic: value })}>
                  <SelectTrigger className="h-12 rounded-sm border-brand-dark/20 bg-white">
                    <SelectValue placeholder={pick(formCopy?.clinicPlaceholder, t("contact.form.clinicPlaceholder"))} />
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
                <label htmlFor="contact-subject" className="text-sm font-medium mb-2 block text-brand-dark">
                  {pick(formCopy?.subjectLabel, t("contact.form.subject"))}
                </label>
                <Input
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={pick(formCopy?.subjectPlaceholder, t("contact.form.subjectPlaceholder"))}
                  required
                  className="h-12 rounded-sm border-brand-dark/20 bg-white"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-sm font-medium mb-2 block text-brand-dark">
                  {pick(formCopy?.messageLabel, t("contact.form.message"))}
                </label>
                <Textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={pick(formCopy?.messagePlaceholder, t("contact.form.messagePlaceholder"))}
                  rows={6}
                  required
                  className="rounded-sm border-brand-dark/20 bg-white"
                />
              </div>
              <p className="text-sm text-brand-dark/60 font-light">
                {pick(formCopy?.sensitiveDataNote, t("contact.form.sensitiveDataNote"))}
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light"
              >
                {pick(formCopy?.submitButton, t("contact.form.submit"))}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
              </>
            )}
          </div>
        </div>
      </section>

      {pageSections?.length ? <PageSectionsRenderer sections={pageSections} /> : null}

      <ContactRequestDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />
    </PageLayout>
  );
};

export default Contact;
