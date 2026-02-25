import { motion } from "framer-motion";
import { Stethoscope, Heart, Baby, Bone, Sparkles, Brain } from "lucide-react";
import { useServices } from "@/hooks/useSanityData";

const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  Heart,
  Baby,
  Bone,
  Sparkles,
  Brain,
};

const ServicesSection = () => {
  const { data: services } = useServices();

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">What We Offer</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-foreground mt-3 mb-4">Our Medical Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We provide comprehensive healthcare services with a patient-first approach, combining cutting-edge technology with compassionate care.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service, i) => {
            const Icon = iconMap[service.icon] || Stethoscope;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-card rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border border-border/50"
              >
                <div className="w-14 h-14 rounded-xl teal-light-bg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-serif text-card-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
