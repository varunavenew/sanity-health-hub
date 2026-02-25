import { motion } from "framer-motion";
import { Phone, Calendar } from "lucide-react";
import { useHero, useSettings } from "@/hooks/useSanityData";
import heroImage from "@/assets/hero-medical.jpg";

const HeroSection = () => {
  const { data: hero } = useHero();
  const { data: settings } = useSettings();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
      {/* Background image overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Medical professionals"
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
      </div>

      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-secondary/20 text-secondary-foreground/90 mb-6 backdrop-blur-sm border border-secondary/30">
              {settings?.tagline || "Excellence in Healthcare"}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight text-primary-foreground mb-6 text-balance">
              {hero?.title}
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-lg mb-8 leading-relaxed">
              {hero?.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={hero?.ctaLink || "#contact"}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                {hero?.ctaText || "Book Appointment"}
              </a>
              <a
                href={`tel:${settings?.phone}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-primary-foreground/30 text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {settings?.phone}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <img
              src={heroImage}
              alt="Healthcare team"
              className="rounded-2xl shadow-2xl w-full max-w-lg ml-auto"
            />
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "25+", label: "Years Experience" },
            { value: "50+", label: "Expert Doctors" },
            { value: "100K+", label: "Patients Served" },
            { value: "98%", label: "Patient Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
