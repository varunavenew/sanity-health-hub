import { ArrowRight, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SubItem {
  label: string;
  path?: string;
}

interface Subcategory {
  label: string;
  path: string;
  items?: SubItem[];
}

interface ServiceCategoryCardProps {
  id: string;
  label: string;
  path: string;
  image: string;
  intro: string;
  subcategories: Subcategory[];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const ServiceCategoryCard = ({
  id,
  label,
  path,
  image,
  intro,
  subcategories,
  index,
  isOpen,
  onToggle,
}: ServiceCategoryCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = (p: string) => {
    window.open(p, "_blank", "noopener,noreferrer");
  };

  const totalTreatments = subcategories.reduce(
    (sum, sub) => sum + 1 + (sub.items?.length || 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      onClick={onToggle}
      className="group relative rounded-sm overflow-hidden border border-border/50 bg-card cursor-pointer transition-all duration-500 hover:border-border hover:shadow-xl"
    >
      {/* Main row */}
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/4 md:w-1/5 flex-shrink-0 overflow-hidden">
          <div className="aspect-[16/9] sm:aspect-auto sm:h-full sm:min-h-[160px]">
            <img
              src={image}
              alt={label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-lg md:text-xl font-light text-foreground leading-tight">
                {label}
              </span>
              <p className="text-sm font-light text-muted-foreground leading-relaxed mt-1.5 line-clamp-2 max-w-lg">
                {intro}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-light text-foreground/70 whitespace-nowrap pt-1">
              <span className="hidden sm:inline">{isOpen ? 'Lukk' : `${totalTreatments} behandlinger`}</span>
              <ChevronRight
                className={`w-3.5 h-3.5 text-foreground/70 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded treatments */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/30 bg-card px-6 md:px-8 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1">
                {subcategories.map((sub, subIdx) => (
                  <motion.div
                    key={sub.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: subIdx * 0.04,
                    }}
                    className="py-1.5"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(sub.path);
                      }}
                      className="text-sm font-light text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1.5 group/link"
                    >
                      {sub.label}
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-60 group-hover/link:translate-x-0 transition-all duration-200" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-5 pt-4 border-t border-border/30 flex items-center gap-4"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/booking?kategori=${id}`);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-accent text-accent-foreground text-sm font-light hover:bg-accent/90 transition-colors"
                >
                  Bestill time for {label.toLowerCase()}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(path);
                  }}
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-light text-foreground/50 hover:text-foreground/80 transition-colors"
                >
                  Les mer
                  <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ServiceCategoryCard;
