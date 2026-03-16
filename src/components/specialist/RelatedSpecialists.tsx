import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Specialist } from "@/data/specialists";
import { motion } from "framer-motion";

interface RelatedSpecialistsProps {
  specialists: Specialist[];
}

export const RelatedSpecialists = ({ specialists }: RelatedSpecialistsProps) => {
  const navigate = useNavigate();

  if (specialists.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
              Samme fagområde
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-foreground">
              Andre spesialister
            </h2>
          </div>
          <Button
            variant="ghost"
            className="hidden md:flex text-sm font-light text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/spesialister")}
          >
            Se alle
            <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden="true" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {specialists.map((s, idx) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <Link to={`/spesialister/${s.slug}`} className="group block">
                <div className="aspect-[3/4] rounded-sm overflow-hidden mb-3 bg-secondary">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm font-medium text-foreground group-hover:text-brand-dark transition-colors">
                  {s.name}
                </p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">
                  {s.subtitle || s.title}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button
            variant="outline"
            className="rounded-full font-light text-sm"
            onClick={() => navigate("/spesialister")}
          >
            Se alle spesialister
            <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
};
