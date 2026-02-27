import { useState } from 'react';
import { ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceCategories } from '@/data/serviceCategories';

export const ServiceExplorer = () => {
  const [activeCategory, setActiveCategory] = useState<string>('gynekologi');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const activeCategoryData = serviceCategories.find(c => c.id === activeCategory);
  const activeSubcategoryData = activeSubcategory 
    ? activeCategoryData?.subcategories.find(s => s.label === activeSubcategory)
    : null;

  const handleNavigate = (path: string) => {
    window.open(path, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-brand-dark rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex flex-col lg:flex-row min-h-[450px]">
        {/* Column 1 - Categories */}
        <div className="lg:w-[220px] p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-white/10">
          <h3 className="text-white/50 text-[11px] uppercase tracking-wider mb-4 font-light">
            Fagområder
          </h3>
          <nav className="space-y-0.5">
            {serviceCategories.map((category) => (
              <button 
                key={category.id}
                onMouseEnter={() => {
                  setActiveCategory(category.id);
                  setActiveSubcategory(null);
                }}
                onClick={() => handleNavigate(category.path)} 
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-left transition-all group ${
                  activeCategory === category.id 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm font-light">{category.label}</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${activeCategory === category.id ? 'translate-x-1' : ''}`} />
              </button>
            ))}
          </nav>

          <div className="mt-5 pt-5 border-t border-white/10">
            <button
              onClick={() => window.location.href = '/priser'}
              className="flex items-center gap-1.5 text-accent hover:text-accent/80 text-xs font-light transition-colors"
            >
              Se alle priser
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Column 2 - Subcategories */}
        <div className="flex-1 p-5 lg:p-6 bg-white/5 max-h-[500px] overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10">
          <AnimatePresence mode="wait">
            {activeCategoryData && (
              <motion.div
                key={activeCategoryData.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
              >
                <h3 className="text-white/50 text-[11px] uppercase tracking-wider mb-4 font-light">
                  {activeCategoryData.label}
                </h3>
                <nav className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0.5">
                  {activeCategoryData.subcategories.map((sub) => (
                    <button 
                      key={sub.label}
                      onMouseEnter={() => setActiveSubcategory(sub.label)}
                      onClick={() => handleNavigate(sub.path)} 
                      className={`text-left py-2 px-2 text-sm font-light transition-colors rounded flex items-center justify-between group ${
                        activeSubcategory === sub.label
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{sub.label}</span>
                      {sub.items && sub.items.length > 0 && (
                        <ChevronRight className={`h-3.5 w-3.5 transition-all ${
                          activeSubcategory === sub.label ? 'opacity-100 translate-x-1' : 'opacity-40'
                        }`} />
                      )}
                    </button>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Column 3 - Sub-items (only show when subcategory has items) */}
        <AnimatePresence>
          {activeSubcategoryData && activeSubcategoryData.items && activeSubcategoryData.items.length > 0 && (
            <motion.div
              key="third-column"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="w-[200px] lg:w-[220px] p-5 lg:p-6 bg-white/[0.03] max-h-[500px] overflow-y-auto">
                <h3 className="text-white/50 text-[11px] uppercase tracking-wider mb-4 font-light">
                  {activeSubcategoryData.label}
                </h3>
                <nav className="space-y-0.5">
                  {activeSubcategoryData.items.map((item) => (
                    <button 
                      key={item.label}
                      onClick={() => handleNavigate(activeSubcategoryData.path)} 
                      className="w-full text-left py-2 px-2 text-[13px] font-light transition-colors rounded text-white/60 hover:text-white hover:bg-white/10"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
                
                {/* Link to full page */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleNavigate(activeSubcategoryData.path)}
                    className="flex items-center gap-1.5 text-accent hover:text-accent/80 text-xs font-light transition-colors"
                  >
                    Les mer om {activeSubcategoryData.label.toLowerCase()}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
