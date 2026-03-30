import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PageLayout } from "@/components/layout/PageLayout";
import { ClinicGrid } from "@/components/ClinicGrid";
import { CTASection } from "@/components/layout/CTASection";
import { clinics as staticClinics } from "@/data/clinicServices";
import { useClinics, useContactPage } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";

import contactHero from "@/assets/hero/contact-hero.jpg";

interface ContactProps {
  isChatOpen: boolean;
}

const Contact = ({ isChatOpen }: ContactProps) => {
  const navigate = useNavigate();
  const { data: sanityClinics } = useClinics();
  const clinics = sanityClinics?.length ? sanityClinics : staticClinics;
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    clinic: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    document.title = "Kontakt oss | CMedical";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Melding sendt!",
      description: "Vi vil ta kontakt med deg innen 24 timer.",
    });
    setFormData({ name: "", email: "", phone: "", clinic: "", subject: "", message: "" });
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Kontakt oss"
        description="Kontakt CMedical – bestill time, ring oss eller besøk en av våre klinikker. Vi svarer gjerne på alle henvendelser om gynekologi, fertilitet og urologi."
        canonical="/kontakt"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Kontakt", path: "/kontakt" },
        ]}
      />
      {/* Hero Section */}
      <header className="relative">
        <div className="h-[25vh] md:h-[30vh] relative">
          <img 
            src={contactHero} 
            alt="Kontakt oss" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 md:px-16">
            <div className="container mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white">
                Kontakt oss
              </h1>
              <p className="text-white/70 mt-2 max-w-lg font-light text-sm md:text-base">
                Har du spørsmål? Vi svarer gjerne på alle henvendelser
              </p>
            </div>
          </div>
        </div>
      </header>

      <ClinicGrid />

      {/* Help Cards Section - without chat reference */}
      <section className="py-16 md:py-24 bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Quick Help Card */}
            <div className="p-8 rounded-sm bg-white/5 border border-white/10 flex flex-col">
              <Calendar className="w-8 h-8 text-white/70 mb-6" strokeWidth={1.5} />
              <h3 className="font-normal text-xl text-white mb-3">Trenger du rask hjelp?</h3>
              <p className="text-white/70 leading-relaxed mb-6 text-base font-light flex-1">
                Du trenger ingen henvisning. Ring oss direkte eller bestill time online – vi har korte ventetider.
              </p>
              <Button 
                className="bg-white text-brand-dark hover:bg-white/90 rounded-sm w-full font-light"
                onClick={() => navigate('/booking')}
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Book Directly Card */}
            <div className="p-8 rounded-sm bg-white/5 border border-white/10 flex flex-col">
              <Calendar className="w-8 h-8 text-white/70 mb-6" strokeWidth={1.5} />
              <h3 className="font-normal text-xl text-white mb-3">Vil du booke direkte?</h3>
              <p className="text-white/70 leading-relaxed text-base font-light flex-1">
                Velg fagområde, klinikk og behandler – alt i én enkel booking.
              </p>
              <div className="mt-6">
                <Button 
                  className="bg-white text-brand-dark hover:bg-white/90 rounded-sm w-full font-light"
                  onClick={() => navigate('/booking')}
                >
                  Bestill time nå
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Insurance Card */}
            <div className="p-8 rounded-sm bg-white/5 border border-white/10 flex flex-col">
              <Shield className="w-8 h-8 text-white/70 mb-6" strokeWidth={1.5} />
              <h3 className="font-normal text-xl text-white mb-3">Har du helseforsikring?</h3>
              <p className="text-white/70 leading-relaxed text-base font-light flex-1">
                De fleste av våre behandlinger dekkes av helseforsikring. Sjekk med ditt selskap.
              </p>
              <div className="mt-6">
                <Button 
                  className="rounded-sm w-full border border-white/30 bg-transparent text-white hover:bg-white hover:text-brand-dark font-light"
                  onClick={() => navigate('/forsikring')}
                >
                  Les om forsikring
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-brand-warm">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light mb-3 text-brand-dark text-center">
              Send oss en melding
            </h2>
            <p className="text-brand-dark/60 text-center font-light mb-10">
              Vi svarer på alle henvendelser innen 24 timer
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="text-sm font-medium mb-2 block text-brand-dark">Navn</label>
                  <Input
                    id="contact-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ditt navn"
                    required
                    className="h-12 rounded-sm border-brand-dark/20 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="text-sm font-medium mb-2 block text-brand-dark">Telefon</label>
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
                <label htmlFor="contact-email" className="text-sm font-medium mb-2 block text-brand-dark">E-post</label>
                <Input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="din@email.no"
                  required
                  className="h-12 rounded-sm border-brand-dark/20 bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-brand-dark">Klinikk</label>
                <Select value={formData.clinic} onValueChange={(value) => setFormData({ ...formData, clinic: value })}>
                  <SelectTrigger className="h-12 rounded-sm border-brand-dark/20 bg-white">
                    <SelectValue placeholder="Velg klinikk" />
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
                <label htmlFor="contact-subject" className="text-sm font-medium mb-2 block text-brand-dark">Emne</label>
                <Input
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Hva gjelder henvendelsen?"
                  required
                  className="h-12 rounded-sm border-brand-dark/20 bg-white"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-sm font-medium mb-2 block text-brand-dark">Melding</label>
                <Textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Beskriv din henvendelse..."
                  rows={6}
                  required
                  className="rounded-sm border-brand-dark/20 bg-white"
                />
              </div>
              <div className="text-center">
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-sm px-8 font-light"
                >
                  Send melding
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <CTASection
        title="Ta vare på livet og underlivet"
        subtitle="Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging"
        primaryCTA="Book time nå"
        secondaryCTA="Se prisliste"
        secondaryLink="/priser"
      />
    </PageLayout>
  );
};

export default Contact;
