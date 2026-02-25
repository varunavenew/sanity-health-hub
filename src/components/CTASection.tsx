import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section id="contact" className="py-24 hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_60%)]" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-serif text-primary-foreground mb-6">
            Ready to Take the First Step?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 leading-relaxed">
            Schedule your appointment today and experience healthcare that puts you first. Our team is ready to provide the care you deserve.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-xl group"
          >
            <Calendar className="w-6 h-6" />
            Book Your Appointment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
