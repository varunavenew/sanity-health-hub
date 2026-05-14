import { AssetImg } from "@/components/AssetImg";
import { Link, useNavigate } from "@/lib/router";
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
            <p className="text-sm font-medium text-muted-foreground mb-2">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {specialists.map((s, idx) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <Link to={`/spesialister/${s.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                  <AssetImg
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-normal text-white text-sm mb-0.5">{s.name}</h3>
                    <p className="text-white/70 text-xs font-light pr-4">
                      {s.subtitle || s.title}
                    </p>
                  </div>
                </div>
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
