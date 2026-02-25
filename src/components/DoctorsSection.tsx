import { motion } from "framer-motion";
import { useDoctors } from "@/hooks/useSanityData";
import { urlFor } from "@/lib/sanity";
import { User } from "lucide-react";

const DoctorsSection = () => {
  const { data: doctors } = useDoctors();

  return (
    <section id="doctors" className="py-24 section-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Our Team</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-foreground mt-3 mb-4">Meet Our Doctors</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our physicians bring decades of combined experience and a genuine commitment to your wellbeing.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors?.map((doctor, i) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              <div className="aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden">
                {doctor.image ? (
                  <img
                    src={urlFor(doctor.image).width(400).height(530).url()}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full hero-gradient flex items-center justify-center">
                    <User className="w-20 h-20 text-primary-foreground/40" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-serif text-card-foreground">{doctor.name}</h3>
                <p className="text-secondary font-medium text-sm mb-2">{doctor.specialty}</p>
                <p className="text-muted-foreground text-sm">{doctor.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
