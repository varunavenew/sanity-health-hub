import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Category images
import urologiImg from "@/assets/categories/urologi-real.jpg";
import fertilitetImg from "@/assets/categories/fertilitet-real.jpg";
import gynekologiImg from "@/assets/categories/gynekologi-real.jpg";
import ortopediImg from "@/assets/categories/ortopedi-real.jpg";
import flereImg from "@/assets/categories/flere-fagomrader.jpg";

// Service category cards with images
const serviceCategories = [
  { id: 'urologi', title: 'Urologi', image: urologiImg, path: '/urologi' },
  { id: 'fertilitet', title: 'Fertilitet', image: fertilitetImg, path: '/fertilitet' },
  { id: 'gynekologi', title: 'Gynekologi', image: gynekologiImg, path: '/gynekologi' },
  { id: 'ortopedi', title: 'Ortopedi', image: ortopediImg, path: '/ortopedi' },
  { id: 'flere', title: 'Flere tjenester', image: flereImg, path: '/flere-fagomrader' },
];

export const HeroCompact = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-background py-12 md:py-16 pb-4 md:pb-6">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section heading */}
        <div className="max-w-6xl mx-auto mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-light text-foreground text-center">
            Våre tjenester
          </h2>
        </div>
        
        {/* Service Category Cards - 5 cards with images */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 max-w-6xl mx-auto"
        >
          {serviceCategories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => navigate(category.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
              className="group relative overflow-hidden rounded-sm aspect-[3/4] shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer text-left md:rounded-sm rounded-none"
              aria-label={`Se behandlinger innen ${category.title}`}
            >
              <img
                src={category.image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" aria-hidden="true" />
              
              {/* Title and arrow at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-sm md:text-base font-light">
                    {category.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" aria-hidden="true" />
                </div>
              </div>
              
              {/* Interactive hover border */}
              <div className="absolute inset-0 rounded-sm border-2 border-transparent group-hover:border-accent/50 transition-colors duration-300" aria-hidden="true" />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
